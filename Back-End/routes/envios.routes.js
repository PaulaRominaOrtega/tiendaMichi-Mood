const express = require("express");
const router = express.Router();

const enviosController = require("../controllers/envios.controller");


// GET /api/envios - Obtener todos los envíos (con paginación y filtro por estado)
router.get("/", enviosController.getEnvios);

// GET /api/envios/:id - Obtener un envío por ID
router.get("/:id", enviosController.getEnvio);

// POST /api/envios - Crear un nuevo envío
router.post("/",enviosController.createEnvio);

// PUT /api/envios/:id - Actualizar un envío
router.put("/:id", enviosController.updateEnvio);

// DELETE /api/envios/:id - Marcar un envío como inactivo (soft delete)
router.delete("/:id", enviosController.deleteEnvio);

module.exports = router;
