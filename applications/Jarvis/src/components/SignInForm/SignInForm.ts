import template from './SignInForm.html?raw'
import './SignInForm.css'
import { supabase } from '../../lib/supabaseClient'
import { showChatView } from '../../services/viewManager'
import { Button } from '../Button/Button'
import google from '../../assets/google.svg'
import { getElement } from '../../utils/getElement'

export class SignInForm {
    private element: HTMLElement

    private emailInput: HTMLInputElement
    private passwordInput: HTMLInputElement
    private loginBtn: HTMLButtonElement
    private googleContainer: HTMLElement
    private errorBox: HTMLDivElement

    constructor() {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = template

        this.emailInput = getElement<HTMLInputElement>(wrapper, '[data-email]')
        this.passwordInput = getElement<HTMLInputElement>(wrapper, '[data-password]')
        this.loginBtn = getElement<HTMLButtonElement>(wrapper, '[data-login-btn]')
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
        this.loginBtn.addEventListener('click', async () => {
            this.clearError()

            const { error } = await supabase.auth.signInWithPassword({
                email: this.emailInput.value,
                password: this.passwordInput.value
            })

            if (error) {
                if (error.code === 'invalid_credentials') {
                    this.showError('Email o password non corretti')
                } else {
                    this.showError('Errore durante il login, riprova')
                }
                return
            }

            showChatView()
        })
    }

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
