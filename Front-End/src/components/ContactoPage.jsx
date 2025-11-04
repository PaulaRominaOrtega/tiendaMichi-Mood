import React, { useState, useEffect } from 'react'; 
import { Container, Typography, Box, Paper, TextField, Button, Alert, Collapse } from '@mui/material';

const CUSTOM_LILA = '#C8A2C8'; 
const PASTEL_GRAY_BACKGROUND = '#F7F7F7'; 

//localStorage
const STORAGE_KEY = 'contactFormDraft';

const ContactoPage = () => {
  const [formData, setFormData] = useState(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : {
        nombre: '',
        email: '',
        mensaje: '',
      };
    } catch (error) {
      console.error("Error al leer de localStorage:", error);
      return { nombre: '', email: '', mensaje: '' };
    }
  });

  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (error) {
      console.error("Error al guardar en localStorage:", error);
    }
  }, [formData]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
//envio formuladio
  const handleSubmit = (e) => {
    e.preventDefault(); 

    const emptyData = { nombre: '', email: '', mensaje: '' };
    setFormData(emptyData);

    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error("Error al borrar de localStorage:", error);
    }

    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000); 
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}
        >
          Contáctanos 
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
        >
          
        </Typography>
      </Box>
      
      {/* Mensaje de confirmación */}
      <Collapse in={showAlert} sx={{ mb: 3 }}>
        <Alert 
          severity="success" 
          onClose={() => setShowAlert(false)} 
        >
          ¡Mensaje Enviado!Te responderemos a la brevedad.
        </Alert>
      </Collapse>


      <Paper 
        elevation={6} 
        sx={{ 
          p: { xs: 3, md: 5 },
          borderRadius: 4, 
          backgroundColor: PASTEL_GRAY_BACKGROUND, 
          transition: 'box-shadow 0.3s'
        }}
      >
        <Typography variant="body1" sx={{ mb: 4, textAlign: 'center' }}>
          Escríbenos tu mensaje y te responderemos a la brevedad.
        </Typography>

        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
         
          <TextField 
            fullWidth 
            label="Tu Nombre" 
            margin="normal" 
            required 
            variant="outlined" 
            name="nombre" 
            value={formData.nombre} 
            onChange={handleChange} 
          />
          
          <TextField 
            fullWidth 
            label="Tu Correo Electrónico" 
            margin="normal" 
            type="email" 
            required 
            variant="outlined"
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
          />
          
          <TextField 
            fullWidth 
            label="Mensaje" 
            margin="normal" 
            multiline 
            rows={5}
            required 
            variant="outlined"
            name="mensaje" 
            value={formData.mensaje} 
            onChange={handleChange} 
          />
        
          <Button 
            variant="contained" 
            fullWidth 
            type="submit" 
            sx={{ 
              mt: 4, 
              py: 1.5,
              backgroundColor: CUSTOM_LILA, 
              '&:hover': { 
                backgroundColor: `${CUSTOM_LILA}E0`, 
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)' 
              },
              fontWeight: 'bold',
              borderRadius: '8px'
            }}
          >
            Enviar Mensaje
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ContactoPage;