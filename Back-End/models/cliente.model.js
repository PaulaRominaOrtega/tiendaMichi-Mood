const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Cliente = sequelize.define(
    "Cliente",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      telefono: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false, // 🚨 Cambiamos a 'false' ya que es el identificador único para Google/Local
        unique: true,     // 🚨 Aseguramos que el email sea único
      },
  
      contrasena: {
        type: DataTypes.STRING,
        // Permitimos nulo, ya que los usuarios de Google NO tendrán contraseña tradicional.
        allowNull: true, 
      },
      
      googleId: { // 🚨 NUEVO CAMPO PARA GOOGLE OAUTH
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
    },
    {
      tableName: "clientes",
      timestamps: false,
    }
  );


module.exports = Cliente;