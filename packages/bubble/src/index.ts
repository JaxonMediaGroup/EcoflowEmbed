import { configFromAttributes } from './config/attrs'
import { getAutoMountScripts, queueAutoMount } from './automount'
import { ECOFLOW_ELEMENT, EcoflowChatElement } from './element'
import type { EcoflowChatConfig } from './types'

export type { EcoflowChatConfig, Message } from './types'
export { DEFAULT_CONFIG } from './types'
export { EcoflowChatElement, ECOFLOW_ELEMENT }

/**
 * Define <ecoflow-chat> en el registro global. Idempotente: puede llamarse
 * tantas veces como sea necesario (IIFE + import ESM en la misma página).
 */
export function defineEcoflowChat(): void {
    if (typeof window === 'undefined' || typeof customElements === 'undefined') return
    if (!customElements.get(ECOFLOW_ELEMENT)) {
        customElements.define(ECOFLOW_ELEMENT, EcoflowChatElement)
    }
}

declare global {
    interface Window {
        ECOFLOW_CONFIG?: Record<string, unknown>
    }
}

/**
 * Auto-mount del patrón <script src data-*>: idéntico al flujo actual de los
 * sitios. El loader script lleva los data-attributes (legacy o canónicos) y
 * este código crea un <ecoflow-chat> en el body aplicándolos como propiedades.
 *
 * currentScript debe capturarse de forma síncrona: en módulos ES es null y el
 * auto-mount simplemente no ocurre (el consumidor importa y define manualmente).
 */
function automount(script: HTMLScriptElement): void {
    defineEcoflowChat()

    if (!script) return

    const fromScript = configFromAttributes(script.attributes)
    const merged = { ...(window.ECOFLOW_CONFIG ?? {}), ...fromScript }
    if (!merged['chatflowId']) return

    const element = document.createElement(ECOFLOW_ELEMENT) as EcoflowChatElement
    // Por el setter config: las propiedades sueltas no pasan por _resolve()
    element.config = merged as Partial<EcoflowChatConfig>
    document.body.appendChild(element)
}

defineEcoflowChat()

if (typeof document !== 'undefined') {
    const scripts = getAutoMountScripts(
        document.currentScript as HTMLScriptElement | null,
        document.scripts
    )
    queueAutoMount(document, scripts, automount)
}
