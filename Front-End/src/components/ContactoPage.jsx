// src/components/ContactoPage.jsx

import React from 'react';
import { Container, Typography, Box, Paper, TextField, Button } from '@mui/material';

const ContactoPage = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Contáctanos
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Si tienes alguna pregunta, duda o sugerencia, escríbenos. Te responderemos a la brevedad.
        </Typography>

        <Box component="form" noValidate autoComplete="off">
          <TextField 
            fullWidth 
            label="Tu Nombre" 
            margin="normal" 
            required 
          />
          <TextField 
            fullWidth 
            label="Tu Correo Electrónico" 
            margin="normal" 
            type="email" 
            required 
          />
          <TextField 
            fullWidth 
            label="Mensaje" 
            margin="normal" 
            multiline 
            rows={4} 
            required 
          />
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ mt: 3, py: 1.5 }}
          >
            Enviar Mensaje
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ContactoPage;