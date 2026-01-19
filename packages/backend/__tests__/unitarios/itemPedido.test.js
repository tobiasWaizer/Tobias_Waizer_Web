import { describe, it, expect } from '@jest/globals'
import { ItemPedido } from '../../domain/pedidos/ItemPedido.js'

describe('ItemPedido', () => {
    it('subtotal: usa el precio del producto cuando no se pasa precioUnitario', () => {
        const productoA = { precio: 100 }
        const item1 = new ItemPedido(productoA, 3)
        expect(item1.subtotal()).toBe(300)
    })

    it('subtotal: usa precioUnitario explícito si se lo damos', () => {
        const productoA = { precio: 100 }
        const item1 = new ItemPedido(productoA, 2, 45)
        expect(item1.subtotal()).toBe(90)
    })

    it('subtotal: casos borde (cantidad 0 y decimales)', () => {
        const productoB = { precio: 99.99 }
        const itemSinCantidad = new ItemPedido(productoB, 0)
        expect(itemSinCantidad.subtotal()).toBe(0)

        const productoC = { precio: 19.95 }
        const itemConDecimales = new ItemPedido(productoC, 3)
        expect(itemConDecimales.subtotal()).toBeCloseTo(59.85, 2)
    })
})
