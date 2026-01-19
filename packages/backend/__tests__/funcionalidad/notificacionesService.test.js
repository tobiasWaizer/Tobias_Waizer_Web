import {describe, it, expect, beforeEach, jest} from "@jest/globals"
import NotificacionesService from "../../services/notificacionesService.js"
import {Notificacion} from "../../domain/notificaciones/Notificacion.js"
import {TipoUsuario} from "../../domain/usuarios/TipoUsuario.js"
import {UsuarioNoPermitidoError, MarcarComoLeidaError} from "../../errors/errors.js"


describe('NotificacionesService.marcarComoLeida', () => {
    let notificacionesService, usuario, otraPersona, notificacion

    beforeEach(() => {
        NotificacionesService._singleton = null
        notificacionesService = NotificacionesService.instance()

        notificacionesService.notificacionesRepository = {
            findById: jest.fn()
        }

        usuario = { id: 1, tipo: TipoUsuario.COMPRADOR }
        otraPersona = { id: 2, tipo: TipoUsuario.COMPRADOR }

        notificacion = new Notificacion(usuario, 'Mensaje de prueba')
        notificacion.id = 123
        notificacion.save = jest.fn().mockResolvedValue(notificacion)
    })

    it('marca como leída una notificación propia', () => {
        notificacionesService.notificacionesRepository.findById.mockResolvedValue(notificacion)

        return notificacionesService.marcarComoLeida(123, usuario).then(result => {
            expect(result.leida).toBe(true)
            expect(result.fechaLeida).toBeInstanceOf(Date)
            expect(notificacion.save).toHaveBeenCalled()
        })
    })

    it('lanza error si el usuario no es el destinatario', () => {
        notificacionesService.notificacionesRepository.findById.mockResolvedValue(notificacion)

        return notificacionesService.marcarComoLeida(123, otraPersona).then(
            () => { throw new Error('Debió lanzar error') },
            err => {
                expect(err).toBeInstanceOf(UsuarioNoPermitidoError)
                expect(notificacion.save).not.toHaveBeenCalled()
            }
        )
    })

    it('lanza error si la notificación ya estaba leída', () => {
        notificacion.leida = true
        notificacion.fechaLeida = new Date()
        notificacionesService.notificacionesRepository.findById.mockResolvedValue(notificacion)

        return notificacionesService.marcarComoLeida(123, usuario).then(
            () => { throw new Error('Debió lanzar error') },
            err => {
                expect(err).toBeInstanceOf(MarcarComoLeidaError)
                expect(notificacion.save).not.toHaveBeenCalled()
            }
        )
    })
})

describe('NotificacionesService.notificarNuevoPedido', () => {
    let notificacionesService, pedidoMock, vendedorMock, compradorMock

    beforeEach(() => {
        NotificacionesService._singleton = null
        notificacionesService = NotificacionesService.instance()
        notificacionesService.crear = jest.fn().mockResolvedValue('ok')

        vendedorMock = { id: 'VENDEDOR-1' }
        compradorMock = { id: 'COMPRADOR-2' }

        pedidoMock = {
            id: '1',
            comprador: compradorMock,
            items: [{ x: 1 }, { y: 2 }],
            total: 999.99,
            direccionEntrega: { calle: 'd' },
            vendedor: () => vendedorMock
        }
    })

    it('construye la Notificacion con mensaje y detalles correctos y llama a crear', () => {
        return notificacionesService.notificarNuevoPedido(pedidoMock).then(() => {
            expect(notificacionesService.crear).toHaveBeenCalledTimes(1)

            const notificacionArg = notificacionesService.crear.mock.calls[0][0]
            expect(notificacionArg).toBeInstanceOf(Notificacion)

            expect(notificacionArg.usuarioDestino).toBe(vendedorMock)

            expect(notificacionArg.mensaje).toBe('Ha recibido un nuevo pedido.')

            expect(notificacionArg.detalles).toEqual({
                pedidoID: '1',
                usuarioID: 'COMPRADOR-2',
                items: [{ x: 1 }, { y: 2 }],
                total: 999.99,
                direccionEntrega: { calle: 'd' }
            })
        })
    })
})