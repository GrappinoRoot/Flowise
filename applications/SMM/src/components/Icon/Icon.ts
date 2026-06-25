import template from './Icon.html?raw'
import { createTemplate } from '../../utils/createTemplate'

export class AppIcon extends HTMLElement {
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
        const img = content.querySelector<HTMLImageElement>('[data-image]')

        if (!img) throw new Error('Missing [data-image]')

        img.src = this.getAttribute('src') ?? ''
        img.alt = this.getAttribute('alt') ?? ''

        this.appendChild(content)
    }
}

customElements.define('app-icon', AppIcon)
