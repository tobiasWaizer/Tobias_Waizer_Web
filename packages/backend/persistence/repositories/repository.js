export class Repository {

    static _singletons = new Map()

    static instance() {
        if (!this._singletons.has(this)) {
            this._singletons.set(this, new this())
        }
        return this._singletons.get(this)
    }

    constructor(model, ObjetoNoEncontradoError) {
        this.model = model
        this.ObjetoNoEncontradoError = ObjetoNoEncontradoError
    }

    findById(id) {
        return this.model.findById(id).exec()
            .then(doc => {
                if (!doc) {
                    throw new this.ObjetoNoEncontradoError(id)
                }
                return doc
            })
    }

    create(entity) {
        return this.model.create(entity)
    }

    count(filter) {
        return this.model.countDocuments(filter).exec()
    }
}