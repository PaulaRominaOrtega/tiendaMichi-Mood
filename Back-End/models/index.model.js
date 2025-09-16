const sequelize = require("../config/database");

const Producto = require("./producto.model");
const Categoria = require("././categoria.model");
const Administrador = require("./administrador.model");
const Carrito = require("./carrito.model");
const CarritoProducto = require("./carritoProducto.model");
const Cliente = require("./cliente.model");
const Direccion = require("./direccion.model");
const Envio = require("./envio.model");
const Pago = require("./pago.model");
const Pedido = require("./pedido.model");
const PedidoProducto = require("./pedidoProducto.model");
const Variante = require("./variante.model");
const CuponDescuento = require("./cuponDescuento.model");


Cliente.hasMany(Direccion, {
  foreignKey: "idCliente",
});
Direccion.belongsTo(Cliente, {
  foreignKey: "idCliente",
});

// ✅ MODIFICACIÓN: Se agrega un alias a la relación entre Cliente y Pedido
Cliente.hasMany(Pedido, {
  foreignKey: "idCliente",
  as: "pedidos",
});
Pedido.belongsTo(Cliente, {
  foreignKey: "idCliente",
  as: "cliente", // Este es el alias que tu controlador necesita
});

Cliente.hasOne(Carrito, {
  foreignKey: "idCliente",
  onDelete: "CASCADE",
});
Carrito.belongsTo(Cliente, {
  foreignKey: "idCliente",
});

Administrador.hasMany(Producto, {
  as: "productos",
  foreignKey: "idAdministrador",
});
Producto.belongsTo(Administrador, {
  as: "administrador",
  foreignKey: "idAdministrador",
});

Categoria.hasMany(Producto, {
  as: "productos",
  foreignKey: "idCategoria",
});
Producto.belongsTo(Categoria, {
  as: "categoria",
  foreignKey: "idCategoria",
});

Pedido.hasOne(Pago, {
  foreignKey: "idPedido",
  onDelete: "CASCADE",
});
Pago.belongsTo(Pedido, {
  foreignKey: "idPedido",
});

Pedido.hasOne(Envio, {
  foreignKey: "idPedido",
  onDelete: "CASCADE",
});

// ✅ ASOCIACIONES AGREGADAS PARA PEDIDOS Y PRODUCTOS
Pedido.belongsToMany(Producto, {
  through: PedidoProducto,
  foreignKey: "idPedido",
  as: "productos",
});
Producto.belongsToMany(Pedido, {
  through: PedidoProducto,
  foreignKey: "idProducto",
  as: "pedidos",
});

Pedido.hasMany(PedidoProducto, {
  foreignKey: "idPedido",
  as: "detalles",
});
PedidoProducto.belongsTo(Pedido, {
  foreignKey: "idPedido",
  as: "pedido",
});

Producto.hasMany(PedidoProducto, {
  foreignKey: "idProducto",
  as: "detallesProducto",
});
PedidoProducto.belongsTo(Producto, {
  foreignKey: "idProducto",
  as: "producto",
});
// ✅ FIN DE LAS ASOCIACIONES AGREGADAS

module.exports = {
  sequelize,
  Categoria,
  Administrador,
  Carrito,
  CarritoProducto,
  Cliente,
  Direccion,
  Envio,
  Pago,
  Pedido,
  PedidoProducto,
  Producto,
  CuponDescuento,
  Variante,
};