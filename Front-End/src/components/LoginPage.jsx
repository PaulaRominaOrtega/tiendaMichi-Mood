import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Grid, Divider, Alert, CircularProgress } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../context/AuthContext'; 

// 🚨 CAMBIO CLAVE: Usamos la sintaxis de VITE (import.meta.env) 🚨
// URL base de tu Back-End (Asegúrate de configurar VITE_API_URL en tu .env del Front-End)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


const LoginPage = () => {
    // Aquí puedes usar useAuth si quieres implementar el login tradicional
    const { login } = useAuth(); 
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Función para iniciar el flujo de Google OAuth
    const handleGoogleLogin = () => {
        // Redirige al Front-End al punto de inicio de Google OAuth en el Back-End
        window.location.href = `${API_URL}/auth/google`;
    };

    // Función para manejar el login tradicional (tendrías que implementar la llamada a la API)
    const handleTraditionalLogin = async (e) => {
        e.preventDefault();
        // 🚨 AQUÍ IRÍA TU LÓGICA DE AXIOS para el login POST /auth/login 🚨
        alert("Login tradicional aún no implementado. Usa Google por ahora.");
    };

    return (
        <Box 
            sx={{ 
                maxWidth: 450, 
                margin: '50px auto', 
                padding: 4, 
                boxShadow: 3, 
                borderRadius: 2, 
                textAlign: 'center' 
            }}
        >
            <Typography variant="h4" component="h1" gutterBottom>
                Acceso de Clientes
            </Typography>

            {/* Opción 1: Login con Google (Implementación OAuth) */}
            <Button
                variant="contained"
                color="primary"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleLogin}
                fullWidth
                sx={{ mb: 3, py: 1.5 }}
            >
                Iniciar Sesión con Google
            </Button>

            <Divider sx={{ my: 2 }}>O</Divider>

            {/* Opción 2: Login Tradicional (Deberás implementar el POST /auth/login) */}
            <Box component="form" onSubmit={handleTraditionalLogin}>
                <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    label="Contraseña"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
                <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    fullWidth
                    sx={{ mt: 2, py: 1.5 }}
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Sesión'}
                </Button>
            </Box>
            
            <Typography variant="body2" sx={{ mt: 3 }}>
                ¿No tienes cuenta? <span style={{ cursor: 'pointer', color: '#1976d2' }}>Regístrate aquí</span>
            </Typography>
        </Box>
    );
};

export default LoginPage;