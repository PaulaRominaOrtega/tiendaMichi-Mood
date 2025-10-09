import React, { useEffect, useRef } from 'react'; // 👈 AGREGAMOS useRef
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; 

const LoginSuccessHandler = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();
    // NOTA: loadCartFromServer está ahora vacío o a prueba de fallos, por lo que no causa bucles por sí mismo.
    const { loadCartFromServer } = useCart(); 
    
    // 💡 SOLUCIÓN ANTI-BUCLE: Bandera para asegurar que la lógica solo se ejecuta una vez.
    const hasProcessed = useRef(false);

    const queryParams = new URLSearchParams(location.search);

    useEffect(() => {
        // Si ya procesamos esto O si la navegación aún no ha terminado, salimos.
        if (hasProcessed.current) {
            return;
        }
        
        const accessToken = queryParams.get('accessToken');
        const refreshToken = queryParams.get('refreshToken');
        const clienteId = queryParams.get('clienteId');
        const email = queryParams.get('email');

        if (accessToken && clienteId) {
            
            // 1. Marcar como procesado para evitar futuras ejecuciones.
            hasProcessed.current = true;
            
            // 2. Ejecutar el login.
            login({ accessToken, refreshToken, clienteId, email }, loadCartFromServer);
            
            // 3. NAVEGAR INMEDIATAMENTE Y REEMPLAZAR. (Es crucial el replace: true)
            // Esto termina el ciclo de vida del handler y rompe el potencial bucle.
            navigate('/', { replace: true });
            
        } else {
            console.error("Fallo en la autenticación: Faltan tokens o ID.");
            // Si falla, también reemplazamos.
            navigate('/login', { replace: true });
        }
        
    // Las dependencias son correctas, pero la bandera useRef nos da la capa extra de seguridad.
    }, [location.search, login, navigate, loadCartFromServer, queryParams]); 

    return (
        <Box 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '80vh' 
            }}
        >
            <CircularProgress size={60} />
            <Typography variant="h5" sx={{ mt: 3 }}>
                Iniciando sesión...
            </Typography>
        </Box>
    );
};

export default LoginSuccessHandler;