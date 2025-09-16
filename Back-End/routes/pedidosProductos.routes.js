const express = require("express");
const router = express.Router();

const pedidosProductosController = require("../controllers/pedidosProductos.controller");

// GET /api/pedidos-productos - Obtener todos los pedidos-productos
router.get("/",  pedidosProductosController.getPedidosProductos);

// GET /api/pedidos-productos/:id - Obtener un pedido-producto por ID
router.get("/:id", pedidosProductosController.getPedidoProductoById);

// POST /api/pedidos-productos - Crear un nuevo pedido-producto
router.post("/",pedidosProductosController.createPedidoProducto);

// PUT /api/pedidos-productos/:id - Actualizar un pedido-producto
router.put("/:id", pedidosProductosController.updatePedidoProducto);

// DELETE /api/pedidos-productos/:id - Eliminar un pedido-producto
router.delete("/:id", pedidosProductosController.deletePedidoProducto);

module.exports = router;
