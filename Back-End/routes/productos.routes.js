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
const upload = require("../middleware/upload.middleware"); 

// GET /api/productos/search - Obtener productos para el autocomplete (NUEVA RUTA)
router.get("/search", productoController.searchProductos); 

// GET /api/productos - Obtener todos los productos (con paginación y filtros)
router.get("/", validatePagination, productoController.getProductos);

// GET /api/productos/:id - Obtener un producto por ID
router.get("/:id", validateProductoId, productoController.getProducto);

// --- Rutas Protegidas para Administrador ---

// POST /api/productos - Crear un nuevo producto (con subida de archivos)
router.post(
    "/", 
    verificarJWTAdmin, 
    upload.array('imagenes', 3), 
    validateProductoCreate, 
    productoController.createProducto
);

// PUT /api/productos/:id - Actualizar un producto
router.put(
    "/:id", 
    verificarJWTAdmin, 
    upload.none(), 
    validateProductoId, 
    validateProductoUpdate, 
    productoController.updateProducto
);

// DELETE /api/productos/:id - Eliminar un producto
router.delete("/:id", verificarJWTAdmin, validateProductoId, productoController.deleteProducto);

module.exports = router;