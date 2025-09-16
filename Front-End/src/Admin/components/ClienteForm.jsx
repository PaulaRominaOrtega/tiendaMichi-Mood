// src/components/ClienteForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClienteForm = ({ show, handleClose, handleSave, cliente }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    contrasena: '',
  });

  useEffect(() => {
    if (cliente) {
      setFormData({
        nombre: cliente.nombre || '',
        telefono: cliente.telefono || '',
        email: cliente.email || '',
        contrasena: '', // Mantener la contraseña vacía al editar
      });
    } else {
      setFormData({
        nombre: '',
        telefono: '',
        email: '',
        contrasena: '',
      });
    }
  }, [cliente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Crear un objeto con los datos a enviar
      const dataToSend = { ...formData };

      // Lógica condicional para manejar la contraseña
      if (cliente) {
        // Modo de edición: Si la contraseña está vacía, no la enviamos al backend.
        if (dataToSend.contrasena === '') {
          delete dataToSend.contrasena;
        }
        await axios.put(`http://localhost:3000/api/clientes/${cliente.id}`, dataToSend);
        alert('Cliente editado con éxito.');
      } else {
        // Modo de creación: La contraseña es obligatoria.
        await axios.post('http://localhost:3000/api/clientes', dataToSend);
        alert('Cliente agregado con éxito.');
      }
      handleSave();
    } catch (err) {
      console.error("Error al guardar el cliente:", err);
      alert("Error al guardar el cliente. Revisa la consola.");
    }
  };
  
  // El resto de tu componente...
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-2xl max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {cliente ? 'Editar Cliente' : 'Agregar Cliente'}
          </h3>
          <button 
            onClick={handleClose} 
            className="text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                type="password"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                required={!cliente} // La contraseña solo es requerida al crear un nuevo cliente
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button 
              type="button" 
              onClick={handleClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteForm;