import {Router} from "express";
import NotificacionesController from "../controllers/notificacionesController.js";
import {validarPathID} from "../middlewares/zodValidations.js";
import {autentificar} from "../middlewares/authentication.js";

const router = Router()
const controller = NotificacionesController.instance()

router.route("/:id")
    .patch(
        validarPathID(),
        autentificar(),
        (req,res) => controller.marcarComoLeida(req,res)
    )

export default router
