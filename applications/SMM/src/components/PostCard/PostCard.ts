import template from './PostCard.html?raw'
import { createTemplate } from '../../utils/createTemplate'

export interface PostCardOptions {
    content: string
    platform: string
    date: string
}

export class AppPostCard extends HTMLElement {
    private _options?: PostCardOptions

    connectedCallback(): void {
        const content = createTemplate(template)
        this.appendChild(content)
    }

    set options(val: PostCardOptions) {
        this._options = val
        this.update()
    }

    private update(): void {
        if (!this._options) return

        const contentEl = this.querySelector<HTMLElement>('[data-content]')
        const platformEl = this.querySelector<HTMLElement>('[data-platform]')
        const dateEl = this.querySelector<HTMLElement>('[data-date]')

        if (contentEl) contentEl.textContent = this._options.content
        if (platformEl) platformEl.textContent = this._options.platform
        if (dateEl) dateEl.textContent = this._options.date
    }
}

customElements.define('app-post-card', AppPostCard)
