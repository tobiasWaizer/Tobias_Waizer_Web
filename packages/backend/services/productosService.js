import {ProductosRepository} from "../persistence/repositories/productosRepository.js"
import ProductosValidator from "../domain/validators/productosValidator.js";
import {paginacionMapper, productoMapper, productosQPMapper} from "../mappers/mappers.js";
import UsuariosService from "./usuariosService.js";
import {TipoUsuario} from "../domain/usuarios/TipoUsuario.js";
import {ProductoNoEncontradoError} from "../errors/errors.js";

export default class ProductosService {
    static _singleton = null
    static instance() {
        this._singleton ||= new this()
        return this._singleton
    }

    constructor() {
        this.productosRepository = ProductosRepository.instance()
        this.usuariosService = UsuariosService.instance()
        this.productosValidator = ProductosValidator.instance()
    }

    crear(productoDTO, vendedor){
        const producto = productoMapper.fromProductoDTO(productoDTO, vendedor)

        return this.usuariosService.validarPermisos(vendedor, TipoUsuario.VENDEDOR)
            .then(() => productoMapper.toProductoDocument(producto))
            .then(productoDoc => this.productosRepository.create(productoDoc))
    }

    buscarProductos(ids){
        return this.existenProductos(ids)
    }

    existenProductos(ids) {
        const productos = [];
        const idsConError = [];

        const promesas = ids.map(id => this.existeProducto(id, productos, idsConError))

        return Promise.all(promesas)
            .then(() => {
                if (idsConError.length > 0) {
                    throw new ProductoNoEncontradoError(idsConError);
                }
                return productos;
            })
    }

    /**
     * Verifica la existencia de un producto por su ID y acumula el resultado.
     *
     * - Si el producto existe, se agrega al array `productos`.
     * - Si ocurre un error (ej. no encontrado), se agrega el `id` al array `idsConError`.
     *
     * @param {string} id - Identificador del producto a buscar.
     * @param {Producto[]} productos - Lista acumuladora donde se agregan los productos encontrados.
     * @param {string[]} idsConError - Lista acumuladora de IDs que no pudieron resolverse.
     * @returns {Promise<void>} Promesa que se resuelve cuando la operación finaliza.
     */
    existeProducto(id, productos, idsConError){
        return this.productosRepository.findById(id)
            .then(producto => productos.push(producto))
            .catch(() => idsConError.push(id))
    }

    aumentarStock(items) {
        const promesas = items.map(item => {
            item.producto.aumentarStock(item.cantidad)
            return item.producto.save()
        })

        return Promise.all(promesas)
    }

    disminuirStock(items) {
        return Promise.resolve()
            .then(() => this.productosValidator.validarProductos(items))
            .then(() => {
                const promesas = items.map(item => {
                    item.producto.reducirStock(item.cantidad)
                    return item.producto.save()
                })
                return Promise.all(promesas)
            })
    }

    consultarProductosVendedor(vendedorID, paginacion, muestreo, filtrado){
        paginacion.offset = (paginacion.page - 1) * paginacion.limit
        const sortParam = productosQPMapper.sortParamMapper(muestreo)
        const filtros = productosQPMapper.filterMapper(filtrado, vendedorID)

        let productos

        return this.productosRepository.findByUsuario(paginacion, sortParam, filtros)
            .then(productosLeidos => productos = productosLeidos)
            .then(() => this.productosRepository.count(filtros))
            .then(cantidad => paginacionMapper.toDTO(productos, paginacion.page, paginacion.limit, cantidad))
    }
}