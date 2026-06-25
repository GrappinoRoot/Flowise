import './styles/global.css'
import { registerMiddleware } from './middleware/middleware'
import { chatMiddleware } from './middleware/chatMiddleware'
import { initApp } from './services/initAppService'
import { initializeViewManager, showChatView } from './services/viewManager'
import { supabase } from './lib/supabaseClient'
import { hydrateAuth } from './services/authService'
import { dispatchStore } from './store/store'

const appElement = document.querySelector<HTMLElement>('#app')

if (!appElement) {
    throw new Error('App element not found')
}

initializeViewManager(appElement)

registerMiddleware(chatMiddleware)

async function bootstrap() {
    // 1. Jarvis è sempre la landing page — se l'utente è loggato idratiamo prima di mostrare
    const {
        data: { session }
    } = await supabase.auth.getSession()

    if (session) {
        await hydrateAuth() // → USER_SET: la ChatView nasconderà la navbar automaticamente
        await initApp() // → carica conversazioni
    }

    showChatView()

    // 2. Cambiamenti futuri di sessione (logout, scadenza, login da AuthView)
    supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT') {
            // Azzera utente + conversazioni nello store, poi torna alla landing
            dispatchStore('USER_CLEAR', undefined)
            showChatView()
        } else if (event === 'SIGNED_IN' && session) {
            // Idrata prima di mostrare la ChatView: nessun flash di navbar
            await hydrateAuth()
            await initApp()
            showChatView()
        }
    })
}

bootstrap()
