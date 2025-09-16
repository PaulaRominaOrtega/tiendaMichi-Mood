const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Pedido = sequelize.define(
    "Pedido",
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
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      total: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      estado: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
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
      tableName: "pedidos",
      timestamps: false,
    }
  );



  module.exports = Pedido;