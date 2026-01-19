import dotenv from 'dotenv'
import app from "./routes/routes.js"
import {MongoDBClient} from "./database.js";
import PedidosService from "./services/pedidosService.js";
import ProductosService from "./services/productosService.js";
import UsuariosService from "./services/usuariosService.js";

const usuariosService = UsuariosService.instance()
const productosService = ProductosService.instance()
const pedidosService = PedidosService.instance()

usuariosService.setServices(productosService, pedidosService)

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
dotenv.config({ path: envFile })
console.log(`Environment: ${process.env.NODE_ENV}`)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`)
    console.log(`Swagger docs available at http://localhost:${PORT}/docs`)
})

MongoDBClient.connect();