export class ItemPedido{
    constructor(producto, cantidad, precioUnitario = null) {
        this.producto = producto
        this.cantidad = cantidad
        this.precioUnitario = precioUnitario ?? producto.precio
    }

    subtotal(){
        return this.cantidad * this.precioUnitario
    }
}