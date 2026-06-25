export type ViewRoute = 'dashboard' | 'agents' | 'posts' | 'approval' | 'debug'

export interface ViewFactory<T extends HTMLElement> {
    create: () => T
}

export class ViewManager {
    private _currentView: HTMLElement | null = null
    private _layout: any // Riferimento al componente AppLayout
    private _routes: Map<ViewRoute, ViewFactory<any>> = new Map()

    constructor(layout: any) {
        this._layout = layout
    }

    registerView(route: ViewRoute, factory: ViewFactory<any>): void {
        this._routes.set(route, factory)
    }

    async switchTo(route: ViewRoute): Promise<void> {
        const factory = this._routes.get(route)
        if (!factory) {
            console.error(`View not found for route: ${route}`)
            return
        }

        // Distruggi la vecchia view se esiste
        if (this._currentView) {
            this._currentView.remove()
            this._currentView = null
        }

        // Crea la nuova view
        const newView = factory.create()
        this._currentView = newView

        // Usa il metodo setView del nostro AppLayout (che abbiamo implementato prima)
        this._layout.setView(newView)

        // Aggiorna il titolo della barra superiore
        const titles: Record<ViewRoute, string> = {
            dashboard: 'Dashboard',
            agents: 'Agents Management',
            posts: 'All Posts',
            approval: 'Pending Approvals',
            debug: 'System Debug'
        }
        this._layout.setViewTitle(titles[route])
    }
}
