export function getElement<T extends HTMLElement>(container: HTMLElement, selector: string): T {
    const el = container.querySelector<T>(selector)
    if (!el) throw new Error(`Missing element: ${selector}`)
    return el
}

export function createEmptyState(): HTMLElement {
    const element = document.createElement('div')
    element.className = 'empty-state'
    element.textContent = 'Start new conversation'
    return element
}
