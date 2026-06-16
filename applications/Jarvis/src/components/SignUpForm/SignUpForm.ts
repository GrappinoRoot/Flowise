import template from './SignUpForm.html?raw'
import './SignUpForm.css'
import { supabase } from '../../lib/supabaseClient'
import { showChatView } from '../../services/viewManager'
import { Button } from '../Button/Button'
import google from '../../assets/google.svg'
import { getElement } from '../../utils/getElement'

export class SignUpForm {
    private element: HTMLElement

    private usernameInput: HTMLInputElement
    private emailInput: HTMLInputElement
    private passwordInput: HTMLInputElement
    private confirmPasswordInput: HTMLInputElement
    private signupBtn: HTMLButtonElement
    private googleContainer: HTMLElement
    private errorBox: HTMLDivElement

    constructor() {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = template

        this.usernameInput = getElement<HTMLInputElement>(wrapper, '[data-username]')
        this.emailInput = getElement<HTMLInputElement>(wrapper, '[data-email]')
        this.passwordInput = getElement<HTMLInputElement>(wrapper, '[data-password]')
        this.confirmPasswordInput = getElement<HTMLInputElement>(wrapper, '[data-confirm-password]')
        this.signupBtn = getElement<HTMLButtonElement>(wrapper, '[data-signup-btn]')
        this.googleContainer = getElement<HTMLElement>(wrapper, '[data-google-btn]')
        this.errorBox = getElement<HTMLDivElement>(wrapper, '[data-error]')

        this.bindEvents()
        this.mountGoogleButton()

        this.element = wrapper.firstElementChild as HTMLElement
    }

    // ----------------------------
    // EVENTS
    // ----------------------------
    private bindEvents(): void {
        this.signupBtn.addEventListener('click', async () => {
            this.clearError()

            if (this.passwordInput.value !== this.confirmPasswordInput.value) {
                this.showError('Le password non corrispondono')
                return
            }

            if (!this.emailInput.value || !this.passwordInput.value) {
                this.showError('Inserisci email e password')
                return
            }

            const { error } = await supabase.auth.signUp({
                email: this.emailInput.value,
                password: this.passwordInput.value,
                options: {
                    data: {
                        username: this.usernameInput.value
                    }
                }
            })

            if (error) {
                if (error.message.toLowerCase().includes('already registered') || error.code === 'user_already_exists') {
                    this.showError('Account già esistente. Reindirizzamento al login...')

                    setTimeout(() => {
                        showChatView() // oppure callback se vuoi switchAuthMode
                    }, 2000)
                } else {
                    this.showError('Errore durante la registrazione: ' + error.message)
                }
                return
            }

            showChatView()
        })
    }

    // ----------------------------
    // GOOGLE AUTH
    // ----------------------------
    private mountGoogleButton(): void {
        const googleBtn = new Button({
            label: 'Continue with Google',
            icon: google,
            variant: 'secondary',
            onClick: async () => {
                const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: window.location.origin
                    }
                })

                if (error) {
                    this.showError('Errore login Google')
                }
            }
        }).render()

        this.googleContainer.replaceWith(googleBtn)
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

    // ----------------------------
    // RENDER
    // ----------------------------
    public render(): HTMLElement {
        return this.element
    }
}
