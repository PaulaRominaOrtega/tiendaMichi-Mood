const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
require("dotenv").config();

const { errorHandler, notFound } = require("./middleware/errorHandler");
const { sequelize } = require("./models/index.model");

const productoRoutes = require("./routes/productos.routes");
const categoriasRoutes = require("./routes/categorias.routes");
const clienteRoutes = require("./routes/clientes.routes");
const pedidoRoutes = require("./routes/pedidos.routes"); 
const chatRoutes = require('./routes/chat.routes.js');
const authRoutes = require("./routes/auth.routes"); // <-- 1. IMPORTA LAS RUTAS

const PORT = process.env.PORT || 3000;

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: "*",
  })
);

app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API funcionando correctamente",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// router de productos
app.use("/api/productos", productoRoutes);
// router de categorías
app.use("/api/categorias", categoriasRoutes);
// router de clientes
app.use("/api/clientes", clienteRoutes);
// router de pedidos
app.use("/api/pedidos", pedidoRoutes); 
app.use('/api', chatRoutes);
app.use('/api/auth', authRoutes); 

app.use(notFound);
app.use(errorHandler);

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a DB - OK");
    await sequelize.sync({ alter: true });
    console.log("✅ Tablas sincronizadas correctamente");
    console.log("📚 Tablas definidas:", Object.keys(sequelize.models));
  } catch (err) {
    console.error("❌ Error en DB:", err);
    process.exit(1);
  }
};

const startServer = async () => {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado en el puerto: ${PORT}`);
    console.log(`📍 Salud de la API: http://localhost:${PORT}/health`);
    console.log(`📖 API Productos: http://localhost:${PORT}/api/productos`);
    console.log(`📖 API Categorias: http://localhost:${PORT}/api/categorias`);
    console.log(`📖 API Clientes: http://localhost:${PORT}/api/clientes`);
    console.log(`📖 API Pedidos: http://localhost:${PORT}/api/pedidos`); 
    console.log(`🔐 API Autenticación: http://localhost:${PORT}/api/auth`);
  });
};

startServer().catch((err) => {
  console.error("❌ Error al iniciar el servidor:", err);
  process.exit(1);
});