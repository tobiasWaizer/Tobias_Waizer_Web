import {describe, it, expect, beforeEach, jest} from "@jest/globals"
import UsuariosService from "../../services/usuariosService.js"
import {TipoUsuario} from "../../domain/usuarios/TipoUsuario.js"
import {AutorizacionError} from "../../errors/errors.js"
import {Usuario} from "../../domain/usuarios/Usuario.js";


describe('UsuariosService', () => {
    let usuariosService, usuario, admin, repoMock

    beforeEach(() => {
        UsuariosService._singleton = null
        usuariosService = UsuariosService.instance()
        repoMock = {
            findById: jest.fn(),
            create: jest.fn().mockResolvedValue(null),
        }
        usuariosService.usuariosRepository = repoMock
        usuario = new Usuario('usuario', 'usuario@test.com', '1', TipoUsuario.COMPRADOR)
        usuario.id = 1
        admin = new Usuario('admin', 'admin@test.com', '2', TipoUsuario.ADMIN)
        admin.id = 2
        usuariosService.usuarioMapper = { fromUsuarioDTO: jest.fn().mockReturnValue(usuario) }
    })


    it('devuelve el usuario si existe', () => {
        repoMock.findById.mockResolvedValue(usuario)
        return usuariosService.obtener(1)
            .then(result => expect(result).toEqual(usuario))
    })

    it('no lanza error cuando el usuario es ADMIN aunque el tipo esperado sea otro', () => {
        return usuariosService.validarPermisos(admin, TipoUsuario.COMPRADOR)
            .then(result => {
                expect(result).toBeUndefined()
            })
    })

    it('lanza error si el tipo de usuario no coincide', () => {
        repoMock.findById.mockResolvedValue(usuario)
        return usuariosService.obtener(1)
            .then(usuario => usuariosService.validarPermisos(usuario, TipoUsuario.ADMIN))
            .then(
                () => { throw new Error('Debió lanzar error') },
                err => expect(err).toBeInstanceOf(AutorizacionError)
            )
    })

    it('lanza error si los IDs no coinciden', () => {
        repoMock.findById.mockResolvedValue(usuario)
        return usuariosService.obtener(1)
            .then(usuario => usuariosService.validarPermisos(usuario, null, 2))
            .then(
                () => { throw new Error('Debió lanzar error') },
                err => expect(err).toBeInstanceOf(AutorizacionError)
            )
    })


})
