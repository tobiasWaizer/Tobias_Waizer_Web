import {TipoUsuarioNoPermitidoError, UsuarioNoPermitidoError} from "../../errors/errors.js";
import {TipoUsuario} from "../usuarios/TipoUsuario.js";

export default class UsuariosValidator {
    static _singleton = null
    static instance() {
        this._singleton ||= new this()
        return this._singleton
    }

    constructor() {}

    validarPermisos(usuario, tipoUsuarioEsperado, pathID) {
        this.validarPathID(usuario, pathID)
        this.validarTipoUsuario(usuario, tipoUsuarioEsperado)
    }

    /**
     * Valida un ID recibido como path param.
     *
     * Reglas:
     * - Debe coincidir con el ID del usuario solicitante
     * - O el usuario solicitante debe tener rol de administrador
     *
     * @param {string|null} pathID - ID recibido en el path, o null si no se quiere verificar
     * @param {Usuario} usuario - Usuario autenticado que hace la solicitud
     * @throws {UsuarioNoPermitidoError} Si el ID no coincide y el usuario no es admin
     * * */
    validarPathID(usuario, pathID) {
        if (pathID && !usuario.tieneID(pathID) && !usuario.esDeTipo(TipoUsuario.ADMIN)) {
            throw new UsuarioNoPermitidoError()
        }
    }

    /**
     * Valida que un usuario sea del tipo esperado o tenga rol ADMIN.
     *
     * - Si `tipoUsuarioEsperado` es `null`, no se valida nada.
     * - Si se pasa un tipo esperado y el usuario no coincide, ni es ADMIN, se lanza un error.
     *
     * @param {Usuario} usuario - Usuario autenticado a validar.
     * @param {TipoUsuario|null} tipoUsuarioEsperado - Tipo de usuario requerido, o null si no se exige.
     * @throws {TipoUsuarioNoPermitidoError} Si el usuario no cumple con el tipo esperado ni es ADMIN.
     */
    validarTipoUsuario(usuario, tipoUsuarioEsperado) {
        if (tipoUsuarioEsperado && !usuario.esDeTipo(tipoUsuarioEsperado) && !usuario.esDeTipo(TipoUsuario.ADMIN)) {
            throw new TipoUsuarioNoPermitidoError(usuario.tipo, tipoUsuarioEsperado)
        }
    }
}