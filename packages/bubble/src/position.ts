export interface Rect {
    top: number
    left: number
    right: number
    width: number
    height: number
}

export interface Viewport {
    width: number
    height: number
}

export interface WindowPlacement {
    /** left en px; undefined cuando se ancla por la derecha */
    left?: number
    /** right en px; undefined cuando se ancla por la izquierda */
    right?: number
    /** top en px; definido solo cuando la ventana abre DEBAJO del botón */
    top?: number
    /** bottom en px (distancia al borde inferior del viewport); solo al abrir encima */
    bottom?: number
    width: number
    height: number
    /** transform-origin para la animación de apertura */
    transformOrigin: string
}

const MARGIN = 12 // aire mínimo a los bordes del viewport
const GAP = 10 // separación entre el botón y la ventana
const MIN_HEIGHT = 200 // altura mínima legible de la ventana

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value))
}

/**
 * Calcula la posición de la ventana de chat ANCLADA al botón lanzador.
 *
 * Esto reemplaza el script de reposicionamiento que los sitios (p.ej. Terralago)
 * inyectaban para corregir los PX fijos del embed de Flowise: como aquí el
 * botón y la ventana viven en el mismo componente, el cálculo es directo.
 *
 * - Vertical: abre ENCIMA del botón; si arriba no cabe una ventana legible
 *   (botón muy alto en pantalla) abre DEBAJO donde haya más espacio.
 * - Horizontal: alineada al borde del botón del lado elegido (left o right).
 * - En móvil (<=480px) la ventana es casi líquida y nunca desborda el viewport.
 */
export function computeWindowPlacement(
    button: Rect,
    viewport: Viewport,
    side: 'left' | 'right',
    desired: { width: number; height: number }
): WindowPlacement {
    const isMobile = viewport.width <= 480

    const width = isMobile
        ? viewport.width - MARGIN * 2
        : clamp(desired.width, MARGIN, viewport.width - MARGIN * 2)

    const buttonBottom = button.top + button.height
    const spaceAbove = button.top - GAP - MARGIN
    const spaceBelow = viewport.height - buttonBottom - GAP - MARGIN

    const openBelow = spaceAbove < MIN_HEIGHT && spaceBelow >= MIN_HEIGHT && spaceBelow > spaceAbove

    let top: number | undefined
    let bottom: number | undefined
    let height: number

    if (openBelow) {
        top = buttonBottom + GAP
        height = clamp(desired.height, MIN_HEIGHT, viewport.height - top - MARGIN)
    } else {
        bottom = viewport.height - button.top + GAP
        const available = spaceAbove > 0 ? spaceAbove : viewport.height - MARGIN * 2
        height = isMobile
            ? clamp(viewport.height * 0.7, MIN_HEIGHT, available)
            : clamp(desired.height, MIN_HEIGHT, available)
    }
    height = clamp(height, MIN_HEIGHT, viewport.height - MARGIN * 2)

    // Anclaje horizontal: la ventana comparte borde con el botón según el lado
    let left: number | undefined
    let right: number | undefined
    if (side === 'right') {
        right = clamp(viewport.width - button.right, MARGIN, viewport.width - MARGIN - width)
    } else {
        left = clamp(button.left, MARGIN, viewport.width - MARGIN - width)
    }

    const verticalOrigin = openBelow ? 'top' : 'bottom'
    return {
        left,
        right,
        top,
        bottom,
        width,
        height,
        transformOrigin: `${verticalOrigin} ${side}`
    }
}
