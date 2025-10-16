import React, { useEffect, useRef } from 'react'; 
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; 

const LoginSuccessHandler = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();
    const { loadCartFromServer } = useCart(); 
    
    const hasProcessed = useRef(false);

    const queryParams = new URLSearchParams(location.search);

    useEffect(() => {
        if (hasProcessed.current) {
            return;
        }
        
        const accessToken = queryParams.get('accessToken');
        const refreshToken = queryParams.get('refreshToken');
        const clienteId = queryParams.get('clienteId');
        const email = queryParams.get('email');

        if (accessToken && clienteId) {
            
            hasProcessed.current = true;
            
            login({ accessToken, refreshToken, clienteId, email }, loadCartFromServer);
            
            navigate('/', { replace: true });
            
        } else {
            console.error("Fallo en la autenticación: Faltan tokens o ID.");
            navigate('/login', { replace: true });
        }
        
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