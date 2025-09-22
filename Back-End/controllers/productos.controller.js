const { Producto, Categoria, Administrador } = require("../models/index.model");
const { validationResult } = require("express-validator");

// Obtener todos los productos
const getProductos = async (req, res) => {
  try {
    const { page = 1, limit = 10, idCategoria, oferta = undefined } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { activo: true };
    if (idCategoria) whereClause.idCategoria = idCategoria;
    if (oferta !== undefined) whereClause.oferta = oferta === "true";

    const productos = await Producto.findAndCountAll({
      where: whereClause,
      include: [
        { model: Categoria, as: "categoria", attributes: ["id", "nombre"] },
        { model: Administrador, as: "administrador", attributes: ["id", "usuario", "email"] },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["id", "DESC"]],
    });

    res.json({
      success: true,
      data: productos.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(productos.count / limit),
        totalItems: productos.count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (err) {
    console.error("Error en getProductos:", err.message);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudieron obtener los productos",
    });
  }
};

// Obtener un producto por ID
const getProducto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "ID de producto inválido",
      });
    }

    const producto = await Producto.findOne({
      where: { id, activo: true },
      include: [
        { model: Categoria, as: "categoria", attributes: ["id", "nombre"] },
        { model: Administrador, as: "administrador", attributes: ["id", "usuario", "email"] },
      ],
    });

    if (!producto) {
      return res.status(404).json({
        success: false,
        error: "Producto no encontrado",
      });
    }

    res.json({
      success: true,
      data: producto,
    });
  } catch (err) {
    console.error("Error en getProducto:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo obtener el producto",
    });
  }
};

// Crear un nuevo producto
const createProducto = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Datos de entrada inválidos",
        details: errors.array(),
      });
    }

    const {
      nombre,
      precio,
      descripcion,
      stock,
      imagen,
      oferta,
      descuento,
      idAdministrador,
      idCategoria,
      material,
      capacidad,
      caracteristicas_especiales
    } = req.body;

    const nuevoProducto = await Producto.create({
      nombre,
      precio: parseFloat(precio),
      descripcion,
      stock: parseInt(stock, 10),
      imagen,
      oferta,
      descuento,
      idAdministrador,
      idCategoria,
      activo: true,
      // Se pasan los nuevos campos al modelo
      material,
      capacidad,
      caracteristicas_especiales
    });

    res.status(201).json({
      success: true,
      data: nuevoProducto,
      message: "Producto creado exitosamente",
    });
  } catch (err) {
    console.error("Error en createProducto:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo crear el producto",
      details: err.message,
    });
  }
};

// Actualizar un producto
const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "ID de producto inválido",
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Datos de entrada inválidos",
        details: errors.array(),
      });
    }

    const producto = await Producto.findByPk(id);
    if (!producto || !producto.activo) {
      return res.status(404).json({
        success: false,
        error: "Producto no encontrado",
      });
    }

    const datosActualizados = req.body;
    if (datosActualizados.precio) {
      datosActualizados.precio = parseFloat(datosActualizados.precio);
    }
    if (datosActualizados.stock) {
      datosActualizados.stock = parseInt(datosActualizados.stock, 10);
    }

    await producto.update(datosActualizados);

    res.json({
      success: true,
      data: producto,
      message: "Producto actualizado exitosamente",
    });
  } catch (err) {
    console.error("Error en updateProducto:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo actualizar el producto",
    });
  }
};

// Eliminar un producto (soft delete)
const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "ID de producto inválido",
      });
    }

    const producto = await Producto.findByPk(id);
    if (!producto || !producto.activo) {
      return res.status(404).json({
        success: false,
        error: "Producto no encontrado",
      });
    }

    await producto.update({ activo: false });

    res.json({
      success: true,
      message: "Producto eliminado exitosamente (soft delete)",
    });
  } catch (err) {
    console.error("Error en deleteProducto:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo eliminar el producto",
    });
  }
};

module.exports = {
  getProductos,
  getProducto,
  createProducto,
  updateProducto,
  deleteProducto,
};