import {Schema} from 'mongoose'
import {CambioEstadoPedido} from "../../domain/pedidos/estados/CambioEstadoPedido.js"

export const CambioEstadoPedidoSchema = new Schema({
    fecha: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: String,
        enum: ['pendiente', 'confirmado', 'enPreparacion', 'enviado', 'entregado', 'cancelado'],
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    motivo: {
        type: String,
        required: true
    }
}, { _id: false })

CambioEstadoPedidoSchema.pre(/^find/, function(next) {
    this.populate('usuario')
    next()
})

CambioEstadoPedidoSchema.loadClass(CambioEstadoPedido)