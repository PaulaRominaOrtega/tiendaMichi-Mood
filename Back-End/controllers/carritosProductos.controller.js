// controllers/carritosProductos.controller.js
const { CarritoProducto } = require("../models/index.model");
const { validationResult } = require("express-validator");

// Obtener todos los registros de carritos-productos
const getCarritosProductos = async (req, res) => {
  try {
    console.log("GET /carritos-productos ");

    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const registros = await CarritoProducto.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
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
    console.error("Error en getCarritosProductos:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudieron obtener los carritos-productos",
    });
  }
};

// Obtener un registro por ID
const getCarritoProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("GET /carritos-productos/:id ", { id });

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "ID inválido",
      });
    }

    const registro = await CarritoProducto.findByPk(id);

    if (!registro) {
      return res.status(404).json({
        success: false,
        error: "Carrito-producto no encontrado",
      });
    }

    res.json({
      success: true,
      data: registro,
    });
  } catch (err) {
    console.error("Error en getCarritoProducto:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo obtener el carrito-producto",
    });
  }
};

// Crear nuevo registro
const createCarritoProducto = async (req, res) => {
  try {
    console.log("POST /carritos-productos ");

    // Validaciones
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Datos inválidos",
        details: errors.array(),
      });
    }

    const { cantidad, idProducto, idCarrito } = req.body;

    const nuevoRegistro = await CarritoProducto.create({
      cantidad,
      idProducto,
      idCarrito,
    });

    res.status(201).json({
      success: true,
      data: nuevoRegistro,
      message: "Carrito-producto creado exitosamente",
    });
  } catch (err) {
    console.error("Error en createCarritoProducto:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo crear el carrito-producto",
    });
  }
};

// Actualizar registro
const updateCarritoProducto = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("PUT /carritos-productos/:id ", { id });

    // Validaciones
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Datos inválidos",
        details: errors.array(),
      });
    }

    const registro = await CarritoProductoModel.findByPk(id);
    if (!registro) {
      return res.status(404).json({
        success: false,
        error: "Carrito-producto no encontrado",
      });
    }

    const { cantidad, idProducto, idCarrito } = req.body;

    await registro.update({
      cantidad,
      idProducto,
      idCarrito,
    });

    res.json({
      success: true,
      data: registro,
      message: "Carrito-producto actualizado exitosamente",
    });
  } catch (err) {
    console.error("Error en updateCarritoProducto:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo actualizar el carrito-producto",
    });
  }
};

// Eliminar registro (soft delete o hard delete)
const deleteCarritoProducto = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("DELETE /carritos-productos/:id ", { id });

    const registro = await CarritoProductoModel.findByPk(id);
    if (!registro) {
      return res.status(404).json({
        success: false,
        error: "Carrito-producto no encontrado",
      });
    }

    // Soft delete:
    // await registro.update({ activo: false });

    // Hard delete:
    await registro.destroy();

    res.json({
      success: true,
      message: "Carrito-producto eliminado exitosamente",
    });
  } catch (err) {
    console.error("Error en deleteCarritoProducto:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo eliminar el carrito-producto",
    });
  }
};

module.exports = {
  getCarritosProductos,
  getCarritoProductoById,
  createCarritoProducto,
  updateCarritoProducto,
  deleteCarritoProducto,
};