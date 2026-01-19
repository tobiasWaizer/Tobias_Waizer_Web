import express from "express"
import healthRoutes from "./healthRoutes.js"
import pedidosRoutes from "./pedidosRoutes.js"
import usuariosRoutes from "./usuariosRoutes.js"
import productosRoutes from "./productosRoutes.js"
import notificacionesRoutes from "./notificacionesRoutes.js"
import swaggerRoutes from "./swaggerRoutes.js";
import {generalErrorHandler} from "../middlewares/generalErrorHandler.js";

const app = express()

app.use(express.json())

app.use("/health", healthRoutes)
app.use("/pedidos", pedidosRoutes)
app.use("/usuarios", usuariosRoutes)
app.use("/productos", productosRoutes)
app.use("/notificaciones", notificacionesRoutes)
app.use("/docs", swaggerRoutes)

app.use(generalErrorHandler)

export default app