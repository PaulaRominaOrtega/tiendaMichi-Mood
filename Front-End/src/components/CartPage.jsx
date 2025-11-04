import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; 
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    CardMedia,
    Divider,
    IconButton,
    Grid,
    CircularProgress, 
    Alert, 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';

const BACKEND_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const DEFAULT_IMAGE_PATH = '/images/default.jpg'; 

const pastelColors = {
    background: '#f8f8f4', 
    primary: '#ffb3c1',
    primaryDark: '#e098a5', 
    secondary: '#c8f0c8', 
    secondaryDark: '#aae0aa',
    buttonText: '#3b3b3b', 
    text: '#4a4a4a',
    success: '#90EE90',
    error: '#f44336', 
    warning: '#ffc107',
    paper: 'white',
};

const pastelTheme = {
    primary: {
        main: pastelColors.primary,
        light: pastelColors.primary,
        dark: pastelColors.primaryDark,
    },
    secondary: {
        main: pastelColors.secondary,
        dark: pastelColors.secondaryDark,
    },
    error: {
        main: pastelColors.error,
    },
    warning: {
        main: pastelColors.warning,
    },
};


const getFirstImageUrl = (imageString) => {
    if (!imageString) return DEFAULT_IMAGE_PATH;
    const imageNames = imageString.split(',');
    const firstName = imageNames[0].trim();
    return firstName 
      ? `${BACKEND_BASE_URL}/uploads/${firstName}` 
      : DEFAULT_IMAGE_PATH;
};

const CartPage = () => {
    const { 
        cart, 
        totalItems, 
        totalPrice, 
        updateQuantity, 
        removeFromCart,
        clearCart, 
    } = useCart();
    
    const { isAuthenticated, clienteId, email } = useAuth(); 

    const navigate = useNavigate(); 
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ message: '', severity: '' }); 
    

    const handleCheckout = async () => {
        
        if (cart.length === 0) return;
        
        if (!isAuthenticated || !clienteId) { 
             setNotification({ message: "Debes iniciar sesión para completar la compra.", severity: "warning" });
             setTimeout(() => navigate('/login'), 1500); 
             return; 
        }

        setIsLoading(true);
        setNotification({ message: '', severity: '' }); 
        const orderPayload = {
        
            idCliente: clienteId, 
            total: totalPrice,
            items: cart.map(item => ({
                productoId: item.id,
                cantidad: item.quantity,
                precioUnitario: item.precio,
                nombre: item.nombre, 
            })),
        };

        try {

            const response = await axios.post(`${BACKEND_BASE_URL}/api/pedidos`, orderPayload);
            
            clearCart(); 
            
            navigate('/confirmacion-pedido', { 
                state: { 
                    pedidoId: response.data.data.id,
                    total: totalPrice,
                    clienteEmail: email,
                } 
            }); 

        } catch (error) {
            console.error("Error al finalizar el pedido:", error.response || error);
            
            const errorMessage = error.response?.data?.error 
                                || error.response?.data?.message 
                                || "Error desconocido al procesar el pedido. Intenta nuevamente.";
            
            setNotification({ message: ` Fallo: ${errorMessage}`, severity: "error" });
            
        } finally {
            setIsLoading(false);
        }
    };
    const hasStockError = cart.some(item => item.quantity > item.stock);
    
    if (cart.length === 0) {
        return (
            <Container maxWidth="md" sx={{ py: 5, textAlign: 'center', backgroundColor: pastelColors.background }}>
                <Typography variant="h5" gutterBottom sx={{ color: pastelColors.text }}>Tu carrito está vacío </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: pastelColors.text }}>
                    ¡Explora nuestros productos y llena tu carrito!
                </Typography>
                <Button 
                    variant="contained" 
                    component={Link} 
                    to="/productos" 
                    sx={{ 
                        mt: 2,
                        backgroundColor: pastelColors.secondary,
                        color: pastelColors.buttonText,
                        '&:hover': { backgroundColor: pastelColors.secondaryDark }
                    }}
                >
                    Ver Productos
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4, backgroundColor: pastelColors.background }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ color: pastelColors.text }}>
                Tu Carrito: {totalItems} {totalItems === 1 ? 'ítem' : 'ítems'}
            </Typography>
            <Divider sx={{ mb: 4 }} />

            {notification.message && (
                <Alert severity={notification.severity} sx={{ mb: 3 }}>
                    {notification.message}
                </Alert>
            )}

            {hasStockError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    Hay productos en tu carrito con una cantidad mayor al stock disponible. Por favor, ajusta la cantidad antes de continuar.
                </Alert>
            )}

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    {cart.map((item) => (
                        <Card 
                            key={item.id} 
                            sx={{ 
                                display: 'flex', 
                                mb: 2, 
                                boxShadow: 1, 
                                backgroundColor: pastelColors.paper 
                            }}
                        >
                            <CardMedia
                                component="img"
                                sx={{ width: 100, height: 100, objectFit: 'cover' }}
                                image={getFirstImageUrl(item.imagen)}
                                alt={item.nombre}
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <CardContent sx={{ flex: '1 0 auto', pb: 1 }}>
                                    <Typography component="div" variant="h6" sx={{ color: pastelColors.text }}>
                                        {item.nombre}
                                    </Typography>
                                    <Typography variant="subtitle1" color={pastelColors.text}>
                                        ${item.precio} c/u
                                    </Typography>
                                    <Typography 
                                        variant="caption" 
                                        color={item.quantity > item.stock ? pastelTheme.error.main : pastelColors.text}
                                    >
                                        Stock disponible: {item.stock}
                                    </Typography>
                                </CardContent>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                    <IconButton 
                                        onClick={() => updateQuantity(item.id, -1)} 
                                        size="small"
                                        disabled={item.quantity <= 1}
                                        sx={{ 
                                            color: pastelColors.buttonText, 
                                            backgroundColor: pastelColors.secondary, 
                                            '&:hover': { backgroundColor: pastelColors.secondaryDark }
                                        }}
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                    <Typography variant="h6" sx={{ minWidth: 20, textAlign: 'center', color: pastelColors.text }}>
                                        {item.quantity}
                                    </Typography>
                                    <IconButton 
                                        onClick={() => updateQuantity(item.id, 1)} 
                                        size="small"
                                        disabled={item.quantity >= item.stock} 
                                        sx={{ 
                                            color: pastelColors.buttonText, 
                                            backgroundColor: pastelColors.secondary,
                                            '&:hover': { backgroundColor: pastelColors.secondaryDark } 
                                        }}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </Box>
                                <Typography variant="h5" sx={{ mr: 2, minWidth: 80, textAlign: 'right', color: pastelColors.primaryDark, fontWeight: 'bold' }}>
                                    ${(item.precio * item.quantity).toFixed(2)}
                                </Typography>
                                <IconButton 
                                    onClick={() => removeFromCart(item.id)} 
                                    color="error"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Card>
                    ))}
                </Grid>

                {/* Resumen pedido */}
                <Grid item xs={12} md={4}>
                    <Card elevation={3} sx={{ backgroundColor: pastelColors.paper }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom sx={{ color: pastelColors.text }}>
                                Resumen del Pedido
                            </Typography>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body1" sx={{ color: pastelColors.text }}>Subtotal ({totalItems} productos):</Typography>
                                <Typography variant="body1" sx={{ color: pastelColors.text }}>${totalPrice.toFixed(2)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="body1" sx={{ color: pastelColors.text }}>Costo de Envío:</Typography>
                                <Typography variant="body1" sx={{ color: pastelColors.text }}>Gratis</Typography>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h4" sx={{ color: pastelColors.text }}>Total:</Typography>
                                <Typography variant="h4" sx={{ color: pastelColors.primaryDark, fontWeight: 'bold' }}>${totalPrice.toFixed(2)}</Typography>
                            </Box>
                            
                            <Button 
                                variant="contained" 
                                fullWidth 
                                sx={{ 
                                    mt: 3, 
                                    py: 1.5,
                                    backgroundColor: isAuthenticated ? pastelColors.primary : pastelColors.secondaryDark,
                                    color: pastelColors.buttonText,
                                    fontWeight: 'bold',
                                    '&:hover': { 
                                        backgroundColor: isAuthenticated ? pastelColors.primaryDark : pastelColors.secondary, 
                                    },
                                    '&:disabled': { 
                                        backgroundColor: pastelColors.secondaryDark, 
                                        color: pastelColors.text 
                                    }
                                }}
                                // Si esta autenticado, va a checkout. si no, al /login.
                                onClick={isAuthenticated ? handleCheckout : () => navigate('/login')}
                                disabled={isLoading || hasStockError} 
                            >
                                {
                                    isLoading ? 'Procesando...' : 
                                    (isAuthenticated ? 'Proceder al Pago' : 'Iniciar Sesión para Pagar')
                                }
                            </Button>

                             {hasStockError && (
                                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                                    Ajuste cantidades para continuar.
                                </Typography>
                            )}
                            
                            {!isAuthenticated && (
                                <Typography variant="caption" color={pastelTheme.warning.main} sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                                    Inicia sesión para realizar la compra.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default CartPage;