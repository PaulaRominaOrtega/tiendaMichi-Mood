import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  IconButton,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/productos/${id}`);
      setProduct(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar el producto');
      setLoading(false);
      console.error('Error fetching product:', err);
    }
  };

  const handleAddToCart = () => {
    // Aquí implementarías la lógica del carrito
    console.log('Agregando al carrito:', product);
    // Por ahora solo mostramos un alert
    alert('Producto agregado al carrito (funcionalidad pendiente)');
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" align="center">
          Cargando producto...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Volver al inicio
        </Button>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">Producto no encontrado</Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Volver al inicio
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Botón de regreso */}
      <Box sx={{ mb: 3 }}>
        <IconButton 
          onClick={() => navigate('/')}
          sx={{ 
            backgroundColor: 'primary.main', 
            color: 'white',
            '&:hover': { backgroundColor: 'primary.dark' }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Grid container spacing={4}>
        {/* Columna de imágenes */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <Box sx={{ p: 2 }}>
              {product.imagen ? (
                <Box sx={{ maxWidth: '100%', height: 400 }}>
                  <Slider {...carouselSettings}>
                    <Box>
                      <img
                        src={`http://localhost:3000/uploads/${product.imagen}`}
                        alt={product.nombre}
                        style={{
                          width: '100%',
                          height: '400px',
                          objectFit: 'contain',
                          borderRadius: '8px'
                        }}
                      />
                    </Box>
                    {/* Aquí podrías agregar más imágenes si las tuvieras */}
                  </Slider>
                </Box>
              ) : (
                <Box
                  sx={{
                    height: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'grey.100',
                    borderRadius: 1
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Sin imagen disponible
                  </Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>

        {/* Columna de información */}
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Información básica */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {product.nombre}
              </Typography>
              
              <Typography variant="h5" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                ${product.precio}
              </Typography>

              {product.oferta && product.descuento > 0 && (
                <Chip 
                  label={`${product.descuento}% OFF`} 
                  color="error" 
                  sx={{ mb: 2 }}
                />
              )}

              <Typography 
                variant="body1" 
                color={product.stock > 0 ? 'success.main' : 'error.main'}
                sx={{ mb: 2, fontWeight: 'medium' }}
              >
                {product.stock > 0 ? `Stock disponible: ${product.stock}` : 'Sin stock'}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Descripción */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Descripción
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {product.descripcion || 'Sin descripción disponible'}
              </Typography>
            </Box>

            {/* Características adicionales */}
            {(product.material || product.capacidad || product.caracteristicas_especiales) && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Características
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {product.material && (
                    <Typography variant="body2">
                      <strong>Material:</strong> {product.material}
                    </Typography>
                  )}
                  {product.capacidad && (
                    <Typography variant="body2">
                      <strong>Capacidad/Tamaño:</strong> {product.capacidad}
                    </Typography>
                  )}
                  {product.caracteristicas_especiales && (
                    <Typography variant="body2">
                      <strong>Características especiales:</strong> {product.caracteristicas_especiales}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Información de categoría */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Categoría: {product.categoria?.nombre || 'Sin categoría'}
              </Typography>
            </Box>

            {/* Botón de agregar al carrito */}
            <Box sx={{ mt: 'auto' }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                sx={{ 
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}
              >
                {product.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;