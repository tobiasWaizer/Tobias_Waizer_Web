import {model, Schema} from 'mongoose'
import {Usuario} from "../../domain/usuarios/Usuario.js"
import {applyDefaultToJSON} from "../schemasUtils.js";

export const UsuarioSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    telefono: {
        type: String
    },
    tipo: {
        type: String,
        enum: ['COMPRADOR', 'VENDEDOR', 'ADMIN'],
        required: true
    },
    fechaAlta: {
        type: Date,
        default: Date.now
    }
})

applyDefaultToJSON(UsuarioSchema)

UsuarioSchema.loadClass(Usuario)

export const UsuarioModel = model('Usuario', UsuarioSchema)