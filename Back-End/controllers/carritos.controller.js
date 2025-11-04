const { Carrito } = require("../models/index.model");
const { validationResult } = require("express-validator");

// Obtener todos los carritos con paginación
const getCarritos = async (req, res) => {
  try {
    console.log("GET /carritos ");

    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const registros = await Carrito.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["fecha", "DESC"]],
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
    console.error("Error en getCarritos:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudieron obtener los carritos",
    });
  }
};

// Obtener un carrito por ID
const getCarritoById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("GET /carritos/:id ", { id });

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "ID inválido",
      });
    }

    const registro = await Carrito.findByPk(id);

    if (!registro) {
      return res.status(404).json({
        success: false,
        error: "Carrito no encontrado",
      });
    }

    res.json({
      success: true,
      data: registro,
    });
  } catch (err) {
    console.error("Error en getCarrito:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo obtener el carrito",
    });
  }
};

// Crear un nuevo carrito
const createCarrito = async (req, res) => {
  try {
    console.log("POST /carritos ");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Datos inválidos",
        details: errors.array(),
      });
    }

    const { idCliente, fecha } = req.body;

    const nuevoCarrito = await Carrito.create({
      idCliente,
      fecha,
    });

    res.status(201).json({
      success: true,
      data: nuevoCarrito,
      message: "Carrito creado exitosamente",
    });
  } catch (err) {
    console.error("Error en createCarrito:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo crear el carrito",
    });
  }
};

// Actualizar un carrito
const updateCarrito = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("PUT /carritos/:id ", { id });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Datos inválidos",
        details: errors.array(),
      });
    }

    const registro = await Carrito.findByPk(id);
    if (!registro) {
      return res.status(404).json({
        success: false,
        error: "Carrito no encontrado",
      });
    }

    const { idCliente, fecha } = req.body;

    await registro.update({
      idCliente,
      fecha,
    });

    res.json({
      success: true,
      data: registro,
      message: "Carrito actualizado exitosamente",
    });
  } catch (err) {
    console.error("Error en updateCarrito:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo actualizar el carrito",
    });
  }
};

// Eliminar un carrito (hard delete)
const deleteCarrito = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("DELETE /carritos/:id ", { id });

    const registro = await Carrito.findByPk(id);
    if (!registro) {
      return res.status(404).json({
        success: false,
        error: "Carrito no encontrado",
      });
    }

    await registro.destroy();

    res.json({
      success: true,
      message: "Carrito eliminado exitosamente",
    });
  } catch (err) {
    console.error("Error en deleteCarrito:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo eliminar el carrito",
    });
  }
};

module.exports = {
  getCarritos,
  getCarritoById,
  createCarrito,
  updateCarrito,
  deleteCarrito,
};