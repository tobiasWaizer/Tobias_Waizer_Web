import {pendiente} from "./estados/EstadoPedido.js"
import { CambioEstadoPedido } from "./estados/CambioEstadoPedido.js"
import {estadoMapper} from "../../mappers/mappers.js";

export class Pedido {

    constructor(comprador, items, moneda, direccionEntrega, fechaCreacion = null) {
        this.comprador = comprador
        this.items = items
        this.total = this.calcularTotal()
        this.moneda = moneda
        this.direccionEntrega = direccionEntrega
        this.estado = pendiente
        this.fechaCreacion = fechaCreacion ?? new Date()
        this.historialEstados = []
    }

    calcularTotal() {
        return this.items.reduce((sum, item) => sum + item.subtotal(), 0)
    }

    vendedor(){
        return this.items[0].producto.vendedor
    }

    actualizarEstado(nuevoEstado, quien, motivo, productosService, notificacionesService) {
        const cambioEstado = new CambioEstadoPedido(nuevoEstado, quien, motivo)
        this.historialEstados.push(cambioEstado)
        this.estado = nuevoEstado
        return estadoMapper.fromString(this.estado).aplicarEfectoInicial(this, productosService, notificacionesService)
    }

    tieneTodosProductosDeMismosVendedores(){
        return this.items.every(item => item.producto.vendedor === this.vendedor())
    }

    productosInactivos(){
        return this.items.filter(item => !item.producto.activo).map(item => item.producto)
    }

    productosSinStock(){
        return this.items.filter(item => item.producto.stock < item.cantidad).map(item => {
            return {
                producto: item.producto.titulo,
                stock: item.producto.stock
            }
        })
    }
}