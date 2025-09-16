// src/components/ClienteCrud.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClienteForm from '../components/ClienteForm';

const ClienteCrud = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/clientes');
      setClientes(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Error al obtener los clientes. Revisa la consola para más detalles.");
      setLoading(false);
      console.error("Error al obtener los clientes:", err);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este cliente?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3000/api/clientes/${id}`);
        fetchClientes();
      } catch (err) {
        setError("Error al eliminar el cliente.");
        console.error("Error:", err);
      }
    }
  };

  const handleEdit = (cliente) => {
    setSelectedCliente(cliente);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedCliente(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCliente(null);
  };

  const handleSave = () => {
    fetchClientes();
    handleCloseModal();
  };

  if (loading) return <div className="p-4 text-center">Cargando clientes...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Gestión de Clientes</h2>

      <div className="mb-6 flex justify-end">
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
        >
          Agregar Nuevo Cliente
        </button>
      </div>

      {clientes.length === 0 ? (
        <div className="text-center p-4 bg-white rounded-lg shadow">
          <p className="text-gray-600">No hay clientes registrados.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Nombre</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Teléfono</th>
                <th className="py-3 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{cliente.id}</td>
                  <td className="py-3 px-6 text-left">{cliente.nombre}</td>
                  <td className="py-3 px-6 text-left">{cliente.email}</td>
                  <td className="py-3 px-6 text-left">{cliente.telefono}</td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <button
                        onClick={() => handleEdit(cliente)}
                        className="w-4 mr-2 transform hover:text-blue-500 hover:scale-110"
                        title="Editar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(cliente.id)}
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
      )}

      {showModal && (
        <ClienteForm
          show={showModal}
          handleClose={handleCloseModal}
          handleSave={handleSave}
          cliente={selectedCliente}
        />
      )}
    </div>
  );
};

export default ClienteCrud;