import {
    CambioEstadoInvalidoError,
    ProductosDeVariosVendedoresError, ProductosNoDisponiblesError,
    TipoUsuarioNoPermitidoError, UsuarioNoPermitidoError
} from "../../errors/errors.js";
import {TipoUsuario} from "../usuarios/TipoUsuario.js";
import {estadoMapper} from "../../mappers/mappers.js";

export default class PedidosValidator {
    static _singleton = null

    static instance() {
        this._singleton ||= new this()
        return this._singleton
    }

    validarCreacion(nuevoPedido) {
        this.validarProductosDeUnSoloVendedor(nuevoPedido)
        this.validarProductosActivosYStock(nuevoPedido)
    }

    validarCambioEstado(pedido, nuevoEstado, usuario) {
        this.validarUsuario(pedido, usuario);
        this.validarAutorizacionCambioEstado(pedido, nuevoEstado, usuario);
        this.validarSiguienteEstado(pedido, nuevoEstado);
    }

    validarUsuario(pedido, usuario) {
        let valido

        switch (usuario.tipo) {
            case TipoUsuario.ADMIN:
                valido = true
                break
            case TipoUsuario.COMPRADOR:
                valido = usuario.id === pedido.comprador.id
                break
            case TipoUsuario.VENDEDOR:
                valido = usuario.id === pedido.vendedor().id
                break
            default:
                valido = false
        }

        if (!valido) {
            throw new UsuarioNoPermitidoError()
        }
    }

    validarAutorizacionCambioEstado(pedido, nuevoEstado, usuario) {
        if(!nuevoEstado.estaAutorizadoACambiar(usuario)) {
            throw new TipoUsuarioNoPermitidoError(usuario.tipo, pedido.estado.tipoUsuarioAutorizado)
        }
    }

    validarSiguienteEstado(pedido, nuevoEstado) {
        if(!estadoMapper.fromString(pedido.estado).puedeCambiarA(nuevoEstado)){
            throw new CambioEstadoInvalidoError(pedido.estado, estadoMapper.toString(nuevoEstado))
        }
    }

    validarProductosDeUnSoloVendedor(nuevoPedido) {
        if(!nuevoPedido.tieneTodosProductosDeMismosVendedores()){
            throw new ProductosDeVariosVendedoresError()
        }
    }

    validarProductosActivosYStock(nuevoPedido) {
        const productosInactivos = nuevoPedido.productosInactivos();
        const productosSinStock = nuevoPedido.productosSinStock();

        if (productosInactivos.length > 0 || productosSinStock > 0) {
            throw new ProductosNoDisponiblesError({productosInactivos, productosSinStock});
        }
    }
}