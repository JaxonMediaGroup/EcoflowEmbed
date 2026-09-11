import { describe, expect, it } from 'vitest'
import componentSource from '../src/component.tsx?raw'
import nizucDemo from '../demo/nizuc.html?raw'
import realAlcalaDemo from '../demo/real-alcala-sur/index.html?raw'
import reservaCastillaDemo from '../demo/reserva-castilla/index.html?raw'

describe('CSS parts para mensajes', () => {
    it('expone una parte específica para que cada sitio pueda suavizar el bot sin cambiar el widget global', () => {
        expect(componentSource).toContain('part={`message message-${')
    })

    it.each([
        ['Reserva Castilla', reservaCastillaDemo, 'rgba(65, 47, 12, .72)'],
        ['Real Alcalá Sur', realAlcalaDemo, 'rgba(5, 48, 45, .66)']
    ])('%s conserva el liquid glass y usa texto blanco legible para las respuestas', (_name, demo, botBackground) => {
        expect(demo).not.toContain('ecoflow-chat::part(messages)')
        expect(demo).toContain('ecoflow-chat::part(window)')
        expect(demo).toContain('ecoflow-chat::part(input)')
        expect(demo).toContain('background: rgba(255, 255, 255, .07);')
        expect(demo).toContain('background: rgba(255, 255, 255, .08);')
        expect(demo).toContain('ecoflow-chat::part(message-bot)')
        expect(demo).toContain(`--ec-glass-bot-bg: ${botBackground};`)
        expect(demo).toContain('--ec-glass-bot-color: #fff;')
        expect(demo).toContain('backdrop-filter: blur(16px) saturate(140%);')
        expect(demo).toContain('border: 1px solid rgba(255, 255, 255, .18);')
        expect(demo).toContain('class="photo-showcase" aria-hidden="true"')
        expect(demo).toContain('class="scene scene--')
        expect((demo.match(/images\.unsplash\.com/g) ?? []).length).toBeGreaterThanOrEqual(3)
    })

    it('NIZUC aplica liquid glass solamente a los mensajes del bot', () => {
        expect(nizucDemo).toContain('ecoflow-chat::part(message-bot)')
        expect(nizucDemo).toContain('--ec-glass-bot-bg: rgba(13, 21, 21, .66);')
        expect(nizucDemo).toContain('--ec-glass-bot-color: #fff;')
        expect(nizucDemo).toContain('backdrop-filter: blur(16px) saturate(140%);')
        expect(nizucDemo).toContain('border: 1px solid rgba(255, 255, 255, .18);')
    })
})
