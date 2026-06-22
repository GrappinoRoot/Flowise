import template from './Sidebar.html?raw'
import './Sidebar.css'

import { dispatchStore } from '../../store/store'
import { createTemplate } from '../../utils/createTemplate'
import type { Conversation } from '../../types/chat'

import { AppConversationItem } from '../ConversationItem/ConversationItem'
import { AppProfileButton } from '../ProfileButton/ProfileButton'
import '../Button/Button'
import { showAuthView } from '../../services/viewManager'
import { signOut } from '../../services/authService'
import toggleIcon from '../../assets/toggle.svg'

export class AppSidebar extends HTMLElement {
    private conversationContainer!: HTMLElement
    private toggleButton!: HTMLElement
    private newChatButton!: HTMLElement
    private profileButton!: AppProfileButton
    private isCollapsed = false
    private _initialized = false

    // ------------------------
    // LIFECYCLE
    // ------------------------
    connectedCallback(): void {
        if (this._initialized) return
        this._initialized = true
        this.initialize()
    }

    private initialize(): void {
        const content = createTemplate(template)

        const conversationContainer = content.querySelector<HTMLElement>('[data-conversations]')
        const toggleButton = content.querySelector<HTMLElement>('[data-toggle-button]')
        const newChatButton = content.querySelector<HTMLElement>('[data-new-chat-button]')
        const profileButton = content.querySelector<AppProfileButton>('[data-profile]')

        if (!conversationContainer) throw new Error('Missing [data-conversations]')
        if (!toggleButton) throw new Error('Missing [data-toggle-button]')
        if (!newChatButton) throw new Error('Missing [data-new-chat-button]')
        if (!profileButton) throw new Error('Missing [data-profile]')

        // Imposta icon PRIMA dell'appendChild: AppButton la legge in connectedCallback
        toggleButton.setAttribute('icon', toggleIcon)

        this.conversationContainer = conversationContainer
        this.toggleButton = toggleButton
        this.newChatButton = newChatButton
        this.profileButton = profileButton

        this.appendChild(content)
        this.bindEvents()
    }

    // ------------------------
    // PUBLIC API — chiamato da ChatView
    // ------------------------
    public setConversations(conversations: Conversation[], activeId: string | null): void {
        // Raccoglie gli item già nel DOM indicizzati per conv-id
        const existing = new Map<string, AppConversationItem>()
        for (const item of this.conversationContainer.querySelectorAll<AppConversationItem>('app-conversation-item')) {
            const id = item.getAttribute('conv-id')
            if (id) existing.set(id, item)
        }

        const seen = new Set<string>()

        for (const conv of conversations) {
            seen.add(conv.Id)
            let item = existing.get(conv.Id)

            if (!item) {
                // Nuovo item: crea e setta conv-id prima dell'append
                item = document.createElement('app-conversation-item') as AppConversationItem
                item.setAttribute('conv-id', conv.Id)
            }

            // Aggiorna title e active (attributeChangedCallback reagisce se già nel DOM)
            item.setAttribute('title', conv.title)
            item.setAttribute('active', String(conv.Id === activeId))

            // appendChild riposiziona se già presente → preserva l'ordine
            this.conversationContainer.appendChild(item)
        }

        // Rimuovi conversazioni eliminate
        for (const [id, item] of existing) {
            if (!seen.has(id)) item.remove()
        }
    }

    public setUser(user: { email: string; avatarUrl?: string } | null): void {
        this.profileButton.setUser(user)
    }

    // ------------------------
    // EVENTS
    // ------------------------
    private bindEvents(): void {
        this.toggleButton.addEventListener('click', () => this.toggleSidebar())
        this.newChatButton.addEventListener('click', () => this.handleNewChat())
        this.profileButton.addEventListener('logout', async () => this.handleLogout())

        this.conversationContainer.addEventListener('click', (event) => {
            const el = (event.target as HTMLElement).closest('[data-id]') as HTMLElement | null
            if (!el) return
            const conversationId = el.dataset.id
            if (!conversationId) return
            dispatchStore('CONVERSATION_SELECTED', { conversationId })
        })
    }

    // ------------------------
    // ACTIONS
    // ------------------------
    private toggleSidebar(): void {
        this.isCollapsed = !this.isCollapsed
        this.classList.toggle('collapsed', this.isCollapsed)
    }

    private handleNewChat(): void {
        dispatchStore('CONVERSATION_CREATED', { Id: crypto.randomUUID(), title: 'New Chat' })
    }

    private async handleLogout(): Promise<void> {
        await signOut()
        showAuthView()
    }
}

customElements.define('app-sidebar', AppSidebar)
