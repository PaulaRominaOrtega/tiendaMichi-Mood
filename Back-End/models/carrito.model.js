const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Carrito = sequelize.define(
    "Carrito",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true,
      },
      fecha: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      idCliente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "clientes",
          key: "id",
        },
      },
    },
    {
      tableName: "carritos",
      timestamps: false,
    }
  );

  
module.exports = Carrito;