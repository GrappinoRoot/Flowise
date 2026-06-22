import './Button.css'
import template from './Button.html?raw'
import { createTemplate } from '../utils/createTemplate'
import '../Icon/Icon'

export class AppButton extends HTMLElement {
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

        const button = content.querySelector<HTMLButtonElement>('button')
        const labelEl = content.querySelector<HTMLSpanElement>('[data-label]')
        const iconEl = content.querySelector<HTMLElement>('[data-icon]')

        if (!button) throw new Error('Missing button')
        if (!labelEl) throw new Error('Missing [data-label]')
        if (!iconEl) throw new Error('Missing [data-icon]')

        labelEl.textContent = this.getAttribute('label') ?? ''

        const variant = this.getAttribute('variant')
        const type = this.getAttribute('type') ?? 'button'
        const icon = this.getAttribute('icon')

        if (variant) button.classList.add(`button--${variant}`)
        button.setAttribute('type', type)

        // Se icon è presente, passa src ad app-icon prima dell'append (legge in connectedCallback)
        // Se assente, rimuove l'elemento per non lasciare tag vuoti nel DOM
        if (icon) {
            iconEl.setAttribute('src', icon)
        } else {
            iconEl.remove()
        }

        // Il click nativo del <button> fa bubble attraverso <app-button> in Light DOM
        this.appendChild(content)
    }
}

customElements.define('app-button', AppButton)
