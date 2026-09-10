import { describe, expect, it } from 'vitest'
import { themeVars } from '../src/component'
import { resolveConfig } from '../src/config/attrs'
import { WIDGET_CSS } from '../src/styles'

describe('scrollbar theme', () => {
    it('hereda los colores del tema tanto en Firefox como en WebKit', () => {
        expect(WIDGET_CSS).toContain('scrollbar-color: var(--ec-c-send) var(--ec-bg-window);')
        expect(WIDGET_CSS).toContain('.ecoflow-messages::-webkit-scrollbar-track { background: var(--ec-bg-window); }')
        expect(WIDGET_CSS).toMatch(
            /\.ecoflow-messages::\-webkit-scrollbar-thumb\s*\{\s*background:\s*var\(--ec-c-send\);/
        )
    })

    it('conserva el tratamiento translúcido en el tema glass', () => {
        expect(WIDGET_CSS).toContain('scrollbar-color: color-mix(in srgb, var(--ec-c-send) 72%, white) transparent;')
        expect(WIDGET_CSS).toContain('background: color-mix(in srgb, var(--ec-c-send) 72%, white);')
    })
})

describe('glass message contrast', () => {
    it('mantiene el fondo del bot oscuro y distinto al mensaje del usuario', () => {
        expect(WIDGET_CSS).toContain('.ecoflow-window--glass .ecoflow-bubble--bot {')
        expect(WIDGET_CSS).toContain('background: color-mix(in srgb, var(--ec-glass-tint) 52%, black);')
        expect(WIDGET_CSS).not.toContain('.ecoflow-window--glass .ecoflow-bubble--user {')
    })
})

describe('glass tint', () => {
    it('hereda el color del botón para no obligar a migrar los embeds legacy', () => {
        const config = resolveConfig([{ glass: true, buttonBackgroundColor: '#c9972b' }])

        expect(themeVars(config)).toMatchObject({ '--ec-glass-tint': '#c9972b' })
    })

    it('permite que React o HTML definan un tinte independiente', () => {
        const config = resolveConfig([
            { glass: true, buttonBackgroundColor: '#c9972b', glassTintColor: '#079d94' }
        ])

        expect(themeVars(config)).toMatchObject({ '--ec-glass-tint': '#079d94' })
    })

    it('aplica el tinte a ventana, input y mensajes del bot conservando alto contraste', () => {
        expect(WIDGET_CSS).toContain('background: color-mix(in srgb, var(--ec-glass-tint) 26%, var(--ec-bg-window));')
        expect(WIDGET_CSS).toContain('background: color-mix(in srgb, var(--ec-glass-tint) 12%, var(--ec-bg-input));')
        expect(WIDGET_CSS).toContain('background: color-mix(in srgb, var(--ec-glass-tint) 52%, black);')
    })
})
