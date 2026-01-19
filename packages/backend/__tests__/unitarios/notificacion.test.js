import { describe, it, expect } from '@jest/globals'
import { Notificacion } from '../../domain/notificaciones/Notificacion.js'

describe('Notificacion', () => {
    it('constructor: asigna fecha actual por defecto y no está leída', () => {
        const usuarioDestino = null
        const notificacion1 = new Notificacion(usuarioDestino, 'mensaje de prueba')

        expect(notificacion1.fechaAlta).toBeInstanceOf(Date)
        expect(notificacion1.leida).toBe(false)
        expect(notificacion1.fechaLeida).toBeNull()
    })

    it('marcarComoLeida: setea leida=true y asigna fecha de lectura', () => {
        const usuarioDestino = null
        const notificacion1 = new Notificacion(usuarioDestino, 'mensaje de prueba')

        notificacion1.marcarComoLeida()

        expect(notificacion1.leida).toBe(true)
        expect(notificacion1.fechaLeida).toBeInstanceOf(Date)
    })
})
