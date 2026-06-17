import template from './ConversationItem.html?raw'
import './ConversationItem.css'
import optionConversationIcon from '../../assets/optionConversation.svg'
import { getElement } from '../../utils/getElement'
import { dispatchStore } from '../../store/store'
import type { ConversationItemProps } from '../../types/chat'

export class ConversationItem {
    private element: HTMLElement

    private titleEl: HTMLSpanElement
    private actionsEl: HTMLButtonElement
    private menuEl: HTMLDivElement

    constructor(private props: ConversationItemProps) {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = template

        const root = getElement<HTMLElement>(wrapper, '[data-root]')
        root.classList.toggle('active', props.active)
        root.dataset.id = props.id

        const iconEl = getElement<HTMLImageElement>(root, '[data-icon]')
        iconEl.src = optionConversationIcon

        this.titleEl = getElement(root, '[data-title]')
        this.actionsEl = getElement(root, '[data-actions]')
        this.menuEl = getElement(root, '[data-menu]')

        this.titleEl.textContent = props.title

        this.actionsEl.addEventListener('click', (e) => {
            e.stopPropagation()
            this.openMenu()
        })
        this.buildMenu()
        this.element = root
    }

    private openMenu() {
        this.menuEl.classList.toggle('conversation-menu-open')
    }

    private buildMenu() {
        const rename = document.createElement('div')
        rename.className = 'conversation-menu-item'
        rename.textContent = 'Rename'

        rename.addEventListener('click', (e) => {
            e.stopPropagation()

            const input = document.createElement('input')
            input.value = this.props.title

            this.element.replaceChild(input, this.titleEl)

            const save = () => {
                const value = input.value.trim()

                if (!value) {
                    this.element.replaceChild(this.titleEl, input)
                    return
                }

                dispatchStore('CONVERSATION_RENAMED', {
                    conversationId: this.props.id,
                    title: value
                })
            }

            input.addEventListener('blur', () => {
                setTimeout(save, 0)
            })
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

            dispatchStore('CONVERSATION_DELETED', {
                conversationId: this.props.id
            })
        })

        this.menuEl.append(rename, remove)
    }

    render(): HTMLElement {
        return this.element
    }
}
