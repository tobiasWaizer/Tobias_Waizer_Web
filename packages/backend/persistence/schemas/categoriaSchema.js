import {Schema} from 'mongoose'
import {Categoria} from "../../domain/productos/Categoria.js";

export const CategoriaSchema = new Schema({
    nombre: {
        type: String,
        required: true
    }
}, { _id: false })

CategoriaSchema.loadClass(Categoria)