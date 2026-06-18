import template from './AuthView.html?raw'
import './AuthView.css'
import { SignInForm } from '../../components/SignInForm/SignInForm'
import { SignUpForm } from '../../components/SignUpForm/SignUpForm'
import { getElement } from '../../utils/getElement'

type AuthMode = 'signin' | 'signup'

export class AuthView {
    private host: HTMLElement
    private authFormElement: HTMLElement
    private subtitleElement: HTMLElement
    private switchModeBtn: HTMLButtonElement
    private authMode: AuthMode = 'signin'

    constructor(host: HTMLElement) {
        this.host = host
        this.host.innerHTML = template

        this.authFormElement = getElement(this.host, '[data-auth-form]')
        this.subtitleElement = getElement(this.host, '[data-auth-subtitle]')
        this.switchModeBtn = getElement(this.host, '[data-switch-mode]')

        this.switchModeBtn.addEventListener('click', () => this.switchMode())

        this.render()
    }

    private switchMode(): void {
        this.authMode = this.authMode === 'signin' ? 'signup' : 'signin'
        this.render()
    }

    private render(): void {
        this.authFormElement.innerHTML = ''

        if (this.authMode === 'signin') {
            this.subtitleElement.textContent = 'Sign in to continue'
            this.switchModeBtn.textContent = 'Create account'
            const signInForm = new SignInForm()
            this.authFormElement.appendChild(signInForm.render())
        } else {
            this.subtitleElement.textContent = 'Create your account'
            this.switchModeBtn.textContent = 'Already have an account'
            const signUpForm = new SignUpForm()
            this.authFormElement.appendChild(signUpForm.render())
        }
    }
}

export function mountAuthView(container: HTMLElement) {
    new AuthView(container)
}
