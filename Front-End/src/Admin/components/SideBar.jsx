import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoPeople, IoCart, IoLogOut, IoNotifications, IoList, IoGrid } from 'react-icons/io5';
import { io } from 'socket.io-client';
import AuthContext from "../../context/AuthContext";

const Sidebar = () => {
    const [newOrderCount, setNewOrderCount] = useState(0);
    const [socket, setSocket] = useState(null);
    const { logout } = useContext(AuthContext); 
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) return;

        const socket = io('http://localhost:3000', { auth: { token } });
        setSocket(socket);

        socket.on('connect', () => console.log('🔌 Socket.IO conectado'));
        socket.on('connect_error', (err) => console.error('Socket.IO Error:', err.message));
        socket.on('nuevoPedido', () => setNewOrderCount(prev => prev + 1));

        return () => socket.disconnect();
    }, []);

    const handlePedidosClick = () => setNewOrderCount(0);
    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const navItems = [
        { name: 'Clientes', path: '/admin/clientes', Icon: IoPeople },
        { name: 'Productos', path: '/admin/productos', Icon: IoCart },
        { name: 'Categorías', path: '/admin/categorias', Icon: IoGrid },
        { name: 'Pedidos', path: '/admin/pedidos', Icon: IoList, notification: newOrderCount },
    ];

    return (
        <aside className="fixed top-0 left-0 z-40 w-64 h-screen bg-white border-r border-gray-200 shadow-xl">
           
            <div className="h-full px-3 py-4 overflow-y-auto flex flex-col justify-between">
          
                <ul className="space-y-2 font-medium">
                    {navItems.map(item => (
                        <li key={item.name}>
                            <Link
                                to={item.path}
                                onClick={item.name === 'Pedidos' ? handlePedidosClick : undefined}
                                className={`flex items-center p-2 text-gray-900 rounded-lg transition duration-75 group 
                                    ${location.pathname.startsWith(item.path) ? 'bg-gray-200 text-indigo-700 font-semibold' : 'hover:bg-gray-100'} 
                                    ${item.notification > 0 ? 'relative' : ''}`}
                            >
                                <item.Icon className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                <span className="flex-1 ms-3 whitespace-nowrap">{item.name}</span>
                                
                                {item.notification > 0 && (
                                    <div className="relative ms-auto me-2">
                                        <IoNotifications className="w-6 h-6 text-red-500 animate-pulse" />
                                        <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 
                                                        bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 
                                                        flex items-center justify-center p-1 border border-white">
                                            {item.notification}
                                        </span>
                                    </div>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
               
                <ul className="space-y-2 font-medium border-t border-gray-200 pt-4 mt-4">
                    <li>
                        <button
                            onClick={handleLogout}
                            className="flex items-center p-2 w-full text-gray-900 rounded-lg hover:bg-red-100 transition duration-75 group"
                        >
                            <IoLogOut className="flex-shrink-0 w-6 h-6 text-red-600 transition duration-75" />
                            <span className="flex-1 ms-3 whitespace-nowrap text-red-600">Cerrar Sesión</span>
                        </button>
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;