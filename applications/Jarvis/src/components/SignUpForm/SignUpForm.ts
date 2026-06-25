import template from './SignUpForm.html?raw'
import './SignUpForm.css'
import { supabase } from '../../lib/supabaseClient'
import googleUrl from '../../assets/google.svg?url'
import { createTemplate } from '../../utils/createTemplate'
import '../Button/Button'
import '../FormInput/FormInput'
import type { AppFormInput } from '../FormInput/FormInput'

export class AppSignUpForm extends HTMLElement {
    private usernameInput!: AppFormInput
    private emailInput!: AppFormInput
    private passwordInput!: AppFormInput
    private confirmPasswordInput!: AppFormInput
    private signupBtn!: HTMLElement
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

        const usernameInput = content.querySelector<AppFormInput>('[data-username]')
        const emailInput = content.querySelector<AppFormInput>('[data-email]')
        const passwordInput = content.querySelector<AppFormInput>('[data-password]')
        const confirmPasswordInput = content.querySelector<AppFormInput>('[data-confirm-password]')
        const signupBtn = content.querySelector<HTMLElement>('[data-signup-btn]')
        const googleBtn = content.querySelector<HTMLElement>('[data-google-btn] app-button')
        const errorBox = content.querySelector<HTMLDivElement>('[data-error]')

        if (!usernameInput) throw new Error('Missing [data-username]')
        if (!emailInput) throw new Error('Missing [data-email]')
        if (!passwordInput) throw new Error('Missing [data-password]')
        if (!confirmPasswordInput) throw new Error('Missing [data-confirm-password]')
        if (!signupBtn) throw new Error('Missing [data-signup-btn]')
        if (!googleBtn) throw new Error('Missing [data-google-btn] app-button')
        if (!errorBox) throw new Error('Missing [data-error]')

        this.usernameInput = usernameInput
        this.emailInput = emailInput
        this.passwordInput = passwordInput
        this.confirmPasswordInput = confirmPasswordInput
        this.signupBtn = signupBtn
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

        this.signupBtn.addEventListener('click', async () => {
            this.clearError()

            if (this.passwordInput.getValue() !== this.confirmPasswordInput.getValue()) {
                this.showError('Le password non corrispondono')
                return
            }

            if (!this.emailInput.getValue() || !this.passwordInput.getValue()) {
                this.showError('Inserisci email e password')
                return
            }

            this.setLoading(true)

            const { error } = await supabase.auth.signUp({
                email: this.emailInput.getValue(),
                password: this.passwordInput.getValue(),
                options: {
                    data: { username: this.usernameInput.getValue() }
                }
            })

            if (error) {
                this.setLoading(false)
                if (error.message.toLowerCase().includes('already registered') || error.code === 'user_already_exists') {
                    this.showError('Account già esistente. Effettua il login.')
                } else {
                    this.showError('Errore durante la registrazione: ' + error.message)
                }
                return
            }

            // La navigazione verso ChatView è gestita da onAuthStateChange in main.ts
        })
    }

    // ----------------------------
    // LOADING STATE
    // ----------------------------
    private setLoading(loading: boolean): void {
        if (loading) {
            this.signupBtn.setAttribute('disabled', '')
            this.signupBtn.setAttribute('label', '...')
            this.googleBtn.setAttribute('disabled', '')
        } else {
            this.signupBtn.removeAttribute('disabled')
            this.signupBtn.setAttribute('label', 'Sign Up')
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

customElements.define('app-sign-up-form', AppSignUpForm)
