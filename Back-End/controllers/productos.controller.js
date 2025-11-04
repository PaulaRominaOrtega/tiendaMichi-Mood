const { Producto, Categoria, Administrador } = require("../models/index.model");
const { validationResult } = require("express-validator");
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize'); 

const getUploadsPath = (filename) => {
  return path.join(__dirname, '../uploads', filename.trim());
};

const deleteProductImages = (imageString) => {
  if (imageString) {
    const imageNames = imageString.split(',');
    imageNames.forEach(imageName => {
      const imagePath = getUploadsPath(imageName);
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
        } catch (error) {
          console.error(`Error al eliminar el archivo ${imageName}:`, error);
        }
      }
    });
  }
};

// obtener productos
const getProductos = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      idCategoria, 
      oferta, 
      categoria,
      q, // búsqueda general
      precio, // ordena por precio 
    } = req.query; 

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    const whereClause = { activo: true };
    const orderClause = [];

    // filtro busqueda
    if (q) {
      whereClause[Op.or] = [
        { nombre: { [Op.like]: `%${q}%` } },
        { descripcion: { [Op.like]: `%${q}%` } },
      ];
    }

    //filtro categoria
    let categoriaIdFiltrada = idCategoria; 
    if (categoria) {
      const categoriaBuscada = await Categoria.findOne({ 
        where: { nombre: categoria, activa: true },
        attributes: ['id']
      });
      categoriaIdFiltrada = categoriaBuscada ? categoriaBuscada.id : 0;
    }

    if (categoriaIdFiltrada) {
      whereClause.idCategoria = categoriaIdFiltrada;
    }

    // filtro oferta
    if (oferta !== undefined) {
      whereClause.oferta = oferta === "true";
    }

    // orden
    if (precio === 'low') {
      orderClause.push(['precio', 'ASC']); 
    } else if (precio === 'high') {
      orderClause.push(['precio', 'DESC']); 
    }

    // Orden por ID
    orderClause.push(["id", "DESC"]); 

    const productos = await Producto.findAndCountAll({
      where: whereClause,
      include: [
        { model: Categoria, as: "categoria", attributes: ["id", "nombre"] },
        { model: Administrador, as: "administrador", attributes: ["id", "usuario", "email"] },
      ],
      limit: limitNumber,
      offset,
      order: orderClause,
    });

    res.json({
      success: true,
      data: productos.rows,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(productos.count / limitNumber),
        totalItems: productos.count,
        itemsPerPage: limitNumber,
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

const searchProductos = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.length < 2) {
      return res.json({ success: true, data: [] });
    }

    const productos = await Producto.findAll({
      where: {
        activo: true,
        [Op.or]: [
          { nombre: { [Op.like]: `%${q}%` } }, 
          { descripcion: { [Op.like]: `%${q}%` } },
        ]
      },
      attributes: ['id', 'nombre'], 
      limit: parseInt(limit, 10),
      order: [['nombre', 'ASC']],
    });

    res.json({ success: true, data: productos });
  } catch (err) {
    console.error("Error en searchProductos:", err.message);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo realizar la búsqueda rápida",
    });
  }
};

// obtener productos
const getProducto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, error: "ID de producto inválido" });
    }

    const producto = await Producto.findOne({
      where: { id, activo: true },
      include: [
        { model: Categoria, as: "categoria", attributes: ["id", "nombre"] },
        { model: Administrador, as: "administrador", attributes: ["id", "usuario", "email"] },
      ],
    });

    if (!producto) {
      return res.status(404).json({ success: false, error: "Producto no encontrado" });
    }

    res.json({ success: true, data: producto });
  } catch (err) {
    console.error("Error en getProducto:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo obtener el producto",
    });
  }
};

// crear producto
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
      nombre, precio, descripcion, stock, oferta, descuento,
      idAdministrador, idCategoria, material, capacidad, caracteristicas_especiales
    } = req.body;

    const imagenes = req.files && req.files.length > 0
      ? req.files.map(file => file.filename).join(',') 
      : null;

    const nuevoProducto = await Producto.create({
      nombre,
      precio: parseFloat(precio),
      descripcion,
      stock: parseInt(stock, 10),
      imagen: imagenes,
      oferta,
      descuento,
      idAdministrador,
      idCategoria,
      activo: true,
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
    if (req.files) {
      const uploadedNames = req.files.map(file => file.filename).join(',');
      deleteProductImages(uploadedNames);
    }
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo crear el producto",
      details: err.message,
    });
  }
};

// actualizar productos
const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, error: "ID de producto inválido" });
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
      return res.status(404).json({ success: false, error: "Producto no encontrado" });
    }

    let datosActualizados = { ...req.body };

    if (req.files && req.files.length > 0) {
      deleteProductImages(producto.imagen);
      const nuevosImagenesString = req.files.map(file => file.filename).join(',');
      datosActualizados.imagen = nuevosImagenesString;
    } else if (datosActualizados.hasOwnProperty('imagen') && datosActualizados.imagen === null) {
      deleteProductImages(producto.imagen);
      datosActualizados.imagen = null;
    }

    if (datosActualizados.precio) datosActualizados.precio = parseFloat(datosActualizados.precio);
    if (datosActualizados.stock) datosActualizados.stock = parseInt(datosActualizados.stock, 10);

    await producto.update(datosActualizados);

    res.json({ success: true, data: producto, message: "Producto actualizado exitosamente" });
  } catch (err) {
    console.error("Error en updateProducto:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo actualizar el producto",
    });
  }
};

// eliminar producto
const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, error: "ID de producto inválido" });
    }

    const producto = await Producto.findByPk(id);
    if (!producto || !producto.activo) {
      return res.status(404).json({ success: false, error: "Producto no encontrado" });
    }

    deleteProductImages(producto.imagen);
    await producto.update({ activo: false });

    res.json({ success: true, message: "Producto eliminado exitosamente (soft delete)" });
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
  searchProductos,
};
