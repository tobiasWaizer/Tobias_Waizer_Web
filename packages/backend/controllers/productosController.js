import ProductosService from "../services/productosService.js";

export default class ProductosController {
    static _singleton = null
    static instance() {
        this._singleton ||= new this()
        return this._singleton
    }

    constructor() {
        this.productosService = ProductosService.instance()
    }

    crear(req, res){
        return this.productosService.crear(req.validatedBody, req.user)
            .then(producto => res.status(201).json(producto))
    }
}
