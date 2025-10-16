const express = require("express");
const http = require("http");
const passport = require('passport');
const session = require('express-session');
const { initializeSocket } = require("./server-config/socket"); 
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();
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
const SESSION_SECRET = process.env.SESSION_SECRET || 'clave-secreta-por-defecto-si-no-hay-env';

const app = express();
const server = http.createServer(app); 

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
        const allowedOrigins = [FRONTEND_URL, 'http://localhost:5174']; 
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);

app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false, 
    cookie: { 
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 24 * 60 * 60 * 1000
    } 
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    if (req.path.startsWith('/uploads/')) {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); 
    }
    next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API funcionando correctamente",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});
app.use("/api/auth", authRoutes); 

app.use("/auth", authRoutes); 

app.use("/api/productos", productoRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/pedidos", pedidoRoutes); 
app.use('/api', chatRoutes);

app.use(notFound);
app.use(errorHandler);

// arranque del servidor

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