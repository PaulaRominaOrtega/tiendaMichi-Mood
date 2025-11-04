import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const SOFT_PINK = '#EACAD8';       
const MINT_PASTEL = '#A8E6CF';     
const BEIGE_LIGHT = '#F5F5DC';     
const TEXT_DARK = '#4B4B4B';       

const OrderConfirmationPage = () => {
  const location = useLocation();
  const pedidoId = location.state?.pedidoId;
  const total = location.state?.total;
  
  const formatTotal = (amount) => {
    return amount.toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS', 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  return (
    <Container 
        maxWidth="sm" 
        sx={{ 
            py: { xs: 6, md: 10 }, 
            textAlign: 'center',
            backgroundColor: 'white', 
            borderRadius: '16px', 
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
            mt: 4,
            mb: 4,
        }}
    >
        <CheckCircleOutlineIcon 
            sx={{ 
                fontSize: 90, 
                color: MINT_PASTEL,
                mb: 3,
            }} 
        />
        
        <Typography 
            variant="h3" 
            gutterBottom 
            sx={{ 
                fontWeight: 700, 
                color: TEXT_DARK,
                mt: 1,
            }}
        >
            ¡Pedido Confirmado!
        </Typography>
        
        <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ 
                mb: 4, 
                color: TEXT_DARK 
            }}
        >
            {pedidoId ? (
                <>
                    Tu pedido <Box component="span" sx={{ fontWeight: 600, color: SOFT_PINK }}>Nº {pedidoId}</Box> ha sido registrado con éxito.
                </>
            ) : (
                "Tu pedido ha sido registrado con éxito."
            )}
        </Typography>

        {total && (
            <Box sx={{ 
                mb: 5, 
                p: 2, 
                backgroundColor: BEIGE_LIGHT, 
                borderRadius: '8px',
                display: 'inline-block'
            }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: TEXT_DARK }}>
                    Monto total: <Box component="span" sx={{ color: SOFT_PINK }}>{formatTotal(total)}</Box>
                </Typography>
            </Box>
        )}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            
            <Button 
                variant="contained" 
                component={Link} 
                to="/productos" 
                size="large"
                sx={{ 
                    backgroundColor: SOFT_PINK,
                    color: 'white', 
                    fontWeight: 'bold',
                    '&:hover': {
                        backgroundColor: '#D1A9B6', 
                    },
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                Volver a Comprar
            </Button>
            
        </Box>
    </Container>
  );
};

export default OrderConfirmationPage;