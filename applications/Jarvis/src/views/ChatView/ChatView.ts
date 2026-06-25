import template from './ChatView.html?raw'
import './ChatView.css'
import { subscribe, getState } from '../../store/store'
import { createEmptyState } from '../../utils/getElement'
import { createTemplate } from '../../utils/createTemplate'
import type { AppSidebar } from '../../components/Sidebar/Sidebar'
import type { AppNavbar } from '../../components/Navbar/Navbar'
import type { ChatMessage } from '../../types/chat'
import '../../components/Sidebar/Sidebar'
import '../../components/Navbar/Navbar'
import '../../components/Composer/Composer'
import '../../components/Message/Message'
import '../../components/Loading/Loading'

type State = ReturnType<typeof getState>

export class AppChatView extends HTMLElement {
    private messagesElement!: HTMLElement
    private loadingElement!: HTMLElement
    private sidebarElement!: AppSidebar
    private navbarElement!: AppNavbar
    private unsubscribe: (() => void) | null = null
    private cachedLoadingEl: HTMLElement | null = null
    private prevState: State | null = null
    private _initialized = false

    // ------------------------
    // LIFECYCLE
    // ------------------------
    connectedCallback(): void {
        if (this._initialized) return
        this._initialized = true
        this.initialize()
    }

    disconnectedCallback(): void {
        this.unsubscribe?.()
        this.unsubscribe = null
    }

    private initialize(): void {
        const content = createTemplate(template)

        const messagesElement = content.querySelector<HTMLElement>('[data-messages]')
        const composerElement = content.querySelector<HTMLElement>('[data-composer]')
        const loadingElement = content.querySelector<HTMLElement>('[data-loading]')
        const sidebarElement = content.querySelector<AppSidebar>('[data-sidebar]')
        const navbarElement = content.querySelector<AppNavbar>('[data-navbar]')

        if (!messagesElement) throw new Error('Missing [data-messages]')
        if (!composerElement) throw new Error('Missing [data-composer]')
        if (!loadingElement) throw new Error('Missing [data-loading]')
        if (!sidebarElement) throw new Error('Missing [data-sidebar]')
        if (!navbarElement) throw new Error('Missing [data-navbar]')

        this.messagesElement = messagesElement
        this.loadingElement = loadingElement
        this.sidebarElement = sidebarElement
        this.navbarElement = navbarElement

        this.appendChild(content)

        // render iniziale + sottoscrizione: Zustand notifica, noi aggiorniamo la UI
        this.render()
        this.unsubscribe = subscribe(() => this.render())
    }

    // ------------------------
    // RENDER — aggiorna solo le sezioni il cui stato è cambiato
    // ------------------------
    private render(): void {
        const prev = this.prevState
        const state = getState()
        this.prevState = state

        const sidebarChanged =
            !prev ||
            prev.conversations !== state.conversations ||
            prev.activeConversationId !== state.activeConversationId ||
            prev.user !== state.user

        const messagesChanged =
            !prev || prev.activeConversationId !== state.activeConversationId || prev.conversations !== state.conversations

        const loadingChanged = !prev || prev.loading !== state.loading
        const navbarChanged = !prev || prev.user !== state.user

        if (sidebarChanged) this.renderSidebar(state)
        if (messagesChanged) this.renderMessages(state, prev)
        if (loadingChanged) this.renderLoading(state)
        if (navbarChanged) this.renderNavbar(state)
    }

    private renderSidebar(state: State): void {
        this.sidebarElement.setConversations(state.conversations, state.activeConversationId)
        this.sidebarElement.setUser(state.user)
    }

    private renderMessages(state: State, prev: State | null): void {
        const activeConversation = state.activeConversationId
            ? state.conversations.find((c) => c.Id === state.activeConversationId)
            : undefined

        const activeChanged = !prev || prev.activeConversationId !== state.activeConversationId

        if (activeChanged) {
            // Conversazione cambiata: reset completo
            this.messagesElement.replaceChildren()

            if (!activeConversation) {
                this.messagesElement.appendChild(createEmptyState())
                return
            }

            for (const msg of activeConversation.messages) {
                this.messagesElement.appendChild(this.createMessageEl(msg))
            }
            this.scrollToBottom()
            return
        }

        // Stessa conversazione: aggiungi solo i nuovi messaggi in coda
        if (!activeConversation) return
        const existingCount = this.messagesElement.querySelectorAll('app-message').length
        const hadNewMessages = existingCount < activeConversation.messages.length
        for (let i = existingCount; i < activeConversation.messages.length; i++) {
            this.messagesElement.appendChild(this.createMessageEl(activeConversation.messages[i]))
        }
        if (hadNewMessages) this.scrollToBottom()
    }

    private renderNavbar(state: State): void {
        this.navbarElement.setAuthenticated(state.user !== null)
    }

    private renderLoading(state: State): void {
        if (state.loading) {
            if (!this.cachedLoadingEl) {
                this.cachedLoadingEl = document.createElement('app-loading')
                this.loadingElement.appendChild(this.cachedLoadingEl)
            }
        } else {
            this.cachedLoadingEl?.remove()
            this.cachedLoadingEl = null
        }
    }

    // ------------------------
    // HELPERS
    // ------------------------
    private createMessageEl(msg: ChatMessage): HTMLElement {
        const el = document.createElement('app-message')
        el.setAttribute('role', msg.role)
        el.setAttribute('content', msg.content)
        return el
    }

    private scrollToBottom(): void {
        this.messagesElement.scrollTop = this.messagesElement.scrollHeight
    }
}

customElements.define('app-chat-view', AppChatView)
