import {model, Schema} from 'mongoose'
import { DireccionEntregaSchema } from './direccionEntregaSchema.js'
import { ItemPedidoSchema } from './itemPedidoSchema.js'
import { CambioEstadoPedidoSchema } from './cambioEstadoPedidoSchema.js'
import {Pedido} from "../../domain/pedidos/Pedido.js"
import {applyDefaultToJSON} from "../schemasUtils.js";
import {estadoMapper} from "../../mappers/mappers.js";

const PedidoSchema = new Schema({
    comprador: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    items: [ItemPedidoSchema],
    moneda: {
        type: String,
        enum: ['PESO_ARG', 'DOLAR_USA', 'REAL'],
        required: true
    },
    direccionEntrega: DireccionEntregaSchema,
    estado: {
        type: String,
        enum: ['pendiente', 'confirmado', 'enPreparacion', 'enviado', 'entregado', 'cancelado'],
        required: true
    },
    historialEstados: [CambioEstadoPedidoSchema],
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
})

applyDefaultToJSON(PedidoSchema)

PedidoSchema.pre(/^find/, function(next) {
    this.populate('comprador')
        .populate({
            path: 'items.producto',
            populate: {path: 'vendedor'}
        })
    next()
})

PedidoSchema.post(/^create|save$/, function(doc) {
    return Promise.resolve(
            doc.populate([{
                path: 'items.producto',
                populate: { path: 'vendedor' }
            }])
    )
})

PedidoSchema.loadClass(Pedido)

export const PedidoModel = model('Pedido', PedidoSchema)