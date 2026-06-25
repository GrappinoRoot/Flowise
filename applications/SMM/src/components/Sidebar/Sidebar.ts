import template from './Sidebar.html?raw'
import { createTemplate } from '../../utils/createTemplate'

export class AppSidebar extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback(): void {
        console.log('[AppSidebar] Connected')
        const content = createTemplate(template)
        this.appendChild(content)
        console.log('[AppSidebar] Style tag present:', this.querySelector('style') !== null)
        this.setupEvents()
    }

    private setupEvents(): void {
        const navItems = this.querySelectorAll<HTMLLIElement>('.nav-item')
        navItems.forEach((item) => {
            item.addEventListener('click', () => {
                // Remove active class from all
                navItems.forEach((i) => i.classList.remove('active'))
                // Add to clicked
                item.classList.add('active')

                // Dispatch custom event for navigation
                const route = item.getAttribute('data-route')
                this.dispatchEvent(
                    new CustomEvent('navigate', {
                        detail: { route },
                        bubbles: true,
                        composed: true
                    })
                )
            })
        })
    }
}

customElements.define('app-sidebar', AppSidebar)
