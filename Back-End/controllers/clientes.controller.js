const { Cliente } = require("../models/index.model");
const { validationResult } = require("express-validator");

// Obtener todos los clientes con paginación
const getClientes = async (req, res) => {
  try {
    console.log("GET /clientes ");

    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const registros = await Cliente.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["nombre", "ASC"]],
    });

    res.json({
      success: true,
      data: registros.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(registros.count / limit),
        totalItems: registros.count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (err) {
    console.error("Error en getClientes:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudieron obtener los clientes",
    });
  }
};

// Obtener un cliente por ID
const getCliente = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("GET /clientes/:id ", { id });

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "ID inválido",
      });
    }

    const registro = await Cliente.findByPk(id);

    if (!registro) {
      return res.status(404).json({
        success: false,
        error: "Cliente no encontrado",
      });
    }

    res.json({
      success: true,
      data: registro,
    });
  } catch (err) {
    console.error("Error en getCliente:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo obtener el cliente",
    });
  }
};

// Crear un nuevo cliente
const createCliente = async (req, res) => {
  try {
    console.log("POST /clientes ");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Datos inválidos",
        details: errors.array(),
      });
    }

    const { nombre, telefono, email, contrasena } = req.body;

    const nuevoCliente = await Cliente.create({
      nombre,
      telefono,
      email,
      contrasena,
    });

    res.status(201).json({
      success: true,
      data: nuevoCliente,
      message: "Cliente creado exitosamente",
    });
  } catch (err) {
    console.error("Error en createCliente:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo crear el cliente",
    });
  }
};

// Actualizar un cliente
const updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("PUT /clientes/:id ", { id });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Datos inválidos",
        details: errors.array(),
      });
    }

    const registro = await Cliente.findByPk(id);
    if (!registro) {
      return res.status(404).json({
        success: false,
        error: "Cliente no encontrado",
      });
    }

    const { nombre, telefono, email, contrasena } = req.body;

    await registro.update({
      nombre,
      telefono,
      email,
      contrasena,
    });

    res.json({
      success: true,
      data: registro,
      message: "Cliente actualizado exitosamente",
    });
  } catch (err) {
    console.error("Error en updateCliente:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo actualizar el cliente",
    });
  }
};

// Eliminar un cliente (hard delete)
const deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("DELETE /clientes/:id ", { id });

    const registro = await Cliente.findByPk(id);
    if (!registro) {
      return res.status(404).json({
        success: false,
        error: "Cliente no encontrado",
      });
    }

    await registro.destroy();

    res.json({
      success: true,
      message: "Cliente eliminado exitosamente",
    });
  } catch (err) {
    console.error("Error en deleteCliente:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo eliminar el cliente",
    });
  }
};

module.exports = {
  getClientes,
  getCliente,
  createCliente,
  updateCliente,
  deleteCliente,
};