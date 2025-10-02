const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Categoria = sequelize.define(
    "Categoria",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imagenUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: '', 
      },
      activa: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "categorias",
      timestamps: false,
    }
  );


module.exports = Categoria;