import { describe, it, expect } from '@jest/globals'
import { Pedido } from '../../domain/pedidos/Pedido.js'
import { ItemPedido } from '../../domain/pedidos/ItemPedido.js'
import { Producto } from '../../domain/productos/Producto.js'

describe('Pedido', () => {
    it('calcularTotal: suma de los subtotales de los items', () => {
        const vendedorA = { id: 'VA' }
        const productoA = new Producto(vendedorA, 'Producto A', 'desc', [], 100, 'PESO_ARG', 10, [], true)
        const productoB = new Producto(vendedorA, 'Producto B', 'desc', [], 50,  'PESO_ARG',  2, [], true)

        const item1 = new ItemPedido(productoA, 2)
        const item2 = new ItemPedido(productoB, 3)

        const pedido1 = new Pedido({ id: 1 }, [item1, item2], 'PESO_ARG', 'direccion X')

        expect(pedido1.total).toBe(350)
        expect(pedido1.calcularTotal()).toBe(350)
    })

    it('vendedor(): devuelve el vendedor del primer item', () => {
        const vendedorA = { id: 'VA' }
        const productoA = new Producto(vendedorA, 'Producto A', 'desc', [], 100, 'PESO_ARG', 10, [], true)
        const productoB = new Producto(vendedorA, 'Producto B', 'desc', [], 50,  'PESO_ARG',  2, [], true)

        const item1 = new ItemPedido(productoA, 1)
        const item2 = new ItemPedido(productoB, 1)

        const pedido1 = new Pedido({ id: 1 }, [item1, item2], 'PESO_ARG', 'direccion X')

        expect(pedido1.vendedor()).toBe(vendedorA)
    })

    it('tieneTodosProductosDeMismosVendedores: true cuando todos comparten vendedor', () => {
        const vendedorA = { id: 'VA' }
        const productoA = new Producto(vendedorA, 'Producto A', 'desc', [], 100, 'PESO_ARG', 10, [], true)
        const productoB = new Producto(vendedorA, 'Producto B', 'desc', [],  50, 'PESO_ARG',  2, [], true)

        const pedidoConMismoVendedor = new Pedido(
            { id: 1 },
            [new ItemPedido(productoA, 1), new ItemPedido(productoB, 1)],
            'PESO_ARG',
            'direccion X'
        )

        expect(pedidoConMismoVendedor.tieneTodosProductosDeMismosVendedores()).toBe(true)
    })

    it('tieneTodosProductosDeMismosVendedores: false cuando hay vendedores distintos', () => {
        const vendedorA = { id: 'VA' }
        const vendedorB = { id: 'VB' }
        const productoA = new Producto(vendedorA, 'Producto A', 'desc', [], 100, 'PESO_ARG', 10, [], true)
        const productoC = new Producto(vendedorB, 'Producto C', 'desc', [],  80, 'PESO_ARG',  5, [], true)

        const pedidoConVendedoresDistintos = new Pedido(
            { id: 1 },
            [new ItemPedido(productoA, 1), new ItemPedido(productoC, 1)],
            'PESO_ARG',
            'direccion X'
        )

        expect(pedidoConVendedoresDistintos.tieneTodosProductosDeMismosVendedores()).toBe(false)
    })

    it('productosInactivos: devuelve solo los productos inactivos', () => {
        const vendedorA = { id: 'VA' }
        const vendedorB = { id: 'VB' }
        const productoActivo = new Producto(vendedorA, 'Producto A', 'desc', [], 100, 'PESO_ARG', 10, [], true)
        const productoInactivo = new Producto(vendedorB, 'Producto C', 'desc', [],  80, 'PESO_ARG',  0, [], false)

        const pedido1 = new Pedido(
            { id: 1 },
            [new ItemPedido(productoActivo, 1), new ItemPedido(productoInactivo, 1)],
            'PESO_ARG',
            'direccion X'
        )

        const resultado = pedido1.productosInactivos()
        expect(resultado).toEqual([productoInactivo])
    })

    it('productosSinStock: lista faltantes con { producto: titulo, stock }', () => {
        const vendedorA = { id: 'VA' }
        const vendedorB = { id: 'VB' }

        const productoA = new Producto(vendedorA, 'Producto A', 'desc', [], 100, 'PESO_ARG', 10, [], true) // stock 10
        const productoB = new Producto(vendedorA, 'Producto B', 'desc', [],  50, 'PESO_ARG',  2, [], true) // stock 2
        const productoC = new Producto(vendedorB, 'Producto C', 'desc', [],  80, 'PESO_ARG',  0, [], false) // stock 0

        const pedido1 = new Pedido(
            { id: 1 },
            [
                new ItemPedido(productoA, 20),
                new ItemPedido(productoB,  1),
                new ItemPedido(productoC,  1)
            ],
            'PESO_ARG',
            'direccion X'
        )

        const resultado = pedido1.productosSinStock()
        expect(resultado).toEqual([
            { producto: 'Producto A', stock: 10 },
            { producto: 'Producto C', stock: 0 }
        ])
    })
})
