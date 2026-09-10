import { describe, expect, it } from 'vitest'
import { configFromAttributes, normalizeName, resolveConfig } from '../src/config/attrs'
import { DEFAULT_CONFIG } from '../src/types'

describe('normalizeName', () => {
    it('normaliza casing y separadores inconsistentes de los sitios actuales', () => {
        expect(normalizeName('data-theme-chat-Window-Title')).toBe('themechatwindowtitle')
        expect(normalizeName('data-theme-Button-Background-Color')).toBe('themebuttonbackgroundcolor')
        expect(normalizeName('button-side')).toBe('buttonside')
        expect(normalizeName('chatflowId')).toBe('chatflowid')
    })
})

describe('configFromAttributes', () => {
    it('mapea atributos canónicos kebab-case', () => {
        const config = configFromAttributes([
            { name: 'chatflow-id', value: 'abc-123' },
            { name: 'button-side', value: 'left' },
            { name: 'window-height', value: '520' }
        ])
        expect(config).toEqual({
            chatflowId: 'abc-123',
            buttonSide: 'left',
            windowHeight: 520
        })
    })

    it('mapea atributos legacy con casing mixto tal como están en los sitios', () => {
        const config = configFromAttributes([
            { name: 'data-chatflowid', value: 'f98edc6a-940e-40d4-88b7-986e8813965a' },
            { name: 'data-theme-Button-Background-Color', value: '#4e635c' },
            { name: 'data-theme-chat-Window-Title', value: 'Terralago' },
            { name: 'data-theme-Chat-Window-Welcome-Message', value: '¡Hola!' },
            { name: 'data-theme-Chat-Window-Show-Agent-Messages', value: 'false' },
            { name: 'data-theme-Text-Input-Send-Button-Color', value: '#4e635c' },
            { name: 'data-lottie-tooltip-enabled', value: 'true' },
            { name: 'data-lottie-tooltip-position-offset', value: '0' }
        ])
        expect(config).toEqual({
            chatflowId: 'f98edc6a-940e-40d4-88b7-986e8813965a',
            buttonBackgroundColor: '#4e635c',
            windowTitle: 'Terralago',
            windowWelcomeMessage: '¡Hola!',
            windowShowAgentMessages: false,
            textInputSendButtonColor: '#4e635c',
            tooltipEnabled: true,
            tooltipPositionOffset: 0
        })
    })

    it('lottieButtonLeft activa el lado izquierdo', () => {
        const config = configFromAttributes([{ name: 'data-lottie-button-left', value: '30px' }])
        expect(config).toEqual({ buttonOffsetX: '30px', buttonSide: 'left' })
    })

    it('coercea booleanos, números y strings CSS', () => {
        const config = configFromAttributes([
            { name: 'data-lottie-button-bottom', value: '45vh' },
            { name: 'data-theme-User-Message-Show-Avatar', value: 'true' },
            { name: 'data-theme-Chat-Window-Width', value: '400' }
        ])
        expect(config).toEqual({
            buttonBottom: '45vh',
            userMessageShowAvatar: true,
            windowWidth: 400
        })
    })

    it('ignora atributos desconocidos', () => {
        const config = configFromAttributes([{ name: 'data-unknown-key', value: 'x' }])
        expect(config).toEqual({})
    })
})

describe('resolveConfig', () => {
    it('con lottieAnimationPath el botón por defecto pasa a lottie', () => {
        const config = resolveConfig([{ lottieAnimationPath: 'https://x/anim.json' }])
        expect(config.buttonType).toBe('lottie')
    })

    it('sin animación, lottie degrada a icon', () => {
        const config = resolveConfig([{ buttonType: 'lottie' as const }])
        expect(config.buttonType).toBe('icon')
    })

    it('el header hereda el color del botón cuando no se define', () => {
        const config = resolveConfig([{ buttonBackgroundColor: '#123456' }])
        expect(config.windowHeaderBackgroundColor).toBe('#123456')
    })

    it('la configuración explícita gana sobre los defaults', () => {
        const config = resolveConfig([{ windowTitle: 'NOMA' }])
        expect(config.windowTitle).toBe('NOMA')
        expect(config.apiHost).toBe(DEFAULT_CONFIG.apiHost)
    })
})
