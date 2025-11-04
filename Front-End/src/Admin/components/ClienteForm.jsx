import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClienteForm = ({ show, handleClose, handleSave, cliente }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    contrasena: '',
  });
  
  const PASTEL_COLORS = {
    modalOverlay: 'bg-gray-900 bg-opacity-60',
    paper: 'bg-white',
    title: 'text-purple-600',
    text: 'text-gray-700',
    inputFocus: 'focus:ring-indigo-300 focus:border-indigo-300',
    saveButton: 'bg-indigo-300 hover:bg-indigo-400',
    cancelButton: 'bg-gray-400 hover:bg-gray-500',
  };

  useEffect(() => {
    if (cliente) {
      setFormData({
        nombre: cliente.nombre || '',
        telefono: cliente.telefono || '',
        email: cliente.email || '',
        contrasena: '', 
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
      const dataToSend = { ...formData };

      if (cliente) {
        if (dataToSend.contrasena === '') {
          delete dataToSend.contrasena;
        }
        await axios.put(`http://localhost:3000/api/clientes/${cliente.id}`, dataToSend);
        alert('Cliente editado con éxito.');
      } else {

        await axios.post('http://localhost:3000/api/clientes', dataToSend);
        alert('Cliente agregado con éxito.');
      }
      handleSave();
    } catch (err) {
      console.error("Error al guardar el cliente:", err);
      alert("Error al guardar el cliente. Revisa la consola.");
    }
  };
  
  if (!show) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${PASTEL_COLORS.modalOverlay}`}>
      <div className={`${PASTEL_COLORS.paper} p-6 rounded-lg shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100 border border-purple-100`}>
        <div className="flex justify-between items-center mb-4 border-b pb-2 border-gray-200">
          <h3 className={`text-2xl font-bold ${PASTEL_COLORS.title}`}>
            {cliente ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}
          </h3>
          <button 
            onClick={handleClose} 
            className="text-gray-500 hover:text-red-500 text-3xl font-bold leading-none transition duration-150"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${PASTEL_COLORS.text}`}>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className={`mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 ${PASTEL_COLORS.inputFocus} transition duration-150`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${PASTEL_COLORS.text}`}>Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className={`mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 ${PASTEL_COLORS.inputFocus} transition duration-150`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${PASTEL_COLORS.text}`}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 ${PASTEL_COLORS.inputFocus} transition duration-150`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${PASTEL_COLORS.text}`}>Contraseña</label>
              <input
                type="password"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                required={!cliente} 
                placeholder={cliente ? "Dejar vacío para no cambiar" : "Contraseña requerida"}
                className={`mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 ${PASTEL_COLORS.inputFocus} transition duration-150`}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button 
              type="button" 
              onClick={handleClose}
              className={`${PASTEL_COLORS.cancelButton} text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out shadow-md hover:scale-[1.02]`}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className={`${PASTEL_COLORS.saveButton} text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out shadow-md hover:scale-[1.02]`}
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