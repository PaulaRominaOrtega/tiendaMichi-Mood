import React, { useState, useEffect, useRef } from 'react'; 
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
  Alert,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'; 
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';     
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useCart } from '../context/CartContext'; 

const BACKEND_BASE_URL = 'http://localhost:3000'; 
const DEFAULT_IMAGE_PATH = '/images/default.jpg'; 

const pastelColors = {
    background: '#f8f8f4', 
    primary: '#a2d2ff', 
    secondary: '#b8c4c2', 
    text: '#4a4a4a',    
    accent: '#ffb3c1',    
    highlight: '#c8f0c8',  
    lila: '#e0b5ff',    
    buttonText: '#3b3b3b', 
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  
  const { addToCart } = useCart(); 

  const sliderRef = useRef(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_BASE_URL}/api/productos/${id}`);
      const data = response.data.data;

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

  const goToNext = () => {
    sliderRef.current.slickNext();
  };

  const goToPrev = () => {
    sliderRef.current.slickPrev();
  };

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
        addToCart(product, 1); 
    }
  };
  const carouselSettings = {
    dots: true,
    infinite: true, 
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false, 
  };


  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, minHeight: '80vh', backgroundColor: pastelColors.background }}>
        <Typography variant="h6" align="center" sx={{ color: pastelColors.text }}>Cargando producto...</Typography>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, backgroundColor: pastelColors.background }}>
        <Alert severity={error ? "error" : "warning"}>{error || 'Producto no encontrado'}</Alert>
        <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/productos')} 
            sx={{ 
                mt: 2, 
                backgroundColor: pastelColors.primary, 
                color: pastelColors.buttonText,
                '&:hover': { backgroundColor: '#86bfff' }
            }}
        >
          Volver a productos
        </Button>
      </Container>
    );
  }
  
  const displayImageUrls = product.imageUrls || [DEFAULT_IMAGE_PATH];

  return (
    <Container maxWidth="lg" sx={{ py: 6, backgroundColor: pastelColors.background }}>
      <Box sx={{ mb: 3 }}>
        <IconButton
          onClick={() => navigate('/productos')}
          sx={{ 
            backgroundColor: pastelColors.primary, 
            color: pastelColors.buttonText, 
            '&:hover': { backgroundColor: '#86bfff' },
            boxShadow: 1
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, backgroundColor: 'white' }}>
        <Grid container spacing={4}>
            
            
            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-start' }}> 
                <Card 
                    elevation={0} 
                    sx={{ 
                        border: `1px solid ${pastelColors.secondary}`, 
                        borderRadius: 2,
                        maxWidth: 300, 
                        width: '100%',
                    }}
                >
                    <Box sx={{ p: 1 }}>
                        <Box 
                            sx={{ 
                                maxWidth: '100%', 
                                height: 380, 
                                position: 'relative' 
                            }}
                        >
                            <Slider {...carouselSettings} ref={sliderRef}>
                            {displayImageUrls.map((url, idx) => (
                                <Box key={idx}>
                                <img
                                    src={url}
                                    alt={`${product.nombre} ${idx + 1}`}
                                    style={{
                                    width: '100%',
                                    height: '380px', 
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
                                        sx={{ color: pastelColors.buttonText, backgroundColor: pastelColors.primary, ml: 1, '&:hover': { backgroundColor: '#86bfff' } }}
                                    >
                                        <ArrowBackIosIcon sx={{ fontSize: '1rem' }} />
                                    </IconButton>
                                    <IconButton 
                                        onClick={goToNext} 
                                        sx={{ color: pastelColors.buttonText, backgroundColor: pastelColors.primary, mr: 1, '&:hover': { backgroundColor: '#86bfff' } }}
                                    >
                                        <ArrowForwardIosIcon sx={{ fontSize: '1rem' }} />
                                    </IconButton>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Card>
            </Grid>

            <Grid item xs={12} md={8}>
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                   
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ color: pastelColors.text, fontWeight: 700 }}>
                            {product.nombre}
                        </Typography>
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: pastelColors.accent }}>
                            ${product.precio}
                        </Typography>
                        {product.oferta && product.descuento > 0 && 
                            <Chip 
                                label={`${product.descuento}% OFF`} 
                                sx={{ backgroundColor: pastelColors.accent, color: 'white', mb: 2, fontWeight: 'bold' }} 
                            />
                        }
                        <Typography 
                            variant="body1" 
                            sx={{ mb: 2, fontWeight: 'medium', color: product.stock > 0 ? pastelColors.highlight : pastelColors.accent }}
                        >
                            {product.stock > 0 ? `Stock disponible: ${product.stock}` : 'Sin stock'}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 2, borderColor: pastelColors.secondary }} />

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: pastelColors.text, fontWeight: 600 }}>Descripción</Typography>
                        <Typography variant="body1" sx={{ color: pastelColors.text }} paragraph>
                            {product.descripcion || 'Sin descripción disponible'}
                        </Typography>
                    </Box>

                    {(product.material || product.capacidad || product.caracteristicas_especiales) && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ color: pastelColors.text, fontWeight: 600 }}>Características</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 1 }}>
                                {product.material && 
                                    <Chip 
                                        label={`Material: ${product.material}`} 
                                        sx={{ backgroundColor: pastelColors.highlight, color: pastelColors.buttonText, fontWeight: 500 }}
                                    />
                                }
                                {product.capacidad && 
                                    <Chip 
                                        label={`Capacidad/Tamaño: ${product.capacidad}`} 
                                        sx={{ backgroundColor: pastelColors.highlight, color: pastelColors.buttonText, fontWeight: 500 }}
                                    />
                                }
                                {product.caracteristicas_especiales && product.caracteristicas_especiales.split('/').map((feature, index) => (
                                     <Chip 
                                        key={index}
                                        label={feature.trim()}
                                        sx={{ backgroundColor: pastelColors.lila, color: pastelColors.buttonText, fontWeight: 500 }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}

                    <Divider sx={{ my: 2, borderColor: pastelColors.secondary }} />

                    <Box sx={{ mt: 'auto' }}>
                        <Typography variant="body2" color={pastelColors.text} sx={{ mb: 1 }}>
                            Categoría: {product.categoria?.nombre || 'Sin categoría'}
                        </Typography>
                        
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
                                fontWeight: 'bold',
                                backgroundColor: product.stock > 0 ? pastelColors.primary : pastelColors.secondary, // Celeste para stock, Gris para sin stock
                                color: product.stock > 0 ? pastelColors.buttonText : pastelColors.text,
                                '&:hover': { 
                                    backgroundColor: product.stock > 0 ? '#86bfff' : pastelColors.secondary,
                                }
                            }}
                        >
                            {product.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
                        </Button>
                    </Box>
                </Box>
            </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProductDetail;