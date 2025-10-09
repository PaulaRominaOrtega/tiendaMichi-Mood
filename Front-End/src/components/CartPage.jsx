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

// 🚨 MODIFICACIÓN CLAVE: Usamos la sintaxis de VITE (import.meta.env)
const BACKEND_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const DEFAULT_IMAGE_PATH = '/images/default.jpg'; 


const getFirstImageUrl = (imageString) => {
    if (!imageString) return DEFAULT_IMAGE_PATH;
    const imageNames = imageString.split(',');
    const firstName = imageNames[0].trim();
    // Asegúrate de usar la URL base correcta
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
    
    // 🚨 EXTRAEMOS LA INFORMACIÓN DE AUTENTICACIÓN 🚨
    const { isAuthenticated, clienteId, email } = useAuth(); 

    const navigate = useNavigate(); 
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ message: '', severity: '' }); // Para mensajes de error/bloqueo
    

    // FUNCIÓN PRINCIPAL DE CHECKOUT
    const handleCheckout = async () => {
        
        // 1. Validación inicial
        if (cart.length === 0) return;
        
        // 🚨 RESTRICCIÓN DE AUTENTICACIÓN (Bloqueo si no hay sesión) 🚨
        if (!isAuthenticated || !clienteId) { 
             setNotification({ message: "Debes iniciar sesión para completar la compra.", severity: "warning" });
             // Redirige al login después de un pequeño retraso
             setTimeout(() => navigate('/login'), 1500); 
             return; // DETIENE la ejecución de la compra
        }

        setIsLoading(true);
        setNotification({ message: '', severity: '' }); // Limpiar notificaciones previas

        // 2. Formatear la carga útil (Payload)
        const orderPayload = {
            // 🚨 USAMOS EL ID REAL DEL CLIENTE LOGEADO 🚨
            idCliente: clienteId, 
            total: totalPrice,
            items: cart.map(item => ({
                productoId: item.id,
                cantidad: item.quantity,
                precioUnitario: item.precio,
                nombre: item.nombre, // Necesario para el email de confirmación
            })),
        };

        try {
            // 3. Enviar el pedido al Back-End
            // 🚨 OPCIONAL: Si necesitas enviar el token, usa axios.create() o pásalo en headers
            const response = await axios.post(`${BACKEND_BASE_URL}/api/pedidos`, orderPayload);
            
            // 4. Éxito: Limpiar carrito y redirigir
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
            
            setNotification({ message: `❌ Fallo: ${errorMessage}`, severity: "error" });
            
        } finally {
            setIsLoading(false);
        }
    };
    // ------------------------------------

    // Comprobar si hay ítems con stock excedido
    const hasStockError = cart.some(item => item.quantity > item.stock);
    
    // REDIRECCIÓN SI EL CARRITO ESTÁ VACÍO
    if (cart.length === 0) {
        return (
            <Container maxWidth="md" sx={{ py: 5, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>Tu carrito está vacío 😔</Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    ¡Explora nuestros productos y llena tu carrito!
                </Typography>
                <Button variant="contained" component={Link} to="/productos" sx={{ mt: 2 }}>
                    Ver Productos
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom>
                Tu Carrito ({totalItems} {totalItems === 1 ? 'ítem' : 'ítems'})
            </Typography>
            <Divider sx={{ mb: 4 }} />

            {/* Muestra notificaciones de bloqueo/error */}
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
                {/* Columna de Productos */}
                <Grid item xs={12} md={8}>
                    {cart.map((item) => (
                        <Card key={item.id} sx={{ display: 'flex', mb: 2, boxShadow: 1 }}>
                            <CardMedia
                                component="img"
                                sx={{ width: 100, height: 100, objectFit: 'cover' }}
                                image={getFirstImageUrl(item.imagen)}
                                alt={item.nombre}
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <CardContent sx={{ flex: '1 0 auto', pb: 1 }}>
                                    <Typography component="div" variant="h6">
                                        {item.nombre}
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        ${item.precio} c/u
                                    </Typography>
                                    <Typography variant="caption" color={item.quantity > item.stock ? 'error' : 'text.secondary'}>
                                        Stock disponible: {item.stock}
                                    </Typography>
                                </CardContent>
                            </Box>
                            
                            {/* Control de Cantidad y Precio */}
                            <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                    <IconButton 
                                        onClick={() => updateQuantity(item.id, -1)} 
                                        color="primary"
                                        size="small"
                                        disabled={item.quantity <= 1} // No permitir menos de 1
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                    <Typography variant="h6" sx={{ minWidth: 20, textAlign: 'center' }}>
                                        {item.quantity}
                                    </Typography>
                                    <IconButton 
                                        onClick={() => updateQuantity(item.id, 1)} 
                                        color="primary"
                                        size="small"
                                        disabled={item.quantity >= item.stock} 
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </Box>
                                <Typography variant="h5" sx={{ mr: 2, minWidth: 80, textAlign: 'right' }}>
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

                {/* Columna de Resumen (Sidebar) */}
                <Grid item xs={12} md={4}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Resumen del Pedido
                            </Typography>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body1">Subtotal ({totalItems} productos):</Typography>
                                <Typography variant="body1">${totalPrice.toFixed(2)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="body1">Costo de Envío:</Typography>
                                <Typography variant="body1">A calcular</Typography>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h4">Total:</Typography>
                                <Typography variant="h4">${totalPrice.toFixed(2)}</Typography>
                            </Box>
                            
                            <Button 
                                variant="contained" 
                                color="primary" 
                                fullWidth 
                                sx={{ mt: 3, py: 1.5 }}
                                onClick={handleCheckout} 
                                // Bloquea si está cargando, hay error de stock O NO está autenticado
                                disabled={isLoading || hasStockError || !isAuthenticated} 
                                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                            >
                                {isLoading ? 'Procesando...' : (isAuthenticated ? 'Proceder al Pago' : 'Inicia Sesión para Pagar')}
                            </Button>

                             {hasStockError && (
                                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                                    Ajuste cantidades para continuar.
                                </Typography>
                            )}
                            
                            {!isAuthenticated && (
                                <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                                    Debes iniciar sesión para realizar la compra.
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