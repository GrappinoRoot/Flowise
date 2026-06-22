import template from './Composer.html?raw'
import './Composer.css'
import { dispatchStore } from '../../store/store'
import { createTemplate } from '../../utils/createTemplate'
import '../Button/Button'

export class AppComposer extends HTMLElement {
    private _initialized = false

    connectedCallback(): void {
        if (this._initialized) return
        this._initialized = true
        this.initialize()
    }

    private initialize(): void {
        const content = createTemplate(template)

        const formElement = content.querySelector<HTMLFormElement>('[data-composer-form]')
        const inputElement = content.querySelector<HTMLInputElement>('[data-composer-input]')

        if (!formElement) throw new Error('Missing [data-composer-form]')
        if (!inputElement) throw new Error('Missing [data-composer-input]')

        formElement.addEventListener('submit', (event) => {
            event.preventDefault()

            const value = inputElement.value.trim()
            if (!value) return

            dispatchStore('USER_MESSAGE_SUBMITTED', { content: value })
            inputElement.value = ''
        })

        this.appendChild(content)
    }
}

customElements.define('app-composer', AppComposer)
