import template from './SignInForm.html?raw'
import './SignInForm.css'
import { supabase } from '../../lib/supabaseClient'
import { showChatView } from '../../services/viewManager'
import googleUrl from '../../assets/google.svg?url'
import { createTemplate } from '../../utils/createTemplate'
import '../Button/Button'

export class AppSignInForm extends HTMLElement {
    private emailInput!: HTMLInputElement
    private passwordInput!: HTMLInputElement
    private loginBtn!: HTMLElement
    private googleBtn!: HTMLElement
    private errorBox!: HTMLDivElement

    private _initialized = false

    // ----------------------------
    // LIFECYCLE
    // ----------------------------
    connectedCallback(): void {
        if (this._initialized) return
        this._initialized = true
        this.initialize()
    }

    private initialize(): void {
        const content = createTemplate(template)

        const emailInput = content.querySelector<HTMLInputElement>('[data-email]')
        const passwordInput = content.querySelector<HTMLInputElement>('[data-password]')
        const loginBtn = content.querySelector<HTMLElement>('[data-login-btn]')
        const googleBtn = content.querySelector<HTMLElement>('[data-google-btn] app-button')
        const errorBox = content.querySelector<HTMLDivElement>('[data-error]')

        if (!emailInput) throw new Error('Missing [data-email]')
        if (!passwordInput) throw new Error('Missing [data-password]')
        if (!loginBtn) throw new Error('Missing [data-login-btn]')
        if (!googleBtn) throw new Error('Missing [data-google-btn] app-button')
        if (!errorBox) throw new Error('Missing [data-error]')

        this.emailInput = emailInput
        this.passwordInput = passwordInput
        this.loginBtn = loginBtn
        this.googleBtn = googleBtn
        this.errorBox = errorBox

        // Passa l'URL dell'icona Google PRIMA dell'append:
        // app-button la leggerà in connectedCallback e renderizzerà app-icon
        googleBtn.setAttribute('icon', googleUrl)

        this.appendChild(content)
        this.bindEvents()
    }

    // ----------------------------
    // EVENTS
    // ----------------------------
    private bindEvents(): void {
        this.loginBtn.addEventListener('click', async () => {
            this.clearError()
            this.setLoading(true)

            const { error } = await supabase.auth.signInWithPassword({
                email: this.emailInput.value,
                password: this.passwordInput.value
            })

            if (error) {
                this.setLoading(false)
                if (error.code === 'invalid_credentials') {
                    this.showError('Email o password non corretti')
                } else {
                    this.showError('Errore durante il login, riprova')
                }
                return
            }

            showChatView()
        })

        this.googleBtn.addEventListener('click', async () => {
            this.setLoading(true)
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: window.location.origin }
            })

            if (error) {
                this.setLoading(false)
                this.showError('Errore durante il login con Google')
            }
        })
    }

    // ----------------------------
    // LOADING STATE
    // ----------------------------
    private setLoading(loading: boolean): void {
        if (loading) {
            this.loginBtn.setAttribute('disabled', '')
            this.loginBtn.setAttribute('label', '...')
            this.googleBtn.setAttribute('disabled', '')
        } else {
            this.loginBtn.removeAttribute('disabled')
            this.loginBtn.setAttribute('label', 'Login')
            this.googleBtn.removeAttribute('disabled')
        }
    }

    // ----------------------------
    // ERROR HANDLING
    // ----------------------------
    private showError(message: string): void {
        this.errorBox.textContent = message
    }

    private clearError(): void {
        this.errorBox.textContent = ''
    }
}

customElements.define('app-sign-in-form', AppSignInForm)
