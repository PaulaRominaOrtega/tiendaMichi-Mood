const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Pago = sequelize.define(
    "Pago",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true,
      },
      monto: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      estado: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
  
      fecha: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
  
      medio_pago: {
        type: DataTypes.STRING,
        allowNull: true,
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
      tableName: "pagos",
      timestamps: false,
    }
  );

  module.exports = Pago;