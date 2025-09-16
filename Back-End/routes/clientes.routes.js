// src/routes/clientes.routes.js
const express = require("express");
const router = express.Router();

const clientesController = require("../controllers/clientes.controller");
const {
    validateClienteCreate,
    validateClienteUpdate,
    validateClienteId,
    validatePagination
} = require("../middleware/validation");

// GET /api/clientes - Obtener todos los clientes con paginación
router.get("/", validatePagination, clientesController.getClientes);

// GET /api/clientes/:id - Obtener un cliente por ID
router.get("/:id", validateClienteId, clientesController.getCliente);

// POST /api/clientes - Crear un nuevo cliente
router.post("/", validateClienteCreate, clientesController.createCliente); 

// PUT /api/clientes/:id - Actualizar un cliente
router.put("/:id", validateClienteId, validateClienteUpdate, clientesController.updateCliente);

// DELETE /api/clientes/:id - Eliminar un cliente (hard delete)
router.delete("/:id", validateClienteId, clientesController.deleteCliente);

module.exports = router;