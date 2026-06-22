import template from './AuthView.html?raw'
import './AuthView.css'
import '../../components/SignInForm/SignInForm'
import '../../components/SignUpForm/SignUpForm'
import { createTemplate } from '../../utils/createTemplate'

type AuthMode = 'signin' | 'signup'

export class AppAuthView extends HTMLElement {
    private authFormElement!: HTMLElement
    private subtitleElement!: HTMLElement
    private switchModeBtn!: HTMLButtonElement
    private authMode: AuthMode = 'signin'

    private _initialized = false

    // ------------------------
    // LIFECYCLE
    // ------------------------
    connectedCallback(): void {
        if (this._initialized) return
        this._initialized = true
        this.initialize()
    }

    private initialize(): void {
        const content = createTemplate(template)

        const authFormElement = content.querySelector<HTMLElement>('[data-auth-form]')
        const subtitleElement = content.querySelector<HTMLElement>('[data-auth-subtitle]')
        const switchModeBtn = content.querySelector<HTMLButtonElement>('[data-switch-mode]')

        if (!authFormElement) throw new Error('Missing [data-auth-form]')
        if (!subtitleElement) throw new Error('Missing [data-auth-subtitle]')
        if (!switchModeBtn) throw new Error('Missing [data-switch-mode]')

        this.authFormElement = authFormElement
        this.subtitleElement = subtitleElement
        this.switchModeBtn = switchModeBtn

        this.appendChild(content)

        this.switchModeBtn.addEventListener('click', () => this.switchMode())

        this.renderForm()
    }

    // ------------------------
    // ACTIONS
    // ------------------------
    private switchMode(): void {
        this.authMode = this.authMode === 'signin' ? 'signup' : 'signin'
        this.renderForm()
    }

    // ------------------------
    // RENDER
    // ------------------------
    private renderForm(): void {
        this.authFormElement.innerHTML = ''

        if (this.authMode === 'signin') {
            this.subtitleElement.textContent = 'Sign in to continue'
            this.switchModeBtn.textContent = 'Create account'
            this.authFormElement.appendChild(document.createElement('app-sign-in-form'))
        } else {
            this.subtitleElement.textContent = 'Create your account'
            this.switchModeBtn.textContent = 'Already have an account'
            this.authFormElement.appendChild(document.createElement('app-sign-up-form'))
        }
    }
}

customElements.define('app-auth-view', AppAuthView)
