// Back-End/server-config/socket.js

let io = null;

function initializeSocket(serverInstance) {
    const { Server } = require('socket.io');

    io = new Server(serverInstance, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log(`🔌 Cliente conectado por Socket.IO: ${socket.id}`);
        socket.on('disconnect', () => {
            console.log(`🔌 Cliente desconectado: ${socket.id}`);
        });
    });

    return io;
}

function getSocketInstance() {
    return io;
}

module.exports = {
    initializeSocket,
    getSocketInstance
};