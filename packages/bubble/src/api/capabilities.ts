import type { FileUpload } from '../types'

export interface AgentCapabilities {
    /** Micrófono configurado en el agente (STT) */
    stt: boolean
    /** Voz de salida configurada en el agente (TTS) */
    tts: boolean
    /** El agente acepta imágenes (modelo multimodal) */
    imageUploads: boolean
    /** MIME types de imagen aceptados */
    imageTypes: string[]
    /** Tamaño máximo de imagen en MB */
    imageMaxSizeMb: number
}

export const NO_CAPABILITIES: AgentCapabilities = {
    stt: false,
    tts: false,
    imageUploads: false,
    imageTypes: [],
    imageMaxSizeMb: 5
}

/**
 * Parsea la config textToSpeech del chatflow: {"openai":{"status":true,...},"none":{"status":false}}.
 * Hay TTS si algún proveedor distinto de "none" está activo. Puro, para tests.
 */
export function parseTextToSpeechConfig(raw: string | undefined | null): boolean {
    if (!raw) return false
    try {
        const config = JSON.parse(raw) as Record<string, { status?: boolean }>
        return Object.entries(config).some(([provider, cfg]) => provider !== 'none' && cfg?.status === true)
    } catch {
        return false
    }
}

interface UploadsConfigResponse {
    isSpeechToTextEnabled?: boolean
    isImageUploadAllowed?: boolean
    imgUploadSizeAndTypes?: Array<{ fileTypes: string[]; maxUploadSize?: number }>
}

interface PublicChatflowResponse {
    textToSpeech?: string
}

const cache = new Map<string, AgentCapabilities>()

/**
 * Detecta las capacidades del agente consultando el servidor del fork:
 *  - GET /api/v1/chatflows-uploads/{id}   → STT e imágenes
 *  - GET /api/v1/public-chatflows/{id}    → TTS
 *
 * No todo agente tiene voz/imagen (Terralago no; NIZUC sí), por eso el widget
 * pregunta antes de mostrar los controles. Si el servidor no responde o el
 * flujo no es público, todo queda desactivado — nunca falla el widget por esto.
 */
export async function fetchCapabilities(apiHost: string, chatflowId: string): Promise<AgentCapabilities> {
    const key = `${apiHost}|${chatflowId}`
    const cached = cache.get(key)
    if (cached) return cached

    const base = apiHost.replace(/\/+$/, '')
    const capabilities = { ...NO_CAPABILITIES }

    try {
        const response = await fetch(`${base}/api/v1/chatflows-uploads/${encodeURIComponent(chatflowId)}`)
        if (response.ok) {
            const data = (await response.json()) as UploadsConfigResponse
            capabilities.stt = data.isSpeechToTextEnabled === true
            capabilities.imageUploads = data.isImageUploadAllowed === true
            const imageConfig = data.imgUploadSizeAndTypes?.[0]
            if (imageConfig?.fileTypes?.length) {
                capabilities.imageTypes = imageConfig.fileTypes.filter((t) => !!t)
                capabilities.imageMaxSizeMb = imageConfig.maxUploadSize ?? 5
            }
        }
    } catch {
        // sin capacidades: el widget sigue funcionando en modo texto
    }

    try {
        const response = await fetch(`${base}/api/v1/public-chatflows/${encodeURIComponent(chatflowId)}`)
        if (response.ok) {
            const data = (await response.json()) as PublicChatflowResponse
            capabilities.tts = parseTextToSpeechConfig(data.textToSpeech)
        }
    } catch {
        // flujo no público o error: TTS queda desactivado
    }

    cache.set(key, capabilities)
    return capabilities
}

/** Convierte un File a data URI base64 para el campo uploads de la predicción */
export function fileToDataUri(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(reader.error ?? new Error('No se pudo leer el archivo'))
        reader.readAsDataURL(file)
    })
}

/** Blob de audio grabado → upload con el MIME correcto para el STT del server */
export function audioBlobToUpload(blob: Blob): FileUpload {
    // MediaRecorder suele devolver "audio/webm;codecs=opus", pero el fork
    // compara este campo contra los MIME base para decidir si corre STT.
    const mime = (blob.type || 'audio/webm').split(';', 1)[0].toLowerCase() || 'audio/webm'
    const extension = mime.includes('mp4') ? 'm4a' : mime.includes('ogg') ? 'ogg' : mime.includes('wav') ? 'wav' : 'webm'
    return { name: `audio-${Date.now()}.${extension}`, mime }
}

/** El evento SSE de TTS confirma que el servidor sí generó audio. */
export function isTtsPlaybackEnabled(setting: boolean | 'auto'): boolean {
    return setting !== false
}
