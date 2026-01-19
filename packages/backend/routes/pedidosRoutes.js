import {Router} from 'express'
import PedidosController from '../controllers/pedidosController.js'
import {cambioEstadoSchema, pedidoSchema, validarBody, validarPathID} from "../middlewares/zodValidations.js";
import {autentificar} from "../middlewares/authentication.js";

const router = Router()
const controller = PedidosController.instance()

router.route("/")
    .post(
        autentificar(),
        validarBody(pedidoSchema),
        (req, res) => controller.crear(req, res)
    )

router.route("/:id")
    .get(
        validarPathID(),
        autentificar(), (req, res) => controller.consultarPedido(req,res))
    .patch(
        validarPathID(),
        autentificar(),
        validarBody(cambioEstadoSchema),
        (req, res) => controller.cambiarEstadoPedido(req,res)
    )

export default router