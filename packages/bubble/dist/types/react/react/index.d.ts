import { CSSProperties } from 'react';
import { EcoflowChatConfig, EcoflowChatElement } from '../index';
export type { EcoflowChatConfig, Message } from '../types';
export interface EcoflowChatProps {
    /** Configuración del widget (misma forma que los data-attributes) */
    config: Partial<EcoflowChatConfig>;
    /** Callback con el elemento una vez montado: expone open/close/toggle/sendMessage */
    onReady?: (element: EcoflowChatElement) => void;
    /** Clase/estilo para el host del widget (el botón y la ventana son fixed) */
    className?: string;
    style?: CSSProperties;
}
/**
 * <EcoflowChat config={...} /> — wrapper React del web component.
 *
 * La configuración se pasa como propiedad JS (no atributos) para soportar
 * valores no-string y funciona igual en React 17, 18 y 19.
 *
 * Importar este módulo define <ecoflow-chat> automáticamente en la página.
 */
export declare function EcoflowChat({ config, onReady, className, style }: EcoflowChatProps): import('react').ReactElement<{
    ref: import('react').MutableRefObject<EcoflowChatElement | null>;
    className: string | undefined;
    style: CSSProperties | undefined;
}, string | import('react').JSXElementConstructor<any>>;
