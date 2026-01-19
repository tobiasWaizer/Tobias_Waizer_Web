import {model, Schema} from 'mongoose'
import {CategoriaSchema} from './categoriaSchema.js'
import {Producto} from "../../domain/productos/Producto.js"
import {applyDefaultToJSON} from "../schemasUtils.js";

export const ProductoSchema = new Schema({
    vendedor: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    categorias: [CategoriaSchema],
    precio: {
        type: Number,
        required: true
    },
    moneda: {
        type: String,
        enum: ['PESO_ARG', 'DOLAR_USA', 'REAL'],
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    fotos: [{
        type: String,
        required: true,
        _id: false
    }],
    activo: {
        type: Boolean,
        default: true
    }
})

applyDefaultToJSON(ProductoSchema)

ProductoSchema.pre(/^find/, function(next) {
    this.populate('vendedor')
    next()
})

ProductoSchema.loadClass(Producto)

export const ProductoModel = model('Producto', ProductoSchema)