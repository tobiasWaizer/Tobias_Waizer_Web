import NotificacionesService from "../services/notificacionesService.js"

export default class NotificacionesController {
    static _singleton = null
    static instance() {
        this._singleton ||= new this()
        return this._singleton
    }

    constructor(){
        this.notificacionesService = NotificacionesService.instance()
    }

    marcarComoLeida(req, res){
        return this.notificacionesService.marcarComoLeida(req.validatedID, req.user)
            .then(notificacion => res.status(200).json(notificacion))
    }

}