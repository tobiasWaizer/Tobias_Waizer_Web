import {MarcarComoLeidaError, UsuarioNoPermitidoError} from "../../errors/errors.js";


export default class NotificacionesValidator {
    static _singleton = null

    static instance() {
        this._singleton ||= new this()
        return this._singleton
    }

    validarUsuario(notificacion, usuario) {
        if (notificacion.usuarioDestino.id !== usuario.id) {
            throw new UsuarioNoPermitidoError("acciones con esta notificacion")
        }
    }

    validarPuedeMarcarComoLeida(notificacion) {
        if (notificacion.leida) {
            throw new MarcarComoLeidaError(notificacion.id);
        }
    }

    validarMarcarComoLeida(notificacion, usuario) {
        this.validarUsuario(notificacion, usuario)
        this.validarPuedeMarcarComoLeida(notificacion)
    }
}