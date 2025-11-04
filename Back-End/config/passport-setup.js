
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const { Cliente } = require('../models/index.model'); 

passport.serializeUser((cliente, done) => {
    // Almacena el ID del cliente en la sesión
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

// Google
passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email'], 
        passReqToCallback: true 
    }, 
    async (req, accessToken, refreshToken, profile, done) => {
        
        
        try {
            // verificar si el usuario ya existe
            let cliente = await Cliente.findOne({ 
                where: { 
                    email: profile.emails[0].value 
                } 
            });

            if (cliente) {
                console.log('Cliente ya registrado:', cliente.nombre);
                done(null, cliente);

            } else {
                // crear un nuevo cliente
                const nuevoCliente = await Cliente.create({
                    nombre: profile.displayName,
                    email: profile.emails[0].value,
                    password: null, 
                    googleId: profile.id,
                    telefono: null, 
                    direccion: null,
                    
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