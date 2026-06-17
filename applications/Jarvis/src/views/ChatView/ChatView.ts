import template from './ChatView.html?raw'
import './ChatView.css'
import { subscribe } from '../../store/subscribers'
import { getState } from '../../store/store'
import { mountComposer } from '../../components/Composer/Composer'
import { Sidebar } from '../../components/Sidebar/Sidebar'
import { getElement, createEmptyState } from '../../utils/getElement'
import { Message } from '../../components/Message/Message'
import { Loading } from '../../components/Loading/Loading'
import { Navbar } from '../../components/Navbar/Navbar'
import { showAuthView } from '../../services/viewManager'
import { signOut } from '../../services/authService'

export class ChatView {
    private host: HTMLElement
    private messagesElement: HTMLElement
    private composerElement: HTMLElement
    private loadingElement: HTMLElement
    private sidebarElement: HTMLElement
    private navbarElement: HTMLElement

    constructor(host: HTMLElement) {
        this.host = host
        this.host.innerHTML = template

        this.messagesElement = getElement(this.host, '[data-messages]')
        this.composerElement = getElement(this.host, '[data-composer]')
        this.loadingElement = getElement(this.host, '[data-loading]')
        this.sidebarElement = getElement(this.host, '[data-sidebar]')
        this.navbarElement = getElement(this.host, '[data-navbar]')

        mountComposer(this.composerElement)
        new Sidebar(this.sidebarElement)

        const navbar = new Navbar({
            isAuthenticated: true,
            onNavigateAuth: () => showAuthView(),
            onLogout: async () => {
                await signOut()
                showAuthView()
            }
        })

        this.navbarElement.appendChild(navbar.render())

        this.render()
        subscribe(() => this.render())
    }

    private renderLoading(state: ReturnType<typeof getState>): void {
        this.loadingElement.replaceChildren()
        if (!state.loading) return
        const loading = new Loading()
        this.loadingElement.appendChild(loading.render())
    }

    private renderMessages(state: ReturnType<typeof getState>): void {
        const activeConversation = state.activeConversationId
            ? state.conversations.find((c) => c.Id === state.activeConversationId)
            : undefined

        this.messagesElement.replaceChildren()

        if (!activeConversation) {
            this.messagesElement.appendChild(createEmptyState())
            return
        }

        for (const msg of activeConversation.messages) {
            const message = new Message({
                role: msg.role,
                content: msg.content
            })

            this.messagesElement.appendChild(message.render())
        }
    }

    private render(): void {
        const state = getState()
        this.renderLoading(state)
        this.renderMessages(state)
    }
}

export function mountChatView(container: HTMLElement) {
    new ChatView(container)
}
