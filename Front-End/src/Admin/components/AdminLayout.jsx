// src/Admin/components/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom'; 
import Sidebar from './SideBar';

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f9' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        <header style={{ paddingBottom: '20px', borderBottom: '1px solid #ddd' }}>
          <h1>Panel de Administración</h1>
        </header>
        <main style={{ paddingTop: '20px' }}>
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;