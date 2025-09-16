const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Envio = sequelize.define(
    "Envio",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true,
      },
      costo: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      estado: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      idPedido: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "pedidos",
          key: "id",
        },
      },
    },
    {
      tableName: "envios",
      timestamps: false,
    }
  );


  module.exports = Envio;