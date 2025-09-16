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
        allowNull: true,
      },
  
      contrasena: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "clientes",
      timestamps: false,
    }
  );



module.exports = Cliente;