import './components/Layout/Layout.ts'
import './components/Sidebar/Sidebar.ts'
import './components/Dashboard/Dashboard.ts'
import './components/ApprovalCard/ApprovalCard.ts'
import './components/PostCard/PostCard.ts'
import './components/Button/Button.ts'
import './components/Icon/Icon.ts'

import './styles/variables.css'

import { ViewManager, ViewRoute } from './services/viewManager'
import './views/AgentsView'
import './views/PostsView'
import './views/ApprovalView'
import './views/DebugView'

// Error capture utility
const captureError = (error: any, type: 'runtime' | 'promise') => {
    const errorLog = JSON.parse(localStorage.getItem('app_errors') || '[]')
    const newError = {
        timestamp: new Date().toISOString(),
        type,
        message: error.message || error,
        stack: error.stack || null
    }
    errorLog.unshift(newError)
    // Keep only last 50 errors
    localStorage.setItem('app_errors', JSON.stringify(errorLog.slice(0, 50)))
    console.error(`[${type.toUpperCase()} ERROR]`, error)
}

// Global Error Handlers
window.onerror = (message, source, lineno, colno, error) => {
    captureError(error || message, 'runtime')
    return false
}

window.onunhandledrejection = (event) => {
    captureError(event.reason, 'promise')
}

class App {
    private viewManager!: ViewManager
    private layout!: HTMLElement

    async init() {
        // 1. Trova il layout nel DOM
        this.layout = document.querySelector('app-layout') as HTMLElement
        if (!this.layout) throw new Error('AppLayout not found in DOM')

        // 2. Inizializza il ViewManager
        this.viewManager = new ViewManager(this.layout)

        // 3. Registra le rotte (Views)
        this.registerRoutes()

        // 4. Ascolta la navigazione dalla Sidebar
        document.addEventListener('navigate', (event: any) => {
            const route = event.detail.route as ViewRoute
            this.viewManager.switchTo(route)
        })

        // 5. Carica la prima view (Dashboard)
        await this.viewManager.switchTo('dashboard')
    }

    private registerRoutes() {
        // Registriamo la Dashboard
        this.viewManager.registerView('dashboard', {
            create: () => {
                const el = document.createElement('app-dashboard')
                return el as any
            }
        })

        // Registriamo le altre rotte
        this.viewManager.registerView('agents', {
            create: () => {
                const el = document.createElement('app-agents-view')
                return el as any
            }
        })

        this.viewManager.registerView('posts', {
            create: () => {
                const el = document.createElement('app-posts-view')
                return el as any
            }
        })

        this.viewManager.registerView('approval', {
            create: () => {
                const el = document.createElement('app-approval-view')
                return el as any
            }
        })

        this.viewManager.registerView('debug', {
            create: () => {
                const el = document.createElement('app-debug-view')
                return el as any
            }
        })
    }
}

// Avvia l'applicazione
const app = new App()
app.init().catch((err) => {
    console.error('App failed to initialize:', err)
    captureError(err, 'runtime')
})
