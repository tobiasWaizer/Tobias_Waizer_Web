import { Router } from 'express'
import UsuariosController from "../controllers/usuariosController.js"
import {
    usuarioSchema,
    validarPathID,
    validarBody,
    validarQueryParams, notificacionQPSchema, productosQPSchema
} from "../middlewares/zodValidations.js";
import {autentificar} from "../middlewares/authentication.js";

const router = Router()
const controller = UsuariosController.instance()

router.route("/")
    .post(validarBody(usuarioSchema), (req, res) => controller.crear(req, res))

router.route("/:id/pedidos")
    .get(
        validarPathID(),
        autentificar(),
        (req, res) => controller.consultarHistorialPedidos(req, res)
    )

router.route("/:id/productos")
    .get(
        validarPathID(),
        validarQueryParams(productosQPSchema),
        (req, res) => controller.consultarProductosVendedor(req, res)
    )

router.route("/:id/notificaciones")
    .get(
        validarPathID(),
        validarQueryParams(notificacionQPSchema),
        autentificar(),
        (req, res) => controller.obtenerNotificaciones(req, res)
    )

export default router
