import {Router} from 'express'
import ProductosController from "../controllers/productosController.js";
import {productoSchema, validarBody} from "../middlewares/zodValidations.js";
import {autentificar} from "../middlewares/authentication.js";

const router = Router()
const controller = ProductosController.instance()

router.route("/")
    .post(
        autentificar(),
        validarBody(productoSchema),
        (req, res) => controller.crear(req, res)
    )

export default router