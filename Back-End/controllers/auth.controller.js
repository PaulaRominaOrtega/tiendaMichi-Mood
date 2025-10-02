const Cliente = require("../models/cliente.model");
const Administrador = require("../models/administrador.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const saltBcrypt = 10;

// Función para generar tokens
const generateTokens = (usuario, tipo) => {
  const accessToken = jwt.sign(
    { id: usuario.id, tipo }, 
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  const refreshToken = jwt.sign(
    { id: usuario.id, tipo },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

// Registrar un nuevo cliente
exports.register = async (req, res, next) => {
  try {
    const { nombre, email, password, telefono } = req.body;

    // Hashearr la contraseña
    const hashedPassword = await bcrypt.hash(password, saltBcrypt);

    const nuevoCliente = await Cliente.create({
      nombre,
      email,
      telefono,
      contrasena: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Cliente registrado exitosamente",
      data: { id: nuevoCliente.id, email: nuevoCliente.email },
    });
  } catch (error) {
    next(error);
  }
};

// Iniciar sesión 
exports.login = async (req, res, next) => {
  try {
    const { email, password, tipo } = req.body; 

    let usuario;

    if (tipo === "cliente") {
      usuario = await Cliente.findOne({ where: { email } });
    } else if (tipo === "administrador") {
      usuario = await Administrador.findOne({ where: { email } });
    } else {
      return res.status(400).json({ success: false, message: "Tipo inválido" });
    }

    if (!usuario) {
      return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, usuario.contrasena);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }

    // Generar tokens
    const tokens = generateTokens(usuario, tipo);

    res.json({
      success: true,
      message: "Inicio de sesión exitoso",
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};

// Refrescar el token
exports.refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token de refresco no proporcionado",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    let usuario;
    if (decoded.tipo === "cliente") {
      usuario = await Cliente.findByPk(decoded.id);
    } else if (decoded.tipo === "administrador") {
      usuario = await Administrador.findByPk(decoded.id);
    }

    if (!usuario) {
      return res.status(401).json({ success: false, message: "Usuario no encontrado" });
    }

    const tokens = generateTokens(usuario, decoded.tipo);

    res.json({
      success: true,
      message: "Token refrescado exitosamente",
      data: tokens,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ success: false, message: "Token de refresco inválido" });
    }
    next(error);
  }
};