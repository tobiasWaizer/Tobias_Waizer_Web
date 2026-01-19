import {Repository} from "./repository.js"
import {UsuarioModel} from "../schemas/usuarioSchema.js";
import {UsuarioNoEncontradoError} from "../../errors/errors.js";

export class UsuariosRepository extends Repository{

    constructor() {
        super(UsuarioModel, UsuarioNoEncontradoError)
    }
}