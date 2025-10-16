import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const pedidoId = location.state?.pedidoId;
  const total = location.state?.total;

  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
      <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
      <Typography variant="h3" gutterBottom>
        ¡Pedido Confirmado!
      </Typography>
      
      {pedidoId ? (
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Tu pedido **#{pedidoId}** ha sido registrado con éxito.
        </Typography>
      ) : (
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Tu pedido ha sido registrado con éxito.
        </Typography>
      )}

      {total && (
        <Typography variant="h6" sx={{ mb: 4 }}>
          Monto total: **${total.toFixed(2)}**
        </Typography>
      )}

      <Box sx={{ mt: 4 }}>
        <Button 
          variant="contained" 
          component={Link} 
          to="/productos" 
          sx={{ mr: 2 }}
        >
          Volver a Comprar
        </Button>
        <Button 
          variant="outlined" 
          component={Link} 
          to="/pedidos" 
        >
          Ver Mis Pedidos
        </Button>
      </Box>
    </Container>
  );
};

export default OrderConfirmationPage;