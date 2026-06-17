import template from './Sidebar.html?raw'
import './Sidebar.css'
import { getState } from '../../store/store'
import { subscribe } from '../../store/subscribers'
import { getElement } from '../../utils/getElement'
import { dispatchStore } from '../../store/store'
import { Button } from '../../components/Button/Button'
import { ProfileButton } from '../../components/ProfileButton/ProfileButton'
import { ConversationItem } from '../../components/ConversationItem/ConversationItem'
import { showAuthView } from '../../services/viewManager'
import { signOut } from '../../services/authService'
import toggleIcon from '../../assets/toggle.svg'

export function mountSidebar(container: HTMLElement) {
    container.innerHTML = template

    let isCollapsed = false

    const conversationsContainer = getElement(container, '[data-conversations]')
    const toggleContainer = getElement(container, '[data-sidebar-toggle]')
    const headerContainer = getElement(container, '[data-sidebar-header]')
    const footerContainer = getElement(container, '[data-sidebar-footer]')

    function toggleSidebar() {
        isCollapsed = !isCollapsed
        container.classList.toggle('collapsed', isCollapsed)
    }

    function handleNewChat() {
        dispatchStore('CONVERSATION_CREATED', {
            Id: crypto.randomUUID(),
            title: 'New Chat'
        })
    }

    const newChatBtn = new Button({
        label: 'New Chat',
        variant: 'secondary',
        onClick: handleNewChat
    })

    const toggleBtn = new Button({
        label: '',
        icon: toggleIcon,
        variant: 'ghost',
        onClick: toggleSidebar
    })

    headerContainer.prepend(newChatBtn.render())
    toggleContainer.prepend(toggleBtn.render())

    conversationsContainer.addEventListener('click', (event) => {
        const el = (event.target as HTMLElement).closest('[data-id]') as HTMLElement | null
        if (!el) return

        const conversationId = el.dataset.id
        if (!conversationId) return

        dispatchStore('CONVERSATION_SELECTED', { conversationId })
    })

    function render() {
        const state = getState()

        conversationsContainer.replaceChildren()
        for (const conversation of state.conversations) {
            conversationsContainer.appendChild(
                new ConversationItem({
                    id: conversation.Id,
                    title: conversation.title,
                    active: conversation.Id === state.activeConversationId
                }).render()
            )
        }

        footerContainer.replaceChildren()

        if (state.user) {
            const profileButton = new ProfileButton({
                email: state.user.email,
                avatarUrl: state.user.avatarUrl,
                onLogout: async () => {
                    await signOut()
                    showAuthView()
                }
            })

            footerContainer.appendChild(profileButton.render())
        }
    }

    render()
    subscribe(render)
}
