import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const PedidoForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        estado: false,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pedido, setPedido] = useState(null);

    useEffect(() => {
        const fetchPedido = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/pedidos/${id}`);
                setPedido(response.data.data);
                setFormData({
                    estado: response.data.data.estado,
                });
                setLoading(false);
            } catch (err) {
                setError("Error al cargar los datos del pedido.");
                setLoading(false);
            }
        };

        if (id) {
            fetchPedido();
        } else {
            setLoading(false);
        }
    }, [id]);

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
            await axios.put(`http://localhost:3000/api/pedidos/${id}`, formData);
            alert("Pedido actualizado exitosamente");
            navigate("/admin/pedidos");
        } catch (err) {
            setError("Error al actualizar el pedido.");
        }
    };

    if (loading) return <div className="p-4 text-center">Cargando formulario...</div>;
    if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-center">
                Editar Pedido #{id}
            </h2>
            
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Información del Cliente</h3>
                <p><strong>Nombre:</strong> {pedido?.cliente?.nombre || 'N/A'}</p>
                <p><strong>Email:</strong> {pedido?.cliente?.email || 'N/A'}</p>
                <p><strong>Teléfono:</strong> {pedido?.cliente?.telefono || 'N/A'}</p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Detalles de los Productos</h3>
                {pedido?.detalles?.length > 0 ? (
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-2 px-4 border-b">Producto</th>
                                <th className="py-2 px-4 border-b">Cantidad</th>
                                <th className="py-2 px-4 border-b">Precio Unitario</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedido.detalles.map((detalle) => (
                                <tr key={detalle.id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b">{detalle.producto?.nombre || 'N/A'}</td>
                                    <td className="py-2 px-4 border-b">{detalle.cantidad}</td>
                                    <td className="py-2 px-4 border-b">${detalle.precio_unitario}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No hay productos en este pedido.</p>
                )}
            </div>

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <div className="flex items-center mt-1">
                        <input
                            type="checkbox"
                            name="estado"
                            checked={formData.estado}
                            onChange={handleChange}
                            className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="ml-2 text-gray-700">{formData.estado ? 'Activo' : 'Inactivo'}</span>
                    </div>
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/pedidos")}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PedidoForm;