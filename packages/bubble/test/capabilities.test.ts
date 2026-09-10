import { describe, expect, it } from 'vitest'
import { audioBlobToUpload, isTtsPlaybackEnabled, parseTextToSpeechConfig } from '../src/api/capabilities'

describe('parseTextToSpeechConfig', () => {
    it('detecta TTS cuando un proveedor está activo', () => {
        expect(parseTextToSpeechConfig('{"openai":{"status":true,"credentialId":"x"},"none":{"status":false}}')).toBe(true)
        expect(parseTextToSpeechConfig('{"elevenlabs":{"status":true}}')).toBe(true)
    })

    it('no detecta TTS con none o proveedores inactivos', () => {
        expect(parseTextToSpeechConfig('{"none":{"status":true}}')).toBe(false)
        expect(parseTextToSpeechConfig('{"openai":{"status":false}}')).toBe(false)
        expect(parseTextToSpeechConfig('{}')).toBe(false)
    })

    it('tolera valores ausentes o corruptos', () => {
        expect(parseTextToSpeechConfig(undefined)).toBe(false)
        expect(parseTextToSpeechConfig(null)).toBe(false)
        expect(parseTextToSpeechConfig('no-json{')).toBe(false)
        expect(parseTextToSpeechConfig('')).toBe(false)
    })
})

describe('audioBlobToUpload', () => {
    it('normaliza parámetros de codec para que Ecoflow active STT', () => {
        const upload = audioBlobToUpload(new Blob(['audio'], { type: 'audio/webm;codecs=opus' }))

        expect(upload.mime).toBe('audio/webm')
        expect(upload.name).toMatch(/^audio-\d+\.webm$/)
    })
})

describe('isTtsPlaybackEnabled', () => {
    it('respeta una desactivación explícita, pero en auto confía en el evento SSE', () => {
        expect(isTtsPlaybackEnabled(false)).toBe(false)
        expect(isTtsPlaybackEnabled(true)).toBe(true)
        expect(isTtsPlaybackEnabled('auto')).toBe(true)
    })
})
