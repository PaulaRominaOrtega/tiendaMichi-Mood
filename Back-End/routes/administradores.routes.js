const express = require("express");
const router = express.Router();
const administradoresController = require("../controllers/administradores.controller");

const {
  validatePagination,
  validateAdministradorCreate,
  validateAdministradorUpdate,
  validateAdministradorId
} = require("../middleware/validation");

// GET /api/administradores - Obtener todos los administradores
router.get("/", validatePagination, administradoresController.getAdministradores);

// GET /api/administradores/:id - Obtener un administrador por ID
router.get("/:id", validateAdministradorId, administradoresController.getAdministrador);

// POST /api/administradores - Crear un nuevo administrador
router.post("/", validateAdministradorCreate, administradoresController.createAdministrador);

// PUT /api/administradores/:id - Actualizar un administrador
router.put("/:id", validateAdministradorId, validateAdministradorUpdate, administradoresController.updateAdministrador);

// DELETE /api/administradores/:id - Eliminar un administrador (soft delete)
router.delete("/:id", validateAdministradorId, administradoresController.deleteAdministrador);

module.exports = router;

