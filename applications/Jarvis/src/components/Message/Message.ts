import template from './Message.html?raw'
import './Message.css'
import { createTemplate } from '../../utils/createTemplate'

export class AppMessage extends HTMLElement {
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

        const rootEl = content.querySelector<HTMLElement>('[data-root]')
        const contentEl = content.querySelector<HTMLSpanElement>('[data-content]')

        if (!rootEl) throw new Error('Missing [data-root]')
        if (!contentEl) throw new Error('Missing [data-content]')

        this.appendChild(content)

        const role = this.getAttribute('role') ?? ''
        const messageContent = this.getAttribute('content') ?? ''

        if (role) rootEl.classList.add(role)
        contentEl.textContent = messageContent
    }
}

customElements.define('app-message', AppMessage)
