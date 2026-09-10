import { describe, expect, it, vi } from 'vitest'
import { clearConversation, conversationKey, loadConversation, saveConversation, type StoredConversation } from '../src/storage'

function memoryStorage(): Storage & { data: Map<string, string> } {
    const data = new Map<string, string>()
    return {
        data,
        get length() {
            return data.size
        },
        clear: () => data.clear(),
        getItem: (key) => data.get(key) ?? null,
        key: () => null,
        removeItem: (key) => data.delete(key),
        setItem: (key, value) => data.set(key, value)
    } as Storage & { data: Map<string, string> }
}

const conversation: StoredConversation = {
    chatId: 'chat-1',
    savedAt: Date.now(),
    messages: [
        { id: 'msg-1', role: 'bot', text: '¡Hola!' },
        { id: 'msg-2', role: 'user', text: '¿Amenidades?', fileUploads: [{ name: 'foto.png', mime: 'image/png', data: 'data:image/png;base64,AAA' }] }
    ]
}

describe('conversationKey', () => {
    it('es estable para el mismo host (sin trailing slash) y flujo', () => {
        expect(conversationKey('https://ecoflow.koppi.mx/', 'abc')).toBe(
            conversationKey('https://ecoflow.koppi.mx', 'abc')
        )
    })
})

describe('storage roundtrip', () => {
    it('guarda y restaura la conversación completa', () => {
        const storage = memoryStorage()
        const key = conversationKey('https://x.com', 'flow-1')
        expect(saveConversation(key, conversation, storage)).toBe(true)
        const loaded = loadConversation(key, storage)
        expect(loaded?.chatId).toBe('chat-1')
        expect(loaded?.messages).toHaveLength(2)
        expect(loaded?.messages[1].fileUploads?.[0].data).toBe('data:image/png;base64,AAA')
    })

    it('rechaza conversaciones caducadas (>24h)', () => {
        const storage = memoryStorage()
        const key = 'k'
        saveConversation(key, { ...conversation, savedAt: Date.now() - 25 * 60 * 60 * 1000 }, storage)
        expect(loadConversation(key, storage)).toBeNull()
    })

    it('filtra mensajes corruptos al restaurar', () => {
        const storage = memoryStorage()
        storage.data.set(
            'k',
            JSON.stringify({ chatId: 'c', savedAt: Date.now(), messages: [{ id: 'ok', role: 'bot', text: 'hola' }, { broken: true }, null] })
        )
        const loaded = loadConversation('k', storage)
        expect(loaded?.messages).toHaveLength(1)
    })

    it('degrada sin imagen cuando la cuota no alcanza', () => {
        const storage = memoryStorage()
        const setItem = vi.spyOn(storage, 'setItem')
        // primera escritura (completa) lanza cuota, segunda (sin imágenes) ok
        setItem.mockImplementationOnce(() => {
            throw new DOMException('QuotaExceeded', 'QuotaExceededError')
        })
        expect(saveConversation('k', conversation, storage)).toBe(true)
        const loaded = loadConversation('k', storage)
        expect(loaded?.messages[1].fileUploads?.[0].data).toBeUndefined()
        expect(loaded?.messages[1].fileUploads?.[0].name).toBe('foto.png')
    })

    it('no lanza cuando localStorage es inaccesible', () => {
        expect(saveConversation('k', conversation, null)).toBe(false)
        expect(loadConversation('k', null)).toBeNull()
        expect(() => clearConversation('k', null)).not.toThrow()
    })
})
