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

export function mountChatView(container: HTMLElement) {
    container.innerHTML = template

    // ----------------------------
    // DOM NODES
    // ----------------------------
    const messagesElement = getElement(container, '[data-messages]')
    const composerElement = getElement(container, '[data-composer]')
    const loadingElement = getElement(container, '[data-loading]')
    const sidebarElement = getElement(container, '[data-sidebar]')
    const navbarElement = getElement(container, '[data-navbar]')

    // ----------------------------
    // COMPONENTS
    // ----------------------------
    mountComposer(composerElement)

    new Sidebar(sidebarElement)

    const navbar = new Navbar({
        isAuthenticated: true,
        onNavigateAuth: () => showAuthView(),
        onLogout: async () => {
            await signOut()
            showAuthView()
        }
    })

    navbarElement.appendChild(navbar.render())

    // ----------------------------
    // RENDER HELPERS
    // ----------------------------

    function renderLoading(state: ReturnType<typeof getState>) {
        loadingElement.replaceChildren()
        if (!state.loading) return
        const loading = new Loading()
        loadingElement.appendChild(loading.render())
    }

    function renderMessages(state: ReturnType<typeof getState>) {
        const activeConversation = state.activeConversationId
            ? state.conversations.find((c) => c.Id === state.activeConversationId)
            : undefined

        messagesElement.replaceChildren()

        if (!activeConversation) {
            messagesElement.appendChild(createEmptyState())
            return
        }

        for (const msg of activeConversation.messages) {
            const message = new Message({
                role: msg.role,
                content: msg.content
            })

            messagesElement.appendChild(message.render())
        }
    }

    // ----------------------------
    // MAIN RENDER
    // ----------------------------
    function render() {
        const state = getState()

        renderLoading(state)
        renderMessages(state)
    }

    // ----------------------------
    // INIT
    // ----------------------------
    render()

    // NOTA: In un'app reale, subscribe dovrebbe ritornare una funzione di unsubscribe
    // da chiamare quando la vista viene smontata per evitare memory leak.
    subscribe(() => {
        render()
    })
}
