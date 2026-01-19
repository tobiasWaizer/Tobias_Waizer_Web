export class Notificacion {
    /**
     * Crea una nueva notificación.
     *
     * @param {Usuario} usuarioDestino - Usuario que recibirá la notificación.
     * @param {string} mensaje - Texto principal de la notificación.
     * @param {object|null} [detalles=null] - Información adicional asociada a la notificación.
     * @param {boolean} [leida=false] - Indica si la notificación ya fue leída.
     * @param {Date|null} [fechaAlta=null] - Fecha de creación; si no se pasa, se asigna la fecha actual.
     * @param {Date|null} [fechaLeida=null] - Fecha en la que la notificación fue leída (si aplica).
     */
    constructor(usuarioDestino, mensaje, detalles = null, leida = false, fechaAlta = null, fechaLeida = null) {
        this.usuarioDestino = usuarioDestino
        this.mensaje = mensaje
        this.detalles = detalles
        this.leida = leida
        this.fechaAlta = fechaAlta ?? new Date()
        this.fechaLeida = fechaLeida
    }

    marcarComoLeida() {
        this.leida = true
        this.fechaLeida = new Date()
    }
}