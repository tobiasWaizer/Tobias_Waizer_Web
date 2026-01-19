import { Producto } from '../../domain/productos/Producto.js'
import PedidosService from "../../services/pedidosService.js"
import {Usuario} from "../../domain/usuarios/Usuario.js"
import {TipoUsuario} from "../../domain/usuarios/TipoUsuario.js"
import {Pedido} from "../../domain/pedidos/Pedido.js"
import {ItemPedido} from "../../domain/pedidos/ItemPedido.js"
import {
    ProductosDeVariosVendedoresError,
    ProductosNoDisponiblesError,
    UsuarioNoPermitidoError
} from "../../errors/errors.js"
import {describe, it, beforeEach, expect, jest} from '@jest/globals'
import {pedidoMapper} from "../../mappers/mappers.js";


describe('PedidosService.consultarPedido', () => {
    let pedidosService, comprador, admin, otro, pedido

    beforeEach(() => {
        PedidosService._singleton = null
        pedidosService = PedidosService.instance()
        pedidosService.usuariosService = {
            validarPermisos: jest.fn().mockResolvedValue()
        }
        pedidosService.pedidosValidator = {
            validarUsuario: jest.fn()
        }
        pedidosService.pedidosRepository = {
            findById: jest.fn()
        }

        comprador = new Usuario('a', 'b', '11', TipoUsuario.COMPRADOR)
        comprador.id = 1
        otro = { id: 2, tipo: TipoUsuario.COMPRADOR }
        admin = { id: 100, tipo: TipoUsuario.ADMIN }

        const producto = new Producto('Vendedor A', 'Producto A', 'Desc A', ['cat1'], 100, 'PESO_ARG', 10, [], true)
        const item = new ItemPedido(producto, 5)
        pedido = new Pedido(comprador, [item], 'PESO_ARG', 'direccion')
        pedido.id = 1
    })

    it('devuelve sin errores cuando comprador matchea con el del pedido', () => {
        pedidosService.pedidosRepository.findById.mockResolvedValue(pedido)

        return pedidosService.consultarPedido(1, comprador).then(result => {
            expect(pedidosService.pedidosRepository.findById).toHaveBeenCalledWith(1)
            expect(result.id).toBe(1)
        })
    })

    it('devuelve sin errores cuando es admin', () => {
        pedidosService.pedidosRepository.findById.mockResolvedValue(pedido)

        return pedidosService.consultarPedido(1, admin).then(result => {
            expect(pedidosService.pedidosRepository.findById).toHaveBeenCalledWith(1)
            expect(result.id).toBe(1)
        })
    })

    it('devuelve el error indicado cuando falla la validacion de usuario', () => {
        pedidosService.pedidosRepository.findById.mockResolvedValue(pedido)
        pedidosService.pedidosValidator.validarUsuario = jest.fn(() => { throw new UsuarioNoPermitidoError() })

        return expect(pedidosService.consultarPedido(1, otro))
            .rejects.toBeInstanceOf(UsuarioNoPermitidoError)
    })
})


describe('PedidosService.consultarHistorialPedidos', () => {
    let pedidosService, usuario, pedido

    beforeEach(() => {
        PedidosService._singleton = null
        pedidosService = PedidosService.instance()

        pedidosService.pedidosRepository = {
            findByUsuario: jest.fn()
        }

        usuario = { id: 1, tipo: TipoUsuario.COMPRADOR }
        const producto = new Producto('Vendedor A', 'Producto A', 'Desc A', ['cat1'], 100, 'PESO_ARG', 10, [], true)
        const item = new ItemPedido(producto, 5)
        pedido = new Pedido(usuario, [item], 'PESO_ARG', 'direccion')
        pedido.id = 1
    })

    it('devuelve los pedidos del usuario', () => {
        pedidosService.pedidosRepository.findByUsuario.mockResolvedValue([pedido])

        return pedidosService.consultarHistorialPedidos(usuario).then(result => {
            expect(pedidosService.pedidosRepository.findByUsuario).toHaveBeenCalledWith(usuario)
            expect(result).toEqual([pedido])
        })
    })
})

describe('PedidosService.cambiarEstadoPedido', () => {
    let pedidosService, usuario, producto, item, pedido

    beforeEach(() => {
        PedidosService._singleton = null
        pedidosService = PedidosService.instance()
        pedidosService.pedidosRepository = {
            findById: jest.fn()
        }
        pedidosService.pedidosValidator = {
            validarCambioEstado: jest.fn()
        }
        pedidosService.productosService = {}
        pedidosService.notificacionesService = {}

        usuario = { id: 1, tipo: TipoUsuario.COMPRADOR }
        producto = new Producto('Vendedor A', 'Producto A', 'Desc A', ['cat1'], 100, 'PESO_ARG', 10, [], true)
        item = new ItemPedido(producto, 2)

        pedido = new Pedido(usuario, [item], 'PESO_ARG', 'direccion')
        pedido.id = 1

        pedido.actualizarEstado = jest.fn().mockResolvedValue()
        pedido.save = jest.fn().mockResolvedValue(pedido)
    })

    it('flujo feliz: busca, valida cambio, actualiza estado y guarda', () => {
        pedidosService.pedidosRepository.findById.mockResolvedValue(pedido)

        return pedidosService.cambiarEstadoPedido(pedido.id, usuario, 'enviado', 'motivo')
            .then(result => {
                expect(pedidosService.pedidosRepository.findById).toHaveBeenCalledWith(pedido.id)
                expect(pedidosService.pedidosValidator.validarCambioEstado)
                    .toHaveBeenCalled()
                expect(pedido.actualizarEstado)
                    .toHaveBeenCalledWith('enviado', usuario, 'motivo', pedidosService.productosService, pedidosService.notificacionesService)
                expect(pedido.save).toHaveBeenCalled()
                expect(result).toBe(pedido)
            })
    })

    it('si la validación de cambio de estado falla, no actualiza ni guarda', () => {
        pedidosService.pedidosRepository.findById.mockResolvedValue(pedido)
        pedidosService.pedidosValidator.validarCambioEstado = jest.fn(() => { throw new Error('no permitido') })

        return pedidosService.cambiarEstadoPedido(pedido.id, usuario, 'cancelado', 'motivo')
            .then(
                () => { throw new Error('Debió fallar') },
                () => {
                    expect(pedido.actualizarEstado).not.toHaveBeenCalled()
                    expect(pedido.save).not.toHaveBeenCalled()
                }
            )
    })

    it('si actualizarEstado rechaza, no guarda y propaga el error', () => {
        pedidosService.pedidosRepository.findById.mockResolvedValue(pedido)
        pedido.actualizarEstado.mockRejectedValue(new Error('fallo efecto estado'))

        return pedidosService.cambiarEstadoPedido(pedido.id, usuario, 'enviado', 'motivo')
            .then(
                () => { throw new Error('Debió fallar') },
                () => {
                    expect(pedido.save).not.toHaveBeenCalled()
                }
            )
    })
})

describe('PedidosService.crear', () => {
    let pedidosService, usuario, productoA, productoB

    beforeEach(() => {
        PedidosService._singleton = null
        pedidosService = PedidosService.instance()
        pedidosService.pedidosRepository = {
            create: jest.fn(doc => Promise.resolve(doc))
        }
        pedidosService.usuariosService = {
            validarPermisos: jest.fn().mockResolvedValue()
        }
        pedidosService.productosService = {
            buscarProductos: jest.fn(),
            disminuirStock: jest.fn().mockResolvedValue()
        }
        pedidosService.notificacionesService = {
            notificarNuevoPedido: jest.fn().mockResolvedValue()
        }
        pedidosService.pedidosValidator = {
            validarCreacion: jest.fn()
        }
        jest.spyOn(pedidoMapper, 'fromPedidoDTO').mockImplementation(() => new Pedido(usuario, [], 'PESO_ARG', 'direccion'))
        jest.spyOn(pedidoMapper, 'toPedidoDocument').mockImplementation(p => ({ ...p }))

        usuario = { id: 1, tipo: TipoUsuario.COMPRADOR }
        productoA = new Producto('Vendedor A', 'Producto A', 'Desc A', ['cat1'], 100, 'PESO_ARG', 10, [], true)
        productoB = new Producto('Vendedor B', 'Producto B', 'Desc B', ['cat2'], 50, 'PESO_ARG', 20, [], true)
        productoA.id = 1
        productoB.id = 2
    })

    it('lanza error si los productos no son del mismo vendedor', () => {
        pedidosService.productosService.buscarProductos.mockResolvedValue([productoA, productoB])
        pedidosService.pedidosValidator.validarCreacion = jest.fn(() => {
            throw new ProductosDeVariosVendedoresError()
        })

        const dto = {
            items: [
                { productoID: 1, cantidad: 1 },
                { productoID: 2, cantidad: 2 }
            ],
            moneda: 'PESO_ARG',
            direccionEntrega: 'direccion'
        }

        return pedidosService.crear(dto, usuario).then(
            () => { throw new Error('Debió lanzar ProductosDeVariosVendedoresError') },
            (err) => {
                expect(err).toBeInstanceOf(ProductosDeVariosVendedoresError)
                expect(pedidosService.productosService.disminuirStock).not.toHaveBeenCalled()
                expect(pedidosService.notificacionesService.notificarNuevoPedido).not.toHaveBeenCalled()
                expect(pedidosService.pedidosRepository.create).not.toHaveBeenCalled()
            }
        )
    })

    it('lanza error si los productos no tienen stock o están inactivos', () => {
        productoB.activo = false
        pedidosService.productosService.buscarProductos.mockResolvedValue([productoA, productoB])
        pedidosService.pedidosValidator.validarCreacion = jest.fn(() => {
            throw new ProductosNoDisponiblesError({})
        })

        const dto = {
            items: [
                { productoID: 1, cantidad: 1 },
                { productoID: 2, cantidad: 2 }
            ],
            moneda: 'PESO_ARG',
            direccionEntrega: 'direccion'
        }

        return pedidosService.crear(dto, usuario).then(
            () => { throw new Error('Debió lanzar ProductosNoDisponiblesError') },
            (err) => {
                expect(err).toBeInstanceOf(ProductosNoDisponiblesError)
                expect(pedidosService.productosService.disminuirStock).not.toHaveBeenCalled()
                expect(pedidosService.notificacionesService.notificarNuevoPedido).not.toHaveBeenCalled()
                expect(pedidosService.pedidosRepository.create).not.toHaveBeenCalled()
            }
        )
    })

    it('crea el pedido si todos los productos son del mismo vendedor', () => {
        productoB.vendedor = productoA.vendedor
        pedidosService.productosService.buscarProductos.mockResolvedValue([productoA, productoB])
        const item1 = new ItemPedido(productoA, 1)
        const item2 = new ItemPedido(productoB, 2)
        const pedidoMapeado = new Pedido(usuario, [item1, item2], 'PESO_ARG', 'direccion')
        jest.spyOn(pedidoMapper, 'fromPedidoDTO').mockReturnValue(pedidoMapeado)

        const dto = {
            items: [
                { productoID: 'prodA', cantidad: 1 },
                { productoID: 'prodB', cantidad: 2 }
            ],
            moneda: 'PESO_ARG',
            direccionEntrega: 'direccion'
        }

        return pedidosService.crear(dto, usuario).then(result => {
            expect(result).toBeDefined()
            expect(pedidosService.productosService.disminuirStock).toHaveBeenCalled()
            expect(pedidosService.notificacionesService.notificarNuevoPedido).toHaveBeenCalled()
            expect(pedidosService.pedidosRepository.create).toHaveBeenCalled()
        })
    })
})

