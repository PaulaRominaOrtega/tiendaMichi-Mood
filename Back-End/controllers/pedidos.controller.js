const { Pedido, Cliente, PedidoProducto, Producto } = require("../models/index.model");
const { validationResult } = require('express-validator');

// Obtener todos los pedidos
const getPedidos = async (req, res) => {
    try {
        console.log("GET /pedidos");

        const { page = 1, limit = 10, estado } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {};
        if (estado === 'true' || estado === 'false') {
            whereClause.estado = estado === 'true';
        }

        const pedidos = await Pedido.findAndCountAll({
            where: whereClause,
            include: [{
                model: Cliente,
                as: 'cliente',
                attributes: ['id', 'nombre', 'email']
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['id', 'DESC']]
        });

        res.json({
            success: true,
            data: pedidos.rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(pedidos.count / limit),
                totalItems: pedidos.count,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (err) {
        console.error("Error en getPedidos:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudieron obtener los pedidos"
        });
    }
};

// Obtener un pedido por ID
const getPedido = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("GET /pedidos/:id", { id });

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: "ID de pedido inválido"
            });
        }

        const pedido = await Pedido.findByPk(id, {
            include: [
                {
                    model: Cliente,
                    as: 'cliente',
                    attributes: ['id', 'nombre', 'email', 'telefono']
                },
                {
                    model: PedidoProducto,
                    as: 'detalles',
                    include: [{
                        model: Producto,
                        as: 'producto',
                        attributes: ['id', 'nombre', 'precio', 'descripcion', 'stock']
                    }]
                }
            ]
        });

        if (!pedido) {
            return res.status(404).json({
                success: false,
                error: "Pedido no encontrado"
            });
        }

        res.json({
            success: true,
            data: pedido
        });
    } catch (err) {
        console.error("Error en getPedido:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo obtener el pedido"
        });
    }
};

// Crear un nuevo pedido
const createPedido = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: "Datos de entrada inválidos",
                details: errors.array()
            });
        }

        const { fecha, total, estado, idCliente } = req.body;

        const nuevoPedido = await Pedido.create({
            fecha,
            total,
            estado,
            idCliente
        });

        res.status(201).json({
            success: true,
            data: nuevoPedido,
            message: "Pedido creado exitosamente"
        });
    } catch (err) {
        console.error("Error en createPedido:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo crear el pedido"
        });
    }
};

// Actualizar un pedido
const updatePedido = async (req, res) => {
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

        const pedido = await Pedido.findByPk(id);
        if (!pedido) {
            return res.status(404).json({
                success: false,
                error: "Pedido no encontrado"
            });
        }

        await pedido.update(req.body);

        res.json({
            success: true,
            data: pedido,
            message: "Pedido actualizado exitosamente"
        });
    } catch (err) {
        console.error("Error en updatePedido:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo actualizar el pedido"
        });
    }
};

// Eliminar un pedido-soft delete
const deletePedido = async (req, res) => {
    try {
        const { id } = req.params;

        const pedido = await Pedido.findByPk(id);
        if (!pedido) {
            return res.status(404).json({
                success: false,
                error: "Pedido no encontrado"
            });
        }

        await pedido.update({ estado: false });

        res.json({
            success: true,
            message: "Pedido eliminado exitosamente"
        });
    } catch (err) {
        console.error("Error en deletePedido:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo eliminar el pedido"
        });
    }
};

module.exports = {
    getPedidos,
    getPedido,
    createPedido,
    updatePedido,
    deletePedido
};