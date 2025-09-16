// src/Admin/components/ProductForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const ProductForm = ({ onSave, editingProduct, onCancel }) => {
  const [formData, setFormData] = useState(
    editingProduct || {
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      imagen: '',
      oferta: false,
      descuento: 0,
      idAdministrador: 1,
      idCategoria: 1,
    }
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(`http://localhost:3000/api/productos/${editingProduct.id}`, formData);
      } else {
        await axios.post('http://localhost:3000/api/productos', formData);
      }
      onSave();
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      if (error.response && error.response.data) {
        console.error("Respuesta del servidor:", error.response.data);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
          </h3>
          <button 
            onClick={onCancel} 
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Precio</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              placeholder="Precio"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Descripción"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 h-24 resize-none"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Stock"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Imagen (URL)</label>
            <input
              type="text"
              name="imagen"
              value={formData.imagen}
              onChange={handleChange}
              placeholder="URL de la imagen"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <button 
              type="button" 
              onClick={onCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;