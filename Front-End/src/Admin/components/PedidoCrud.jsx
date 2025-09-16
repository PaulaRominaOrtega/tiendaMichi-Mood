import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PedidoCrud = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPedidos();
    }, []);

    const fetchPedidos = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:3000/api/pedidos");
            setPedidos(response.data.data);
            setLoading(false);
        } catch (err) {
            setError("Error al obtener los pedidos. Por favor, intente de nuevo.");
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este pedido?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:3000/api/pedidos/${id}`);
                fetchPedidos();
            } catch (err) {
                setError("Error al eliminar el pedido.");
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
                            <th className="py-3 px-6 text-left">Cliente</th>
                            <th className="py-3 px-6 text-left">Fecha</th>
                            <th className="py-3 px-6 text-left">Total</th>
                            <th className="py-3 px-6 text-left">Estado</th>
                            <th className="py-3 px-6 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {pedidos.map((pedido) => (
                            <tr key={pedido.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left whitespace-nowrap">{pedido.id}</td>
                                <td className="py-3 px-6 text-left">{pedido.cliente?.nombre || 'N/A'}</td>
                                <td className="py-3 px-6 text-left">{new Date(pedido.fecha).toLocaleDateString()}</td>
                                <td className="py-3 px-6 text-left">${pedido.total}</td>
                                <td className="py-3 px-6 text-left">
                                    <span className={`px-2 py-1 font-semibold leading-tight rounded-full ${pedido.estado ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'}`}>
                                        {pedido.estado ? "Activo" : "Inactivo"}
                                    </span>
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex item-center justify-center">
                                        <Link 
                                            to={`/admin/pedidos/editar/${pedido.id}`}
                                            className="w-4 mr-2 transform hover:text-blue-500 hover:scale-110"
                                            title="Editar"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(pedido.id)}
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
        </div>
    );
};

export default PedidoCrud;