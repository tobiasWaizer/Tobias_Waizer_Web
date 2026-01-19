import UsuariosService from "../services/usuariosService.js"

export default class UsuariosController {
    static _singleton = null
    static instance() {
        this._singleton ||= new this()
        return this._singleton
    }

    constructor() {
        this.usuariosService = UsuariosService.instance()
    }

    crear(req, res) {
        return this.usuariosService.crear(req.validatedBody)
            .then(usuario => res.status(201).json(usuario))
    }

    consultarHistorialPedidos(req, res) {
        return this.usuariosService.consultarHistorialPedidos(req.user, req.validatedID)
            .then(pedidos => res.status(200).json(pedidos))
    }

    consultarProductosVendedor(req, res){
        const { page, limit, order, orderBy, ...filtrosCrudos } = req.validatedQuery;
        const paginacion = { page, limit };
        const muestreo = { order, orderBy };

        return this.usuariosService.consultarProductosVendedor(req.validatedID, paginacion, muestreo, filtrosCrudos)
            .then(productos => res.status(200).json(productos))
    }

    obtenerNotificaciones(req, res){
        return this.usuariosService.obtenerNotificaciones(req.user, req.validatedQuery.tipo, req.validatedID)
            .then(notificaciones => res.status(200).json(notificaciones))
    }
}