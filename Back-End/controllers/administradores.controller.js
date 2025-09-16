const { Administrador } = require("../models/index.model");
const { validationResult } = require("express-validator");

// Obtener todos los administradores
const getAdministradores = async (req, res) => {
    try {
        console.log("GET /administradores");

        const { page = 1, limit = 10, activa = true } = req.query;
        const offset = (page - 1) * limit;

        const administradores = await Administrador.findAndCountAll({
            where: { activa },
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [["id", "ASC"]],
        });

        res.json({
            success: true,
            data: administradores.rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(administradores.count / limit),
                totalItems: administradores.count,
                itemsPerPage: parseInt(limit),
            },
        });
    } catch (err) {
        console.error("Error en getAdministradores:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudieron obtener los administradores",
        });
    }
};

// Obtener un administrador por ID
const getAdministrador = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("GET /administradores/:id ", { id });

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: "ID de administrador inválido",
            });
        }

        const administrador = await Administrador.findByPk(id);

        if (!administrador) {
            return res.status(404).json({
                success: false,
                error: "Administrador no encontrado",
            });
        }

        res.json({
            success: true,
            data: administrador,
        });
    } catch (err) {
        console.error("Error en getAdministrador:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo obtener el administrador",
        });
    }
};

// Crear un nuevo administrador
const createAdministrador = async (req, res) => {
    try {
        // Verificar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: "Datos de entrada inválidos",
                details: errors.array(),
            });
        }

        const { usuario, contrasena, email } = req.body;

        const nuevoAdministrador = await Administrador.create({
            usuario,
            contrasena,
            email,
        });

        res.status(201).json({
            success: true,
            data: nuevoAdministrador,
            message: "Administrador creado exitosamente",
        });
    } catch (err) {
        console.error("Error en createAdministrador:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo crear el administrador",
        });
    }
};

// Actualizar un administrador
const updateAdministrador = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: "Datos de entrada inválidos",
                details: errors.array(),
            });
        }

        const administrador = await Administrador.findByPk(id);
        if (!administrador) {
            return res.status(404).json({
                success: false,
                error: "Administrador no encontrado",
            });
        }

        await administrador.update(req.body);

        res.json({
            success: true,
            data: administrador,
            message: "Administrador actualizado exitosamente",
        });
    } catch (err) {
        console.error("Error en updateAdministrador:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo actualizar el administrador",
        });
    }
};

// Eliminar un administrador (soft delete)
const deleteAdministrador = async (req, res) => {
    try {
        const { id } = req.params;

        const administrador = await Administrador.findByPk(id);
        if (!administrador) {
            return res.status(404).json({
                success: false,
                error: "Administrador no encontrado",
            });
        }

        await administrador.update({ activa: false });

        res.json({
            success: true,
            message: "Administrador eliminado exitosamente",
        });
    } catch (err) {
        console.error("Error en deleteAdministrador:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo eliminar el administrador",
        });
    }
};

module.exports = {
    getAdministradores,
    getAdministrador,
    createAdministrador,
    updateAdministrador,
    deleteAdministrador,
};