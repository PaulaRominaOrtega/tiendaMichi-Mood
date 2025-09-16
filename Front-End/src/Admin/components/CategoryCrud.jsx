// src/Admin/components/CategoryCrud.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CategoryForm from './CategoryForm';

const CategoryCrud = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false); // Nuevo estado para mostrar/ocultar el formulario
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/categorias?page=${currentPage}&limit=${itemsPerPage}`);
      setCategories(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage]);

  const handleSave = () => {
    setEditingCategory(null);
    setShowForm(false); // Oculta el formulario al guardar
    fetchCategories();
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true); // Muestra el formulario para editar
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      try {
        await axios.delete(`http://localhost:3000/api/categorias/${id}`);
        fetchCategories();
      } catch (error) {
        console.error('Error al eliminar la categoría:', error);
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  const handleAddNewClick = () => {
    setEditingCategory(null); // Asegura que no haya una categoría en edición
    setShowForm(true); // Muestra el formulario para agregar una nueva
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setShowForm(false); // Oculta el formulario al cancelar
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Gestión de Categorías</h2>
      
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleAddNewClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
        >
          Agregar Nueva Categoría
        </button>
      </div>
      
      {showForm && (
        <CategoryForm 
          onSave={handleSave} 
          editingCategory={editingCategory} 
          onCancel={handleCancel} 
        />
      )}

      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Nombre</th>
              <th className="py-3 px-6 text-left">Imagen URL</th>
              <th className="py-3 px-6 text-left">Activa</th>
              <th className="py-3 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {categories.map((category) => (
              <tr key={category.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{category.id}</td>
                <td className="py-3 px-6 text-left">{category.nombre}</td>
                <td className="py-3 px-6 text-left truncate max-w-xs">{category.imagenUrl}</td>
                <td className="py-3 px-6 text-left">
                  <span className={`px-2 py-1 font-semibold leading-tight rounded-full ${category.activa ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'}`}>
                    {category.activa ? 'Sí' : 'No'}
                  </span>
                </td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center">
                    <button
                      onClick={() => handleEdit(category)}
                      className="w-4 mr-2 transform hover:text-blue-500 hover:scale-110"
                      title="Editar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
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
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-l-lg hover:bg-gray-400 disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-gray-700">Página {currentPage} de {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-r-lg hover:bg-gray-400 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default CategoryCrud;