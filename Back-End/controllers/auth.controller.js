const Cliente = require("../models/cliente.model");
const Administrador = require("../models/administrador.model"); // 🚨 DESCOMENTAR: Necesitamos este modelo
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const saltBcrypt = 10;

// Función para generar tokens
const generateTokens = (usuario, tipo) => {
  const tokenTipo = tipo || 'cliente'; 
  const accessToken = jwt.sign(
    { id: usuario.id, tipo: tokenTipo }, 
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  const refreshToken = jwt.sign(
    { id: usuario.id, tipo: tokenTipo },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  const idKey = tokenTipo === 'cliente' ? 'clienteId' : 'adminId'; 

  return { 
    accessToken, 
    refreshToken, 
    [idKey]: usuario.id, 
    email: usuario.email 
  };
};

// Registrar un nuevo cliente
exports.register = async (req, res, next) => {
  try {

    const { nombre, email, password, telefono } = req.body; 
    const hashedPassword = await bcrypt.hash(password, saltBcrypt);

    //crear el nuevo cliente
    const nuevoCliente = await Cliente.create({
      nombre,
      email,
      telefono, 
      contrasena: hashedPassword,
    });
  } catch (error) {
    next(error);
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password, tipo } = req.body; 
    let usuario;
    let tipoUsuario = tipo ? tipo.toLowerCase() : 'cliente'; 

    // determinar dónde buscar (Cliente o Administrador)
    if (tipoUsuario === "cliente") {
      usuario = await Cliente.findOne({ where: { email } });
    } else if (tipoUsuario === "administrador") {
      //Búsqueda en la tabla de Administrador
      usuario = await Administrador.findOne({ where: { email } });
    } else {
    
      return res.status(400).json({ success: false, message: "Tipo de usuario no válido." });
    }
    
    // Verificación Usuario no encontrado
    if (!usuario) {
    
      return res.status(401).json({ success: false, message: "Email o contraseña incorrectos." });
    }

    //Verificar contraseña
    const isMatch = await bcrypt.compare(password, usuario.contrasena);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Email o contraseña incorrectos." });
    }

    const tokens = generateTokens(usuario, tipoUsuario);

    res.json({
      success: true,
      message: "Inicio de sesión exitoso",
      ...tokens,
    });
  } catch (error) {
    next(error);
  }
};

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
      ...tokens,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ success: false, message: "Token de refresco inválido" });
    }
    next(error);
  }
};