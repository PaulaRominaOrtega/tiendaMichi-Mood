const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Producto = sequelize.define(
  "Producto",
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
    precio: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    oferta: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    descuento: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    idAdministrador: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "administradores",
        key: "id",
      },
    },
    idCategoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categorias",
        key: "id",
      },
    },
  },
  {
    tableName: "productos",
    timestamps: false,
  }
);

module.exports = Producto;
