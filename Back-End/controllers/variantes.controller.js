const { Variante, Producto } = require("../models/index.model");
const { validationResult } = require('express-validator');

// Obtener todas las variantes
const getVariantes = async (req, res) => {
    try {
        console.log("GET /variantes");

        const { page = 1, limit = 10, productoId } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {};
        if (productoId) whereClause.productoId = productoId;

        const variantes = await Variante.findAndCountAll({
            where: whereClause,
            include: [
                { model: Producto, as: 'producto', attributes: ['id', 'nombre', 'precio'] }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['id', 'DESC']]
        });

        res.json({
            success: true,
            data: variantes.rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(variantes.count / limit),
                totalItems: variantes.count,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (err) {
        console.error("Error en getVariantes:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudieron obtener las variantes"
        });
    }
};

// Obtener una variante por ID
const getVariante = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("GET /variantes/:id ", { id });

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: "ID de variante inválido"
            });
        }

        const variante = await Variante.findByPk(id, {
            include: [
                { model: Producto, as: 'producto', attributes: ['id', 'nombre', 'precio'] }
            ]
        });

        if (!variante) {
            return res.status(404).json({
                success: false,
                error: "Variante no encontrada"
            });
        }

        res.json({
            success: true,
            data: variante
        });
    } catch (err) {
        console.error("Error en getVariante:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo obtener la variante"
        });
    }
};

// Crear una nueva variante
const createVariante = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: "Datos de entrada inválidos",
                details: errors.array()
            });
        }

        const { nombre, precio, stock, productoId } = req.body;

        const nuevaVariante = await Variante.create({
            nombre,
            precio,
            stock,
            productoId
        });

        res.status(201).json({
            success: true,
            data: nuevaVariante,
            message: "Variante creada exitosamente"
        });
    } catch (err) {
        console.error("Error en createVariante:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo crear la variante"
        });
    }
};

// Actualizar una variante
const updateVariante = async (req, res) => {
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

        const variante = await Variante.findByPk(id);
        if (!variante) {
            return res.status(404).json({
                success: false,
                error: "Variante no encontrada"
            });
        }

        await variante.update(req.body);

        res.json({
            success: true,
            data: variante,
            message: "Variante actualizada exitosamente"
        });
    } catch (err) {
        console.error("Error en updateVariante:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo actualizar la variante"
        });
    }
};

// Eliminar una variante
const deleteVariante = async (req, res) => {
    try {
        const { id } = req.params;

        const variante = await Variante.findByPk(id);
        if (!variante) {
            return res.status(404).json({
                success: false,
                error: "Variante no encontrada"
            });
        }

        await variante.destroy();

        res.json({
            success: true,
            message: "Variante eliminada exitosamente"
        });
    } catch (err) {
        console.error("Error en deleteVariante:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo eliminar la variante"
        });
    }
};

module.exports = {
    getVariantes,
    getVariante,
    createVariante,
    updateVariante,
    deleteVariante
};