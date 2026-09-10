import { marked } from 'marked'
import DOMPurify from 'dompurify'

marked.setOptions({ gfm: true, breaks: true })

let sanitized = false
function installHooks(): void {
    if (sanitized) return
    // Los links del bot abren en pestaña nueva: el widget vive embebido en sitios de clientes
    DOMPurify.addHook('afterSanitizeAttributes', (node) => {
        if (node.tagName === 'A') {
            node.setAttribute('target', '_blank')
            node.setAttribute('rel', 'noopener noreferrer')
        }
    })
    sanitized = true
}

/**
 * Render markdown de la respuesta del bot a HTML seguro.
 * Toda respuesta pasa por DOMPurify: el LLM puede devolver cualquier cosa
 * y este HTML se inyecta con dangerouslySetInnerHTML en el shadow root.
 */
export function renderMarkdown(text: string): string {
    installHooks()
    const html = marked.parse(text ?? '', { async: false }) as string
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            'a', 'b', 'blockquote', 'br', 'code', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'hr', 'i', 'li', 'ol', 'p', 'pre', 'strong', 'table', 'tbody', 'td', 'th',
            'thead', 'tr', 'ul', 'span', 'del', 's', 'sup', 'sub', 'img'
        ],
        ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'src', 'alt'],
        ALLOW_DATA_ATTR: false
    })
}
