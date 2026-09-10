import type { SseEvent } from '../types'

/**
 * Parser SSE del fork de Flowise. El servidor escribe cada evento como:
 *   "message:\ndata:{\"event\":\"token\",\"data\":\"hola\"}\n\n"
 * Los bloques terminan en doble salto de línea; los payloads son JSON.
 */
export function parseSseChunk(chunk: string): { events: SseEvent[]; rest: string } {
    const events: SseEvent[] = []
    let rest = chunk

    // Un bloque SSE puede usar \r\n; normalizamos para partir con seguridad
    const normalized = chunk.replace(/\r\n/g, '\n')
    const blocks = normalized.split('\n\n')
    // Si el chunk no terminó en \n\n, el último bloque está incompleto
    rest = chunk.endsWith('\n\n') ? '' : (blocks.pop() ?? '')

    for (const block of blocks) {
        const dataLines = block
            .split('\n')
            .filter((line) => line.startsWith('data:'))
            .map((line) => line.slice(5).trim())
        if (dataLines.length === 0) continue
        const raw = dataLines.join('\n')
        try {
            const parsed = JSON.parse(raw) as { event?: string; data?: unknown }
            events.push({ event: parsed.event ?? 'message', data: parsed.data })
        } catch {
            // Payload no JSON: tratarlo como token plano si no está marcado como fin
            if (raw !== '[DONE]') events.push({ event: 'token', data: raw })
        }
    }
    return { events, rest }
}
