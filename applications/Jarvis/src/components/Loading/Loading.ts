import template from './Loading.html?raw'
import './Loading.css'
import { createTemplate } from '../../utils/createTemplate'

export class AppLoading extends HTMLElement {
    private _initialized = false

    // ------------------------
    // LIFECYCLE
    // ------------------------
    connectedCallback(): void {
        if (this._initialized) return
        this._initialized = true

        const content = createTemplate(template)

        if (!content.querySelector('[data-root]')) {
            throw new Error('Missing [data-root]')
        }

        this.appendChild(content)
    }
}

customElements.define('app-loading', AppLoading)
