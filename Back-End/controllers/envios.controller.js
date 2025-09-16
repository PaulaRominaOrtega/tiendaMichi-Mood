const { Envio } = require("../models/index.model");
const { Pedido } = require("../models/index.model");
const { validationResult } = require('express-validator');

// Obtener todos los envíos
const getEnvios = async (req, res) => {
    try {
        console.log("GET /envios v1");

        const { page = 1, limit = 10, estado } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {};
        if (estado !== undefined) {
            whereClause.estado = estado === 'true';
        }

        const envios = await Envio.findAndCountAll({
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
            data: envios.rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(envios.count / limit),
                totalItems: envios.count,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (err) {
        console.error("Error en getEnvios:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudieron obtener los envíos"
        });
    }
};

// Obtener un envío por ID
const getEnvio = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("GET /envios/:id v1", { id });

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: "ID de envío inválido"
            });
        }

        const envio = await Envio.findByPk(id, {
            include: [{
                model: Pedido,
                as: 'pedido',
                attributes: ['id', 'cliente', 'total'] 
            }]
        });

        if (!envio) {
            return res.status(404).json({
                success: false,
                error: "Envío no encontrado"
            });
        }

        res.json({
            success: true,
            data: envio
        });
    } catch (err) {
        console.error("Error en getEnvio:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo obtener el envío"
        });
    }
};

// Crear un nuevo envío
const createEnvio = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: "Datos de entrada inválidos",
                details: errors.array()
            });
        }

        const { costo, estado, idPedido } = req.body;

        const nuevoEnvio = await Envio.create({
            costo,
            estado,
            idPedido
        });

        res.status(201).json({
            success: true,
            data: nuevoEnvio,
            message: "Envío creado exitosamente"
        });
    } catch (err) {
        console.error("Error en createEnvio:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo crear el envío"
        });
    }
};

// Actualizar un envío
const updateEnvio = async (req, res) => {
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

        const envio = await Envio.findByPk(id);
        if (!envio) {
            return res.status(404).json({
                success: false,
                error: "Envío no encontrado"
            });
        }

        await envio.update(req.body);

        res.json({
            success: true,
            data: envio,
            message: "Envío actualizado exitosamente"
        });
    } catch (err) {
        console.error("Error en updateEnvio:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo actualizar el envío"
        });
    }
};

// Eliminar un envío (soft delete)
const deleteEnvio = async (req, res) => {
    try {
        const { id } = req.params;

        const envio = await Envio.findByPk(id);
        if (!envio) {
            return res.status(404).json({
                success: false,
                error: "Envío no encontrado"
            });
        }

        await envio.update({ estado: false });

        res.json({
            success: true,
            message: "Envío eliminado exitosamente"
        });
    } catch (err) {
        console.error("Error en deleteEnvio:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo eliminar el envío"
        });
    }
};

module.exports = {
    getEnvios,
    getEnvio,
    createEnvio,
    updateEnvio,
    deleteEnvio
};