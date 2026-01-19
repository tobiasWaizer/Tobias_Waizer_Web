import {Repository} from "./repository.js"
import {PedidoModel} from "../schemas/pedidoSchema.js";
import {PedidoNoEncontradoError} from "../../errors/errors.js";

export class PedidosRepository extends Repository{

    constructor() {
        super(PedidoModel, PedidoNoEncontradoError)
    }

    findByUsuario(usuario) {
        return this.model.find({ comprador: usuario }).exec()
    }
}