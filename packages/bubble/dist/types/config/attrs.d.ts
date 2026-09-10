import { EcoflowChatConfig } from '../types';
/** minúsculas + sin separadores, quitando el prefijo data- */
export declare function normalizeName(name: string): string;
/** Coerción de valores textuales: booleanos, números y strings CSS ("45vh") */
export declare function parseValue(raw: string): string | number | boolean;
interface AttrLike {
    name: string;
    value: string;
}
/**
 * Construye configuración parcial a partir de atributos (del loader script,
 * del propio elemento o de cualquier fuente de pares name/value).
 */
export declare function configFromAttributes(attrs: ArrayLike<AttrLike> | Iterable<AttrLike>): Partial<EcoflowChatConfig>;
/** Lista de atributos a observar en <ecoflow-chat>: canónicos + legacy */
export declare function observedAttributeNames(): string[];
/**
 * Resuelve la configuración final aplicando defaults y reglas derivadas.
 * Precedencia: props JS > atributos del elemento > window.ECOFLOW_CONFIG > defaults.
 */
export declare function resolveConfig(parts: Partial<EcoflowChatConfig>[]): EcoflowChatConfig;
export {};
