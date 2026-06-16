import template from './AuthView.html?raw'
import './AuthView.css'
import { SignInForm } from '../../components/SignInForm/SignInForm'
import { SignUpForm } from '../../components/SignUpForm/SignUpForm'

type AuthMode = 'signin' | 'signup'

export function mountAuthView(container: HTMLElement) {
    container.innerHTML = template

    const authFormElement = container.querySelector('[data-auth-form]') as HTMLDivElement
    const subtitleElement = container.querySelector('[data-auth-subtitle]') as HTMLParagraphElement
    const switchModeBtn = container.querySelector('[data-switch-mode]') as HTMLButtonElement

    let authMode: AuthMode = 'signin'

    function switchToSignIn() {
        authMode = 'signin'
        render()
    }

    function switchMode() {
        authMode = authMode === 'signin' ? 'signup' : 'signin'
        render()
    }

    function render() {
        authFormElement.replaceChildren()

        if (authMode === 'signin') {
            subtitleElement.textContent = 'Sign in to continue'
            switchModeBtn.textContent = 'Create account'

            const signInForm = new SignInForm()
            authFormElement.appendChild(signInForm.render())
        } else {
            subtitleElement.textContent = 'Create your account'
            switchModeBtn.textContent = 'Already have an account'

            const signUpForm = new SignUpForm(switchToSignIn)
            authFormElement.appendChild(signUpForm.render())
        }
    }

    switchModeBtn.addEventListener('click', switchMode)

    render()
}
