import './styles/global.css'
import { registerMiddleware } from './middleware/middleware'
import { chatMiddleware } from './middleware/chatMiddleware'
import { initApp } from './services/initAppService'
import { initializeViewManager, showAuthView, showChatView } from './services/viewManager'
import { supabase } from './lib/supabaseClient'
import { hydrateAuth } from './services/authService'

const appElement = document.querySelector<HTMLElement>('#app')

if (!appElement) {
    throw new Error('App element not found')
}

initializeViewManager(appElement)

registerMiddleware(chatMiddleware)

async function bootstrap() {
    // 1. Controlliamo la sessione attuale al caricamento
    const {
        data: { session }
    } = await supabase.auth.getSession()

    if (session) {
        await hydrateAuth()
        await initApp()
        showChatView()
    } else {
        showAuthView()
    }

    // 2. Ascoltiamo i cambiamenti futuri (es. l'utente fa logout o la sessione scade)
    supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT') {
            showAuthView()
        } else if (event === 'SIGNED_IN' && session) {
            await hydrateAuth()
            await initApp()
            showChatView()
        }
    })
}

bootstrap()
