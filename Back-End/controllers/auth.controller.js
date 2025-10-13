const Cliente = require("../models/cliente.model");
const Administrador = require("../models/administrador.model"); // 🚨 DESCOMENTAR: Necesitamos este modelo
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const saltBcrypt = 10;

// Función para generar tokens
const generateTokens = (usuario, tipo) => {
  const tokenTipo = tipo || 'cliente'; 
  
  // Incluimos el ID y el TIPO en el payload del token
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

  // Devolvemos el clienteId o adminId, dependiendo del tipo.
  const idKey = tokenTipo === 'cliente' ? 'clienteId' : 'adminId'; 

  return { 
    accessToken, 
    refreshToken, 
    [idKey]: usuario.id, 
    email: usuario.email 
  };
};

// Registrar un nuevo cliente (Esta función NO CAMBIA)
exports.register = async (req, res, next) => {
  // ... [El código de register es idéntico al que pasaste y está correcto para clientes] ...
  try {
    const { nombre, email, password, telefono } = req.body;

    // 1. Verificar si el cliente ya existe
    const existingClient = await Cliente.findOne({ where: { email } });
    if (existingClient) {
      return res.status(409).json({
        success: false,
        message: "Ya existe un usuario con este correo electrónico."
      });
    }

    // 2. Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, saltBcrypt);

    // 3. Crear el nuevo cliente
    const nuevoCliente = await Cliente.create({
      nombre,
      email,
      telefono,
      contrasena: hashedPassword,
    });

    // 4. Generar tokens e iniciar sesión automáticamente
    const tokens = generateTokens(nuevoCliente, 'cliente');

    res.status(201).json({
      success: true,
      message: "Cliente registrado e inicio de sesión exitoso",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      clienteId: nuevoCliente.id,
      email: nuevoCliente.email,
    });
  } catch (error) {
    next(error);
  }
};

// 🚨 FUNCIÓN CORREGIDA: Iniciar sesión (Soporta CLIENTE y ADMINISTRADOR)
exports.login = async (req, res, next) => {
  try {
    // 🚨 CLAVE: Recibimos 'tipo' del body. Si no viene, asumimos 'cliente'.
    const { email, password, tipo } = req.body; 
    let usuario;
    let tipoUsuario = tipo ? tipo.toLowerCase() : 'cliente'; 

    // 1. Determinar dónde buscar (Cliente o Administrador)
    if (tipoUsuario === "cliente") {
      usuario = await Cliente.findOne({ where: { email } });
    } else if (tipoUsuario === "administrador") {
      // 🚨 Búsqueda en la tabla de Administrador
      usuario = await Administrador.findOne({ where: { email } });
    } else {
      // Manejar tipos inválidos (aunque el frontend ya lo fija)
      return res.status(400).json({ success: false, message: "Tipo de usuario no válido." });
    }
    
    // Verificación 1: Usuario no encontrado
    if (!usuario) {
      // Respuesta 401 para fallo de credenciales
      return res.status(401).json({ success: false, message: "Email o contraseña incorrectos." });
    }

    // 2. Verificar contraseña
    const isMatch = await bcrypt.compare(password, usuario.contrasena);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Email o contraseña incorrectos." });
    }

    // 3. Generar tokens
    const tokens = generateTokens(usuario, tipoUsuario);

    // 4. Respuesta exitosa
    // 🚨 Usamos el spread de tokens para enviar el ID correcto (clienteId o adminId)
    res.json({
      success: true,
      message: "Inicio de sesión exitoso",
      ...tokens,
    });
  } catch (error) {
    next(error);
  }
};

// Refrescar el token (Esta función NO CAMBIA y es correcta)
exports.refreshToken = async (req, res, next) => {
  // ... [El código de refreshToken es idéntico al que pasaste y es correcto] ...
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
    // Mantenemos la lógica de tipo aquí para refrescar correctamente
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