// src/models/Producto.js
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
    material: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Material principal del producto, ej: cerámica, plástico, tela."
    },
    capacidad: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Capacidad o tamaño del producto, ej: 350 ml, 1 litro, S, M, L."
    },
    caracteristicas_especiales: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Características adicionales, ej: apto para microondas, antideslizante."
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