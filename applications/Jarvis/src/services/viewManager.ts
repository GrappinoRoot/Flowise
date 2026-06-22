import '../views/AuthView/AuthView'
import '../views/ChatView/ChatView'

let rootElement: HTMLElement | null = null

export function initializeViewManager(container: HTMLElement) {
    rootElement = container
}

export function showAuthView() {
    if (!rootElement) return

    rootElement.innerHTML = ''
    rootElement.appendChild(document.createElement('app-auth-view'))
}

export function showChatView() {
    if (!rootElement) return

    rootElement.innerHTML = ''
    rootElement.appendChild(document.createElement('app-chat-view'))
}
