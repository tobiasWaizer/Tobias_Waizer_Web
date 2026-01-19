export class CambioEstadoPedido {
    constructor(estado, usuario, motivo, fecha = null) {
        this.estado = estado
        this.usuario = usuario
        this.motivo = motivo
        this.fecha = fecha ?? new Date()
    }
}