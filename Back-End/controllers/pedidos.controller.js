const { Pedido, Cliente, PedidoProducto, Producto } = require("../models/index.model");
const { validationResult } = require('express-validator');
const { getSocketInstance } = require('../server-config/socket');
const { sendNewOrderEmail } = require('../services/emailService'); 

// Obtener todos los pedidos
const getPedidos = async (req, res) => {
    try {
        console.log("GET /pedidos");

        const { page = 1, limit = 10, estado } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {};
        if (estado === 'true' || estado === 'false') {
            whereClause.estado = estado === 'true';
        }

        const pedidos = await Pedido.findAndCountAll({
            where: whereClause,
            include: [{
                model: Cliente,
                as: 'cliente',
                attributes: ['id', 'nombre', 'email']
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['id', 'DESC']]
        });

        res.json({
            success: true,
            data: pedidos.rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(pedidos.count / limit),
                totalItems: pedidos.count,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (err) {
        console.error("Error en getPedidos:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudieron obtener los pedidos"
        });
    }
};

// Obtener un pedido por ID
const getPedido = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("GET /pedidos/:id", { id });

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: "ID de pedido inválido"
            });
        }

        const pedido = await Pedido.findByPk(id, {
            include: [
                {
                    model: Cliente,
                    as: 'cliente',
                    attributes: ['id', 'nombre', 'email', 'telefono']
                },
                {
                    model: PedidoProducto,
                    as: 'detalles',
                    include: [{
                        model: Producto,
                        as: 'producto',
                        attributes: ['id', 'nombre', 'precio', 'descripcion', 'stock']
                    }]
                }
            ]
        });

        if (!pedido) {
            return res.status(404).json({
                success: false,
                error: "Pedido no encontrado"
            });
        }

        res.json({
            success: true,
            data: pedido
        });
    } catch (err) {
        console.error("Error en getPedido:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo obtener el pedido"
        });
    }
};

const createPedido = async (req, res) => {
    let transaction; 
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: "Datos de entrada inválidos",
                details: errors.array()
            });
        }

    
        const { idCliente, total, items, ...otrosDatosPedido } = req.body;

        if (!items || items.length === 0) {
             return res.status(400).json({ success: false, error: "El pedido debe contener productos." });
        }

        transaction = await Pedido.sequelize.transaction();

        // Crear el Pedid
        const nuevoPedido = await Pedido.create({
            idCliente,
            total,
            fecha: new Date(),
            estado: 'Pendiente', 
            ...otrosDatosPedido
        }, { transaction });

        const pedidoId = nuevoPedido.id;
        const pedidoProductos = [];
        const itemsParaEmail = []; 
        
        for (const item of items) {
            const { productoId, cantidad, precioUnitario, nombre } = item; 

            
            const producto = await Producto.findByPk(productoId, { 
                attributes: ['id', 'nombre', 'stock'], 
                transaction 
            });
            
            if (!producto) {
                throw new Error(`Producto no encontrado para el ID: ${productoId}`);
            }
            if (producto.stock < cantidad) {
                throw new Error(`Stock insuficiente para el producto ${producto.nombre || `ID: ${productoId}`}. Stock disponible: ${producto.stock}`);
            }

            pedidoProductos.push({
                idPedido: pedidoId,     
                idProducto: productoId, 
                cantidad: cantidad,
                precio_unitario: precioUnitario, 
            });
            itemsParaEmail.push({
                productoId: productoId,
                cantidad: cantidad,
                precioUnitario: precioUnitario,
                nombre: nombre || producto.nombre, 
            });

            // Actualizar el stock
            await producto.update({ stock: producto.stock - cantidad }, { transaction });
        }
        await PedidoProducto.bulkCreate(pedidoProductos, { transaction });

        // Finalizar la transacción
        await transaction.commit();
        
        const io = getSocketInstance(); 
        if (io) {
            // Evento nuevoPedido
            io.emit('nuevoPedido', { 
                message: 'Nuevo pedido entrante', 
                pedidoId: pedidoId,
                total: total,
            });
            console.log(`Socket.IO: Evento 'nuevoPedido' emitido para el ID: ${pedidoId}`);
        } else {
             console.warn("Socket.IO no está disponible. No se pudo enviar la notificación en tiempo real.");
        }
        // ----------------------------------------------------


        if (sendNewOrderEmail) {
            const cliente = await Cliente.findByPk(idCliente);
            
            const adminEmail = process.env.ADMIN_EMAIL || 'admin@tutienda.com'; 
            
            await sendNewOrderEmail({
                to: adminEmail, 
                subject: `🚨 Nuevo Pedido #${pedidoId}`,
                templateName: 'new_order_admin', 
                data: { 
                    pedidoId: pedidoId, 
                    total: total, 
                    clienteNombre: cliente ? cliente.nombre : 'Cliente Desconocido',
                    items: itemsParaEmail, 
                }
            });
            console.log(`Nodemailer: Email de nuevo pedido enviado al administrador (${adminEmail}).`);

        } else {
             console.warn("Función sendNewOrderEmail no está disponible. No se pudo enviar el correo de respaldo.");
        }

        res.status(201).json({
            success: true,
            data: nuevoPedido,
            message: "Pedido creado y stock actualizado exitosamente. Notificación enviada."
        });

    } catch (err) {
        
        if (transaction) await transaction.rollback();
        
        console.error("Error en createPedido:", err);
        
        let errorMessage = "No se pudo crear el pedido debido a un error interno del servidor.";
        if (err.message.includes("Stock insuficiente") || err.message.includes("Producto no encontrado")) {
             errorMessage = err.message;
        } else if (err.name === 'SequelizeForeignKeyConstraintError') {
             errorMessage = "Error: El cliente o producto asociado al pedido no existe.";
        }

        res.status(500).json({
            success: false,
            error: errorMessage,
            message: "Error al procesar la compra."
        });
    }
};

// Actualizar un pedido
const updatePedido = async (req, res) => {
    try {
        const { id } = req.params;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: "Datos de entrada inválidos",
                details: errors.array()
            });
        }

        const pedido = await Pedido.findByPk(id);
        if (!pedido) {
            return res.status(404).json({
                success: false,
                error: "Pedido no encontrado"
            });
        }

        await pedido.update(req.body);

        res.json({
            success: true,
            data: pedido,
            message: "Pedido actualizado exitosamente"
        });
    } catch (err) {
        console.error("Error en updatePedido:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo actualizar el pedido"
        });
    }
};


const actualizarEstadoPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body; 

        if (!estado) {
            return res.status(400).json({
                success: false,
                error: "El nuevo estado del pedido es requerido."
            });
        }

        const [filasActualizadas, pedidosActualizados] = await Pedido.update(
            { estado: estado },
            { where: { id: id }, returning: true } 
        );

        if (filasActualizadas === 0) {
            return res.status(404).json({
                success: false,
                error: "Pedido no encontrado o estado ya actualizado."
            });
        }
       
        res.json({
            success: true,
            data: pedidosActualizados[0],
            message: "Estado del pedido actualizado exitosamente"
        });

    } catch (err) {
        console.error("Error en actualizarEstadoPedido:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo actualizar el estado del pedido"
        });
    }
};

// Eliminar un pedido-soft delete
const deletePedido = async (req, res) => {
    try {
        const { id } = req.params;

        const pedido = await Pedido.findByPk(id);
        if (!pedido) {
            return res.status(404).json({
                success: false,
                error: "Pedido no encontrado"
            });
        }
        
        await pedido.update({ estado: 'Eliminado' }); 

        res.json({
            success: true,
            message: "Pedido marcado como eliminado exitosamente"
        });
    } catch (err) {
        console.error("Error en deletePedido:", err);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor",
            message: "No se pudo eliminar el pedido. Podría haber restricciones de la base de datos."
        });
    }
};

module.exports = {
    getPedidos,
    getPedido,
    createPedido,
    updatePedido,
    actualizarEstadoPedido, 
    deletePedido
};