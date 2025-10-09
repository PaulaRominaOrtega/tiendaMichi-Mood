// config/passport-setup.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const { Cliente } = require('../models/index.model'); // Asegúrate de que esta ruta sea correcta

// Serializar y Deserializar: Esencial para mantener la sesión
passport.serializeUser((cliente, done) => {
    // Almacena solo el ID del cliente en la sesión
    done(null, cliente.id); 
});

passport.deserializeUser(async (id, done) => {
    // Busca el cliente completo por el ID almacenado
    try {
        const cliente = await Cliente.findByPk(id);
        done(null, cliente);
    } catch (err) {
        done(err, null);
    }
});

// Estrategia de Google
passport.use(
    new GoogleStrategy({
        // Opciones de la estrategia
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email'], // Pide acceso al perfil y al correo
        passReqToCallback: true 
    }, 
    async (req, accessToken, refreshToken, profile, done) => {
        // Esta función se ejecuta después de que Google verifica al usuario
        
        try {
            // 1. Verificar si el usuario ya existe en tu BD
            let cliente = await Cliente.findOne({ 
                where: { 
                    email: profile.emails[0].value 
                } 
            });

            if (cliente) {
                // Usuario encontrado, iniciar sesión
                console.log('Cliente ya registrado:', cliente.nombre);
                done(null, cliente);

            } else {
                // 2. Crear un nuevo cliente en tu BD (Registro automático)
                const nuevoCliente = await Cliente.create({
                    nombre: profile.displayName,
                    email: profile.emails[0].value,
                    // NOTA: Para Google, la contraseña es opcional o un placeholder
                    password: null, // No necesita password, inicia sesión con Google
                    googleId: profile.id,
                    telefono: null, // Puedes pedir esto después
                    direccion: null,
                    // Asegúrate de que los campos concuerden con tu modelo Cliente
                });
                console.log('Nuevo cliente creado:', nuevoCliente.nombre);
                done(null, nuevoCliente);
            }
        } catch (error) {
            console.error('Error durante la autenticación de Google:', error);
            done(error, null);
        }
    })
);