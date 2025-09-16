const express = require("express");
const router = express.Router();

const varianteController = require("../controllers/variantes.controller");


// GET /api/variantes - Obtener todas las variantes
router.get("/", varianteController.getVariantes);

// GET /api/variantes/:id - Obtener una variante por ID
router.get("/:id", varianteController.getVariante);

// POST /api/variantes - Crear una nueva variante
router.post("/", varianteController.createVariante);

// PUT /api/variantes/:id - Actualizar una variante
router.put("/:id", varianteController.updateVariante);

// DELETE /api/variantes/:id - Eliminar una variante
router.delete("/:id", varianteController.deleteVariante);

module.exports = router;
