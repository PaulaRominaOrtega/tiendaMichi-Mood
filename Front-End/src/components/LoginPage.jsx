// src/components/LoginPage.jsx (CORREGIDO)
import React, { useState } from 'react';
// 🚨 Importamos Alert 🚨
import { Box, Typography, Container, Button, TextField, Paper, Divider, Alert } from '@mui/material'; 
import { Google as GoogleIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const GOOGLE_AUTH_URL = "http://localhost:3000/auth/google"; 
const LOCAL_LOGIN_URL = "http://localhost:3000/api/auth/login"; 

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    
    // Estados para el formulario de login local
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Manejador para el login estándar (Email/Password)
    const handleLocalLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Llamada al Backend para autenticación
            const response = await fetch(LOCAL_LOGIN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // 🚨 MANTENEMOS: 'email' y 'password'. Si tu backend usa otros nombres (ej. 'correo', 'clave'), cámbialo aquí.
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Si el backend devuelve un 401, 403, etc.
                throw new Error(data.message || 'Error al iniciar sesión. Verifica tus credenciales.');
            }
            
            // 2. Si es exitoso
            login(data); 

            // 3. Redirigir a la página principal
            navigate('/', { replace: true });

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    // Manejador para el login de Google
    const handleGoogleLogin = () => {
        window.location.href = GOOGLE_AUTH_URL;
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 5, mb: 5 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" component="h1" gutterBottom textAlign="center" sx={{ fontWeight: 600 }}>
                    Inicia Sesión en MichiMood
                </Typography>
                
                {/* Mostrar Error */}
                {/* 🚨 Ahora Alert está definido 🚨 */}
                {error && <Box sx={{ mb: 2 }}><Alert severity="error">{error}</Alert></Box>}

                {/* === Formulario de Login Estándar === */}
                <Box component="form" onSubmit={handleLocalLogin} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Correo Electrónico"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Contraseña"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, bgcolor: '#ffb6c1', '&:hover': { bgcolor: '#dda0dd' } }}
                        disabled={loading}
                    >
                        {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                    </Button>
                </Box>
                
                <Divider sx={{ my: 3 }}>o</Divider>

                {/* === Botón de Login de Google === */}
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    onClick={handleGoogleLogin}
                    sx={{ mb: 1, color: '#8b4513', borderColor: '#8b4513' }}
                    disabled={loading}
                >
                    Continuar con Google
                </Button>
                
                {/* Enlace para registrarse */}
                <Box textAlign="center" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                        ¿Nuevo en MichiMood?{' '}
                        <Link to="/register" style={{ color: '#dda0dd', textDecoration: 'none', fontWeight: 600 }}>
                            Regístrate
                        </Link>
                    </Typography>
                </Box>
                
            </Paper>
        </Container>
    );
};

export default LoginPage;