// src/Admin/components/PedidoForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { IoTrash } from 'react-icons/io5'; 

const PedidoForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        estado: 'Pendiente', 
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pedido, setPedido] = useState(null);
 
    const estadosOpciones = [
        { value: 'Pendiente', label: 'Pendiente' },
        { value: 'En Proceso de Envío', label: 'En Proceso de Envío' },
        { value: 'Entregado', label: 'Completado (Entregado)' },
    ];
    
    const PASTEL_COLORS = {
        background: 'bg-pink-50', 
        paper: 'bg-white',
        primary: 'bg-indigo-300', 
        primaryHover: 'hover:bg-indigo-400',
        secondary: 'bg-teal-100', 
        secondaryHover: 'hover:bg-teal-200',
        text: 'text-gray-700',
        title: 'text-purple-600',
        error: 'text-red-500',
        danger: 'bg-red-400',
        dangerHover: 'hover:bg-red-500',
        backButton: 'bg-gray-300',
        backButtonHover: 'hover:bg-gray-400',
    };

    const fetchPedido = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) throw new Error("No está autenticado.");

            const response = await axios.get(`http://localhost:3000/api/pedidos/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });

            setPedido(response.data.data);
            const estadoActual = response.data.data.estado || 'Pendiente';
            setFormData({
                estado: estadoActual, 
            });
            setLoading(false);
        } catch (err) {
            setError("Error al cargar los datos del pedido.");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchPedido();
        } else {
            setLoading(false);
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            
            await axios.put(`http://localhost:3000/api/pedidos/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Pedido actualizado exitosamente");
            navigate("/admin/pedidos");
        } catch (err) {
            setError("Error al actualizar el pedido. Verifique que su endpoint PUT pueda manejar la actualización del campo 'estado'.");
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar el pedido #${id} permanentemente? Esta acción es irreversible.`);
        if (confirmDelete) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`http://localhost:3000/api/pedidos/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert(`Pedido #${id} eliminado exitosamente.`);
                navigate("/admin/pedidos");
            } catch (err) {
                setError("Error al eliminar el pedido. Verifique permisos o restricciones de la base de datos.");
            }
        }
    };

    if (loading) return <div className={`p-4 text-center ${PASTEL_COLORS.text}`}>Cargando detalle del pedido...</div>;
    if (error) return <div className={`p-4 text-center ${PASTEL_COLORS.error}`}>{error}</div>;

    const estadoActualVisual = formData.estado || 'Pendiente';
    let estadoClase = 'bg-gray-100 text-gray-800'; 
    if (estadoActualVisual.includes('Pendiente')) {
        estadoClase = 'bg-red-100 text-red-800';
    } else if (estadoActualVisual.includes('Envío')) {
        estadoClase = 'bg-yellow-100 text-yellow-800';
    } else if (estadoActualVisual.includes('Entregado')) {
        estadoClase = 'bg-green-100 text-green-800';
    }

    return (
        <div className={`container mx-auto p-4 ${PASTEL_COLORS.background} rounded-lg shadow-xl`}>
            
            <div className="flex justify-between items-center mb-6 border-b border-purple-200 pb-2">
                <h2 className={`text-3xl font-bold ${PASTEL_COLORS.title}`}>
                    Detalle / Edición Pedido #{id}
                </h2>
            </div>
            
            <div className={`${PASTEL_COLORS.paper} shadow-lg rounded-lg p-6 mb-6 border border-purple-100`}>
                <h3 className={`text-xl font-semibold mb-4 ${PASTEL_COLORS.text}`}>Información del Cliente y Pedido</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p className={PASTEL_COLORS.text}><strong>Nombre Cliente:</strong> {pedido?.cliente?.nombre || 'N/A'}</p>
                    <p className={PASTEL_COLORS.text}><strong>Email Cliente:</strong> {pedido?.cliente?.email || 'N/A'}</p>
                    <p className={PASTEL_COLORS.text}><strong>Teléfono:</strong> {pedido?.cliente?.telefono || 'N/A'}</p>
                    <p className={PASTEL_COLORS.text}><strong>Fecha del Pedido:</strong> {new Date(pedido?.fecha).toLocaleDateString() || 'N/A'}</p>
                    <p className={PASTEL_COLORS.text}><strong>Total:</strong> ${pedido?.total?.toFixed(2) || '0.00'}</p>
                    <p>
                        <strong>Estado Actual:</strong> 
                        <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${estadoClase}`}>
                            {estadoActualVisual}
                        </span>
                    </p>
                </div>
            </div>

            <div className={`${PASTEL_COLORS.paper} shadow-lg rounded-lg p-6 mb-6 border border-purple-100`}>
                <h3 className={`text-xl font-semibold mb-4 ${PASTEL_COLORS.text}`}>Productos Comprados</h3>
                {pedido?.detalles?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full rounded-lg overflow-hidden">
                            <thead className={PASTEL_COLORS.secondary}>
                                <tr>
                                    <th className={`py-3 px-4 border-b ${PASTEL_COLORS.text} text-left`}>Producto</th>
                                    <th className={`py-3 px-4 border-b ${PASTEL_COLORS.text} text-left`}>Cantidad</th>
                                    <th className={`py-3 px-4 border-b ${PASTEL_COLORS.text} text-right`}>Precio Unitario</th>
                                    <th className={`py-3 px-4 border-b ${PASTEL_COLORS.text} text-right`}>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedido.detalles.map((detalle, index) => (
                                    <tr 
                                        key={detalle.id || index} 
                                        className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-pink-50'} hover:bg-teal-50`}
                                    >
                                        <td className={`py-2 px-4 ${PASTEL_COLORS.text}`}>{detalle.producto?.nombre || 'N/A'}</td>
                                        <td className={`py-2 px-4 ${PASTEL_COLORS.text}`}>{detalle.cantidad}</td>
                                        <td className={`py-2 px-4 ${PASTEL_COLORS.text} text-right`}>${parseFloat(detalle.precio_unitario).toFixed(2)}</td>
                                        <td className={`py-2 px-4 ${PASTEL_COLORS.text} text-right font-medium`}>
                                            ${(detalle.cantidad * parseFloat(detalle.precio_unitario)).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className={PASTEL_COLORS.text}>No hay productos en este pedido.</p>
                )}
            </div>

            <form onSubmit={handleSubmit} className={`${PASTEL_COLORS.paper} shadow-lg rounded-lg p-6 border border-purple-100`}>
                <h3 className={`text-xl font-semibold mb-4 ${PASTEL_COLORS.text}`}>Acciones del Pedido</h3>
             
                <div className="mb-6">
                    <label htmlFor="estado" className={`block text-lg font-bold mb-2 ${PASTEL_COLORS.text}`}>
                        Actualizar Estado del Pedido
                    </label>
                    <select
                        id="estado"
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-300 focus:border-purple-300 transition duration-150"
                    >
                        {estadosOpciones.map((op) => (
                            <option key={op.value} value={op.value}>{op.label}</option>
                        ))}
                    </select>
                </div>
                
                <div className="flex justify-between items-center space-x-2">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/pedidos")}
                        className={`${PASTEL_COLORS.backButton} ${PASTEL_COLORS.backButtonHover} ${PASTEL_COLORS.text} font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out shadow-md`}
                    >
                        Volver a la Lista
                    </button>
                    
                    <div className="flex space-x-2">
                    
                        <button
                            type="button"
                            onClick={handleDelete}
                            className={`${PASTEL_COLORS.danger} ${PASTEL_COLORS.dangerHover} text-white font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out flex items-center shadow-md`}
                            title="Eliminar Pedido"
                        >
                            <IoTrash className="w-5 h-5 mr-1" />
                            Eliminar
                        </button>

                        <button
                            type="submit"
                            className={`${PASTEL_COLORS.primary} ${PASTEL_COLORS.primaryHover} text-white font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out shadow-md`}
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PedidoForm;