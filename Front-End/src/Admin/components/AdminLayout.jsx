// src/Admin/components/AdminLayout.jsx
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom'; 
import Sidebar from './SideBar';
// 🚨 Importar el cliente de Socket.IO
import io from 'socket.io-client';
// 🚨 Importar componentes de MUI para la notificación
import { Snackbar, Alert, Box, IconButton } from '@mui/material'; 
import CloseIcon from '@mui/icons-material/Close';

// 🚨 URL de tu servidor de Back-End donde corre Socket.IO
// AJUSTA ESTA URL SI TU BACK-END NO USA EL PUERTO 3000
const SOCKET_SERVER_URL = 'http://localhost:3000'; 

const AdminLayout = () => {
  // Estado para manejar la notificación de nuevo pedido
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [pedidoId, setPedidoId] = useState(null);

  useEffect(() => {
    // 1. Inicializar la conexión con el servidor
    const socket = io(SOCKET_SERVER_URL, {
        // Opcional: Si usas autenticación o namespaces, agrégalo aquí
        // Por ejemplo, para asegurarte de que solo los admins escuchen.
    });

    // 2. Escuchar el evento 'nuevo_pedido'
    socket.on('nuevo_pedido', (data) => {
      console.log('¡Nuevo pedido recibido por Socket.IO!', data);
      
      // Actualiza el estado y abre la notificación
      setPedidoId(data.pedidoId || 'Desconocido'); 
      setOpenSnackbar(true);
      
      // Opcional: Reproducir un sonido de alerta para el administrador
      // const audio = new Audio('/ruta/a/sonido_alerta.mp3');
      // audio.play();
    });

    // 3. Limpiar la conexión al desmontar el componente (CRÍTICO)
    return () => {
      socket.disconnect();
    };
  }, []); // El array vacío asegura que se ejecute solo al montar y desmontar

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };
  
  // Acción para ver el pedido (navegar a la ruta de edición)
  const handleViewOrder = () => {
      setOpenSnackbar(false);
      // Asume que tienes una ruta para ver/editar pedidos por ID
      // Deberías usar useNavigate, pero para simplificar, usaremos window.location
      window.location.href = `/admin/pedidos/editar/${pedidoId}`;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f9' }}>
      
      {/* 4. Notificación de Nuevo Pedido */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={8000} // Se cierra automáticamente después de 8 segundos
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          action={
            <Box>
                <button 
                    onClick={handleViewOrder} 
                    style={{ color: 'white', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', marginRight: 8, fontWeight: 'bold' }}
                >
                    VER PEDIDO
                </button>
                <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={handleClose}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>
          }
          sx={{ width: '100%', minWidth: '350px' }}
        >
          ¡NUEVO PEDIDO RECIBIDO! ID: #{pedidoId}
        </Alert>
      </Snackbar>
      {/* --------------------------------- */}

      <Sidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        <header style={{ paddingBottom: '20px', borderBottom: '1px solid #ddd' }}>
          <h1>Panel de Administración</h1>
        </header>
        <main style={{ paddingTop: '20px' }}>
          {/* Aquí se renderizan los componentes de la subruta (Dashboard, ProductCrud, etc.) */}
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;