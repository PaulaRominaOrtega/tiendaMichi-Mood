import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom"; 
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Divider from "@mui/material/Divider";

import FilterBar from './FilterBar'; 

import { useCart } from '../context/CartContext'; 

const BACKEND_BASE_URL = "http://localhost:3000";
const DEFAULT_IMAGE_PATH = "/images/default.jpg";

const CUSTOM_LILA = '#C8A2C8'; 
const CUSTOM_LILA_HOVER = '#EAE2EA'; 

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useCart(); 

  const location = useLocation(); 
  const queryParams = new URLSearchParams(location.search);
  const categoriaSlug = queryParams.get('categoria'); 
  
  const categoriaNombre = categoriaSlug 
    ? categoriaSlug.replace(/-/g, ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    : null;

  useEffect(() => {
    fetchProducts();
  }, [categoriaSlug]); 

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
  
    let url = `${BACKEND_BASE_URL}/api/productos?limit=100`; 
    
    if (categoriaNombre) {
    
      url = `${BACKEND_BASE_URL}/api/productos?categoria=${categoriaNombre}&limit=100`; 
    }
    
    try {
      const res = await axios.get(url);
      setProducts(res.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error al obtener productos:", err);
      setError("Error al cargar la lista de productos.");
      setLoading(false);
    }
  };

  
  const getFirstImageUrl = (imageString) => {
    if (!imageString) {
      return DEFAULT_IMAGE_PATH;
    }
    const imageNames = imageString.split(',');
    const firstName = imageNames[0].trim();
    
    return firstName 
      ? `${BACKEND_BASE_URL}/uploads/${firstName}` 
      : DEFAULT_IMAGE_PATH;
  };
 
  const handleAddToCartClick = (e, product) => {
      e.stopPropagation(); 
      e.preventDefault(); 
      addToCart(product, 1); 
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography mt={2}>Cargando productos...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="xl" sx={{ padding: 4 }}>
      
      <Box 
          sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              mb: 2,
          }}
      >
          <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                  fontWeight: 600, 
                  mr: { sm: 2 }, 
                  mb: { xs: 2, sm: 0 } 
              }} 
          >
              {categoriaNombre || 'Todos los Productos'}
          </Typography>
          
         
          <Box sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: 250, maxWidth: 350 }}>
              <FilterBar />
          </Box>
      </Box>
      
      
      <Divider sx={{ mb: 4 }} /> 
      
      {products.length === 0 && (
          <Alert severity="info">
             {categoriaSlug 
                ? `No se encontraron productos para la categoría "${categoriaNombre}".`
                : "No hay productos disponibles."
             }
          </Alert>
      )}
      
      
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(5, 1fr)",
          },
          gap: 3,
        }}
      >
        {products.map((product) => (
          <Card 
            key={product.id} 
            
            sx={{ 
                height: "100%", 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s, box-shadow 0.3s, background-color 0.3s', 
                cursor: 'pointer', 
                '&:hover': {
                    transform: 'translateY(-5px)', 
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', 
                    backgroundColor: CUSTOM_LILA_HOVER, 
                },
            }}
          >

            <Link 
                to={`/producto/${product.id}`} 
                style={{ 
                    textDecoration: 'none', 
                    color: 'inherit', 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column' 
                }}
            >
          
                <CardMedia
                    component="img"
                    image={getFirstImageUrl(product.imagen)} 
                    alt={product.nombre}
                    sx={{ height: 200, objectFit: "cover" }}
                />
                
                
                <CardContent sx={{ flexGrow: 1 }}>
                    
                    <Typography 
                        variant="subtitle1" 
                        noWrap 
                        sx={{ fontWeight: 500, mb: 0.5 }} 
                    >
                        {product.nombre}
                    </Typography>
                  
                    <Typography 
                        variant="h5" 
                        component="p"
                        color="primary" 
                        sx={{ fontWeight: 'bold', lineHeight: 1.2 }}
                    >
                        ${product.precio}
                    </Typography>
                    

                    <Typography
                        variant="body2" 
                        color={product.stock === 1 ? "error.main" : (product.stock > 1 ? "success.main" : "error.main")}
                        sx={{ fontWeight: '600', mt: 0.5 }}
                    >
                        {
                            product.stock === 1 
                                ? "¡Última Unidad!" 
                                : (product.stock > 1 
                                    ? `Stock: ${product.stock}` 
                                    : "Sin stock"
                                )
                        }
                    </Typography>
                </CardContent>

                <Box sx={{ p: 3, textAlign: 'center' }}> 
                    <Button 
                      variant="contained" 
                      size="medium" 
                      
                      sx={{ 
                          width: '90%', 
                          fontSize: 11, 
                          
                          backgroundColor: CUSTOM_LILA, 
                          '&:hover': { backgroundColor: `${CUSTOM_LILA}E0` }, 
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
                          borderRadius: '8px', 
                          fontWeight: 'bold',
                          padding: '10px 10px',
                      }}
                      startIcon={<ShoppingCartIcon sx={{ fontSize: 13 }} />} 
                      onClick={(e) => handleAddToCartClick(e, product)}
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? "Agotado" : "Agregar al Carrito"}
                    </Button>
                </Box>
            </Link>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default ProductList;