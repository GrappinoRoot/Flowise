import './Navbar.css'
import template from './Navbar.html?raw'
import type { NavbarProps } from '../../types/chat'
import { Button } from '../Button/Button'
import { getElement } from '../../utils/getElement'

export class Navbar {
    private element: HTMLElement

    constructor(private props: NavbarProps) {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = template

        const actionsContainer = getElement<HTMLElement>(wrapper, '[data-actions]')

        actionsContainer.replaceChildren()

        if (props.isAuthenticated) {
            const logoutBtn = new Button({
                label: 'Logout',
                variant: 'logout',
                onClick: () => this.props.onLogout()
            })

            actionsContainer.appendChild(logoutBtn.render())
        } else {
            const loginBtn = new Button({
                label: 'Login',
                variant: 'ghost',
                onClick: () => this.props.onNavigateAuth()
            })

            const signupBtn = new Button({
                label: 'Sign up',
                variant: 'primary',
                onClick: () => this.props.onNavigateAuth()
            })

            actionsContainer.append(loginBtn.render(), signupBtn.render())
        }

        this.element = wrapper.firstElementChild as HTMLElement
    }

    render(): HTMLElement {
        return this.element
    }
}
