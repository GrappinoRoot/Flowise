import template from './ConversationItem.html?raw'
import './ConversationItem.css'
import optionConversationIcon from '../../assets/optionConversation.svg'
import { dispatchStore } from '../../store/store'
import { createTemplate } from '../../utils/createTemplate'

export class AppConversationItem extends HTMLElement {
    private titleEl!: HTMLSpanElement
    private actionsEl!: HTMLButtonElement
    private menuEl!: HTMLDivElement
    private rootEl!: HTMLElement
    private _clickOutsideHandler: ((e: MouseEvent) => void) | null = null

    private _initialized = false

    // ------------------------
    // OBSERVED ATTRIBUTES
    // ------------------------
    static get observedAttributes(): string[] {
        return ['title', 'active']
    }

    attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
        // Ignora i cambiamenti che arrivano prima dell'inizializzazione:
        // initialize() legge i valori direttamente con getAttribute()
        if (!this._initialized) return

        if (name === 'title' && this.titleEl) {
            this.titleEl.textContent = value ?? ''
        }
        if (name === 'active' && this.rootEl) {
            this.rootEl.classList.toggle('active', value === 'true')
        }
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
        this.removeClickOutside()
    }

    // ------------------------
    // INIT
    // ------------------------
    private initialize(): void {
        const content = createTemplate(template)

        const rootEl = content.querySelector<HTMLElement>('[data-root]')
        const iconEl = content.querySelector<HTMLImageElement>('[data-icon]')
        const titleEl = content.querySelector<HTMLSpanElement>('[data-title]')
        const actionsEl = content.querySelector<HTMLButtonElement>('[data-actions]')
        const menuEl = content.querySelector<HTMLDivElement>('[data-menu]')

        if (!rootEl) throw new Error('Missing [data-root]')
        if (!iconEl) throw new Error('Missing [data-icon]')
        if (!titleEl) throw new Error('Missing [data-title]')
        if (!actionsEl) throw new Error('Missing [data-actions]')
        if (!menuEl) throw new Error('Missing [data-menu]')

        iconEl.src = optionConversationIcon

        this.rootEl = rootEl
        this.titleEl = titleEl
        this.actionsEl = actionsEl
        this.menuEl = menuEl

        this.appendChild(content)

        const id = this.getAttribute('conv-id') ?? ''
        const title = this.getAttribute('title') ?? ''
        const active = this.getAttribute('active') === 'true'

        this.dataset.id = id
        this.rootEl.classList.toggle('active', active)
        this.titleEl.textContent = title

        this.actionsEl.addEventListener('click', (e) => {
            e.stopPropagation()
            this.openMenu()
        })

        this.buildMenu(id)
    }

    // ------------------------
    // ACTIONS
    // ------------------------
    private openMenu(): void {
        const isOpen = this.menuEl.classList.toggle('conversation-menu-open')

        if (isOpen) {
            this._clickOutsideHandler = (e: MouseEvent) => {
                if (!this.contains(e.target as Node)) {
                    this.closeMenu()
                }
            }
            // rAF: evita che il click che ha aperto il menu lo chiuda subito
            requestAnimationFrame(() => {
                document.addEventListener('click', this._clickOutsideHandler!)
            })
        } else {
            this.removeClickOutside()
        }
    }

    private closeMenu(): void {
        this.menuEl.classList.remove('conversation-menu-open')
        this.removeClickOutside()
    }

    private removeClickOutside(): void {
        if (this._clickOutsideHandler) {
            document.removeEventListener('click', this._clickOutsideHandler)
            this._clickOutsideHandler = null
        }
    }

    private buildMenu(id: string): void {
        const rename = document.createElement('div')
        rename.className = 'conversation-menu-item'
        rename.textContent = 'Rename'

        rename.addEventListener('click', (e) => {
            e.stopPropagation()

            const input = document.createElement('input')
            // Legge il titolo corrente dal DOM — aggiornato da attributeChangedCallback dopo ogni rename
            input.value = this.titleEl.textContent ?? ''

            this.titleEl.replaceWith(input)

            const save = () => {
                const value = input.value.trim()

                if (!value) {
                    input.replaceWith(this.titleEl)
                    return
                }

                dispatchStore('CONVERSATION_RENAMED', { conversationId: id, title: value })
            }

            input.addEventListener('blur', () => setTimeout(save, 0))
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault()
                    save()
                }
            })

            input.focus()
        })

        const remove = document.createElement('div')
        remove.className = 'conversation-menu-item'
        remove.textContent = 'Remove'

        remove.addEventListener('click', (e) => {
            e.stopPropagation()
            dispatchStore('CONVERSATION_DELETED', { conversationId: id })
        })

        this.menuEl.append(rename, remove)
    }
}

customElements.define('app-conversation-item', AppConversationItem)
