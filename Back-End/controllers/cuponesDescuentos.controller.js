// controllers/cuponesDescuentos.controller.js
const { CuponDescuento } = require("../models/index.model");
const { validationResult } = require("express-validator");

// Obtener todos los cupones con paginación
const getCupones = async (req, res) => {
  try {
    console.log("GET /cupones ");

    const { page = 1, limit = 10, activos } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (activos !== undefined) {
      where.activo = activos === "true"; 
    }

    const registros = await CuponDescuento.findAndCountAll({
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
    console.error("Error en getCupones:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudieron obtener los cupones",
    });
  }
};

// Obtener un cupón por ID
const getCupon = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("GET /cupones/:id ", { id });

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "ID inválido",
      });
    }

    const registro = await CuponDescuento.findByPk(id);

    if (!registro) {
      return res.status(404).json({
        success: false,
        error: "Cupón no encontrado",
      });
    }

    res.json({
      success: true,
      data: registro,
    });
  } catch (err) {
    console.error("Error en getCupon:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo obtener el cupón",
    });
  }
};

// Crear un nuevo cupón
const createCupon = async (req, res) => {
  try {
    console.log("POST /cupones ");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Datos inválidos",
        details: errors.array(),
      });
    }

    const { nombreCupon, codigoCupon, porcentajeDescuento, activo } = req.body;

    const nuevoCupon = await CuponDescuento.create({
      nombreCupon,
      codigoCupon,
      porcentajeDescuento,
      activo,
    });

    res.status(201).json({
      success: true,
      data: nuevoCupon,
      message: "Cupón creado exitosamente",
    });
  } catch (err) {
    console.error("Error en createCupon:", err);

    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        success: false,
        error: "El código de cupón ya existe",
      });
    }

    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo crear el cupón",
    });
  }
};

// Actualizar un cupón
const updateCupon = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("PUT /cupones/:id ", { id });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Datos inválidos",
        details: errors.array(),
      });
    }

    const registro = await CuponDescuento.findByPk(id);
    if (!registro) {
      return res.status(404).json({
        success: false,
        error: "Cupón no encontrado",
      });
    }

    const { nombreCupon, codigoCupon, porcentajeDescuento, activo } = req.body;

    await registro.update({
      nombreCupon,
      codigoCupon,
      porcentajeDescuento,
      activo,
    });

    res.json({
      success: true,
      data: registro,
      message: "Cupón actualizado exitosamente",
    });
  } catch (err) {
    console.error("Error en updateCupon:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo actualizar el cupón",
    });
  }
};

// Eliminar un cupón 
const deleteCupon = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("DELETE /cupones/:id ", { id });

    const registro = await CuponDescuento.findByPk(id);
    if (!registro) {
      return res.status(404).json({
        success: false,
        error: "Cupón no encontrado",
      });
    }


    await registro.update({ activo: false });

    res.json({
      success: true,
      message: "Cupón desactivado exitosamente",
    });
  } catch (err) {
    console.error("Error en deleteCupon:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo eliminar el cupón",
    });
  }
};

module.exports = {
  getCupones,
  getCupon,
  createCupon,
  updateCupon,
  deleteCupon,
};