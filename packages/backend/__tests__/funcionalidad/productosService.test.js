import ProductosService from "../../services/productosService.js"
import { Producto } from '../../domain/productos/Producto.js'
import {describe, it, beforeEach, expect, jest} from '@jest/globals'
import {productosQPMapper,  paginacionMapper, productoMapper} from "../../mappers/mappers.js";
import {Usuario} from "../../domain/usuarios/Usuario.js";
import {TipoUsuario} from "../../domain/usuarios/TipoUsuario.js";
import {ProductoNoEncontradoError} from "../../errors/errors.js";

describe('ProductosService.crear', () => {
    let productosService, vendedor, productoDTO, productoDoc

    beforeEach(() => {
        ProductosService._singleton = null
        productosService = ProductosService.instance()

        productosService.productosRepository = {
            create: jest.fn(doc => Promise.resolve(doc))
        }
        productosService.usuariosService = {
            validarPermisos: jest.fn().mockResolvedValue()
        }
        jest.spyOn(productoMapper, 'fromProductoDTO')
        jest.spyOn(productoMapper, 'toProductoDocument')

        vendedor = new Usuario('VendedorA', 'v@test.com', '123', TipoUsuario.VENDEDOR)
        productoDTO = { titulo: 'P', descripcion: 'D', categorias: [], precio: 10, moneda: 'PESO_ARG', stock: 2, fotos: [], activo: true }
        productoDoc = { any: 'doc' }
        productoMapper.fromProductoDTO.mockReturnValue(new Producto(vendedor, 'P', 'D', [], 10, 'PESO_ARG', 2, [], true))
        productoMapper.toProductoDocument.mockReturnValue(productoDoc)
    })

    it('crea producto con permisos y mapping correcto', () => {
        return productosService.crear(productoDTO, vendedor).then(result => {
            expect(productosService.usuariosService.validarPermisos).toHaveBeenCalledWith(vendedor, TipoUsuario.VENDEDOR)
            expect(productoMapper.fromProductoDTO).toHaveBeenCalledWith(productoDTO, vendedor)
            expect(productoMapper.toProductoDocument).toHaveBeenCalled()
            expect(productosService.productosRepository.create).toHaveBeenCalledWith(productoDoc)
            expect(result).toEqual(productoDoc)
        })
    })
})

describe('ProductosService.existenProductos', () => {
    let productosService

    beforeEach(() => {
        ProductosService._singleton = null
        productosService = ProductosService.instance()
    })

    it('devuelve productos cuando todos existen', () => {
        const ids = ['a', 'b']
        productosService.existeProducto = jest.fn((id, productos) => {
            productos.push({ id })
            return Promise.resolve()
        })
        return productosService.existenProductos(ids).then(result => {
            expect(productosService.existeProducto).toHaveBeenCalledTimes(2)
            expect(result.map(p => p.id)).toEqual(ids)
        })
    })

    it('lanza ProductoNoEncontradoError cuando alguno no existe', () => {
        const ids = ['ok', 'fail', 'ok2']
        productosService.existeProducto = jest.fn((id, productos, idsConError) => {
            if (id === 'fail') idsConError.push(id)
            else productos.push({ id })
            return Promise.resolve()
        })
        return productosService.existenProductos(ids).then(
            () => { throw new Error('Debió lanzar') },
            err => expect(err).toBeInstanceOf(ProductoNoEncontradoError)
        )
    })
})

describe('ProductosService.aumentarStock', () => {
    let productosService, item1, item2

    beforeEach(() => {
        ProductosService._singleton = null
        productosService = ProductosService.instance()
        const prod1 = { aumentarStock: jest.fn(), save: jest.fn().mockResolvedValue({}) }
        const prod2 = { aumentarStock: jest.fn(), save: jest.fn().mockResolvedValue({}) }
        item1 = { producto: prod1, cantidad: 3 }
        item2 = { producto: prod2, cantidad: 1 }
    })

    it('aumenta stock y guarda todos los productos', () => {
        return productosService.aumentarStock([item1, item2]).then(() => {
            expect(item1.producto.aumentarStock).toHaveBeenCalledWith(3)
            expect(item2.producto.aumentarStock).toHaveBeenCalledWith(1)
            expect(item1.producto.save).toHaveBeenCalled()
            expect(item2.producto.save).toHaveBeenCalled()
        })
    })

    it('rechaza si un save falla', () => {
        item2.producto.save.mockRejectedValue(new Error('fail'))
        return productosService.aumentarStock([item1, item2]).then(
            () => { throw new Error('Debió fallar') },
            () => expect(item1.producto.save).toHaveBeenCalled()
        )
    })
})

describe('ProductosService.disminuirStock', () => {
    let productosService, item1, item2

    beforeEach(() => {
        ProductosService._singleton = null
        productosService = ProductosService.instance()
        productosService.productosValidator = { validarProductos: jest.fn() }

        const prod1 = { reducirStock: jest.fn(), save: jest.fn().mockResolvedValue({}) }
        const prod2 = { reducirStock: jest.fn(), save: jest.fn().mockResolvedValue({}) }
        item1 = { producto: prod1, cantidad: 2 }
        item2 = { producto: prod2, cantidad: 5 }
    })

    it('valida, reduce stock y guarda', () => {
        productosService.productosValidator.validarProductos.mockImplementation(() => {})
        return productosService.disminuirStock([item1, item2]).then(() => {
            expect(productosService.productosValidator.validarProductos).toHaveBeenCalledWith([item1, item2])
            expect(item1.producto.reducirStock).toHaveBeenCalledWith(2)
            expect(item2.producto.reducirStock).toHaveBeenCalledWith(5)
            expect(item1.producto.save).toHaveBeenCalled()
            expect(item2.producto.save).toHaveBeenCalled()
        })
    })

    it('si la validación falla, no guarda y rechaza', () => {
        productosService.productosValidator.validarProductos.mockImplementation(() => { throw new Error('invalid') })
        return productosService.disminuirStock([item1, item2]).then(
            () => { throw new Error('Debió fallar') },
            () => {
                expect(item1.producto.save).not.toHaveBeenCalled()
                expect(item2.producto.save).not.toHaveBeenCalled()
            }
        )
    })
})

describe('ProductosService.consultarProductosVendedor', () => {
    let productosService, vendedorID, paginacion, muestreo, filtrado, productosLeidos, dtoFinal

    beforeEach(() => {
        ProductosService._singleton = null
        productosService = ProductosService.instance()

        productosService.productosRepository = {
            findByUsuario: jest.fn(),
            count: jest.fn()
        }

        jest.spyOn(productosQPMapper, 'sortParamMapper')
        jest.spyOn(productosQPMapper, 'filterMapper')
        jest.spyOn(paginacionMapper, 'toDTO')

        vendedorID = 'V1'
        paginacion = { page: 2, limit: 10 }
        muestreo = { any: 'x' }
        filtrado = { q: 'abc' }
        productosLeidos = [{ id: 1 }]
        dtoFinal = { data: productosLeidos, page: 2, limit: 10, total: 15 }

        productosQPMapper.sortParamMapper.mockReturnValue({ sort: 'desc' })
        productosQPMapper.filterMapper.mockReturnValue({ vendedorID: 'V1', q: 'abc' })
        productosService.productosRepository.findByUsuario.mockResolvedValue(productosLeidos)
        productosService.productosRepository.count.mockResolvedValue(15)
        paginacionMapper.toDTO.mockReturnValue(dtoFinal)
    })

    it('aplica offset, mapea sort/filtros y pagina el resultado', () => {
        return productosService.consultarProductosVendedor(vendedorID, paginacion, muestreo, filtrado).then(result => {
            expect(paginacion.offset).toBe((2 - 1) * 10)
            expect(productosQPMapper.sortParamMapper).toHaveBeenCalledWith(muestreo)
            expect(productosQPMapper.filterMapper).toHaveBeenCalledWith(filtrado, vendedorID)
            expect(productosService.productosRepository.findByUsuario)
                .toHaveBeenCalledWith(paginacion, { sort: 'desc' }, { vendedorID: 'V1', q: 'abc' })
            expect(productosService.productosRepository.count)
                .toHaveBeenCalledWith({ vendedorID: 'V1', q: 'abc' })
            expect(paginacionMapper.toDTO)
                .toHaveBeenCalledWith(productosLeidos, 2, 10, 15)
            expect(result).toEqual(dtoFinal)
        })
    })
})