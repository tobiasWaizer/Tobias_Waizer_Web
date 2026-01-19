import {UsuariosRepository} from "../persistence/repositories/usuariosRepository.js"
import UsuariosValidator from "../domain/validators/usuariosValidator.js"
import {usuarioMapper} from "../mappers/mappers.js";
import NotificacionesService from "./notificacionesService.js";
import {TipoUsuario} from "../domain/usuarios/TipoUsuario.js";

export default class UsuariosService {
    static _singleton = null
    static instance() {
        this._singleton ||= new this()
        return this._singleton
    }

    constructor() {
        this.usuariosRepository = UsuariosRepository.instance()
        this.usuarioValidator = UsuariosValidator.instance()
        this.notificacionesService = NotificacionesService.instance()
    }

    /**
     * Inyecta las dependencias de servicios requeridas después de la construcción,
     * con el fin de evitar dependencias circulares entre módulos.
     *
     * @param {ProductosService} productosService - Servicio de productos a asociar.
     * @param {PedidosService} pedidosService - Servicio de pedidos a asociar.
     */
    setServices(productosService, pedidosService) {
        this.productosService = productosService
        this.pedidosService = pedidosService
    }

    crear(usuarioDTO) {
        const nuevoUsuario = usuarioMapper.fromUsuarioDTO(usuarioDTO)
        return Promise.resolve()
            .then(() => this.usuariosRepository.create(nuevoUsuario))
    }

    consultarHistorialPedidos(usuario, pathID) {
        return this.validarPermisos(usuario, TipoUsuario.COMPRADOR, pathID)
            .then(() => this.pedidosService.consultarHistorialPedidos(usuario))
    }

    consultarProductosVendedor(vendedorID, paginacion, muestreo, filtrado) {
        return this.obtener(vendedorID)
            .then(vendedor => this.validarPermisos(vendedor, TipoUsuario.VENDEDOR))
            .then(() => this.productosService.consultarProductosVendedor(vendedorID, paginacion, muestreo, filtrado))
    }

    obtener(usuarioID) {
        return this.usuariosRepository.findById(usuarioID)
    }

    validarPermisos(usuario, tipoUsuario = null, pathID = null) {
        return Promise.resolve()
            .then(() => this.usuarioValidator.validarPermisos(usuario, tipoUsuario, pathID))
    }

    obtenerNotificaciones(usuario, filtro, pathID){
        return this.validarPermisos(usuario, null, pathID)
            .then(() => this.notificacionesService.obtenerNotificaciones(usuario, filtro))
    }
}