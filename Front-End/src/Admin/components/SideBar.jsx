// src/Admin/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { IoSpeedometerOutline, IoCubeOutline, IoPricetagsOutline, IoPeopleOutline, IoBagHandleOutline } from 'react-icons/io5';

const Sidebar = () => {
  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-6 flex flex-col transition-all duration-300 ease-in-out shadow-lg">
      <div className="flex items-center mb-10">
        <h2 className="text-2xl font-bold text-pink-300 tracking-wider">MichiAdmin</h2>
      </div>
      <nav className="flex-1">
        <ul className="space-y-6">
  
          <li>
            <Link 
              to="/admin/productos" 
              className="flex items-center space-x-4 text-lg text-gray-300 hover:text-white hover:bg-pink-500 hover:bg-opacity-20 rounded-lg p-3 transition-all duration-200"
            >
              <IoCubeOutline className="text-2xl" />
              <span>Productos</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/categorias" 
              className="flex items-center space-x-4 text-lg text-gray-300 hover:text-white hover:bg-pink-500 hover:bg-opacity-20 rounded-lg p-3 transition-all duration-200"
            >
              <IoPricetagsOutline className="text-2xl" />
              <span>Categorías</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/clientes" 
              className="flex items-center space-x-4 text-lg text-gray-300 hover:text-white hover:bg-pink-500 hover:bg-opacity-20 rounded-lg p-3 transition-all duration-200"
            >
              <IoPeopleOutline className="text-2xl" />
              <span>Clientes</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/pedidos" 
              className="flex items-center space-x-4 text-lg text-gray-300 hover:text-white hover:bg-pink-500 hover:bg-opacity-20 rounded-lg p-3 transition-all duration-200"
            >
              <IoBagHandleOutline className="text-2xl" />
              <span>Pedidos</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;