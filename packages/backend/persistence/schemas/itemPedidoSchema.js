import {Schema} from 'mongoose'
import {ItemPedido} from "../../domain/pedidos/ItemPedido.js"

export const ItemPedidoSchema = new Schema({
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    precioUnitario: {
        type: Number,
        required: true
    }
}, { _id: false })

ItemPedidoSchema.pre(/^find/, function(next) {
    this.populate('producto')
    next()
})

ItemPedidoSchema.loadClass(ItemPedido)