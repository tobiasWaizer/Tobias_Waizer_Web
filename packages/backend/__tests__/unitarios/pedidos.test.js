import { describe, it, expect } from '@jest/globals'
import { Producto } from '../../domain/productos/Producto.js'

describe('Producto', () => {
    it('estaActivo: responde true/false según el flag', () => {
        const productoActivo = new Producto({}, 'Titulo', 'Desc', [], 1, 'PESO_ARG', 0, [], true)
        const productoInactivo = new Producto({}, 'Titulo', 'Desc', [], 1, 'PESO_ARG', 0, [], false)

        expect(productoActivo.estaActivo()).toBe(true)
        expect(productoInactivo.estaActivo()).toBe(false)
    })

    it('tieneStockSuficiente: compara con menor, igual y mayor', () => {
        const productoA = new Producto({}, 'Titulo', 'Desc', [], 1, 'PESO_ARG', 5, [], true)

        expect(productoA.tieneStockSuficiente(10)).toBe(false)
        expect(productoA.tieneStockSuficiente(5)).toBe(true)
        expect(productoA.tieneStockSuficiente(3)).toBe(true)
    })

    it('reducirStock y aumentarStock: modifican el stock bien', () => {
        const productoA = new Producto({}, 'Titulo', 'Desc', [], 1, 'PESO_ARG', 10, [], true)

        productoA.reducirStock(3)
        productoA.aumentarStock(5)
        productoA.reducirStock(2)

        expect(productoA.stock).toBe(10)
    })
})
