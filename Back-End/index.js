const express = require("express");
const http = require("http");
const passport = require('passport'); // 🚨 IMPORTACIÓN NECESARIA
const session = require('express-session'); // 🚨 IMPORTACIÓN NECESARIA
const { initializeSocket } = require("./server-config/socket"); 
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();

// 🚨 Asegúrate de que este archivo exista y configure tu estrategia de Google
require('./config/passport-setup'); 

const { errorHandler, notFound } = require("./middleware/errorHandler");
const { sequelize } = require("./models/index.model");

const productoRoutes = require("./routes/productos.routes");
const categoriasRoutes = require("./routes/categorias.routes");
const clienteRoutes = require("./routes/clientes.routes");
const pedidoRoutes = require("./routes/pedidos.routes"); 
const chatRoutes = require('./routes/chat.routes.js');
const authRoutes = require("./routes/auth.routes");

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const SESSION_SECRET = process.env.SESSION_SECRET || 'clave-secreta-por-defecto-si-no-hay-env'; // Usar variable de entorno

const app = express();
const server = http.createServer(app); 

app.use(helmet());

// -------------------------------------------------------------------
// 🚨 MODIFICACIÓN CLAVE: Configuración de CORS con Credenciales 🚨
// -------------------------------------------------------------------
app.use(
  cors({
    origin: FRONTEND_URL, 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true // Necesario para que Passport use cookies/sessions
  })
);

app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// -------------------------------------------------------------------
// 🚨 CONFIGURACIÓN DE AUTENTICACIÓN: EXPRESS SESSION Y PASSPORT 🚨
// -------------------------------------------------------------------

// 1. Express Session (DEBE ir ANTES de Passport.initialize)
app.use(session({
    secret: SESSION_SECRET, // Usa la clave secreta de tu .env
    resave: false,
    saveUninitialized: false, 
    cookie: { 
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 24 * 60 * 60 * 1000 // 1 día
    } 
}));

// 2. Inicializar Passport
app.use(passport.initialize());
app.use(passport.session()); // Necesario si usas serialización/deserialización (Passport Sessions)

// Middleware para Content-Security-Policy (para archivos estáticos)
app.use((req, res, next) => {
    if (req.path.startsWith('/uploads/')) {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); 
    }
    next();
});

// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ruta de salud
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API funcionando correctamente",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});
app.use("/api/auth", authRoutes);

app.use("/api/productos", productoRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/pedidos", pedidoRoutes); 
app.use('/api', chatRoutes);
app.use(notFound);
app.use(errorHandler);

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a DB - OK");
    await sequelize.sync({ alter: true });
    console.log("✅ Tablas sincronizadas correctamente");
    console.log("📚 Tablas definidas:", Object.keys(sequelize.models));
    
    initializeSocket(server); 
    console.log("🔌 Socket.IO inicializado y listo para escuchar");
    
  } catch (err) {
    console.error("❌ Error en DB:", err);
    process.exit(1);
  }
};

const startServer = async () => {
  await initializeDatabase();
  server.listen(PORT, () => {
    console.log(`🚀 Servidor EXPRESS & SOCKET.IO iniciado en el puerto: ${PORT}`);
    console.log(`📍 Salud de la API: http://localhost:${PORT}/health`);
  });
};

startServer().catch((err) => {
  console.error("❌ Error al iniciar el servidor:", err);
  process.exit(1);
});