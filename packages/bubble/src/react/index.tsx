import { createElement, useEffect, useRef, type CSSProperties } from 'react'
// Side-effect: asegura que <ecoflow-chat> quede definido aunque la app no
// importe el core por separado (el build de React incluye todo el bundle)
import '../index'
import type { EcoflowChatConfig, EcoflowChatElement } from '../index'

export type { EcoflowChatConfig, Message } from '../types'

export interface EcoflowChatProps {
    /** Configuración del widget (misma forma que los data-attributes) */
    config: Partial<EcoflowChatConfig>
    /** Callback con el elemento una vez montado: expone open/close/toggle/sendMessage */
    onReady?: (element: EcoflowChatElement) => void
    /** Clase/estilo para el host del widget (el botón y la ventana son fixed) */
    className?: string
    style?: CSSProperties
}

/**
 * <EcoflowChat config={...} /> — wrapper React del web component.
 *
 * La configuración se pasa como propiedad JS (no atributos) para soportar
 * valores no-string y funciona igual en React 17, 18 y 19.
 *
 * Importar este módulo define <ecoflow-chat> automáticamente en la página.
 */
export function EcoflowChat({ config, onReady, className, style }: EcoflowChatProps) {
    const ref = useRef<EcoflowChatElement | null>(null)

    useEffect(() => {
        const element = ref.current
        if (!element) return
        element.config = config
        onReady?.(element)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config])

    return createElement('ecoflow-chat', { ref, className, style })
}
