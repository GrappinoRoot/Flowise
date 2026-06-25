import template from './Layout.html?raw'
import { createTemplate } from '../../utils/createTemplate'
import '../Sidebar/Sidebar'

export class AppLayout extends HTMLElement {
    private _shadow: ShadowRoot

    constructor() {
        super()
        this._shadow = this.attachShadow({ mode: 'open' })
    }

    connectedCallback(): void {
        this.initialize()
    }

    private initialize(): void {
        console.log('[AppLayout] Initializing...')
        const content = createTemplate(template)
        console.log('[AppLayout] Template content appended. Style tag present:', this._shadow.querySelector('style') !== null)
        this._shadow.appendChild(content)
    }

    // Metodo per cambiare il titolo della view
    setViewTitle(title: string): void {
        const titleEl = this._shadow.querySelector<HTMLElement>('[data-view-title]')
        if (titleEl) titleEl.textContent = title
    }

    // Metodo per iniettare il contenuto della view
    setView(component: HTMLElement): void {
        const mainView = this._shadow.querySelector<HTMLElement>('#main-view')
        if (mainView) {
            mainView.innerHTML = ''
            mainView.appendChild(component)
        }
    }
}

customElements.define('app-layout', AppLayout)
