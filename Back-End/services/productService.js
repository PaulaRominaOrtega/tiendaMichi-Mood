const { Op } = require('sequelize');
const { Producto } = require('../models/index.model'); 

/**
 * Busca productos en la base de datos por nombre o descripción.
 * @param {string} query La consulta de búsqueda del usuario.
 * @returns {Promise<Array<Object>>} Una lista de productos encontrados con sus detalles.
 */
const getProductDetails = async (query) => {
    try {
        const products = await Producto.findAll({
            where: {
                [Op.or]: [
                    { nombre: { [Op.like]: `%${query}%` } },
                    { descripcion: { [Op.like]: `%${query}%` } }
                ]
            },
            limit: 5 
        });

        return products.map(p => ({
            nombre: p.nombre,
            descripcion: p.descripcion,
            precio: p.precio,
            material: p.material,
            capacidad: p.capacidad, 
            caracteristicas_especiales: p.caracteristicas_especiales 
        }));

    } catch (error) {
        console.error('Error al buscar productos en la base de datos:', error);
        return [];
    }
};

module.exports = {
    getProductDetails
};