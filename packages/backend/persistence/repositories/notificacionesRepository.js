import { Repository } from './repository.js'
import {NotificacionModel} from "../schemas/notificacionSchema.js";
import {NotificacionNoEncontradaError} from "../../errors/errors.js";

export class NotificacionesRepository extends Repository {

    constructor() {
        super(NotificacionModel, NotificacionNoEncontradaError)
    }

    findByUsuario(usuario, filtro) {
        return this.model.find({
            usuarioDestino: usuario,
            ...(typeof filtro === 'boolean' ? { leida: filtro } : {})
        }).exec();
    }
}