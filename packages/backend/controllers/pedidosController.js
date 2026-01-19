import PedidosService from "../services/pedidosService.js"

export default class PedidosController {
    static _singleton = null
    static instance() {
        this._singleton ||= new PedidosController()
        return this._singleton
    }

    constructor() {
        this.pedidosService = PedidosService.instance()
    }

    crear(req, res){
        return this.pedidosService.crear(req.validatedBody, req.user)
            .then(pedido => res.status(201).json(pedido))
    }

    cambiarEstadoPedido(req, res) {
        return this.pedidosService.cambiarEstadoPedido(req.validatedID, req.user, req.validatedBody.nuevoEstado, req.validatedBody.motivo)
            .then(pedido => res.status(200).json(pedido))
    }

    consultarPedido(req, res) {
        return this.pedidosService.consultarPedido(req.validatedID, req.user)
            .then(pedido => res.status(200).json(pedido))
    }
}