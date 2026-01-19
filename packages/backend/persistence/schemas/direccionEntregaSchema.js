import {Schema} from 'mongoose'
import {DireccionEntrega} from '../../domain/pedidos/DireccionEntrega.js'

export const DireccionEntregaSchema = new Schema({
    calle: {
        type: String,
        required: true
    },
    altura: {
        type: Number,
        required: true
    },
    piso: {
        type: Number
    },
    departamento: {
        type: String
    },
    codigoPostal: {
        type: String,
        required: true
    },
    ciudad: {
        type: String,
        required: true
    },
    provincia: {
        type: String,
        required: true
    },
    pais: {
        type: String,
        required: true
    },
    lat: {
        type: Number
    },
    lon: {
        type: Number
    }
});

DireccionEntregaSchema.loadClass(DireccionEntrega)