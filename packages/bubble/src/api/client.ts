import { parseSseChunk } from './sse'
import type { FileUpload } from '../types'

export interface PredictionHandlers {
    /** Primer evento del stream */
    onStart?: () => void
    /** Token incremental de texto */
    onToken: (token: string) => void
    /** El agente está razonando/ejecutando herramientas (sin tokens aún) */
    onActivity?: (activity: string) => void
    /** Metadata final: chatId, followUpPrompts, etc. */
    onMetadata?: (metadata: Record<string, unknown>) => void
    /** Error de red o evento error del servidor */
    onError: (message: string) => void
    /** Stream terminado correctamente */
    onDone: () => void
    /** TTS: el servidor empezó a sintetizar audio */
    onTtsStart?: (format: string) => void
    /** TTS: chunk de audio base64 */
    onTtsChunk?: (base64: string) => void
    /** TTS: fin del audio del mensaje */
    onTtsEnd?: () => void
}

export interface PredictionRequest {
    apiHost: string
    chatflowId: string
    question: string
    chatId: string
    streaming?: boolean
    overrideConfig?: Record<string, unknown>
    /** Adjuntos (imágenes/audio) como data URIs base64, formato del campo uploads del fork */
    uploads?: FileUpload[]
}

function predictionUrl(req: PredictionRequest): string {
    const base = req.apiHost.replace(/\/+$/, '')
    return `${base}/api/v1/prediction/${encodeURIComponent(req.chatflowId)}`
}

/**
 * Envía una pregunta al chatflow vía /api/v1/prediction/{id}.
 * Con streaming:true consume el SSE del fork y emite handlers.onToken por
 * cada incremento; con streaming:false hace una única petición bloqueante.
 * Devuelve una promesa que resuelve al terminar (o rechaza si el fetch falla
 * antes de obtener respuesta HTTP).
 */
export async function sendPrediction(
    req: PredictionRequest,
    handlers: PredictionHandlers,
    signal?: AbortSignal
): Promise<void> {
    const body = {
        question: req.question,
        chatId: req.chatId,
        streaming: req.streaming ?? true,
        ...(req.overrideConfig ? { overrideConfig: req.overrideConfig } : {}),
        ...(req.uploads?.length ? { uploads: req.uploads } : {})
    }

    const response = await fetch(predictionUrl(req), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal
    })

    if (!response.ok) {
        let detail = `${response.status} ${response.statusText}`
        try {
            const errorBody = (await response.json()) as { message?: string }
            if (errorBody?.message) detail = errorBody.message
        } catch {
            // respuesta sin body JSON: nos quedamos con el status
        }
        throw new Error(detail)
    }

    if (!req.streaming || !response.body) {
        const json = (await response.json()) as {
            text?: string
            chatId?: string
            followUpPrompts?: string[]
        }
        if (json.text) handlers.onToken(json.text)
        if (json.chatId || json.followUpPrompts) {
            handlers.onMetadata?.({ chatId: json.chatId, followUpPrompts: json.followUpPrompts })
        }
        handlers.onDone()
        return
    }

    handlers.onStart?.()

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let sawError = false

    // El fork cierra el stream con event 'end' y data '[DONE]'
    const handleEvent = (event: { event: string; data: unknown }): boolean => {
        const { event: name, data } = event
        switch (name) {
            case 'token':
                if (typeof data === 'string') handlers.onToken(data)
                break
            case 'thinking':
            case 'tool':
            case 'usedTools':
            case 'calledTools':
            case 'agentReasoning':
            case 'nextAgent':
                handlers.onActivity?.(name)
                break
            case 'metadata':
                if (data && typeof data === 'object') handlers.onMetadata?.(data as Record<string, unknown>)
                break
            case 'tts_start':
                if (data && typeof data === 'object') {
                    const format = (data as { format?: string }).format ?? 'audio/mpeg'
                    handlers.onTtsStart?.(format)
                }
                break
            case 'tts_data':
                if (data && typeof data === 'object') {
                    const chunk = (data as { audioChunk?: string }).audioChunk
                    if (chunk) handlers.onTtsChunk?.(chunk)
                }
                break
            case 'tts_end':
                handlers.onTtsEnd?.()
                break
            case 'error':
                sawError = true
                handlers.onError(typeof data === 'string' ? data : JSON.stringify(data))
                break
            case 'end':
                return true
            default:
                break
        }
        return false
    }

    let finished = false
    while (!finished) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const { events, rest } = parseSseChunk(buffer)
        buffer = rest
        for (const event of events) {
            if (handleEvent(event)) {
                finished = true
                break
            }
        }
    }

    if (!sawError) handlers.onDone()
}

/** Genera un chatId estable por conversación sin dependencias externas */
export function generateChatId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
    return 'chat-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10)
}
