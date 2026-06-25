import '../views/AuthView/AuthView'
import '../views/ChatView/ChatView'

let rootElement: HTMLElement | null = null

export function initializeViewManager(container: HTMLElement) {
    rootElement = container
}

export function showAuthView(initialMode: 'signin' | 'signup' = 'signin') {
    if (!rootElement) return

    rootElement.innerHTML = ''
    const view = document.createElement('app-auth-view')
    view.setAttribute('initial-mode', initialMode)
    rootElement.appendChild(view)
}

export function showChatView() {
    if (!rootElement) return

    rootElement.innerHTML = ''
    rootElement.appendChild(document.createElement('app-chat-view'))
}
