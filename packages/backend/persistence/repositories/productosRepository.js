import { Repository } from './repository.js'
import {ProductoModel} from "../schemas/productoSchema.js";
import {ProductoNoEncontradoError} from "../../errors/errors.js";

export class ProductosRepository extends Repository {

    constructor() {
        super(ProductoModel, ProductoNoEncontradoError)
    }

    findByUsuario(paginacion, sortParam, filtros) {
        return this.model
            .find(filtros)
            .skip (paginacion.offset)
            .limit(paginacion.limit)
            .sort(sortParam)
            .exec()
    }
}