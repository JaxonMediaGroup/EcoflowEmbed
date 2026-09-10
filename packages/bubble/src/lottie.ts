import lottie, { type AnimationItem } from 'lottie-web/build/player/lottie_light'

/**
 * Monta la animación Lottie dentro del botón.
 * Usa el build light (solo renderer SVG, sin expresiones) para reducir el bundle.
 */
export function mountLottie(
    container: HTMLElement,
    path: string,
    opts: { loop: boolean; autoplay: boolean }
): AnimationItem {
    return lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: opts.loop,
        autoplay: opts.autoplay,
        path
    })
}
