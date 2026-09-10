import { describe, expect, it } from 'vitest'
import { computeWindowPlacement } from '../src/position'

const DESKTOP = { width: 1920, height: 1080 }
const LAPTOP = { width: 1280, height: 800 }
const MOBILE = { width: 390, height: 844 }

describe('computeWindowPlacement', () => {
    it('ancla al lado derecho: la ventana comparte borde derecho con el botón', () => {
        const button = { top: 1000, left: 1860, right: 1900, width: 40, height: 60 }
        const placement = computeWindowPlacement(button, DESKTOP, 'right', { width: 400, height: 500 })
        expect(placement.right).toBe(20)
        expect(placement.left).toBeUndefined()
        expect(placement.bottom).toBe(1080 - 1000 + 10)
        expect(placement.top).toBeUndefined()
        expect(placement.width).toBe(400)
        expect(placement.height).toBe(500)
        expect(placement.transformOrigin).toBe('bottom right')
    })

    it('ancla al lado izquierdo: la ventana comparte borde izquierdo con el botón', () => {
        const button = { top: 1000, left: 20, right: 60, width: 40, height: 60 }
        const placement = computeWindowPlacement(button, DESKTOP, 'left', { width: 400, height: 500 })
        expect(placement.left).toBe(20)
        expect(placement.right).toBeUndefined()
        expect(placement.transformOrigin).toBe('bottom left')
    })

    it('abre DEBAJO del botón cuando arriba no cabe una ventana legible', () => {
        // botón a 200px del top en un viewport de 800: arriba hay ~178px, abajo ~518
        const button = { top: 200, left: 1220, right: 1260, width: 40, height: 60 }
        const placement = computeWindowPlacement(button, LAPTOP, 'right', { width: 400, height: 500 })
        expect(placement.top).toBe(200 + 60 + 10)
        expect(placement.bottom).toBeUndefined()
        expect(placement.height).toBe(500)
        expect(placement.height).toBeLessThanOrEqual(LAPTOP.height - placement.top! - 12)
        expect(placement.transformOrigin).toBe('top right')
    })

    it('recorta el alto deseado cuando arriba cabe algo pero no todo', () => {
        // botón a 400px del top en 800: arriba ~378px → la ventana de 500 se recorta a 378
        const button = { top: 400, left: 1220, right: 1260, width: 40, height: 60 }
        const placement = computeWindowPlacement(button, LAPTOP, 'right', { width: 400, height: 500 })
        expect(placement.bottom).toBeDefined()
        expect(placement.height).toBeLessThanOrEqual(400 - 10 - 12)
        expect(placement.height).toBeGreaterThanOrEqual(200)
    })

    it('en móvil la ventana es casi líquida y respeta márgenes', () => {
        const button = { top: 750, left: 320, right: 370, width: 50, height: 70 }
        const placement = computeWindowPlacement(button, MOBILE, 'right', { width: 400, height: 500 })
        expect(placement.width).toBe(MOBILE.width - 24)
        expect(placement.right).toBeGreaterThanOrEqual(12)
        expect(placement.height).toBeLessThanOrEqual(MOBILE.height - 24)
    })

    it('nunca desborda horizontalmente el viewport', () => {
        const button = { top: 750, left: -50, right: 0, width: 50, height: 70 }
        const placement = computeWindowPlacement(button, MOBILE, 'right', { width: 400, height: 500 })
        expect(placement.right!).toBeLessThanOrEqual(MOBILE.width - 12 - placement.width)
    })
})
