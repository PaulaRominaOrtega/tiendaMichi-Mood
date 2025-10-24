import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom'; 
import Sidebar from './SideBar'; 
import io from 'socket.io-client';
import { Snackbar, Alert, Box, IconButton, Typography } from '@mui/material'; 
import CloseIcon from '@mui/icons-material/Close';

const SOCKET_SERVER_URL = 'http://localhost:3000'; 

const SIDEBAR_WIDTH = '256px'; 

const PASTEL_STYLES = {
    backgroundColor: '#f8f4fb', 
    headerColor: '#8a2be2',   
    successBg: '#a8dadc',      
    successText: '#1d3557',  
    buttonBg: '#6a0dad',  
    buttonHover: '#7b2dae',
    divider: '#d8bcf5' 
};

const AdminLayout = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [pedidoId, setPedidoId] = useState(null);

  useEffect(() => {
    
    const socket = io(SOCKET_SERVER_URL, {});

    socket.on('nuevo_pedido', (data) => {
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
      window.location.href = `/admin/pedidos/${pedidoId}`;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: PASTEL_STYLES.backgroundColor, display: 'flex' }}> 
      
      <Sidebar />
    
      <div style={{ flex: 1, padding: '20px', marginLeft: SIDEBAR_WIDTH, transition: 'margin-left 0.3s' }}>
        <header style={{ paddingBottom: '20px', borderBottom: `2px solid ${PASTEL_STYLES.divider}`, marginBottom: '20px' }}>
          <Typography variant="h4" style={{ color: PASTEL_STYLES.headerColor, fontWeight: 'bold' }}>
            Bienvenido Administrador
          </Typography>
        </header>
        <main>
          <Outlet /> 
        </main>
      </div>

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
                    style={{ 
                        color: 'white', 
                        backgroundColor: PASTEL_STYLES.buttonBg, 
                        border: 'none', 
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer', 
                        marginRight: 8, 
                        fontWeight: 'bold',
                        transition: 'background-color 0.2s',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = PASTEL_STYLES.buttonHover}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = PASTEL_STYLES.buttonBg}
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
          sx={{ 
            width: '100%', 
            minWidth: '350px',
            backgroundColor: PASTEL_STYLES.successBg,
            color: PASTEL_STYLES.successText,
            '.MuiAlert-icon': { 
                color: PASTEL_STYLES.successText, 
            },
            '.MuiAlert-message': { 
                fontWeight: 'bold',
            }
          }}
        >
          ¡NUEVO PEDIDO RECIBIDO! ID: **#{pedidoId}**
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminLayout;