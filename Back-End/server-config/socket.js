// server-config/socket.js

const { Server } = require("socket.io");

let io;

const initializeSocket = (httpServer) => {
    // Inicializa la instancia de Socket.IO
    io = new Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:5173", 
            methods: ["GET", "POST"]
        }
    });

    // Lógica de conexión básica
    io.on('connection', (socket) => {
        console.log(`🔌 Cliente conectado por Socket.IO: ${socket.id}`);
        
        socket.on('disconnect', () => {
            console.log(`❌ Cliente desconectado: ${socket.id}`);
        });
    });
};

const getSocketInstance = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

module.exports = {
    initializeSocket,
    getSocketInstance 
};