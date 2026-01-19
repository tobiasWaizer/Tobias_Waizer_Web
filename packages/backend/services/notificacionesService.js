import {NotificacionesRepository} from "../persistence/repositories/notificacionesRepository.js"
import {Notificacion} from "../domain/notificaciones/Notificacion.js"
import NotificacionesValidator from "../domain/validators/notificacionesValidator.js";
import {notificacionesQPMapper, notificacionMapper} from "../mappers/mappers.js";

export default class NotificacionesService {
    static _singleton = null
    static instance() {
        this._singleton ||= new this()
        return this._singleton
    }

    constructor() {
        this.notificacionesRepository = NotificacionesRepository.instance()
        this.notificacionValidator = NotificacionesValidator.instance()
    }

    crear(notificacion) {
        const notificacionDoc = notificacionMapper.toNotificacionDocument(notificacion)
        return this.notificacionesRepository.create(notificacionDoc)
    }

    notificarNuevoPedido(pedido){
        const mensaje = `Ha recibido un nuevo pedido.`

        const detalles = {
            pedidoID: pedido.id,
            usuarioID: pedido.comprador.id,
            items: pedido.items,
            total: pedido.total,
            direccionEntrega: pedido.direccionEntrega
        }

        const notificacion = new Notificacion(pedido.vendedor(), mensaje, detalles)
        return Promise.resolve(this.crear(notificacion))
    }

    notificarCambioEstado(pedido, usuario) {
        const mensaje = `El estado del pedido ${pedido.id} cambió a ${pedido.estado}.`
        return this.crear(new Notificacion(usuario, mensaje))
    }

    marcarComoLeida(id_notificacion, usuario) {
        return this.notificacionesRepository.findById(id_notificacion)
            .then(notificacion => {
                this.notificacionValidator.validarMarcarComoLeida(notificacion, usuario)
                return notificacion
            })
            .then(notificacion => {
                notificacion.marcarComoLeida()
                return notificacion
            })
            .then(notificacion => notificacion.save())
    }

    obtenerNotificaciones(usuario, filtroCrudo) {
        const filtro = notificacionesQPMapper.toBool(filtroCrudo)
        return this.notificacionesRepository.findByUsuario(usuario, filtro)
    }
}