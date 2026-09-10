import type { Message } from './types'

const PREFIX = 'ecoflow-chat:'
/** Una conversación vieja se considera caducada después de un día */
const MAX_AGE_MS = 24 * 60 * 60 * 1000

export interface StoredConversation {
    chatId: string
    messages: Message[]
    savedAt: number
}

export function conversationKey(apiHost: string, chatflowId: string): string {
    return PREFIX + apiHost.replace(/\/+$/, '') + ':' + chatflowId
}

/** localStorage puede lanzar (modo privado de Safari); leer siempre en defensivo */
function getStorage(): Storage | null {
    try {
        return window.localStorage
    } catch {
        return null
    }
}

function isMessage(value: unknown): value is Message {
    if (!value || typeof value !== 'object') return false
    const candidate = value as Partial<Message>
    return typeof candidate.id === 'string' && typeof candidate.text === 'string' && typeof candidate.role === 'string'
}

/**
 * Restaura la conversación guardada si existe y no ha caducado.
 * Nunca lanza: cualquier problema devuelve null y el widget arranca limpio.
 */
export function loadConversation(key: string, storage: Storage | null = getStorage()): StoredConversation | null {
    if (!storage) return null
    try {
        const raw = storage.getItem(key)
        if (!raw) return null
        const parsed = JSON.parse(raw) as StoredConversation
        if (typeof parsed?.chatId !== 'string' || !Array.isArray(parsed?.messages)) return null
        if (typeof parsed.savedAt !== 'number' || Date.now() - parsed.savedAt > MAX_AGE_MS) return null
        return {
            chatId: parsed.chatId,
            savedAt: parsed.savedAt,
            messages: parsed.messages.filter(isMessage)
        }
    } catch {
        return null
    }
}

/**
 * Guarda la conversación. Si la cuota de localStorage no alcanza (las imágenes
 * en base64 pesan), reintenta sin los datos de imagen y, si aun así falla,
 * devuelve false silenciosamente: la persistencia nunca rompe el chat.
 */
export function saveConversation(
    key: string,
    conversation: StoredConversation,
    storage: Storage | null = getStorage()
): boolean {
    if (!storage) return false
    try {
        storage.setItem(key, JSON.stringify(conversation))
        return true
    } catch {
        // cuota excedida: guardar solo texto
        try {
            const lightweight: StoredConversation = {
                ...conversation,
                messages: conversation.messages.map((m) =>
                    m.fileUploads ? { ...m, fileUploads: m.fileUploads.map((f) => ({ ...f, data: undefined })) } : m
                )
            }
            storage.setItem(key, JSON.stringify(lightweight))
            return true
        } catch {
            return false
        }
    }
}

export function clearConversation(key: string, storage: Storage | null = getStorage()): void {
    try {
        storage?.removeItem(key)
    } catch {
        // nada que limpiar
    }
}
