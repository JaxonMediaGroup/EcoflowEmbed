import { describe, expect, it } from 'vitest'
import { parseSseChunk } from '../src/api/sse'

describe('parseSseChunk', () => {
    it('parsea un evento completo del fork (message:\\ndata:{...})', () => {
        const chunk = 'message:\ndata:{"event":"token","data":"hola"}\n\n'
        const { events, rest } = parseSseChunk(chunk)
        expect(events).toEqual([{ event: 'token', data: 'hola' }])
        expect(rest).toBe('')
    })

    it('acumula el bloque incompleto como resto', () => {
        const chunk = 'message:\ndata:{"event":"token","data":"ho'
        const { events, rest } = parseSseChunk(chunk)
        expect(events).toEqual([])
        expect(rest).toContain('"token"')
    })

    it('procesa varios eventos en un solo chunk', () => {
        const chunk =
            'message:\ndata:{"event":"start","data":"q"}\n\n' +
            'message:\ndata:{"event":"token","data":"hola"}\n\n' +
            'message:\ndata:{"event":"token","data":" mundo"}\n\n' +
            'message:\ndata:{"event":"end","data":"[DONE]"}\n\n'
        const { events } = parseSseChunk(chunk)
        expect(events.map((e) => e.event)).toEqual(['start', 'token', 'token', 'end'])
        expect(events[1].data).toBe('hola')
        expect(events[2].data).toBe(' mundo')
    })

    it('maneja metadata con objeto y error', () => {
        const chunk =
            'message:\ndata:{"event":"metadata","data":{"chatId":"c-1","followUpPrompts":["¿Costos?"]}}\n\n' +
            'message:\ndata:{"event":"error","data":"boom"}\n\n'
        const { events } = parseSseChunk(chunk)
        expect(events[0].data).toEqual({ chatId: 'c-1', followUpPrompts: ['¿Costos?'] })
        expect(events[1]).toEqual({ event: 'error', data: 'boom' })
    })

    it('tolera payload no JSON tratándolo como token', () => {
        const chunk = 'message:\ndata:texto-plano\n\n'
        const { events } = parseSseChunk(chunk)
        expect(events).toEqual([{ event: 'token', data: 'texto-plano' }])
    })

    it('ignora [DONE] como data cruda', () => {
        const chunk = 'data:[DONE]\n\n'
        const { events } = parseSseChunk(chunk)
        expect(events).toEqual([])
    })

    it('normaliza saltos \\r\\n', () => {
        const chunk = 'message:\r\ndata:{"event":"token","data":"x"}\r\n\r\n'
        const { events } = parseSseChunk(chunk)
        expect(events).toEqual([{ event: 'token', data: 'x' }])
    })
})
