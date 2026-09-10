type AutoMount = (script: HTMLScriptElement) => void

/**
 * En algunos webviews `currentScript` es null incluso al evaluar un IIFE.
 * El fallback solamente considera loaders completos, para no montar scripts
 * ajenos ni cambiar el uso por ESM.
 */
export function getAutoMountScripts(
    currentScript: HTMLScriptElement | null,
    scripts: Iterable<HTMLScriptElement>
): HTMLScriptElement[] {
    if (currentScript) return [currentScript]

    return Array.from(scripts).filter(
        (script) => script.hasAttribute('data-chatflowid') && script.hasAttribute('data-api-host')
    )
}

/**
 * `document.currentScript` solo existe durante la evaluación del bundle. Lo
 * recibimos ya capturado para que esperar al DOM no pierda sus data-attributes.
 */
export function queueAutoMount(
    document: Pick<Document, 'readyState' | 'addEventListener'>,
    scripts: readonly HTMLScriptElement[],
    mount: AutoMount
): void {
    const run = () => scripts.forEach((script) => mount(script))

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run, { once: true })
        return
    }
    run()
}
