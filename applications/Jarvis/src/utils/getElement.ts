export function createEmptyState(): HTMLElement {
    const element = document.createElement('div')
    element.className = 'empty-state'
    element.textContent = 'Start new conversation'
    return element
}
