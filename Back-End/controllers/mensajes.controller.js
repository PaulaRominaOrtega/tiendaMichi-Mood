const { Mensaje, Producto } = require("../models/index.model");
const { validationResult } = require('express-validator');

// Obtener todos los mensajes
const getMensajes = async (req, res) => {
    try {
        console.log("GET /mensajes v1");

        const { page = 1, limit = 10, productoId } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {};
        if (productoId) {
            whereClause.productoId = productoId;
        }

        const mensajes = await Mensaje.findAndCountAll({
            where: whereClause,
            include: [{
                model: Producto,
                as: 'producto',
                attributes: ['id', 'nombre'] 
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['id', 'DESC']]
        });

        res.json({
            success: true,
            data: mensajes.rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(mensajes.count / limit),
                totalItems: mensajes.count,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (err) {
        console.error("Error en getMensajes:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudieron obtener los mensajes"
        });
    }
};

// Obtener un mensaje por ID
const getMensaje = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("GET /mensajes/:id v1", { id });

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: "ID de mensaje inválido"
            });
        }

        const mensaje = await Mensaje.findByPk(id, {
            include: [{
                model: Producto,
                as: 'producto',
                attributes: ['id', 'nombre']
            }]
        });

        if (!mensaje) {
            return res.status(404).json({
                success: false,
                error: "Mensaje no encontrado"
            });
        }

        res.json({
            success: true,
            data: mensaje
        });
    } catch (err) {
        console.error("Error en getMensaje:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo obtener el mensaje"
        });
    }
};

// Crear un nuevo mensaje
const createMensaje = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: "Datos de entrada inválidos",
                details: errors.array()
            });
        }

        const { texto, productoId } = req.body;

        const nuevoMensaje = await Mensaje.create({
            texto,
            productoId
        });

        res.status(201).json({
            success: true,
            data: nuevoMensaje,
            message: "Mensaje creado exitosamente"
        });
    } catch (err) {
        console.error("Error en createMensaje:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo crear el mensaje"
        });
    }
};

// Actualizar un mensaje
const updateMensaje = async (req, res) => {
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

        const mensaje = await Mensaje.findByPk(id);
        if (!mensaje) {
            return res.status(404).json({
                success: false,
                error: "Mensaje no encontrado"
            });
        }

        await mensaje.update(req.body);

        res.json({
            success: true,
            data: mensaje,
            message: "Mensaje actualizado exitosamente"
        });
    } catch (err) {
        console.error("Error en updateMensaje:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo actualizar el mensaje"
        });
    }
};

// Eliminar un mensaje
const deleteMensaje = async (req, res) => {
    try {
        const { id } = req.params;

        const mensaje = await Mensaje.findByPk(id);
        if (!mensaje) {
            return res.status(404).json({
                success: false,
                error: "Mensaje no encontrado"
            });
        }

        await mensaje.destroy();

        res.json({
            success: true,
            message: "Mensaje eliminado exitosamente"
        });
    } catch (err) {
        console.error("Error en deleteMensaje:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo eliminar el mensaje"
        });
    }
};

module.exports = {
    getMensajes,
    getMensaje,
    createMensaje,
    updateMensaje,
    deleteMensaje
};