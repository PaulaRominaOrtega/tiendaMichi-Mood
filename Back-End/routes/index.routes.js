const express = require("express");
const router = express.Router();

const productosRoutes = require("./productos.routes");
router.use("/productos", productosRoutes);

const categoriasRoutes = require("./categorias.routes");
router.use("/categorias", categoriasRoutes);

const administradoresRoutes = require("./administradores.routes");
router.use("/administradores", administradoresRoutes);

const carritosRoutes = require("./carritos.routes");
router.use("/carritos", carritosRoutes);

const carritosProductosRoutes = require("./carritosProductos.routes");
router.use("/carritosProductos", carritosProductosRoutes);

const clientesRoutes = require("./clientes.routes");
router.use("/clientes", clientesRoutes);

const direccionesRoutes = require("./direcciones.routes");
router.use("/direcciones",direccionesRoutes);

const enviosRoutes = require("./envios.routes");
router.use("/envios", enviosRoutes);

const mensajesRoutes = require("./mensajes.routes");
router.use("/mensajes",mensajesRoutes);

const pagosRoutes = require("./pagos.routes");
router.use("/pagos", pagosRoutes);

const pedidosRoutes = require("./pedidos.routes");
router.use("/pedidos", pedidosRoutes);

const pedidosProductosRoutes = require("./pedidosProductos.routes");
router.use("/pedidosProductos", pedidosProductosRoutes);

const variantesRoutes = require("./variantes.routes");
router.use("/variantes", variantesRoutes);



// Rutas de autenticación
const authRoutes = require("./auth.routes");
router.use("/auth", authRoutes);

module.exports = router;