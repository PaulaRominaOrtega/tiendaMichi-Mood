const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PedidoProducto = sequelize.define(
    "PedidoProducto",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true,
      },
      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      precio_unitario: {
        type: DataTypes.INTEGER,
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
      idProducto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "productos",
          key: "id",
        },
      },
    },
    {
      tableName: "pedidosproductos",
      timestamps: false,
    }
  );

  module.exports = PedidoProducto;