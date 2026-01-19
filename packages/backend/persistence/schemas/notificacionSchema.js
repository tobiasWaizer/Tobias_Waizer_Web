import {model, Schema} from 'mongoose'
import {Notificacion} from "../../domain/notificaciones/Notificacion.js"
import {applyDefaultToJSON} from "../schemasUtils.js";

export const NotificacionSchema = new Schema({
    usuarioDestino: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    mensaje: {
        type: String,
        required: true
    },
    detalles: {
        type: Object,
        default: null
    },
    leida: {
        type: Boolean,
        default: false
    },
    fechaAlta: {
        type: Date,
        default: Date.now
    },
    fechaLeida: {
        type: Date,
        default: null
    }
})

applyDefaultToJSON(NotificacionSchema)

NotificacionSchema.pre(/^find/, function(next) {
    this.populate('usuarioDestino')
    next()
})

NotificacionSchema.loadClass(Notificacion)

export const NotificacionModel = model('Notificacion', NotificacionSchema)