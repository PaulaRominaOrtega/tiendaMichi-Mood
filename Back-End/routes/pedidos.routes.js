const express = require("express");
const router = express.Router();

const pedidosController = require("../controllers/pedidos.controller");

// GET /api/pedidos - Obtener todos los pedidos
router.get("/", pedidosController.getPedidos);

// GET /api/pedidos/:id - Obtener un pedido por ID
router.get("/:id", pedidosController.getPedido);

// POST /api/pedidos - Crear un nuevo pedido
router.post("/", pedidosController.createPedido);

// PUT /api/pedidos/:id - Actualizar un pedido
router.put("/:id", pedidosController.updatePedido);

// DELETE /api/pedidos/:id - Eliminar un pedido-soft delete
router.delete("/:id", pedidosController.deletePedido);

module.exports = router;
