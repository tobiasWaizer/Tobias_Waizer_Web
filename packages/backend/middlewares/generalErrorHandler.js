import {
    AutorizacionError, ObjetoNoEncontradoError, CambioEstadoInvalidoError, ProductosNoDisponiblesError,
    ProductosDeVariosVendedoresError, MarcarComoLeidaError
} from "../errors/errors.js";
import {z} from "zod";
import {mapperErrorBD} from "../mappers/mappers.js";

const erroresExistentes = new Set([
    AutorizacionError,
    ObjetoNoEncontradoError,
    CambioEstadoInvalidoError,
    ProductosNoDisponiblesError,
    ProductosDeVariosVendedoresError,
    MarcarComoLeidaError
]);

export function generalErrorHandler(err, req, res, next) {
    if (err instanceof z.ZodError) {
        return res.status(400).json({
            error: "Datos de entrada inválidos",
            detalles: err.issues,
        });
    }

    const bddError = mapperErrorBD(err);
    if (bddError) {
        return res.status(bddError.status).json(errorAJSON(bddError));
    }

    if (existeElError(err)) {
        return res.status(err.status).json(errorAJSON(err));
    }

    return res
        .status(500)
        .json({ error: "Error interno del servidor" });
}

function existeElError(err) {
    for (const Tipo of erroresExistentes) if (err instanceof Tipo) return true;
    return false;
}

function errorAJSON(err) {
    const body = { error: err.message };
    if (err.detalles !== undefined) body.detalles = err.detalles;
    return body;
}