import {PedidosRepository} from "../persistence/repositories/pedidosRepository.js"
import ProductosService from "./productosService.js";
import NotificacionesService from "./notificacionesService.js";
import {estadoMapper, pedidoMapper} from "../mappers/mappers.js";
import PedidosValidator from "../domain/validators/pedidosValidator.js";
import UsuariosService from "./usuariosService.js";
import {TipoUsuario} from "../domain/usuarios/TipoUsuario.js";

export default class PedidosService {
    static _singleton = null
    static instance() {
        this._singleton ||= new this()
        return this._singleton
    }

    constructor() {
        this.pedidosRepository = PedidosRepository.instance()
        this.productosService = ProductosService.instance()
        this.notificacionesService = NotificacionesService.instance()
        this.usuariosService = UsuariosService.instance()
        this.pedidosValidator = PedidosValidator.instance()
    }

    crear(pedidoDTO, comprador) {
        const ids = pedidoDTO.items.map(item => item.productoID)

        return this.usuariosService.validarPermisos(comprador, TipoUsuario.COMPRADOR)
            .then(() => this.productosService.buscarProductos(ids))
            .then(productos => pedidoMapper.fromPedidoDTO(pedidoDTO, comprador, productos))
            .then(pedido => {
                this.pedidosValidator.validarCreacion(pedido)
                return pedido
            })
            .then(pedido =>
                this.productosService.disminuirStock(pedido.items)
                    .then(() => pedido)
            )
            .then(pedido => pedidoMapper.toPedidoDocument(pedido))
            .then(pedidoDoc => this.pedidosRepository.create(pedidoDoc))
            .then(pedido => this.notificacionesService.notificarNuevoPedido(pedido)
                .then(() => pedido)
            )
    }

    consultarPedido(pedidoID, usuario) {
        return this.usuariosService.validarPermisos(usuario, TipoUsuario.COMPRADOR)
            .then(() => this.pedidosRepository.findById(pedidoID))
            .then(pedido => {
                this.pedidosValidator.validarUsuario(pedido, usuario)
                return pedido
            })
    }

    consultarHistorialPedidos(usuario) {
        return this.pedidosRepository.findByUsuario(usuario)
    }

    cambiarEstadoPedido(pedidoID, usuario, nuevoEstadoStr, motivo) {
        const nuevoEstado = estadoMapper.fromString(nuevoEstadoStr)

        return this.pedidosRepository.findById(pedidoID)
            .then(pedido => {
                this.pedidosValidator.validarCambioEstado(pedido, nuevoEstado, usuario)
                return pedido
            })
            .then(pedido => pedido.actualizarEstado(nuevoEstadoStr, usuario, motivo, this.productosService, this.notificacionesService)
                .then(() => pedido)
            )
            .then(pedido => pedido.save())
    }
}