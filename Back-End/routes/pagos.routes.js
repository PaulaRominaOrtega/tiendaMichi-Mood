const express = require("express");
const router = express.Router();

const pagosController = require("../controllers/pagos.controller");


// GET /api/pagos - Obtener todos los pagos
router.get("/",pagosController.getPagos);

// GET /api/pagos/:id - Obtener un pago por ID
router.get("/:id",pagosController.getPago);

// POST /api/pagos - Crear un nuevo pago
router.post("/",pagosController.createPago);

// PUT /api/pagos/:id - Actualizar un pago
router.put("/:id", pagosController.updatePago);

// DELETE /api/pagos/:id - Eliminar un pago-soft delete
router.delete("/:id", pagosController.deletePago);

module.exports = router;
