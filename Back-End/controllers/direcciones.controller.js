// controllers/direcciones.controller.js
const { Direccion } = require("../models/index.model");
const { validationResult } = require("express-validator");

// Obtener todas las direcciones con paginación
const getDirecciones = async (req, res) => {
  try {
    console.log("GET /direcciones ");

    const { page = 1, limit = 10, idCliente } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (idCliente) {
      where.idCliente = idCliente;
    }

    const registros = await Direccion.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["id", "DESC"]],
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
    console.error("Error en getDirecciones:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudieron obtener las direcciones",
    });
  }
};

// Obtener una dirección por ID
const getDireccion = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("GET /direcciones/:id ", { id });

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "ID inválido",
      });
    }

    const registro = await Direccion.findByPk(id);

    if (!registro) {
      return res.status(404).json({
        success: false,
        error: "Dirección no encontrada",
      });
    }

    res.json({
      success: true,
      data: registro,
    });
  } catch (err) {
    console.error("Error en getDireccion:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo obtener la dirección",
    });
  }
};

// Crear una nueva dirección
const createDireccion = async (req, res) => {
  try {
    console.log("POST /direcciones ");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Datos inválidos",
        details: errors.array(),
      });
    }

    const { calle, numeracion, ciudad, provincia, codigo_postal, idCliente } = req.body;

    const nuevaDireccion = await Direccion.create({
      calle,
      numeracion,
      ciudad,
      provincia,
      codigo_postal,
      idCliente,
    });

    res.status(201).json({
      success: true,
      data: nuevaDireccion,
      message: "Dirección creada exitosamente",
    });
  } catch (err) {
    console.error("Error en createDireccion:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo crear la dirección",
    });
  }
};

// Actualizar una dirección
const updateDireccion = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("PUT /direcciones/:id ", { id });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Datos inválidos",
        details: errors.array(),
      });
    }

    const registro = await Direccion.findByPk(id);
    if (!registro) {
      return res.status(404).json({
        success: false,
        error: "Dirección no encontrada",
      });
    }

    const { calle, numeracion, ciudad, provincia, codigo_postal, idCliente } = req.body;

    await registro.update({
      calle,
      numeracion,
      ciudad,
      provincia,
      codigo_postal,
      idCliente,
    });

    res.json({
      success: true,
      data: registro,
      message: "Dirección actualizada exitosamente",
    });
  } catch (err) {
    console.error("Error en updateDireccion:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo actualizar la dirección",
    });
  }
};

// Eliminar una dirección-hard delete
const deleteDireccion = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("DELETE /direcciones/:id ", { id });

    const registro = await Direccion.findByPk(id);
    if (!registro) {
      return res.status(404).json({
        success: false,
        error: "Dirección no encontrada",
      });
    }

    await registro.destroy();

    res.json({
      success: true,
      message: "Dirección eliminada exitosamente",
    });
  } catch (err) {
    console.error("Error en deleteDireccion:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo eliminar la dirección",
    });
  }
};

module.exports = {
  getDirecciones,
  getDireccion,
  createDireccion,
  updateDireccion,
  deleteDireccion,
};