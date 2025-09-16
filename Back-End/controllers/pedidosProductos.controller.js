const { PedidoProducto, Pedido, Producto } = require("../models/index.model");
const { validationResult } = require('express-validator');

// Obtener todos los pedidos-productos
const getPedidosProductos = async (req, res) => {
    try {
        console.log("GET /pedidos-productos ");

        const { page = 1, limit = 10, idPedido, idProducto } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {};
        if (idPedido) whereClause.idPedido = idPedido;
        if (idProducto) whereClause.idProducto = idProducto;

        const pedidosProductos = await PedidoProducto.findAndCountAll({
            where: whereClause,
            include: [
                { model: Pedido, as: 'pedido', attributes: ['id', 'fecha', 'total'] },
                { model: Producto, as: 'producto', attributes: ['id', 'nombre', 'precio'] }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['id', 'DESC']]
        });

        res.json({
            success: true,
            data: pedidosProductos.rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(pedidosProductos.count / limit),
                totalItems: pedidosProductos.count,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (err) {
        console.error("Error en getPedidosProductos:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudieron obtener los pedidos-productos"
        });
    }
};

// Obtener un pedido-producto por ID
const getPedidoProductoById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("GET /pedidos-productos/:id", { id });

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: "ID inválido"
            });
        }

        const pedidoProducto = await PedidoProducto.findByPk(id, {
            include: [
                { model: Pedido, as: 'pedido', attributes: ['id', 'fecha', 'total'] },
                { model: Producto, as: 'producto', attributes: ['id', 'nombre', 'precio'] }
            ]
        });

        if (!pedidoProducto) {
            return res.status(404).json({
                success: false,
                error: "Registro no encontrado"
            });
        }

        res.json({
            success: true,
            data: pedidoProducto
        });
    } catch (err) {
        console.error("Error en getPedidoProducto:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo obtener el registro"
        });
    }
};

// Crear un nuevo pedido-producto
const createPedidoProducto = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: "Datos de entrada inválidos",
                details: errors.array()
            });
        }

        const { cantidad, precio_unitario, idPedido, idProducto } = req.body;

        const nuevoPedidoProducto = await PedidoProducto.create({
            cantidad,
            precio_unitario,
            idPedido,
            idProducto
        });

        res.status(201).json({
            success: true,
            data: nuevoPedidoProducto,
            message: "Pedido-producto creado exitosamente"
        });
    } catch (err) {
        console.error("Error en createPedidoProducto:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo crear el registro"
        });
    }
};

// Actualizar un pedido-producto
const updatePedidoProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: "Datos de entrada inválidos",
                details: errors.array()
            });
        }

        const pedidoProducto = await PedidoProducto.findByPk(id);
        if (!pedidoProducto) {
            return res.status(404).json({
                success: false,
                error: "Registro no encontrado"
            });
        }

        await pedidoProducto.update(req.body);

        res.json({
            success: true,
            data: pedidoProducto,
            message: "Pedido-producto actualizado exitosamente"
        });
    } catch (err) {
        console.error("Error en updatePedidoProducto:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo actualizar el registro"
        });
    }
};

// Eliminar un pedido-producto
const deletePedidoProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const pedidoProducto = await PedidoProducto.findByPk(id);
        if (!pedidoProducto) {
            return res.status(404).json({
                success: false,
                error: "Registro no encontrado"
            });
        }

        await pedidoProducto.destroy();

        res.json({
            success: true,
            message: "Pedido-producto eliminado exitosamente"
        });
    } catch (err) {
        console.error("Error en deletePedidoProducto:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo eliminar el registro"
        });
    }
};

module.exports = {
    getPedidosProductos,
    getPedidoProductoById,
    createPedidoProducto,
    updatePedidoProducto,
    deletePedidoProducto
};
