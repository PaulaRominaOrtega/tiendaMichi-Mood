import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';

const Hero = () => {

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '300px', md: '500px' },
        backgroundImage: "url('/images/hero.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        textAlign: 'center',
        borderRadius: 2,
        boxShadow: 3,
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          borderRadius: 2,
          zIndex: 1,
        },
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          ¡Oferta especial por tiempo limitado!
        </Typography>
        <Typography variant="h6" component="p" gutterBottom sx={{ mb: 4 }}>
          Aprovecha un 30% de descuento en nuestros cuadernos
        </Typography>
        <Button
          variant="contained"
          color="error"
          size="large"
          sx={{ borderRadius: '10px', px: 5 }}
         
        >
          Comprar ahora
        </Button>
      </Container>
    </Box>
  );
};

export default Hero;