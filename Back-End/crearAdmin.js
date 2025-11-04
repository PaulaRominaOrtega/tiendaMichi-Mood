const bcrypt = require('bcryptjs');
const { DataTypes } = require("sequelize");
const sequelize = require("./config/database"); 
const Administrador = require("./models/administrador.model");

const crearAdministrador = async (nombre, email, password, usuario) => {
    try {
        //se hace el hash
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // se guarda el hash
        const nuevoAdmin = await Administrador.create({
            nombre,
            email,
            contrasena: hashedPassword, 
            usuario
        });

        console.log(" Administrador creado exitosamente:");
        console.log(nuevoAdmin.toJSON());
    } catch (error) {
        console.error("Error al crear administrador:", error);
    } finally {
        await sequelize.close();
    }
};

crearAdministrador('', '', '', '');