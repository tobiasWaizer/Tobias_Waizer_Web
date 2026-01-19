import {cancelado, entregado, enviado, enPreparacion, confirmado, pendiente} from "../domain/pedidos/estados/EstadoPedido.js";
import {Pedido} from "../domain/pedidos/Pedido.js";
import {ItemPedido} from "../domain/pedidos/ItemPedido.js";
import {Usuario} from "../domain/usuarios/Usuario.js";
import {Producto} from "../domain/productos/Producto.js";
import {Categoria} from "../domain/productos/Categoria.js";
import {DireccionEntrega} from "../domain/pedidos/DireccionEntrega.js";
import mongoose from 'mongoose';
import {
    ValidacionBDError,
    CastBDError,
    DuplicadoError,
    ConflictoVersionBDError,
    ConexionBDError,
    MongoBDError,
} from "../errors/errors.js";

class EstadoMapper {
    constructor() {
        this.estados = new Map([
            ["cancelado", cancelado],
            ["entregado", entregado],
            ["enviado", enviado],
            ["enPreparacion", enPreparacion],
            ["confirmado", confirmado],
            ["pendiente", pendiente]
        ]);

        this.inverse = new Map(
            Array.from(this.estados.entries()).map(([k, v]) => [v, k])
        );
    }

    fromString(stringEstado) {
        return this.estados.get(stringEstado);
    }

    toString(estado) {
        return this.inverse.get(estado);
    }
}

class PedidoMapper {
    fromPedidoDTO(dto, comprador, productos) {
        const dir = dto.direccionEntrega

        return new Pedido(
            comprador,
            dto.items.map((item) => {
                const producto = productos.find(producto => producto.id === item.productoID)
                return new ItemPedido(producto, item.cantidad)
            }),
            dto.moneda,
            new DireccionEntrega(
                dir.calle,
                dir.altura,
                dir.piso,
                dir.departamento,
                dir.codigoPostal,
                dir.ciudad,
                dir.provincia,
                dir.pais,
                dir.lat,
                dir.lon
            )
        );
    }

    toPedidoDocument(pedido){
        return {
            ...pedido,
            comprador: pedido.comprador._id,
            items: pedido.items.map(item => {
                return {
                    ...item,
                    producto: item.producto._id
                }
            }),
            estado: estadoMapper.toString(pedido.estado),
            historialEstados: pedido.historialEstados.map(cambioEstado => {
                return {
                    ...cambioEstado,
                    estado: estadoMapper.toString(cambioEstado.estado),
                    usuario: cambioEstado.usuario._id
                }
            })
        }
    }
}

class UsuarioMapper {
    fromUsuarioDTO(usuarioDTO){
        return new Usuario(
            usuarioDTO.nombre,
            usuarioDTO.email,
            usuarioDTO.telefono,
            usuarioDTO.tipo
        )
    }
}

class ProductoMapper {
    fromProductoDTO(productoDTO, vendedor){
        return new Producto(
            vendedor,
            productoDTO.titulo,
            productoDTO.descripcion,
            productoDTO.categorias.map(nombre => new Categoria(nombre)),
            productoDTO.precio,
            productoDTO.moneda,
            productoDTO.stock,
            productoDTO.fotos,
            productoDTO.activo
        )
    }

    toProductoDocument(producto){
        return {
            ...producto,
            vendedor: producto.vendedor.id
        }
    }
}

class NotificacionMapper{
    toNotificacionDocument(notificacion){
        const notificacionDocument = {
            ...notificacion,
            usuarioDestino: notificacion.usuarioDestino._id
        }

        return notificacionDocument && typeof notificacionDocument.toObject === 'function'
            ? notificacionDocument.toObject()
            : { ...(notificacionDocument || {}) }
    }
}

class NotificacionesQPMapper{
    constructor(){
        this.filtros = new Map([
            ["leidas", true],
            ["no_leidas", false],
            ["todas", undefined],
        ]);
    }

    toBool(filtroBool) {
        return this.filtros.get(filtroBool);
    }
}

class ProductosQPMapper{
    /**
     * Construye un objeto de ordenamiento para consultas en base a los parámetros de muestreo.
     *
     * - Si `orderBy` está definido, se ordena por `precio` o `ventas`.
     * - El orden puede ser ascendente (`1`) o descendente (`-1`).
     * - Si no se especifica `orderBy`, devuelve un objeto vacío.
     *
     * @param {{ orderBy?: string, order?: "asc"|"desc" }} muestreo - Parámetros de ordenamiento.
     * @returns {Object<string, 1|-1>} Objeto de ordenamiento compatible con consultas de Mongoose.
     *
     * @example
     * sortParamMapper({ orderBy: "precio", order: "desc" })
     * // => { precio: -1 }
     */
    sortParamMapper(muestreo){
        if (muestreo.orderBy) {
            const campo = muestreo.orderBy === "precio" ? "precio" : "ventas";
            return { [campo]: muestreo.order === "desc" ? -1 : 1 };
        }
        return {};
    }

    /**
     * Construye un objeto de filtros para consultas en base a filtros crudos y un vendedor.
     *
     * - Siempre filtra por el `vendedorID`.
     * - Si existen filtros de texto (`nombre`, `descripcion`, `categorias`), se convierten en expresiones regulares insensibles a mayúsculas.
     * - Si se especifica un rango de precios (`minPrice`, `maxPrice`), se agrega un filtro de `$gte`/`$lte`.
     *
     * @param {Object} filtrosCrudos - Filtros recibidos en crudo (ej. desde query params).
     * @param {string} vendedorID - Identificador del vendedor al que pertenecen los productos.
     * @returns {Object} Objeto de filtros compatible con consultas (ej. MongoDB).
     *
     * @example
     * filterMapper({ nombre: "camisa", minPrice: 100 }, "v123")
     * // => {
     * //   vendedor: "v123",
     * //   nombre: /camisa/i,
     * //   precio: { $gte: 100 }
     * // }
     */
    filterMapper(filtrosCrudos, vendedorID){
        const filtros = { vendedor: vendedorID };

        ["nombre", "descripcion", "categorias"].forEach(campo => {
            if (filtrosCrudos[campo]) {
                filtros[campo] = new RegExp(filtrosCrudos[campo], "i");
            }
        });

        if (filtrosCrudos.minPrice !== undefined || filtrosCrudos.maxPrice !== undefined) {
            filtros.precio = {};
            if (filtrosCrudos.minPrice !== undefined)
                filtros.precio.$gte = filtrosCrudos.minPrice;
            if (filtrosCrudos.maxPrice !== undefined)
                filtros.precio.$lte = filtrosCrudos.maxPrice;
        }

        return filtros;
    }
}

class PaginacionMapper{
    toDTO(elementos, numeroPagina, elementosPorPagina, total){

        const totalPaginas = Math.ceil(total / elementosPorPagina)

        return {
            pagina: numeroPagina,
            perPage: elementosPorPagina,
            total: total,
            totalPaginas: totalPaginas,
            data: elementos
        }
    }
}

export function mapperErrorBD(err) {
    if (err instanceof mongoose.Error.ValidationError) {
        const erroresValidacion = Object.keys(err.errors || {}).map(campo => ({
            campo,
            mensaje: err.errors[campo]?.message,
            tipo: err.errors[campo]?.kind,
        }));
        return new ValidacionBDError(erroresValidacion);
    }

    if (err?.name === 'CastError') {
        return new CastBDError({ campo: err.path, valor: err.value, tipo: err.kind });
    }

    if (err?.name === 'MongoServerError' && err?.code === 11000) {
        const campo =
            Object.keys(err.keyValue || {})[0] ||
            Object.keys(err.keyPattern || {})[0] ||
            'campo';
        const valor = (err.keyValue && err.keyValue[campo]) ?? '(desconocido)';
        return new DuplicadoError(campo, valor);
    }

    if (err instanceof mongoose.Error.VersionError) {
        return new ConflictoVersionBDError({
            id: err?.doc?._id,
            versionIntentada: err?.version,
        });
    }

    if (
        err?.name === 'MongoNetworkError' ||
        err?.name === 'MongoServerSelectionError' ||
        err?.name === 'MongoTimeoutError'
    ) {
        return new ConexionBDError(err.message);
    }

    if (err?.name === 'MongoError' || err?.name === 'MongoServerError') {
        return new MongoBDError(err.message, err.code);
    }

    return null;
}

export const estadoMapper = new EstadoMapper()
export const pedidoMapper = new PedidoMapper()
export const usuarioMapper = new UsuarioMapper()
export const productoMapper = new ProductoMapper()
export const productosQPMapper = new ProductosQPMapper()
export const notificacionMapper = new NotificacionMapper()
export const notificacionesQPMapper = new NotificacionesQPMapper()
export const paginacionMapper = new PaginacionMapper()