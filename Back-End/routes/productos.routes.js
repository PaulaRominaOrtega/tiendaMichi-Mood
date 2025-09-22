const express = require("express");
const router = express.Router();

const productoController = require("../controllers/productos.controller");
const {
    validateProductoCreate,
    validateProductoUpdate,
    validateProductoId,
    validatePagination
} = require("../middleware/validation");
const { verificarJWTAdmin } = require("../middleware/auth.middleware"); 

// GET /api/productos - Obtener todos los productos (con paginación)
// Esta ruta es pública ya que los usuarios comunes pueden ver los productos.
router.get("/", validatePagination, productoController.getProductos);

// GET /api/productos/:id - Obtener un producto por ID
// También es una ruta pública, los usuarios pueden ver un producto específico.
router.get("/:id", validateProductoId, productoController.getProducto);

// ------------------- Rutas Protegidas para Administradores -------------------

// POST /api/productos - Crear un nuevo producto
// Solo un administrador puede crear un producto.
router.post("/", verificarJWTAdmin, validateProductoCreate, productoController.createProducto);

// PUT /api/productos/:id - Actualizar un producto
// Solo un administrador puede actualizar un producto.
router.put("/:id", verificarJWTAdmin, validateProductoId, validateProductoUpdate, productoController.updateProducto);

// DELETE /api/productos/:id - Eliminar un producto
// Solo un administrador puede eliminar un producto.
router.delete("/:id", verificarJWTAdmin, validateProductoId, productoController.deleteProducto);

module.exports = router;