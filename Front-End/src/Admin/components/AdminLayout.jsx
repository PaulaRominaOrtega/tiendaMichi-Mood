import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom'; 
import Sidebar from './SideBar'; 
import io from 'socket.io-client';
import { Snackbar, Alert, Box, IconButton } from '@mui/material'; 
import CloseIcon from '@mui/icons-material/Close';


const SOCKET_SERVER_URL = 'http://localhost:3000'; 

const SIDEBAR_WIDTH = '256px'; 

const AdminLayout = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [pedidoId, setPedidoId] = useState(null);

  useEffect(() => {
    
    const socket = io(SOCKET_SERVER_URL, {
        
    });

    socket.on('nuevo_pedido', (data) => {

      console.log('¡Nuevo pedido recibido por Socket.IO!', data);
      
      setPedidoId(data.pedidoId || 'Desconocido'); 
      setOpenSnackbar(true);
    });
    return () => {
      socket.disconnect();
    };
  }, []); 

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };
  
  const handleViewOrder = () => {
      setOpenSnackbar(false);
      window.location.href = `/admin/pedidos/editar/${pedidoId}`;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f7f9' }}> 
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={8000} 
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
      
      <Sidebar />
    
      <div style={{ flex: 1, padding: '20px', marginLeft: SIDEBAR_WIDTH }}>
        <header style={{ paddingBottom: '20px', borderBottom: '1px solid #ddd' }}>
          <h1>Bienvenido Administrador</h1>
        </header>
        <main style={{ paddingTop: '20px' }}>
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;