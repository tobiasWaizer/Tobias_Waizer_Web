import UsuariosService from "../services/usuariosService.js";
import {idSchema} from "./zodValidations.js";

export function autentificar(){
    return (req, res, next) => {
        const usuarioID = req.headers['authorization']

        if(!usuarioID){
            return res.status(401).json({
                error: "Header Authorization requerido."
            })
        }

        idSchema.parseAsync(usuarioID)
            .then(resultID => UsuariosService.instance().obtener(resultID))
            .then(usuario => req.user = usuario)
            .then(() => next())
            .catch(err => {
                next(err)
            })
    }
}