import { render } from 'preact'
import { ChatApp } from './component'
import { configFromAttributes, observedAttributeNames, resolveConfig } from './config/attrs'
import { WIDGET_CSS } from './styles'
import type { EcoflowChatConfig } from './types'

export const ECOFLOW_ELEMENT = 'ecoflow-chat'

declare global {
    interface HTMLElementTagNameMap {
        'ecoflow-chat': EcoflowChatElement
    }
}

/**
 * Web component <ecoflow-chat>.
 *
 * La configuración se resuelve con esta precedencia:
 *   1. Propiedad JS `element.config` (la que usa el wrapper de React)
 *   2. Atributos del propio elemento (canónicos o legacy)
 *   3. window.ECOFLOW_CONFIG
 *   4. Defaults
 */
export class EcoflowChatElement extends HTMLElement {
    static get observedAttributes(): string[] {
        return observedAttributeNames()
    }

    private _explicitConfig: Partial<EcoflowChatConfig> = {}
    private _shadow: ShadowRoot | null = null

    // API imperativa, implementada por ChatApp al montar
    open: () => void = () => {}
    close: () => void = () => {}
    toggle: () => void = () => {}
    sendMessage: (text: string) => void = () => {}

    get config(): Partial<EcoflowChatConfig> {
        return this._explicitConfig
    }

    set config(value: Partial<EcoflowChatConfig>) {
        this._explicitConfig = value ?? {}
        this._render()
    }

    connectedCallback(): void {
        if (this._shadow) return
        this._shadow = this.attachShadow({ mode: 'open' })
        const style = document.createElement('style')
        style.textContent = WIDGET_CSS
        this._shadow.appendChild(style)
        this._render()
    }

    disconnectedCallback(): void {
        if (this._shadow) render(null, this._shadow)
    }

    attributeChangedCallback(): void {
        this._render()
    }

    private _resolve(): EcoflowChatConfig {
        const fromWindow =
            typeof window !== 'undefined' && window.ECOFLOW_CONFIG
                ? (window.ECOFLOW_CONFIG as Partial<EcoflowChatConfig>)
                : {}
        const fromAttrs = configFromAttributes(this.attributes)
        return resolveConfig([fromWindow, fromAttrs, this._explicitConfig])
    }

    private _render(): void {
        if (!this._shadow) return
        render(<ChatApp host={this} config={this._resolve()} />, this._shadow)
    }
}
