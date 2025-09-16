// routes/carritosProductos.routes.js
const express = require("express");
const router = express.Router();
const carritosProductosController = require("../controllers/carritosProductos.controller");

// GET /api/carritos-productos - Obtener todos los carritosProductos
router.get("/", carritosProductosController.getCarritosProductos);

// GET /api/carritos-productos/:id - Obtener un carritoProducto por ID
router.get("/:id", carritosProductosController.getCarritoProductoById);

// POST /api/carritos-productos - Crear un nuevo carritoProducto
router.post("/", carritosProductosController.createCarritoProducto);

// PUT /api/carritos-productos/:id - Actualizar un carritoProducto
router.put("/:id", carritosProductosController.updateCarritoProducto);

// DELETE /api/carritos-productos/:id - Eliminar un carritoProducto
router.delete("/:id",carritosProductosController.deleteCarritoProducto);

module.exports = router;