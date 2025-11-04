import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; 
import { IoEye } from 'react-icons/io5'; 

const PedidoCrud = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 5; 
    
    const PASTEL_COLORS = {
        background: 'bg-pink-50',
        paper: 'bg-white',
        title: 'text-purple-600',
        text: 'text-gray-700',
        tableHeader: 'bg-teal-100',
        tableHeaderText: 'text-gray-700',
        paginationBg: 'bg-purple-200',
        paginationHover: 'hover:bg-purple-300',
        eyeIcon: 'text-indigo-400 hover:text-indigo-600',
        estadoPendiente: 'bg-red-100 text-red-700',
        estadoEnvio: 'bg-yellow-100 text-yellow-700',
        estadoEntregado: 'bg-green-100 text-green-700',
        estadoDefault: 'bg-gray-100 text-gray-700',
        hoverRow: 'hover:bg-teal-50',
    };

    const fetchPedidos = async () => {
        const token = localStorage.getItem('adminToken'); 

        if (!token) {
            setError("Error: No está autenticado. Por favor, inicie sesión nuevamente.");
            setLoading(false);
            return;
        }
        
        let url = `http://localhost:3000/api/pedidos?page=${currentPage}&limit=${itemsPerPage}`;
        
        try {
            setLoading(true);
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });
            
            setPedidos(response.data.data);
            setTotalPages(response.data.pagination.totalPages || 1); 
            setLoading(false);
            setError(null); 
        } catch (err) {
            console.error("Detalle del Error al obtener pedidos:", err.response ? err.response.data : err.message);
            setError("Error al obtener los pedidos. Verifique su conexión y autenticación.");
            setLoading(false);
            setPedidos([]);
        }
    };
    
    useEffect(() => {
        fetchPedidos();
    }, [currentPage]); 
    
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const getEstadoClase = (estado) => {
        const estadoVisual = estado ? estado.charAt(0).toUpperCase() + estado.slice(1) : 'Pendiente';
        if (estadoVisual.includes('Pendiente')) return PASTEL_COLORS.estadoPendiente;
        if (estadoVisual.includes('Envío')) return PASTEL_COLORS.estadoEnvio;
        if (estadoVisual.includes('Entregado')) return PASTEL_COLORS.estadoEntregado;
        return PASTEL_COLORS.estadoDefault;
    };


    if (loading) return <div className={`p-4 text-center ${PASTEL_COLORS.text}`}>Cargando pedidos...</div>;
    if (error) return <div className={`p-4 text-center text-red-500`}>{error}</div>;
    

    return (
        <div className={`container mx-auto p-4 ${PASTEL_COLORS.background} rounded-lg shadow-xl`}>
            
            <h2 className={`text-3xl font-bold mb-6 text-center ${PASTEL_COLORS.title}`}>Gestión de Pedidos</h2>
            
            <h3 className={`text-xl font-semibold mb-4 ${PASTEL_COLORS.text}`}>Lista de Pedidos</h3>

            {pedidos.length === 0 ? (
                 <div className={`p-6 ${PASTEL_COLORS.paper} rounded-lg shadow-md`}>
                    <p className={`${PASTEL_COLORS.text} text-center`}>No hay pedidos registrados en esta página.</p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <div className={`${PASTEL_COLORS.paper} shadow-lg rounded-lg overflow-hidden border border-gray-200`}>
                            <table className="min-w-full">
                                <thead className={`${PASTEL_COLORS.tableHeader} text-sm leading-normal`}>
                                    <tr>
                                        <th className={`py-3 px-6 text-center ${PASTEL_COLORS.tableHeaderText}`}>N° pedido</th>
                                        <th className={`py-3 px-6 text-left ${PASTEL_COLORS.tableHeaderText}`}>Cliente</th>
                                        <th className={`py-3 px-6 text-left ${PASTEL_COLORS.tableHeaderText}`}>Fecha</th>
                                        <th className={`py-3 px-6 text-right ${PASTEL_COLORS.tableHeaderText}`}>Total</th>
                                        <th className={`py-3 px-6 text-center ${PASTEL_COLORS.tableHeaderText}`}>Estado</th> 
                                        <th className={`py-3 px-6 text-center ${PASTEL_COLORS.tableHeaderText}`}>Acciones</th> 
                                    </tr>
                                </thead>
                                <tbody className={`${PASTEL_COLORS.text} text-sm font-light`}>
                                    {pedidos.map((pedido, index) => {
                                        const estadoVisual = pedido.estado ? pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1) : 'Pendiente';

                                        return (
                                            <tr 
                                                key={pedido.id} 
                                                className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-pink-50'} ${PASTEL_COLORS.hoverRow} transition duration-150`}
                                            >
                                                <td className="py-3 px-6 text-center whitespace-nowrap">{pedido.id}</td>
                                                <td className="py-3 px-6 text-left">
                                                    {pedido.cliente ? pedido.cliente.nombre : "Cliente no encontrado"}
                                                </td>
                                                <td className="py-3 px-6 text-left">{new Date(pedido.fecha).toLocaleDateString()}</td>
                                                <td className="py-3 px-6 text-right">${pedido.total.toFixed(2)}</td>
                                                
                                                <td className="py-3 px-6 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getEstadoClase(pedido.estado)}`}>
                                                        {estadoVisual}
                                                    </span>
                                                </td>
                                                
                                                <td className="py-3 px-6 text-center">
                                                    <div className="flex item-center justify-center">
                                                        <Link 
                                                            to={`/admin/pedidos/${pedido.id}`} 
                                                            title="Ver Detalle del Pedido"
                                                            className={`w-5 h-5 transform ${PASTEL_COLORS.eyeIcon} hover:scale-110 transition duration-150`}
                                                        >
                                                            <IoEye className="w-5 h-5" />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-6">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`p-2 ${PASTEL_COLORS.paginationBg} ${PASTEL_COLORS.text} font-bold rounded-lg ${PASTEL_COLORS.paginationHover} disabled:opacity-50 transition duration-300 ease-in-out`}
                            title="Página Anterior"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                        </button>
                        <span className={`${PASTEL_COLORS.text} mx-4`}>
                            Página <span className="font-bold">{currentPage}</span> de <span className="font-bold">{totalPages}</span>
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                            className={`p-2 ${PASTEL_COLORS.paginationBg} ${PASTEL_COLORS.text} font-bold rounded-lg ${PASTEL_COLORS.paginationHover} disabled:opacity-50 transition duration-300 ease-in-out`}
                            title="Página Siguiente"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default PedidoCrud;