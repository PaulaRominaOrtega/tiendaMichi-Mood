const { Op } = require('sequelize'); 
const db = require('../models/index.model'); 
const Producto = db.Producto; 


/**
 * Función para consultar el stock y características de un producto usando Sequelize.
 * Filtra rigurosamente por productos activos.
 * @param {string} nombreProducto - El nombre del producto a buscar.
 * @returns {Promise<string>} - Un JSON string con la información de stock y características.
 */
async function consultarStock(nombreProducto) {
    if (!Producto) {
        console.error("Error interno: El modelo 'Producto' no está definido.");
        return JSON.stringify({
            status: 'error',
            message: 'Error interno de configuración: El modelo de Producto no se cargó correctamente.'
        });
    }

    try {
        const busqueda = nombreProducto.toLowerCase().trim();

        const producto = await Producto.findOne({ 
            where: { 
                nombre: { 
                    [Op.like]: `%${busqueda}%` 
                },
                activo: true // para que no salgan los eliminados por ej
            },
            attributes: ['precio', 'stock', 'descripcion', 'material', 'capacidad', 'caracteristicas_especiales'] 
        });

        if (producto) {
            return JSON.stringify({
                status: 'success',
                producto: producto.nombre, 
                precio: producto.precio,
                stock: producto.stock,
                descripcion: producto.descripcion,
                material: producto.material,
                capacidad: producto.capacidad,
                caracteristicas: producto.caracteristicas_especiales 
            });
        } else {
            return JSON.stringify({
                status: 'not_found',
                message: `Lo siento, no tenemos '${nombreProducto}' actualmente en nuestro catálogo.`
            });
        }
    } catch (error) {
        console.error('Error al consultar la BD (Sequelize):', error);
        return JSON.stringify({
            status: 'error',
            message: 'Error interno al consultar la base de datos.'
        });
    }
}

module.exports = {
    consultarStock
};