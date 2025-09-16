const express = require("express");
const router = express.Router();
const carritosController = require("../controllers/carritos.controller");
// Para validaciones específicas para carritos, tengo que importás acá!!!!!!:
// const { validateCarritoCreate, validateCarritoUpdate, validateCarritoId } = require("../../middleware/validation");

// GET /api/carritos - Obtener todos los carritos
router.get("/", carritosController.getCarritos);

// GET /api/carritos/:id - Obtener un carrito por ID
router.get("/:id", carritosController.getCarritoById);

// POST /api/carritos - Crear un nuevo carrito
router.post("/", carritosController.createCarrito);

// PUT /api/carritos/:id - Actualizar un carrito
router.put("/:id", carritosController.updateCarrito);

// DELETE /api/carritos/:id - Eliminar un carrito (soft delete)
router.delete("/:id", carritosController.deleteCarrito);

module.exports = router;