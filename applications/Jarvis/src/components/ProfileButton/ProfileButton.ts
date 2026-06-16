import template from './Jarvis.html?raw'
import './Jarvis.css'
import { getElement } from '../../utils/getElement'
import { Button } from '../Button/Button'
import type { ProfileButtonProps } from '../../types/chat'

export class ProfileButton {
    private element: HTMLElement
    private menuEl: HTMLElement
    private avatarEl: HTMLImageElement
    private logoutEl: HTMLElement

    constructor(private props: ProfileButtonProps) {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = template

        const root = getElement<HTMLElement>(wrapper, '[data-root]')
        this.menuEl = getElement(root, '[data-menu]')
        this.avatarEl = getElement<HTMLImageElement>(root, '[data-avatar]')
        this.logoutEl = getElement<HTMLElement>(root, '[data-logout]')

        this.avatarEl.src = props.avatarUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(props.email)}`
        this.bindEvents()

        this.element = root
    }

    // ---------------
    // EVENTS
    // --------------
    private bindEvents(): void {
        this.element.addEventListener('click', (e) => {
            e.stopPropagation()
            this.toggleMenu()
        })

        const logoutBtn = new Button({
            label: 'Logout',
            variant: 'logout',
            onClick: async () => {
                await this.props.onLogout()
            }
        })

        this.logoutEl.replaceWith(logoutBtn.render())
    }

    // *********
    // UI STATE
    // *********
    private toggleMenu(): void {
        this.menuEl.classList.toggle('open')
    }

    // *********
    // Render
    // *********
    public render(): HTMLElement {
        return this.element
    }
}
