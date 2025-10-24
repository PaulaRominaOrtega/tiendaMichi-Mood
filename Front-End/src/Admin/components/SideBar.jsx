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

    const PASTEL_COLORS = {
        background: 'bg-white', 
        border: 'border-purple-200',
        activeBg: 'bg-indigo-100', 
        activeText: 'text-purple-700', 
        hoverBg: 'hover:bg-pink-50', 
        iconColor: 'text-gray-600',
        logoutHover: 'hover:bg-red-50',
        logoutIcon: 'text-red-500',
        notificationBg: 'bg-red-500', 
    };

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
        <aside className={`fixed top-0 left-0 z-40 w-64 h-screen ${PASTEL_COLORS.background} border-r ${PASTEL_COLORS.border} shadow-xl`}>
           
            <div className="h-full px-3 py-6 overflow-y-auto flex flex-col justify-between">
                
                <div className="text-2xl font-bold text-purple-700 mb-6 px-2">
                  Panel Administración
                </div>
          
                <ul className="space-y-2 font-medium flex-grow">
                    {navItems.map(item => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <li key={item.name}>
                                <Link
                                    to={item.path}
                                    onClick={item.name === 'Pedidos' ? handlePedidosClick : undefined}
                                    className={`flex items-center p-3 text-gray-800 rounded-xl transition duration-150 group 
                                        ${isActive 
                                            ? `${PASTEL_COLORS.activeBg} ${PASTEL_COLORS.activeText} font-bold shadow-sm` 
                                            : `${PASTEL_COLORS.hoverBg} ${PASTEL_COLORS.iconColor}`} 
                                        ${item.notification > 0 ? 'relative' : ''}`}
                                >
                                    <item.Icon className={`flex-shrink-0 w-6 h-6 ${isActive ? PASTEL_COLORS.activeText : PASTEL_COLORS.iconColor} transition duration-150`} />
                                    <span className="flex-1 ms-3 whitespace-nowrap">{item.name}</span>
                                    
                                    {item.notification > 0 && (
                                        <div className="relative ms-auto me-1">
                                            <IoNotifications className="w-6 h-6 text-red-400 animate-pulse" />
                                            <span className={`absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 
                                                            ${PASTEL_COLORS.notificationBg} text-white text-[10px] font-extrabold rounded-full h-5 w-5 
                                                            flex items-center justify-center border-2 border-white/50 shadow-md`}>
                                                {item.notification}
                                            </span>
                                        </div>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
               
                <ul className="space-y-2 font-medium border-t border-purple-200 pt-4 mt-4">
                    <li>
                        <button
                            onClick={handleLogout}
                            className={`flex items-center p-3 w-full text-gray-800 rounded-xl ${PASTEL_COLORS.logoutHover} transition duration-150 group`}
                        >
                            <IoLogOut className={`flex-shrink-0 w-6 h-6 ${PASTEL_COLORS.logoutIcon} transition duration-150`} />
                            <span className={`flex-1 ms-3 whitespace-nowrap ${PASTEL_COLORS.logoutIcon} font-semibold`}>Cerrar Sesión</span>
                        </button>
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;