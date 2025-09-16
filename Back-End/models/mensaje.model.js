const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Mensaje = sequelize.define(
    "Mensaje",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      texto: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      productoId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Productos",
          key: "id",
        },
        allowNull: false,
      },
    },
    {
      tableName: "Mensajes",
      timestamps: false,
    }
  );

  module.exports = Mensaje;