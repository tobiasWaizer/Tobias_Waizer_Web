import { TipoUsuario } from "../../usuarios/TipoUsuario.js"

class EstadoPedido{
    constructor(tipoUsuarioAutorizado, estadosPosibles) {
        this.tipoUsuarioAutorizado = tipoUsuarioAutorizado
        this.estadosPosibles = estadosPosibles
    }

    estaAutorizadoACambiar(usuario){
        return usuario.tipo === this.tipoUsuarioAutorizado || usuario.tipo === TipoUsuario.ADMIN
    }

    puedeCambiarA(nuevoEstado){
        return this.estadosPosibles.includes(nuevoEstado)
    }

    aplicarEfectoInicial(){
        return Promise.resolve()
    }
}

class Cancelado extends EstadoPedido {
    constructor() {
        super(TipoUsuario.COMPRADOR, [])
    }

    aplicarEfectoInicial(pedido, productosService, notificacionesService){
        return productosService.aumentarStock(pedido.items)
            .then(() => notificacionesService.notificarCambioEstado(pedido, pedido.vendedor()))
    }
}

class Entregado extends EstadoPedido {
    constructor() {
        super(TipoUsuario.VENDEDOR, [])
    }
}

class Enviado extends EstadoPedido {
    constructor() {
        super(TipoUsuario.COMPRADOR, [entregado])
    }

    aplicarEfectoInicial(pedido, productosService, notificacionesService){
        return notificacionesService.notificarCambioEstado(pedido, pedido.comprador)
    }
}

class EnPreparacion extends EstadoPedido {
    constructor() {
        super(TipoUsuario.COMPRADOR, [enviado, cancelado])
    }
}

class Confirmado extends EstadoPedido {
    constructor() {
        super(TipoUsuario.VENDEDOR, [enPreparacion, cancelado])
    }
}

class Pendiente extends EstadoPedido {
    constructor() {
        super(TipoUsuario.COMPRADOR, [confirmado, cancelado])
    }
}

export const cancelado = new Cancelado()
export const entregado = new Entregado()
export const enviado = new Enviado()
export const enPreparacion = new EnPreparacion()
export const confirmado = new Confirmado()
export const pendiente = new Pendiente()