import { ECOFLOW_ELEMENT, EcoflowChatElement } from './element';
export type { EcoflowChatConfig, Message } from './types';
export { DEFAULT_CONFIG } from './types';
export { EcoflowChatElement, ECOFLOW_ELEMENT };
/**
 * Define <ecoflow-chat> en el registro global. Idempotente: puede llamarse
 * tantas veces como sea necesario (IIFE + import ESM en la misma página).
 */
export declare function defineEcoflowChat(): void;
declare global {
    interface Window {
        ECOFLOW_CONFIG?: Record<string, unknown>;
    }
}
