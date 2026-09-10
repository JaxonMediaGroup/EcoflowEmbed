import { describe, expect, it } from 'vitest'
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
    it('hace el fondo del bot apenas más sólido sin tocar el mensaje del usuario', () => {
        expect(WIDGET_CSS).toContain('.ecoflow-window--glass .ecoflow-bubble--bot {')
        expect(WIDGET_CSS).toContain('background: color-mix(in srgb, var(--ec-bg-bot) 88%, black);')
        expect(WIDGET_CSS).not.toContain('.ecoflow-window--glass .ecoflow-bubble--user {')
    })
})
