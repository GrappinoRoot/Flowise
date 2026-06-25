import './FormInput.css'
import template from './FormInput.html?raw'
import { createTemplate } from '../../utils/createTemplate'

export class AppFormInput extends HTMLElement {
    private inputEl!: HTMLInputElement
    private labelEl!: HTMLElement
    private errorEl!: HTMLElement
    private _initialized = false

    // ------------------------
    // OBSERVED ATTRIBUTES
    // ------------------------
    static get observedAttributes(): string[] {
        return ['label', 'type', 'placeholder', 'value', 'required', 'error']
    }

    attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
        if (this._initialized && oldValue !== newValue) {
            this.updateField()
        }
    }

    // ------------------------
    // LIFECYCLE
    // ------------------------
    connectedCallback(): void {
        if (this._initialized) return
        this._initialized = true
        this.initialize()
    }

    // ------------------------
    // INIT
    // ------------------------
    private initialize(): void {
        const content = createTemplate(template)

        const labelEl = content.querySelector<HTMLElement>('[data-label]')
        const inputEl = content.querySelector<HTMLInputElement>('[data-input]')
        const errorEl = content.querySelector<HTMLElement>('[data-error]')

        if (!labelEl) throw new Error('Missing [data-label]')
        if (!inputEl) throw new Error('Missing [data-input]')
        if (!errorEl) throw new Error('Missing [data-error]')

        this.labelEl = labelEl
        this.inputEl = inputEl
        this.errorEl = errorEl

        inputEl.addEventListener('input', () => {
            this.dispatchEvent(
                new CustomEvent('input-change', {
                    bubbles: true,
                    detail: { value: inputEl.value }
                })
            )
        })

        this.appendChild(content)

        // Legge gli attributi iniziali DOPO appendChild (refs già valorizzate)
        this.updateField()
    }

    // ------------------------
    // PRIVATE
    // ------------------------
    private updateField(): void {
        this.inputEl.type = this.getAttribute('type') ?? 'text'
        this.inputEl.placeholder = this.getAttribute('placeholder') ?? ''
        this.inputEl.value = this.getAttribute('value') ?? ''
        this.inputEl.required = this.hasAttribute('required')
        this.labelEl.textContent = this.getAttribute('label') ?? ''
        this.errorEl.textContent = this.getAttribute('error') ?? ''
    }

    // ------------------------
    // PUBLIC API
    // ------------------------
    getValue(): string {
        return this.inputEl?.value ?? ''
    }

    setValue(value: string): void {
        if (this.inputEl) this.inputEl.value = value
    }

    setError(msg: string): void {
        this.setAttribute('error', msg)
    }

    clearError(): void {
        this.removeAttribute('error')
    }
}

customElements.define('app-form-input', AppFormInput)
