export class ObjetoNoEncontradoError extends Error {
    constructor(tipoDeObjeto, { ids }) {
        const listaDeIds = Array.isArray(ids) ? ids.join(', ') : String(ids);
        super(`No se encontraron los siguientes ${tipoDeObjeto}: ${listaDeIds}`);
        this.name = this.constructor.name;
        this.status = 404;
        this.tipoDeObjeto = tipoDeObjeto;
        this.ids = ids;
        this.detalles = { tipoDeObjeto, ids };
    }
}

export class PedidoNoEncontradoError extends ObjetoNoEncontradoError {
    constructor({ ids }) {
        super('pedidos', { ids });
    }
}

export class UsuarioNoEncontradoError extends ObjetoNoEncontradoError {
    constructor({ ids }) {
        super('usuarios', { ids });
    }
}

export class ProductoNoEncontradoError extends ObjetoNoEncontradoError {
    constructor({ ids }) {
        super('productos', { ids });
    }
}

export class NotificacionNoEncontradaError extends ObjetoNoEncontradoError {
    constructor({ ids }) {
        super('notificaciones', { ids });
    }
}

export class AutorizacionError extends Error {
    constructor(mensaje, detalles = {}) {
        super(mensaje);
        this.name = this.constructor.name;
        this.status = 403;
        this.detalles = detalles;
    }
}

export class TipoUsuarioNoPermitidoError extends AutorizacionError {
    constructor(tipoUsuario, tipoUsuarioEsperado) {
        super(
            `El tipo de usuario "${tipoUsuario}" no tiene permiso, se esperaba a un "${tipoUsuarioEsperado}"`,
            { tipoUsuario, tipoUsuarioEsperado }
        );
    }
}

export class UsuarioNoPermitidoError extends AutorizacionError {
    constructor() {
        super(`El usuario no tiene permitido realizar esta accion`, {});
    }
}

export class CambioEstadoInvalidoError extends Error {
    constructor(anterior, intentado) {
        super(`No se permite cambiar de "${anterior}" a "${intentado}".`);
        this.name = this.constructor.name;
        this.status = 422;
        this.anterior = anterior;
        this.intentado = intentado;
        this.detalles = { anterior, intentado };
    }
}

export class ProductosDeVariosVendedoresError extends Error {
    constructor() {
        super(`Un pedido no puede tener productos de varios vendedores`);
        this.name = this.constructor.name;
        this.status = 422;
        this.detalles = {};
    }
}

export class ProductosNoDisponiblesError extends Error {
    constructor({ productosInactivos = [], productosSinStock = [] }) {
        const partes = [];

        if (Array.isArray(productosInactivos) && productosInactivos.length > 0) {
            partes.push(`inactivos: ${productosInactivos.join(', ')}`);
        }

        if (Array.isArray(productosSinStock) && productosSinStock.length > 0) {
            partes.push(`sin stock: ${productosSinStock.join(', ')}`);
        }

        const detalle = partes.length > 0 ? ` (${partes.join(' | ')})` : '';
        super(`Hay productos no disponibles${detalle}.`);

        this.name = this.constructor.name;
        this.status = 409;
        this.productosInactivos = productosInactivos;
        this.productosSinStock = productosSinStock;
        this.detalles = { productosInactivos, productosSinStock };
    }
}

export class MarcarComoLeidaError extends Error {
    constructor(notificationId) {
        super(
            `No se puede marcar como leída una notificación ya leída. La notificación ${notificationId} ya está leída.`
        );
        this.name = this.constructor.name;
        this.status = 409;
        this.notificationId = notificationId;
        this.detalles = { notificationId };
    }
}

export class ValidacionBDError extends Error {
    constructor(erroresValidacion) {
        super('Error de validación en la base de datos');
        this.name = this.constructor.name;
        this.status = 400;
        this.detalles = { erroresValidacion };
    }
}

export class CastBDError extends Error {
    constructor({ campo, valor, tipo }) {
        super(`Valor inválido para el campo "${campo}": "${valor}"`);
        this.name = this.constructor.name;
        this.status = 400;
        this.detalles = { campo, valor, tipo };
    }
}

export class DuplicadoError extends Error {
    constructor(campo, valor) {
        super(`Ya existe un registro con ${campo}: "${valor}"`);
        this.name = this.constructor.name;
        this.status = 409;
        this.detalles = { campo, valor };
    }
}

export class ConflictoVersionBDError extends Error {
    constructor({ id, versionIntentada }) {
        super('Conflicto de versión del recurso');
        this.name = this.constructor.name;
        this.status = 409;
        this.detalles = { id, versionIntentada };
    }
}

export class ConexionBDError extends Error {
    constructor(motivo) {
        super('La base de datos no está disponible en este momento');
        this.name = this.constructor.name;
        this.status = 503;
        this.detalles = { reason: motivo };
    }
}

export class MongoBDError extends Error {
    constructor(mensaje, codigoOriginal) {
        super('Error interno de base de datos');
        this.name = this.constructor.name;
        this.status = 500;
        this.detalles = { mensaje, codigoOriginal };
    }
}