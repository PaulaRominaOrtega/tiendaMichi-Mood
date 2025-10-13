// src/components/RegisterPage.jsx
import React, { useState } from 'react';
import { Box, Typography, Container, Button, TextField, Paper, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const REGISTER_URL = "http://localhost:3000/api/auth/register"; 

const RegisterPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    
    // Estados para el formulario de registro
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState(''); // Campo adicional de nombre
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Manejador del Formulario de Registro
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        
        // Validación básica
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        if (!email || !password || !name) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        setLoading(true);

        try {
            // 1. Llamada al Backend para crear el nuevo usuario
            const response = await fetch(REGISTER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // 🚨 CORRECCIÓN CLAVE: Mapeamos la variable 'name' del frontend a la clave 'nombre' que espera el backend.
                body: JSON.stringify({ 
                    nombre: name, // El backend espera 'nombre'
                    email: email, 
                    password: password 
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Si el backend devuelve un 400 (ej: email ya existe), mostramos el mensaje de error.
                throw new Error(data.message || 'Error al registrar la cuenta. Verifica que el correo no esté ya registrado.');
            }
            
            // 2. Si es exitoso, usamos la función login (asume que el backend devuelve los tokens)
            login(data); 

            // 3. Redirigir al usuario
            navigate('/', { replace: true });

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 5, mb: 5 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" component="h1" gutterBottom textAlign="center" sx={{ fontWeight: 600 }}>
                    <span style={{ color: '#ffb6c1' }}>Únete</span> a la Comunidad MichiMood
                </Typography>
                
                {/* Mostrar Error */}
                {error && <Box sx={{ mb: 2 }}><Alert severity="error">{error}</Alert></Box>}

                {/* === Formulario de Registro === */}
                <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Nombre Completo"
                        name="name"
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Correo Electrónico"
                        name="email"
                        autoComplete="email"
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
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirmar Contraseña"
                        type="password"
                        id="confirmPassword"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, bgcolor: '#dda0dd', '&:hover': { bgcolor: '#ffb6c1' } }}
                        disabled={loading}
                    >
                        {loading ? 'Creando Cuenta...' : 'Registrarse'}
                    </Button>
                </Box>
                
                {/* Enlace para ir al Login */}
                <Box textAlign="center" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login" style={{ color: '#8b4513', textDecoration: 'none', fontWeight: 600 }}>
                            Iniciar Sesión
                        </Link>
                    </Typography>
                </Box>
                
            </Paper>
        </Container>
    );
};

export default RegisterPage;