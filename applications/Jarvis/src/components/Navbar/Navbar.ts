import './Navbar.css'
import template from './Navbar.html?raw'
import { createTemplate } from '../../utils/createTemplate'
import { showAuthView } from '../../services/viewManager'
import '../Button/Button'

export class AppNavbar extends HTMLElement {
    private loginBtn!: HTMLElement
    private signupBtn!: HTMLElement
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

        const loginBtn = content.querySelector<HTMLElement>('[data-login-btn]')
        const signupBtn = content.querySelector<HTMLElement>('[data-signup-btn]')

        if (!loginBtn) throw new Error('Missing [data-login-btn]')
        if (!signupBtn) throw new Error('Missing [data-signup-btn]')

        this.loginBtn = loginBtn
        this.signupBtn = signupBtn

        this.appendChild(content)
        this.bindEvents()
    }

    // ------------------------
    // PUBLIC API — chiamato da ChatView
    // ------------------------
    public setAuthenticated(isAuthenticated: boolean): void {
        // hidden=true → display:none (standard HTML attribute)
        this.hidden = isAuthenticated
    }

    // ------------------------
    // EVENTS
    // ------------------------
    private bindEvents(): void {
        this.loginBtn.addEventListener('click', () => showAuthView('signin'))
        this.signupBtn.addEventListener('click', () => showAuthView('signup'))
    }
}

customElements.define('app-navbar', AppNavbar)
