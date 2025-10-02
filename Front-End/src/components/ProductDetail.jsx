import React, { useState, useEffect, useRef } from 'react'; // 🔑 Importamos useRef
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  Grid,
  Chip,
  Divider,
  IconButton,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'; // 🔑 Icono para Siguiente
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';     // 🔑 Icono para Anterior
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// URL base del backend
const BACKEND_BASE_URL = 'http://localhost:3000'; 
const DEFAULT_IMAGE_PATH = '/images/default.jpg'; 

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 🔑 Creamos la referencia para controlar el Slider
  const sliderRef = useRef(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_BASE_URL}/api/productos/${id}`);
      const data = response.data.data;

      // LÓGICA DE CORRECCIÓN: Separar el string de imágenes y construir las URLs
      let imageUrls = [];
      if (typeof data.imagen === 'string' && data.imagen.length > 0) {
        imageUrls = data.imagen
            .split(',')
            .map(name => name.trim())
            .filter(name => name.length > 0)
            .map(name => `${BACKEND_BASE_URL}/uploads/${name}`);
      }
      
      if (imageUrls.length === 0) {
          imageUrls = [DEFAULT_IMAGE_PATH]; 
      }

      setProduct({ ...data, imageUrls: imageUrls });
      setLoading(false);
    } catch (err) {
      if (err.response && err.response.status === 404) {
          setError('Producto no encontrado.');
      } else {
          setError('Error al cargar el producto. Intenta más tarde.');
      }
      setLoading(false);
      console.error('Error fetching product:', err);
    }
  };

  // 🔑 FUNCIONES PARA CONTROLAR EL SLIDER
  const goToNext = () => {
    sliderRef.current.slickNext();
  };

  const goToPrev = () => {
    sliderRef.current.slickPrev();
  };
  // ------------------------------------

  const handleAddToCart = () => {
    alert('Producto agregado al carrito (funcionalidad pendiente)');
  };

  // Configuramos el carrusel para que no muestre flechas internas 
  // ya que usaremos botones externos
  const carouselSettings = {
    dots: true,
    infinite: false, // Es mejor false para evitar bucles infinitos en pocos slides
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false, // <<-- DESACTIVAMOS FLECHAS INTERNAS
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" align="center">Cargando producto...</Typography>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity={error ? "error" : "warning"}>{error || 'Producto no encontrado'}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Volver al inicio
        </Button>
      </Container>
    );
  }
  
  const displayImageUrls = product.imageUrls || [DEFAULT_IMAGE_PATH];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Botón de regreso */}
      <Box sx={{ mb: 3 }}>
        <IconButton
          onClick={() => navigate('/')}
          sx={{ backgroundColor: 'primary.main', color: 'white', '&:hover': { backgroundColor: 'primary.dark' } }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Grid container spacing={4}>
        {/* Columna de imágenes */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <Box sx={{ p: 2 }}>
              <Box 
                sx={{ 
                  maxWidth: '100%', 
                  height: 400, 
                  position: 'relative' 
                }}
              >
                {/* 🚨 RENDERIZACIÓN DEL SLIDER CON LA REFERENCIA */}
                <Slider {...carouselSettings} ref={sliderRef}>
                  {displayImageUrls.map((url, idx) => (
                    <Box key={idx}>
                      <img
                        src={url}
                        alt={`${product.nombre} ${idx + 1}`}
                        style={{
                          width: '100%',
                          height: '400px',
                          objectFit: 'contain',
                          borderRadius: '8px'
                        }}
                        onError={(e) => { 
                            e.target.onerror = null; 
                            e.target.src = DEFAULT_IMAGE_PATH;
                        }}
                      />
                    </Box>
                  ))}
                </Slider>
                
                {/* 🔑 BOTONES DE NAVEGACIÓN MANUAL */}
                {displayImageUrls.length > 1 && (
                    <Box 
                        sx={{ 
                            position: 'absolute', 
                            top: '50%', 
                            width: '100%', 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            transform: 'translateY(-50%)', 
                            zIndex: 10 
                        }}
                    >
                        <IconButton 
                            onClick={goToPrev} 
                            sx={{ color: 'primary.main', backgroundColor: 'rgba(255,255,255,0.7)', ml: 1 }}
                        >
                            <ArrowBackIosIcon />
                        </IconButton>
                        <IconButton 
                            onClick={goToNext} 
                            sx={{ color: 'primary.main', backgroundColor: 'rgba(255,255,255,0.7)', mr: 1 }}
                        >
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </Box>
                )}
                {/* ------------------------------------------- */}
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Columna de información */}
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom>{product.nombre}</Typography>
              <Typography variant="h5" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>${product.precio}</Typography>
              {product.oferta && product.descuento > 0 && <Chip label={`${product.descuento}% OFF`} color="error" sx={{ mb: 2 }} />}
              <Typography variant="body1" color={product.stock > 0 ? 'success.main' : 'error.main'} sx={{ mb: 2, fontWeight: 'medium' }}>
                {product.stock > 0 ? `Stock disponible: ${product.stock}` : 'Sin stock'}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>Descripción</Typography>
              <Typography variant="body1" color="text.secondary" paragraph>{product.descripcion || 'Sin descripción disponible'}</Typography>
            </Box>

            {(product.material || product.capacidad || product.caracteristicas_especiales) && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>Características</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {product.material && <Typography variant="body2"><strong>Material:</strong> {product.material}</Typography>}
                  {product.capacidad && <Typography variant="body2"><strong>Capacidad/Tamaño:</strong> {product.capacidad}</Typography>}
                  {product.caracteristicas_especiales && <Typography variant="body2"><strong>Características especiales:</strong> {product.caracteristicas_especiales}</Typography>}
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">Categoría: {product.categoria?.nombre || 'Sin categoría'}</Typography>
            </Box>

            <Box sx={{ mt: 'auto' }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 'bold' }}
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