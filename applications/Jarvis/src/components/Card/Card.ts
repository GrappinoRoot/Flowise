import './Card.css'
import template from './Card.html?raw'
import { createTemplate } from '../../utils/createTemplate'
import { formatDate } from '../../utils/dateUtils'

export class AppCard extends HTMLElement {
    private _initialized = false

    connectedCallback(): void {
        if (this._initialized) return
        this._initialized = true
        this.initialize()
    }

    private initialize(): void {
        const content = createTemplate(template)

        const titleEl = content.querySelector<HTMLElement>('[data-title]')
        const descEl = content.querySelector<HTMLElement>('[data-description]')
        const badgeEl = content.querySelector<HTMLElement>('[data-badge]')

        if (!titleEl) throw new Error('Missing [data-title]')
        if (!descEl) throw new Error('Missing [data-description]')

        // Attributi
        const title = this.getAttribute('title') ?? ''
        const description = this.getAttribute('description') ?? ''
        const badge = this.getAttribute('badge')
        const date = this.getAttribute('date')

        // Popola contenuto
        titleEl.textContent = title
        descEl.textContent = description

        if (badge && badgeEl) {
            badgeEl.textContent = badge
        } else if (badgeEl) {
            badgeEl.remove()
        }

        // Se c'è una data, formattala
        if (date) {
            const dateEl = document.createElement('time')
            dateEl.className = 'card__date'
            dateEl.textContent = formatDate(new Date(date))
            content.querySelector('[data-footer]')?.appendChild(dateEl)
        }

        this.appendChild(content)
    }
}

customElements.define('app-card', AppCard)
