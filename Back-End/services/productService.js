const { Op } = require('sequelize');
const { Producto } = require('../models/index.model');

const getProductDetails = async (query) => {
    try {
        const products = await Producto.findAll({
            where: {
                [Op.and]: [
                    { activo: true },
                    {
                        [Op.or]: [
                            { nombre: { [Op.like]: `%${query}%` } },
                            { descripcion: { [Op.like]: `%${query}%` } },
                            { material: { [Op.like]: `%${query}%` } },
                            { capacidad: { [Op.like]: `%${query}%` } }
                        ]
                    }
                ]
            },
            limit: 5
        });

        return products.map(p => ({
            nombre: p.nombre,
            descripcion: p.descripcion,
            precio: p.precio,
            stock: p.stock,
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