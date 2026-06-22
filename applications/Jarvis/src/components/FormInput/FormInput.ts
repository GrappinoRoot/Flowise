import './FormInput.css'
import template from './FormInput.html?raw'
import { createTemplate } from '../../utils/createTemplate'

export class FormInput extends HTMLElement {
    private _initialized = false

    static get observedAttributes() {
        return ['label', 'type', 'placeholder', 'value', 'required', 'error']
    }

    connectedCallback(): void {
        if (this._initialized) return
        this._initialized = true
        this.initialize()
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (this._initialized && oldValue !== newValue) {
            this.updateField()
        }
    }

    private initialize(): void {
        const content = createTemplate(template)

        const labelEl = content.querySelector<HTMLElement>('[data-label]')
        const inputEl = content.querySelector<HTMLInputElement>('[data-input]')
        const errorEl = content.querySelector<HTMLElement>('[data-error]')

        if (!labelEl) throw new Error('Missing [data-label]')
        if (!inputEl) throw new Error('Missing [data-input]')
        if (!errorEl) throw new Error('Missing [data-error]')

        this.updateField()

        // Dispatch event on input
        inputEl.addEventListener('input', () => {
            this.dispatchEvent(
                new CustomEvent('input-change', {
                    detail: { value: inputEl.value }
                })
            )
        })

        this.appendChild(content)
    }

    private updateField(): void {
        const inputEl = this.querySelector('[data-input]') as HTMLInputElement
        const labelEl = this.querySelector('[data-label]') as HTMLLabelElement
        const errorEl = this.querySelector('[data-error]') as HTMLElement

        if (!inputEl) return

        inputEl.type = this.getAttribute('type') ?? 'text'
        inputEl.placeholder = this.getAttribute('placeholder') ?? ''
        inputEl.value = this.getAttribute('value') ?? ''
        inputEl.required = this.hasAttribute('required')

        if (labelEl) {
            labelEl.textContent = this.getAttribute('label') ?? ''
        }

        if (errorEl) {
            errorEl.textContent = this.getAttribute('error') ?? ''
        }
    }

    getValue(): string {
        const input = this.querySelector('[data-input]') as HTMLInputElement
        return input?.value ?? ''
    }

    setValue(value: string): void {
        const input = this.querySelector('[data-input]') as HTMLInputElement
        if (input) {
            input.value = value
        }
    }
}

customElements.define('form-input', FormInput)
