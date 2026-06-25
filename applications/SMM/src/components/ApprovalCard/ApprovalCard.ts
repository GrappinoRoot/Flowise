import template from './ApprovalCard.html?raw'
import { createTemplate } from '../../utils/createTemplate'
import '../Button/Button'

export interface ApprovalCardOptions {
    title?: string
    content: string
    onApprove: () => void
    onReject: () => void
}

export class ApprovalCard extends HTMLElement {
    private _initialized = false
    private _options?: ApprovalCardOptions

    connectedCallback(): void {
        if (this._initialized) return
        this._initialized = true
        this.initialize()
    }

    set options(val: ApprovalCardOptions) {
        this._options = val
        this.update()
    }

    private initialize(): void {
        const content = createTemplate(template)
        this.appendChild(content)
        this.update()
    }

    private update(): void {
        if (!this._options) return

        const titleEl = this.querySelector<HTMLElement>('[data-title]')
        const contentEl = this.querySelector<HTMLElement>('[data-content]')
        const approveBtn = this.querySelector<HTMLButtonElement>('#approve-btn')
        const rejectBtn = this.querySelector<HTMLButtonElement>('#reject-btn')

        if (titleEl) titleEl.textContent = this._options.title || 'Post Preview'
        if (contentEl) contentEl.textContent = this._options.content

        // Note: Since AppButton uses a real <button> inside it,
        // we should listen to the click event on the shadow DOM or the custom element.
        // In the provided AppButton, the click event on the internal button bubbles up.
        if (approveBtn) {
            approveBtn.onclick = () => this._options?.onApprove()
        }
        if (rejectBtn) {
            rejectBtn.onclick = () => this._options?.onReject()
        }
    }
}

customElements.define('app-approval-card', ApprovalCard)
