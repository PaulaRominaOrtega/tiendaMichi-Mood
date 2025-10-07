// =================================================================
// 🚨 CONFIGURACIÓN DEL SERVIDOR CON EXPRESS Y SOCKET.IO 🚨
// =================================================================
const express = require("express");
const http = require("http"); // ✅ Necesario para Socket.IO
// 🚨 IMPORTAR la función de inicialización en lugar de la clase Server directamente
const { initializeSocket } = require("./server-config/socket"); 
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();

const { errorHandler, notFound } = require("./middleware/errorHandler");
const { sequelize } = require("./models/index.model");

const productoRoutes = require("./routes/productos.routes");
const categoriasRoutes = require("./routes/categorias.routes");
const clienteRoutes = require("./routes/clientes.routes");
const pedidoRoutes = require("./routes/pedidos.routes"); 
const chatRoutes = require('./routes/chat.routes.js');
const authRoutes = require("./routes/auth.routes");

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"; // Asumiendo Vite

const app = express();
// 🚨 PASO 1: Crear el servidor HTTP montando la app Express
const server = http.createServer(app); 

// 🚨 CÓDIGO ELIMINADO: La inicialización directa de 'io' y su exportación se movieron a 'server-config/socket.js'
// ------------------------------------------------------------------


app.use(helmet());

// Middleware de CORS para Express 
app.use(
  cors({
    origin: FRONTEND_URL, // Restringimos CORS a la URL de tu Front-End
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);

app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Middleware para Content-Security-Policy (para archivos estáticos)
app.use((req, res, next) => {
    if (req.path.startsWith('/uploads/')) {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); 
    }
    next();
});

// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🚨 CÓDIGO ELIMINADO: El log de conexión de Socket.IO se movió a 'server-config/socket.js'
// ------------------------------------------------------------------

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
    
    // 🚨 PASO DE INICIALIZACIÓN CLAVE: Usamos la función importada
    initializeSocket(server); 
    console.log("🔌 Socket.IO inicializado y listo para escuchar");
    
  } catch (err) {
    console.error("❌ Error en DB:", err);
    process.exit(1);
  }
};

const startServer = async () => {
  await initializeDatabase();
  // 🚨 Usar server.listen
  server.listen(PORT, () => {
    console.log(`🚀 Servidor EXPRESS & SOCKET.IO iniciado en el puerto: ${PORT}`);
    console.log(`📍 Salud de la API: http://localhost:${PORT}/health`);
    console.log(`📖 API Pedidos: http://localhost:${PORT}/api/pedidos`); 
  });
};

startServer().catch((err) => {
  console.error("❌ Error al iniciar el servidor:", err);
  process.exit(1);
});