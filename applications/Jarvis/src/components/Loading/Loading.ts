import template from './Loading.html?raw'
import './Loading.css'
import { getElement } from '../../utils/getElement'

export class Loading {
    private element: HTMLElement

    constructor() {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = template

        const root = getElement<HTMLElement>(wrapper, '[data-root]')

        this.element = root
    }

    render(): HTMLElement {
        return this.element
    }
}
