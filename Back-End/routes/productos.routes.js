const express = require("express");
const router = express.Router();

const productoController = require("../controllers/productos.controller");
const {
    validateProductoCreate,
    validateProductoUpdate,
    validateProductoId,
    validatePagination
} = require("../middleware/validation");

// GET /api/productos - Obtener todos los productos (con paginación)
router.get("/", validatePagination, productoController.getProductos);

// GET /api/productos/:id - Obtener un producto por ID
router.get("/:id", validateProductoId, productoController.getProducto);

// POST /api/productos - Crear un nuevo producto
router.post("/", validateProductoCreate, productoController.createProducto);

// PUT /api/productos/:id - Actualizar un producto
router.put("/:id", validateProductoId, validateProductoUpdate, productoController.updateProducto);

// DELETE /api/productos/:id - Eliminar un producto
router.delete("/:id", validateProductoId, productoController.deleteProducto);

module.exports = router;