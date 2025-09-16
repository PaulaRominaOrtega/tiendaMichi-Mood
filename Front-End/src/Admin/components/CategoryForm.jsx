// src/Admin/components/CategoryForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryForm = ({ onSave, editingCategory, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    imagenUrl: '',
    activa: true,
  });

  const initialFormState = {
    nombre: '',
    imagenUrl: '',
    activa: true,
  };

  useEffect(() => {
    if (editingCategory) {
      setFormData(editingCategory);
    } else {
      setFormData(initialFormState);
    }
  }, [editingCategory]);

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
      if (editingCategory) {
        await axios.put(`http://localhost:3000/api/categorias/${editingCategory.id}`, formData);
        alert('Categoría editada con éxito.');
      } else {
        await axios.post('http://localhost:3000/api/categorias', formData);
        alert('Categoría agregada con éxito.');
      }
      onSave();
    } catch (error) {
      console.error('Error al guardar la categoría:', error);
      alert('Hubo un error al guardar la categoría.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        {editingCategory ? 'Editar Categoría' : 'Agregar Nueva Categoría'}
      </h3>
      <div className="space-y-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre de la categoría"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="imagenUrl"
          placeholder="URL de la imagen"
          value={formData.imagenUrl}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex items-center space-x-2">
          <label htmlFor="activa" className="text-gray-700">
            Activa:
          </label>
          <input
            id="activa"
            type="checkbox"
            name="activa"
            checked={formData.activa}
            onChange={handleChange}
            className="form-checkbox h-5 w-5 text-blue-600 rounded"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4 mt-6">
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
        >
          Guardar
        </button>
        {editingCategory && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default CategoryForm;