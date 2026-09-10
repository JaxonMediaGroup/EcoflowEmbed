import { DEFAULT_CONFIG, type EcoflowChatConfig } from '../types'

/**
 * Capa de compatibilidad de atributos.
 *
 * Acepta tres escrituras del mismo valor y las normaliza a la clave canónica:
 *  - canónica:            button-side="left"  /  windowTitle (en objetos)
 *  - legacy del script:   data-theme-Button-Background-Color="#fff"
 *  - legacy inconsistente: data-theme-chat-Window-Title="..." (casing mixto real de los sitios)
 *
 * La normalización quita "data-", baja a minúsculas y elimina separadores,
 * así el casing inconsistente de los sitios actuales no importa.
 */

/** Alias legacy → clave canónica. `extra` permite que un alias fije más de una clave. */
const LEGACY_ALIASES: Record<string, string | { key: string; extra: Partial<EcoflowChatConfig> }> = {
    themeChatWindowTitle: 'windowTitle',
    themeChatWindowWelcomeMessage: 'windowWelcomeMessage',
    themeChatWindowHeight: 'windowHeight',
    themeChatWindowWidth: 'windowWidth',
    themeChatWindowErrorMessage: 'windowErrorMessage',
    themeChatWindowShowAgentMessages: 'windowShowAgentMessages',
    themeChatWindowBackgroundColor: 'windowBackgroundColor',
    themeChatWindowFontSize: 'windowFontSize',
    themeButtonBackgroundColor: 'buttonBackgroundColor',
    themeButtonRight: 'buttonOffsetX',
    themeButtonBottom: 'buttonBottom',
    themeButtonZIndex: 'buttonZIndex',
    themeZIndex: 'windowZIndex',
    lottieButtonBottom: 'buttonBottom',
    lottieButtonRight: 'buttonOffsetX',
    lottieButtonLeft: { key: 'buttonOffsetX', extra: { buttonSide: 'left' } },
    lottieButtonWidth: 'buttonWidth',
    lottieButtonHeight: 'buttonHeight',
    lottieButtonZIndex: 'buttonZIndex',
    lottieTooltipEnabled: 'tooltipEnabled',
    lottieTooltipText: 'tooltipText',
    lottieTooltipBackgroundColor: 'tooltipBackgroundColor',
    lottieTooltipTextColor: 'tooltipTextColor',
    lottieTooltipFontSize: 'tooltipFontSize',
    lottieTooltipPadding: 'tooltipPadding',
    lottieTooltipBorderRadius: 'tooltipBorderRadius',
    lottieTooltipPositionOffset: 'tooltipPositionOffset',
    themeBotMessageBackgroundColor: 'botMessageBackgroundColor',
    themeBotMessageTextColor: 'botMessageTextColor',
    themeBotMessageShowAvatar: 'botMessageShowAvatar',
    themeBotMessageAvatarSrc: 'botMessageAvatarSrc',
    themeUserMessageBackgroundColor: 'userMessageBackgroundColor',
    themeUserMessageTextColor: 'userMessageTextColor',
    themeUserMessageShowAvatar: 'userMessageShowAvatar',
    themeUserMessageAvatarSrc: 'userMessageAvatarSrc',
    themeTextInputPlaceholder: 'textInputPlaceholder',
    themeTextInputBackgroundColor: 'textInputBackgroundColor',
    themeTextInputTextColor: 'textInputTextColor',
    themeTextInputSendButtonColor: 'textInputSendButtonColor',
    themeTextInputMaxChars: 'textInputMaxChars',
    themeTextInputAutoFocus: 'textInputAutoFocus',
    themeFooterText: 'footerText',
    themeFooterCompany: 'footerCompany',
    themeFooterCompanyLink: 'footerCompanyLink',
    themeFooterTextColor: 'footerTextColor'
}

/** minúsculas + sin separadores, quitando el prefijo data- */
export function normalizeName(name: string): string {
    return name
        .toLowerCase()
        .replace(/^data-/, '')
        .replace(/[^a-z0-9]/g, '')
}

const canonicalIndex: Map<string, string> = new Map(
    (Object.keys(DEFAULT_CONFIG) as (keyof EcoflowChatConfig)[]).map((key) => [
        normalizeName(key),
        key
    ])
)

const legacyIndex: Map<string, string | { key: string; extra: Partial<EcoflowChatConfig> }> = new Map(
    Object.entries(LEGACY_ALIASES).map(([legacy, target]) => [normalizeName(legacy), target])
)

/** Coerción de valores textuales: booleanos, números y strings CSS ("45vh") */
export function parseValue(raw: string): string | number | boolean {
    const value = raw.trim()
    if (value === '') return true // atributo booleano sin valor: data-tooltip-enabled=""
    if (value === 'true') return true
    if (value === 'false') return false
    if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value)
    return value
}

interface AttrLike {
    name: string
    value: string
}

/**
 * Construye configuración parcial a partir de atributos (del loader script,
 * del propio elemento o de cualquier fuente de pares name/value).
 */
export function configFromAttributes(attrs: ArrayLike<AttrLike> | Iterable<AttrLike>): Partial<EcoflowChatConfig> {
    const out: Partial<EcoflowChatConfig> = {}
    const list = Array.isArray(attrs) ? attrs : Array.from(attrs as Iterable<AttrLike>)
    for (const attr of list) {
        const normalized = normalizeName(attr.name)
        const canonical = canonicalIndex.get(normalized)
        if (canonical) {
            ;(out as Record<string, unknown>)[canonical] = parseValue(attr.value)
            continue
        }
        const legacy = legacyIndex.get(normalized)
        if (typeof legacy === 'string') {
            ;(out as Record<string, unknown>)[legacy] = parseValue(attr.value)
        } else if (legacy && typeof legacy === 'object') {
            ;(out as Record<string, unknown>)[legacy.key] = parseValue(attr.value)
            Object.assign(out, legacy.extra)
        }
    }
    return out
}

/** Lista de atributos a observar en <ecoflow-chat>: canónicos + legacy */
export function observedAttributeNames(): string[] {
    const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())
    const canonical = (Object.keys(DEFAULT_CONFIG) as (keyof EcoflowChatConfig)[]).map(kebab)
    const legacy = Object.keys(LEGACY_ALIASES).map(kebab)
    return Array.from(new Set([...canonical, ...legacy]))
}

/**
 * Resuelve la configuración final aplicando defaults y reglas derivadas.
 * Precedencia: props JS > atributos del elemento > window.ECOFLOW_CONFIG > defaults.
 */
export function resolveConfig(parts: Partial<EcoflowChatConfig>[]): EcoflowChatConfig {
    const merged = Object.assign({}, DEFAULT_CONFIG, ...parts) as EcoflowChatConfig
    // Reglas derivadas: el tipo de botón sigue al recurso disponible
    if (merged.buttonType === 'icon' && merged.lottieAnimationPath && !merged.buttonImageSrc) {
        merged.buttonType = 'lottie'
    } else if (merged.buttonType === 'lottie' && !merged.lottieAnimationPath) {
        merged.buttonType = merged.buttonImageSrc ? 'image' : 'icon'
    }
    if (merged.buttonType === 'image' && !merged.buttonImageSrc) {
        merged.buttonType = 'icon'
    }
    if (!merged.windowHeaderBackgroundColor) {
        merged.windowHeaderBackgroundColor = merged.buttonBackgroundColor
    }
    return merged
}
