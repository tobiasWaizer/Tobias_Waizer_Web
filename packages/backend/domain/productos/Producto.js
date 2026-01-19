export class Producto{
    constructor(vendedor, titulo, descripcion, categorias, precio, moneda, stock, fotos, activo){
        this.vendedor = vendedor
        this.titulo = titulo
        this.descripcion = descripcion
        this.categorias = categorias
        this.precio = precio
        this.moneda = moneda
        this.stock = stock
        this.fotos = fotos
        this.activo = activo
    }

    estaActivo(){
        return this.activo
    }

    tieneStockSuficiente(cantidad){
        return this.stock >= cantidad
    }

    reducirStock(cantidad){
        this.stock -= cantidad
    }

    aumentarStock(cantidad){
        this.stock += cantidad
    }
}