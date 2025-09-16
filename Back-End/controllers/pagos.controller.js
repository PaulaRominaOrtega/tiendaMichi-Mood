const { Pago, Pedido } = require("../models/index.model");
const { validationResult } = require('express-validator');

// Obtener todos los pagos
const getPagos = async (req, res) => {
    try {
        console.log("GET /pagos ");

        const { page = 1, limit = 10, estado } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {};
        if (estado !== undefined) {
            whereClause.estado = estado === 'true';
        }

        const pagos = await Pago.findAndCountAll({
            where: whereClause,
            include: [{
                model: Pedido,
                as: 'pedido',
                attributes: ['id', 'cliente', 'total'] 
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['id', 'DESC']]
        });

        res.json({
            success: true,
            data: pagos.rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(pagos.count / limit),
                totalItems: pagos.count,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (err) {
        console.error("Error en getPagos:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudieron obtener los pagos"
        });
    }
};

// Obtener un pago por ID
const getPago = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("GET /pagos/:id v1", { id });

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: "ID de pago inválido"
            });
        }

        const pago = await Pago.findByPk(id, {
            include: [{
                model: Pedido,
                as: 'pedido',
                attributes: ['id', 'cliente', 'total'] 
            }]
        });

        if (!pago) {
            return res.status(404).json({
                success: false,
                error: "Pago no encontrado"
            });
        }

        res.json({
            success: true,
            data: pago
        });
    } catch (err) {
        console.error("Error en getPago:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo obtener el pago"
        });
    }
};

// Crear un nuevo pago
const createPago = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: "Datos de entrada inválidos",
                details: errors.array()
            });
        }

        const { monto, estado, fecha, medio_pago, idPedido } = req.body;

        const nuevoPago = await Pago.create({
            monto,
            estado,
            fecha,
            medio_pago,
            idPedido
        });

        res.status(201).json({
            success: true,
            data: nuevoPago,
            message: "Pago creado exitosamente"
        });
    } catch (err) {
        console.error("Error en createPago:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo crear el pago"
        });
    }
};

// Actualizar un pago
const updatePago = async (req, res) => {
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

        const pago = await Pago.findByPk(id);
        if (!pago) {
            return res.status(404).json({
                success: false,
                error: "Pago no encontrado"
            });
        }

        await pago.update(req.body);

        res.json({
            success: true,
            data: pago,
            message: "Pago actualizado exitosamente"
        });
    } catch (err) {
        console.error("Error en updatePago:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo actualizar el pago"
        });
    }
};

// Eliminar un pago-soft delete
const deletePago = async (req, res) => {
    try {
        const { id } = req.params;

        const pago = await Pago.findByPk(id);
        if (!pago) {
            return res.status(404).json({
                success: false,
                error: "Pago no encontrado"
            });
        }

        await pago.update({ estado: false });

        res.json({
            success: true,
            message: "Pago eliminado exitosamente"
        });
    } catch (err) {
        console.error("Error en deletePago:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo eliminar el pago"
        });
    }
};

module.exports = {
    getPagos,
    getPago,
    createPago,
    updatePago,
    deletePago
};