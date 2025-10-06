// src/components/NosotrosPage.jsx

import React from 'react';
// 🚨 Importaciones de Material-UI: Estas deben ser correctas.
import { Container, Typography, Box } from '@mui/material'; 

const NosotrosPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Sobre Nosotros
        </Typography>
        <Typography variant="body1" color="text.secondary">
          ¡Bienvenido a MichiMood! Somos una tienda dedicada a ofrecer productos únicos y de calidad.
        </Typography>
      </Box>
      
      {/* 💡 Ejemplo de contenido para la página */}
      <Box sx={{ mt: 5, p: 3, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
        <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
          Nuestra Misión
        </Typography>
        <Typography paragraph>
          Nuestra misión es llevar alegría y estilo a tu hogar con artículos seleccionados que reflejan creatividad y calidad artesanal. Creemos que los pequeños detalles hacen la gran diferencia.
        </Typography>
        
        <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'primary.main' }}>
          El Equipo
        </Typography>
        <Typography paragraph>
          Somos un equipo pequeño, apasionado por el diseño y el buen servicio. Cada producto en MichiMood es elegido con cuidado y cariño.
        </Typography>
      </Box>
      
    </Container>
  );
};

export default NosotrosPage;