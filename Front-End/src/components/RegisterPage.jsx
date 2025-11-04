import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Button, TextField, Paper, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const REGISTER_URL = "http://localhost:3000/api/auth/register"; 
const STORAGE_KEY = 'registerFormDraft'; //localStorage

const RegisterPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const getInitialState = () => {
        try {
            const savedData = localStorage.getItem(STORAGE_KEY);
            if (savedData) {
                const draft = JSON.parse(savedData);
                return {
                    name: draft.name || '',
                    email: draft.email || '',
                    telefono: draft.telefono || '',
                };
            }
        } catch (error) {
            console.error("Error al leer el borrador de registro:", error);
        }
        return { name: '', email: '', telefono: '' };
    };
    
    const initialState = getInitialState();
    const [name, setName] = useState(initialState.name); 
    const [email, setEmail] = useState(initialState.email);
    const [telefono, setTelefono] = useState(initialState.telefono); 
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const draft = {
            name,
            email,
            telefono,
        };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
        } catch (error) {
            console.error("Error al guardar borrador de registro:", error);
        }
    }, [name, email, telefono]); 

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        if (!email || !password || !name || !telefono) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(REGISTER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    nombre: name, 
                    email: email, 
                    telefono: telefono, 
                    password: password 
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.message || `Error ${response.status}: Error al registrar la cuenta.`;
                throw new Error(errorMessage);
            }
            
            localStorage.removeItem(STORAGE_KEY);
            
            login(data); 
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
                    <span style={{ color: '#ffb6c1' }}>Únete</span> a la Comunidad MichiMood 🐈
                </Typography>
                
                {error && <Box sx={{ mb: 2 }}><Alert severity="error">{error}</Alert></Box>}

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
                        name="telefono"
                        label="Teléfono"
                        type="tel" 
                        id="telefono"
                        autoComplete="tel"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)} 
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