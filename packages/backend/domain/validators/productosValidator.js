import {ProductoNoEncontradoError, ProductosNoDisponiblesError} from "../../errors/errors.js";

export default class ProductosValidator {
    static _singleton = null
    static instance() {
        this._singleton ||= new this()
        return this._singleton
    }

    constructor() {}

    validarProductos(items){

        const productosInactivos = items
            .map(item => item.producto)
            .filter((producto) => !producto.estaActivo())

        const itemsSinStock = items
            .filter(item => !item.producto.tieneStockSuficiente(item.cantidad))

        if(productosInactivos.length > 0 || itemsSinStock.length > 0){
            throw new ProductosNoDisponiblesError({productosInactivos, itemsSinStock})
        }
    }

    /*
    existenProductos(ids, productosService) {
        const productos = [];
        const idsConError = [];

        ids.forEach(id => productosService.existeProducto(id, productos, idsConError))

        if (idsConError.length > 0) {
            throw new ProductoNoEncontradoError(idsConError);
        }

        return productos
    }
    * */
}