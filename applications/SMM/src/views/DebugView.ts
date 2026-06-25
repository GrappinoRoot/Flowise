import template from './DebugView.html?raw'
import { createTemplate } from '../utils/createTemplate'

export class DebugView extends HTMLElement {
    connectedCallback(): void {
        const content = createTemplate(template)
        this.appendChild(content)
        this.render()

        this.querySelector('.btn-clear')?.addEventListener('click', () => {
            localStorage.removeItem('app_errors')
            this.render()
        })
    }

    private render(): void {
        const errorList = this.querySelector<HTMLElement>('.error-list')
        if (!errorList) return

        const errors = JSON.parse(localStorage.getItem('app_errors') || '[]')

        if (errors.length === 0) {
            errorList.innerHTML = '<p class="empty-msg">No errors captured yet.</p>'
            return
        }

        errorList.innerHTML = errors
            .map(
                (err: any) => `
            <div class="error-item ${err.type}">
                <div class="error-header">
                    <span class="error-type">${err.type}</span>
                    <span class="error-time">${new Date(err.timestamp).toLocaleTimeString()}</span>
                </div>
                <div class="error-message">${err.message}</div>
                ${err.stack ? `<div class="error-stack">${err.stack}</div>` : ''}
            </div>
        `
            )
            .join('')
    }
}

customElements.define('app-debug-view', DebugView)
