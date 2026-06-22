import './Modal.css'
import template from './Modal.html?raw'
import { createTemplate } from '../../utils/createTemplate'

export class AppModal extends HTMLElement {
    private _initialized = false
    private _open = false

    static get observedAttributes() {
        return ['open', 'title']
    }

    connectedCallback(): void {
        if (this._initialized) return
        this._initialized = true
        this.initialize()
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'open' && oldValue !== newValue) {
            this.toggleModal(newValue !== null)
        }
        if (name === 'title' && this._initialized) {
            this.updateTitle()
        }
    }

    private initialize(): void {
        const content = createTemplate(template)

        const titleEl = content.querySelector<HTMLElement>('[data-title]')
        const closeBtn = content.querySelector<HTMLElement>('[data-close]')
        const overlay = content.querySelector<HTMLElement>('[data-overlay]')

        if (!titleEl) throw new Error('Missing [data-title]')
        if (!closeBtn) throw new Error('Missing [data-close]')
        if (!overlay) throw new Error('Missing [data-overlay]')

        this.updateTitle()

        closeBtn.addEventListener('click', () => this.close())
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.close()
        })

        this.appendChild(content)

        // Chiudi con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this._open) this.close()
        })
    }

    private updateTitle(): void {
        const titleEl = this.querySelector('[data-title]')
        if (titleEl) {
            titleEl.textContent = this.getAttribute('title') ?? ''
        }
    }

    private toggleModal(open: boolean): void {
        this._open = open
        if (open) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
    }

    openModal(): void {
        this.setAttribute('open', '')
    }

    close(): void {
        this.removeAttribute('open')
        this.dispatchEvent(new CustomEvent('modal-close'))
    }
}

customElements.define('app-modal', AppModal)
