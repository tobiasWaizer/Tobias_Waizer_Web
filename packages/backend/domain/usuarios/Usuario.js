export class Usuario{

    id

    constructor(nombre, email, telefono, tipo, fechaAlta = null){
        this.nombre = nombre
        this.email = email
        this.telefono = telefono
        this.tipo = tipo
        this.fechaAlta = fechaAlta ?? new Date()
    }

    esDeTipo(tipo){
        return this.tipo === tipo
    }

    tieneID(id){
        return this.id === id
    }
}