import template from './Sidebar.html?raw'
import './Sidebar.css'
import { getState } from '../../store/store'
import { subscribe } from '../../store/store'
import { getElement } from '../../utils/getElement'
import { dispatchStore } from '../../store/store'
import { Button } from '../../components/Button/Button'
import { ProfileButton } from '../../components/ProfileButton/ProfileButton'
import { ConversationItem } from '../../components/ConversationItem/ConversationItem'
import { showAuthView } from '../../services/viewManager'
import { signOut } from '../../services/authService'
import toggleIcon from '../../assets/toggle.svg'

export class Sidebar {
    private host: HTMLElement
    private conversationContainer: HTMLElement
    private toggleContainer: HTMLElement
    private headerContainer: HTMLElement
    private footerContainer: HTMLElement
    private isCollapsed = false
    private newChatBtn!: Button
    private toggleBtn!: Button

    constructor(host: HTMLElement) {
        this.host = host
        this.host.innerHTML = template

        this.conversationContainer = getElement(host, '[data-conversations]')
        this.toggleContainer = getElement(host, '[data-sidebar-toggle]')
        this.headerContainer = getElement(host, '[data-sidebar-header]')
        this.footerContainer = getElement(host, '[data-sidebar-footer]')

        this.initialize()
    }

    private initialize(): void {
        // Create buttons
        this.newChatBtn = new Button({
            label: 'New Chat',
            variant: 'secondary',
            onClick: () => this.handleNewChat()
        })

        this.toggleBtn = new Button({
            label: '',
            icon: toggleIcon,
            variant: 'ghost',
            onClick: () => this.toggleSidebar()
        })

        this.headerContainer.prepend(this.newChatBtn.render())
        this.toggleContainer.prepend(this.toggleBtn.render())

        this.conversationContainer.addEventListener('click', (event) => {
            const el = (event.target as HTMLElement).closest('[data-id]') as HTMLElement | null
            if (!el) return

            const conversationId = el.dataset.id
            if (!conversationId) return

            dispatchStore('CONVERSATION_SELECTED', { conversationId })
        })

        this.update()
        subscribe(() => this.update())
    }

    // *******
    // EVENTS
    // *******
    private toggleSidebar(): void {
        this.isCollapsed = !this.isCollapsed
        this.host.classList.toggle('collapsed', this.isCollapsed)
    }

    private handleNewChat(): void {
        dispatchStore('CONVERSATION_CREATED', {
            Id: crypto.randomUUID(),
            title: 'New Chat'
        })
    }

    // *******
    // RENDER
    // *******
    private update(): void {
        const state = getState()

        // Conversations
        this.conversationContainer.replaceChildren()
        for (const conversation of state.conversations) {
            this.conversationContainer.appendChild(
                new ConversationItem({
                    id: conversation.Id,
                    title: conversation.title,
                    active: conversation.Id === state.activeConversationId
                }).render()
            )
        }

        // Footer: profile button
        this.footerContainer.replaceChildren()

        if (state.user) {
            const profileButton = new ProfileButton({
                email: state.user.email,
                avatarUrl: state.user.avatarUrl,
                onLogout: async () => {
                    await signOut()
                    showAuthView()
                }
            })

            this.footerContainer.appendChild(profileButton.render())
        }
    }

    // *******
    // PUBLIC API
    // *******
    public render(): HTMLElement {
        return this.host
    }
}
