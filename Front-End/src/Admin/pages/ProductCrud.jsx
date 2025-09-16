// src/Admin/pages/ProductCrud.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from '../components/ProductForm';
import { Link } from 'react-router-dom';

const ProductCrud = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/productos');
      setProducts(response.data.data); 
      setIsFormVisible(false);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await axios.delete(`http://localhost:3000/api/productos/${productId}`);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsFormVisible(true);
  };
  
  const handleAdd = () => {
    setEditingProduct(null);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Gestión de Productos</h2>

      {!isFormVisible && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
          >
            Agregar Nuevo Producto
          </button>
        </div>
      )}

      {isFormVisible && (
        <ProductForm
          editingProduct={editingProduct}
          onSave={fetchProducts}
          onCancel={handleCancel}
        />
      )}

      <div className="overflow-x-auto mt-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Lista de Productos</h3>
        {products.length === 0 ? (
          <div className="text-center p-4 bg-white rounded-lg shadow">
            <p className="text-gray-600">No hay productos cargados. Agrega uno nuevo.</p>
          </div>
        ) : (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Nombre</th>
                <th className="py-3 px-6 text-left">Precio</th>
                <th className="py-3 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{product.id}</td>
                  <td className="py-3 px-6 text-left">{product.nombre}</td>
                  <td className="py-3 px-6 text-left">${product.precio}</td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <button
                        onClick={() => handleEdit(product)}
                        className="w-4 mr-2 transform hover:text-blue-500 hover:scale-110"
                        title="Editar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="w-4 mr-2 transform hover:text-red-500 hover:scale-110"
                        title="Eliminar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProductCrud;