const express = require("express");
const router = express.Router();

const mensajesController = require("../controllers/mensajes.controller");


// GET /api/mensajes - Obtener todos los mensajes (con paginación y filtro por productoId)
router.get("/", mensajesController.getMensajes);

// GET /api/mensajes/:id - Obtener un mensaje por ID
router.get("/:id", mensajesController.getMensaje);

// POST /api/mensajes - Crear un nuevo mensaje
router.post("/",  mensajesController.createMensaje);

// PUT /api/mensajes/:id - Actualizar un mensaje
router.put("/:id", mensajesController.updateMensaje);

// DELETE /api/mensajes/:id - Eliminar un mensaje
router.delete("/:id", mensajesController.deleteMensaje);

module.exports = router;
