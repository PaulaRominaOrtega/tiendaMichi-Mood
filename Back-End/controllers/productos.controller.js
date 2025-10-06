const { Producto, Categoria, Administrador } = require("../models/index.model");
const { validationResult } = require("express-validator");
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize'); // Asegúrate de importar Op

// ⚠️ FUNCIONES DE AYUDA PARA MÚLTIPLES IMÁGENES ⚠️
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
          // Usamos unlink para eliminar el archivo del sistema de archivos
          fs.unlinkSync(imagePath);
        } catch (error) {
          console.error(`Error al eliminar el archivo ${imageName}:`, error);
        }
      }
    });
  }
};

// --------------------------------------------------------------------------------------
// OBTENER TODOS LOS PRODUCTOS (CON FILTRO POR NOMBRE DE CATEGORÍA)
// --------------------------------------------------------------------------------------
const getProductos = async (req, res) => {
  try {
    const { page = 1, limit = 10, idCategoria, oferta = undefined, categoria } = req.query; 
    const offset = (page - 1) * limit;

    const whereClause = { activo: true };
    
    let categoriaIdFiltrada = idCategoria; // Mantenemos el filtro por ID existente si existe

    // 🚨 NUEVA LÓGICA: Si se envió el NOMBRE de la categoría
    if (categoria) {
        // 1. Buscamos el ID de la categoría por su nombre
        const categoriaBuscada = await Categoria.findOne({ 
            where: { 
                nombre: categoria, // Filtramos por el nombre exacto
                activa: true 
            },
            attributes: ['id']
        });

        if (categoriaBuscada) {
            categoriaIdFiltrada = categoriaBuscada.id; // Establecemos el ID para la consulta
        } else {
            // Si el nombre de la categoría no existe, forzamos una búsqueda vacía.
            // Usamos un ID que nunca existirá (ej. 0)
            categoriaIdFiltrada = 0; 
        }
    }
    
    // 2. Aplicamos el ID de la categoría
    if (categoriaIdFiltrada) {
        whereClause.idCategoria = categoriaIdFiltrada;
    }

    // Filtro de oferta existente
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

// --------------------------------------------------------------------------------------
// OBTENER UN PRODUCTO POR ID
// --------------------------------------------------------------------------------------
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


// --------------------------------------------------------------------------------------
// CREAR UN NUEVO PRODUCTO
// --------------------------------------------------------------------------------------
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
      oferta,
      descuento,
      idAdministrador,
      idCategoria,
      material,
      capacidad,
      caracteristicas_especiales
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
    // Si la creación falla y se subieron archivos, debemos borrarlos
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

// --------------------------------------------------------------------------------------
// ACTUALIZAR UN PRODUCTO (FUNCIÓN CORREGIDA)
// --------------------------------------------------------------------------------------
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
    let datosActualizados = { ...req.body };

    // Manejo de imágenes
    if (req.files && req.files.length > 0) {
      // 1. Si se subieron nuevas imágenes, elimina las viejas del disco
      deleteProductImages(producto.imagen);

      // 2. Crea el string con los nuevos nombres de archivo
      const nuevosImagenesString = req.files.map(file => file.filename).join(',');
      datosActualizados.imagen = nuevosImagenesString;

    } else if (datosActualizados.hasOwnProperty('imagen') && datosActualizados.imagen === null) {
      // Opción para borrar todas las imágenes si el frontend envía 'imagen: null'
      deleteProductImages(producto.imagen);
      datosActualizados.imagen = null;
    }

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

// --------------------------------------------------------------------------------------
// ELIMINAR UN PRODUCTO (SOFT DELETE)
// --------------------------------------------------------------------------------------
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

    // Eliminar todas las imágenes físicas del servidor
    deleteProductImages(producto.imagen);

    // Marcar como inactivo
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