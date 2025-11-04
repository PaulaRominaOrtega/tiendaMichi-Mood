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
  
  const PASTEL_COLORS = {
    paper: 'bg-white',
    title: 'text-purple-600',
    text: 'text-gray-700',
    inputFocus: 'focus:ring-indigo-300 focus:border-indigo-300',
    saveButton: 'bg-green-400 hover:bg-green-500',
    cancelButton: 'bg-gray-400 hover:bg-gray-500',
    checkbox: 'text-indigo-400',
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
    <form onSubmit={handleSubmit} className={`${PASTEL_COLORS.paper} p-6 rounded-lg shadow-xl mb-6 border border-purple-100`}>
      <h3 className={`text-2xl font-bold mb-6 ${PASTEL_COLORS.title}`}>
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
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${PASTEL_COLORS.inputFocus} transition duration-150`}
        />
        <input
          type="text"
          name="imagenUrl"
          placeholder="URL de la imagen"
          value={formData.imagenUrl}
          onChange={handleChange}
          required
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${PASTEL_COLORS.inputFocus} transition duration-150`}
        />
        <div className="flex items-center space-x-3 pt-2">
          <label htmlFor="activa" className={`text-lg font-medium ${PASTEL_COLORS.text}`}>
            Categoría Activa:
          </label>
          <input
            id="activa"
            type="checkbox"
            name="activa"
            checked={formData.activa}
            onChange={handleChange}
            className={`form-checkbox h-5 w-5 rounded border-gray-300 ${PASTEL_COLORS.checkbox} focus:ring-0`}
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4 mt-8">
        <button
          type="submit"
          className={`${PASTEL_COLORS.saveButton} text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out shadow-md hover:scale-[1.02]`}
        >
          Guardar
        </button>
        {editingCategory && (
          <button
            type="button"
            onClick={onCancel}
            className={`${PASTEL_COLORS.cancelButton} text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out shadow-md hover:scale-[1.02]`}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default CategoryForm;