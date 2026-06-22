import template from './ProfileButton.html?raw'
import './ProfileButton.css'
import { createTemplate } from '../../utils/createTemplate'
import '../Button/Button'

export class AppProfileButton extends HTMLElement {
    private menuEl!: HTMLElement
    private avatarEl!: HTMLImageElement
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

        const menuEl = content.querySelector<HTMLElement>('[data-menu]')
        const avatarEl = content.querySelector<HTMLImageElement>('[data-avatar]')
        const logoutEl = content.querySelector<HTMLElement>('[data-logout]')

        if (!menuEl) throw new Error('Missing [data-menu]')
        if (!avatarEl) throw new Error('Missing [data-avatar]')
        if (!logoutEl) throw new Error('Missing [data-logout]')

        this.menuEl = menuEl
        this.avatarEl = avatarEl

        logoutEl.addEventListener('click', (e) => {
            e.stopPropagation()
            this.dispatchEvent(new CustomEvent('logout', { bubbles: true }))
        })

        this.addEventListener('click', (e) => {
            e.stopPropagation()
            this.toggleMenu()
        })

        this.appendChild(content)
    }

    // ------------------------
    // PUBLIC API
    // ------------------------
    /** Aggiorna avatar e fallback quando ChatView passa i dati utente */
    public setUser(user: { email: string; avatarUrl?: string } | null): void {
        if (!this.avatarEl) return
        const email = user?.email ?? ''
        this.avatarEl.src = user?.avatarUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}`
    }

    // ------------------------
    // ACTIONS
    // ------------------------
    private toggleMenu(): void {
        this.menuEl.classList.toggle('open')
    }
}

customElements.define('app-profile-button', AppProfileButton)
