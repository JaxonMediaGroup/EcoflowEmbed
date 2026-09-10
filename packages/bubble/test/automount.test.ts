import { describe, expect, it, vi } from 'vitest'
import { getAutoMountScripts, queueAutoMount } from '../src/automount'

describe('queueAutoMount', () => {
    it('conserva el script capturado hasta DOMContentLoaded', () => {
        let onDomContentLoaded: (() => void) | undefined
        const document = {
            readyState: 'loading',
            addEventListener: vi.fn((_event: string, listener: () => void) => {
                onDomContentLoaded = listener
            })
        } as unknown as Document
        const script = {} as HTMLScriptElement
        const mount = vi.fn()

        queueAutoMount(document, [script], mount)

        expect(mount).not.toHaveBeenCalled()
        onDomContentLoaded?.()
        expect(mount).toHaveBeenCalledWith(script)
    })

    it('encuentra el loader configurado si currentScript no está disponible', () => {
        const loader = {
            hasAttribute: (name: string) => name === 'data-chatflowid' || name === 'data-api-host'
        } as unknown as HTMLScriptElement
        const unrelated = { hasAttribute: () => false } as unknown as HTMLScriptElement

        expect(getAutoMountScripts(null, [unrelated, loader])).toEqual([loader])
    })

    it('monta el chat con los atributos del loader aunque currentScript ya sea nulo', async () => {
        let onDomContentLoaded: (() => void) | undefined
        const script = {
            attributes: [
                { name: 'data-chatflowid', value: 'nizuc-flow' },
                { name: 'data-api-host', value: 'https://ecoflow.koppi.mx' }
            ]
        } as unknown as HTMLScriptElement
        const element: { config?: unknown } = {}
        const appendChild = vi.fn()
        const document: {
            readyState: string
            currentScript: HTMLScriptElement | null
            scripts: HTMLScriptElement[]
            addEventListener: ReturnType<typeof vi.fn>
            createElement: ReturnType<typeof vi.fn>
            body: { appendChild: ReturnType<typeof vi.fn> }
        } = {
            readyState: 'loading',
            currentScript: script,
            scripts: [script],
            addEventListener: vi.fn((_event: string, listener: () => void) => {
                onDomContentLoaded = listener
            }),
            createElement: vi.fn(() => element),
            body: { appendChild }
        }

        vi.stubGlobal('HTMLElement', class {})
        vi.stubGlobal('customElements', { get: vi.fn(), define: vi.fn() })
        vi.stubGlobal('window', { ECOFLOW_CONFIG: {} })
        vi.stubGlobal('document', document)
        vi.doMock('lottie-web/build/player/lottie_light', () => ({
            default: { loadAnimation: vi.fn() }
        }))

        try {
            await import('../src/index')
            document.currentScript = null
            onDomContentLoaded?.()

            expect(element.config).toMatchObject({
                chatflowId: 'nizuc-flow',
                apiHost: 'https://ecoflow.koppi.mx'
            })
            expect(appendChild).toHaveBeenCalledWith(element)
        } finally {
            vi.unstubAllGlobals()
            vi.doUnmock('lottie-web/build/player/lottie_light')
            vi.resetModules()
        }
    })
})
