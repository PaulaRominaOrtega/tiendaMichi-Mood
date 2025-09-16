const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const CuponDescuento = sequelize.define(
    "CuponDescuento",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombreCupon: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Nombre descriptivo para el cupón (ej. 'Descuento Bienvenida')",
      },
      codigoCupon: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Código que el usuario ingresará (ej. 'BIENVENIDO10')",
      },
      porcentajeDescuento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 100,
        },
        comment: "Porcentaje de descuento (0 a 100)",
      },
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: "Indica si el cupón está habilitado para usarse",
      },
    },
    {
      tableName: "cupones",
      timestamps: false,
    }
  );

module.exports = CuponDescuento;