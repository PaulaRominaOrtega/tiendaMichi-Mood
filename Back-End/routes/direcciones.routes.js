const express = require("express");
const router = express.Router();

const direccionesController = require("../controllers/direcciones.controller");

// GET /api/direcciones - Obtener todas las direcciones (con paginación y filtro por idCliente)
router.get("/",direccionesController.getDirecciones);

// GET /api/direcciones/:id - Obtener una dirección por ID
router.get("/:id", direccionesController.getDireccion);

// POST /api/direcciones - Crear una nueva dirección
router.post("/", direccionesController.createDireccion);

// PUT /api/direcciones/:id - Actualizar una dirección
router.put("/:id", direccionesController.updateDireccion);

// DELETE /api/direcciones/:id - Eliminar una dirección (hard delete)
router.delete("/:id", direccionesController.deleteDireccion);

module.exports = router;
