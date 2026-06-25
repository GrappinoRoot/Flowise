import './Modal.css'
import template from './Modal.html?raw'
import { createTemplate } from '../../utils/createTemplate'

export class AppModal extends HTMLElement {
    private overlayEl!: HTMLElement
    private titleEl!: HTMLElement
    private contentEl!: HTMLElement
    private _escHandler: ((e: KeyboardEvent) => void) | null = null
    private _initialized = false

    // ------------------------
    // OBSERVED ATTRIBUTES
    // ------------------------
    static get observedAttributes(): string[] {
        return ['open', 'title']
    }

    attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
        // Ignora prima dell'inizializzazione: initialize() legge lo stato corrente
        if (!this._initialized) return

        if (name === 'open') this.toggleModal(value !== null)
        if (name === 'title') this.updateTitle()
    }

    // ------------------------
    // LIFECYCLE
    // ------------------------
    connectedCallback(): void {
        if (this._initialized) return
        this._initialized = true
        this.initialize()
    }

    disconnectedCallback(): void {
        this.removeEscListener()
    }

    // ------------------------
    // INIT
    // ------------------------
    private initialize(): void {
        const content = createTemplate(template)

        const overlayEl = content.querySelector<HTMLElement>('[data-overlay]')
        const titleEl = content.querySelector<HTMLElement>('[data-title]')
        const closeBtn = content.querySelector<HTMLElement>('[data-close]')
        const contentEl = content.querySelector<HTMLElement>('[data-content]')

        if (!overlayEl) throw new Error('Missing [data-overlay]')
        if (!titleEl) throw new Error('Missing [data-title]')
        if (!closeBtn) throw new Error('Missing [data-close]')
        if (!contentEl) throw new Error('Missing [data-content]')

        this.overlayEl = overlayEl
        this.titleEl = titleEl
        this.contentEl = contentEl

        closeBtn.addEventListener('click', () => this.close())
        overlayEl.addEventListener('click', (e) => {
            if (e.target === overlayEl) this.close()
        })

        this.appendChild(content)

        // Legge lo stato iniziale DOPO appendChild (DOM presente)
        this.updateTitle()
        this.toggleModal(this.hasAttribute('open'))

        // ESC — memorizza il riferimento per poterlo rimuovere
        this._escHandler = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && this.hasAttribute('open')) this.close()
        }
        document.addEventListener('keydown', this._escHandler)
    }

    // ------------------------
    // PRIVATE
    // ------------------------
    private updateTitle(): void {
        this.titleEl.textContent = this.getAttribute('title') ?? ''
    }

    private toggleModal(open: boolean): void {
        this.overlayEl.classList.toggle('modal-overlay--open', open)
        document.body.style.overflow = open ? 'hidden' : ''
    }

    private removeEscListener(): void {
        if (this._escHandler) {
            document.removeEventListener('keydown', this._escHandler)
            this._escHandler = null
        }
    }

    // ------------------------
    // PUBLIC API
    // ------------------------
    open(): void {
        this.setAttribute('open', '')
    }

    close(): void {
        this.removeAttribute('open')
        this.dispatchEvent(new CustomEvent('modal-close', { bubbles: true }))
    }

    /** Inserisce un elemento nel corpo del modal */
    setContent(el: HTMLElement): void {
        this.contentEl.replaceChildren(el)
    }

    /** Svuota il corpo del modal */
    clearContent(): void {
        this.contentEl.replaceChildren()
    }
}

customElements.define('app-modal', AppModal)
