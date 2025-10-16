import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { IoTrash } from 'react-icons/io5'; 

const PedidoCrud = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        fetchPedidos();
    }, []);

    const fetchPedidos = async () => {
        const token = localStorage.getItem('adminToken'); 

        if (!token) {
            setError("Error: No está autenticado. Por favor, inicie sesión nuevamente.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get("http://localhost:3000/api/pedidos", {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });
            
            setPedidos(response.data.data);
            setLoading(false);
            setError(null); 
        } catch (err) {
            console.error("Detalle del Error al obtener pedidos:", err.response ? err.response.data : err.message);
            setError("Error al obtener los pedidos. Verifique su conexión y autenticación.");
            setLoading(false);
            setPedidos([]);
        }
    };
    
    const handleEstadoUpdate = async (id, estadoActual) => {
        const token = localStorage.getItem('adminToken'); 
        if (!token) return setError("No está autenticado.");

        const estado = estadoActual ? estadoActual.toUpperCase() : 'PENDIENTE';
        let nuevoEstado;

        if (estado === 'PENDIENTE') {
            nuevoEstado = 'En Proceso de Envío';
        } else if (estado === 'EN PROCESO DE ENVÍO') {
            nuevoEstado = 'Entregado';
        } else {
            nuevoEstado = 'Pendiente';
        }
        
        const confirmUpdate = window.confirm(`¿Cambiar el estado del pedido #${id} a "${nuevoEstado}"?`);
        if (!confirmUpdate) return;

        try {
            await axios.put(`http://localhost:3000/api/pedidos/estado/${id}`, {
                estado: nuevoEstado
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            fetchPedidos();
        } catch (err) {
            console.error("Error al actualizar estado:", err);
            setError("Error al actualizar el estado. (Asegúrese de que el endpoint PUT en su backend exista: /api/pedidos/estado/:id)");
        }
    };


    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este pedido?");
        if (confirmDelete) {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                setError("No se puede eliminar: Sesión expirada.");
                return;
            }

            try {
                await axios.delete(`http://localhost:3000/api/pedidos/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                fetchPedidos();
            } catch (err) {
                setError("Error al eliminar el pedido. Esto puede ser una restricción de la base de datos (Clave Foránea).");
            }
        }
    };

    if (loading) return <div className="p-4 text-center">Cargando pedidos...</div>;
    if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
    if (pedidos.length === 0) return <div className="p-4 text-center">No hay pedidos registrados.</div>;

    return (
        <div className="container mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
            
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Gestión de Pedidos</h2>
            
            <div className="overflow-x-auto">

                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <tr>
                            <th className="py-3 px-6 text-left">ID</th>
                            <th className="py-3 px-6 text-left">CLIENTE</th>
                            <th className="py-3 px-6 text-left">FECHA</th>
                            <th className="py-3 px-6 text-left">TOTAL</th>
                            <th className="py-3 px-6 text-center">ESTADO</th>
                            <th className="py-3 px-6 text-center">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {pedidos.map((pedido) => {
                            const estadoVisual = pedido.estado ? pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1) : 'Pendiente';
                            
                            let estadoClase = 'bg-gray-100 text-gray-800'; 
                            if (estadoVisual.includes('Pendiente')) {
                                estadoClase = 'bg-red-100 text-red-800';
                            } else if (estadoVisual.includes('Envío')) {
                                estadoClase = 'bg-yellow-100 text-yellow-800';
                            } else if (estadoVisual.includes('Entregado')) {
                                estadoClase = 'bg-green-100 text-green-800';
                            }

                            return (
                                <tr key={pedido.id} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-6 text-left whitespace-nowrap">{pedido.id}</td>
                                    
                                    <td className="py-3 px-6 text-left">
                                        {pedido.cliente ? pedido.cliente.nombre : "Cliente no encontrado"}
                                    </td>
                                    
                                    <td className="py-3 px-6 text-left">{new Date(pedido.fecha).toLocaleDateString()}</td>
                                    <td className="py-3 px-6 text-left">${pedido.total.toFixed(2)}</td>
                                    
                                    <td className="py-3 px-6 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${estadoClase}`}>
                                            {estadoVisual}
                                        </span>
                                    </td>
                                    
                                    <td className="py-3 px-6 text-center">
                                        <div className="flex item-center justify-center space-x-3">
                                            <button
                                                onClick={() => handleEstadoUpdate(pedido.id, pedido.estado)}
                                                className="text-indigo-600 transform hover:text-indigo-800 hover:scale-110 transition duration-150"
                                                title={`Estado actual: ${estadoVisual}. Click para cambiar.`}
                                            >
                                                <span className="text-xs font-medium">Editar Estado</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(pedido.id)}
                                                className="text-red-500 transform hover:text-red-700 hover:scale-110 transition duration-150"
                                                title="Eliminar"
                                            >
                                                <IoTrash className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PedidoCrud;