// src/components/ContactoPage.jsx

import React from 'react';
import { Container, Typography, Box, Paper, TextField, Button } from '@mui/material';
const CUSTOM_LILA = '#C8A2C8'; 
const PASTEL_GRAY_BACKGROUND = '#F7F7F7'; 

const ContactoPage = () => {
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

        <Box component="form" noValidate autoComplete="off">
         
          <TextField 
            fullWidth 
            label="Tu Nombre" 
            margin="normal" 
            required 
            variant="outlined" 
          
          />
          
          <TextField 
            fullWidth 
            label="Tu Correo Electrónico" 
            margin="normal" 
            type="email" 
            required 
            variant="outlined"
          />
          
          <TextField 
            fullWidth 
            label="Mensaje" 
            margin="normal" 
            multiline 
            rows={5}
            required 
            variant="outlined"
          />
        
          <Button 
            variant="contained" 
            fullWidth 
          
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