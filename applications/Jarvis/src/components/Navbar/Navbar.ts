import './Navbar.css'
import template from './Navbar.html?raw'
import { createTemplate } from '../../utils/createTemplate'

export class AppNavbar extends HTMLElement {
    private _initialized = false

    // ------------------------
    // LIFECYCLE
    // ------------------------
    connectedCallback(): void {
        if (this._initialized) return
        this._initialized = true
        this.initialize()
    }

    private initialize(): void {
        const content = createTemplate(template)
        this.appendChild(content)
    }
}

customElements.define('app-navbar', AppNavbar)
