const express = require("express");
const router = express.Router();

const cuponesController = require("../controllers/cuponesDescuentos.controller");


// GET /api/cupones - Obtener todos los cupones con paginación y filtro activos
router.get("/", cuponesController.getCupones);

// GET /api/cupones/:id - Obtener un cupón por ID
router.get("/:id",cuponesController.getCupon);

// POST /api/cupones - Crear un nuevo cupón
router.post("/", cuponesController.createCupon);

// PUT /api/cupones/:id - Actualizar un cupón
router.put("/:id", cuponesController.updateCupon);

// DELETE /api/cupones/:id - Desactivar un cupón (soft delete)
router.delete("/:id",cuponesController.deleteCupon);

module.exports = router;
