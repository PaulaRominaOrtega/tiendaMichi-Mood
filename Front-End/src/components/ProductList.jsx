import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom"; 
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// 🚨 IMPORTACIÓN CLAVE: El hook para usar el carrito
import { useCart } from '../context/CartContext'; 
// --------------------------------------------------

// URL base del backend para servir las imágenes
const BACKEND_BASE_URL = "http://localhost:3000";
const DEFAULT_IMAGE_PATH = "/images/default.jpg";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🚨 1. Obtener la función addToCart del contexto
  const { addToCart } = useCart(); 
  // ----------------------------------------------

  const location = useLocation(); 
  const queryParams = new URLSearchParams(location.search);
  const categoriaSlug = queryParams.get('categoria'); 
  
  // Convertir el slug (ej: 'deco-hogar') a nombre legible (ej: 'Deco Hogar')
  const categoriaNombre = categoriaSlug 
    ? categoriaSlug.replace(/-/g, ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    : null;

  // Cargar productos desde el backend
  useEffect(() => {
    fetchProducts();
  }, [categoriaSlug]); // Se re-ejecuta si el filtro cambia

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    // 3. Construir la URL de la API dinámicamente
    let url = `${BACKEND_BASE_URL}/api/productos?limit=100`; 
    
    if (categoriaNombre) {
      // Enviamos el nombre legible de la categoría al Back-End para que filtre
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

  /**
   * Obtiene la URL de la primera imagen.
   */
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
  
  // 🚨 Nueva función para manejar el clic del botón "Agregar al Carrito"
  const handleAddToCartClick = (e, product) => {
      e.preventDefault(); // Detiene el evento de propagación para que el <Link> no se active
      addToCart(product, 1); // Agregamos 1 unidad por defecto
  };
  // ----------------------------------------------------------------------

  // --- Manejo de la vista de carga y error ---
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
  
  // --- Renderizado principal ---
  return (
    <Container maxWidth="xl" sx={{ padding: 4 }}>
      {/* Título dinámico para saber qué estamos viendo */}
      <Typography variant="h4" gutterBottom sx={{ borderBottom: '2px solid #ccc', pb: 1, mb: 4 }}>
        {categoriaNombre || 'Todos los Productos'}
      </Typography>

      {products.length === 0 && (
          <Alert severity="info">
             {categoriaSlug 
                ? `No se encontraron productos para la categoría "${categoriaNombre}".`
                : "No hay productos disponibles."
             }
          </Alert>
      )}
      
      {/* Tu layout de productos original */}
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
          <Card key={product.id} sx={{ height: "100%", display: 'flex', flexDirection: 'column' }}>
            {/* El Link envuelve la imagen y el contenido para ir al detalle */}
            <Link to={`/producto/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
                <CardMedia
                    component="img"
                    image={getFirstImageUrl(product.imagen)} 
                    alt={product.nombre}
                    sx={{ height: 200, objectFit: "cover" }}
                />
                <CardContent>
                    <Typography variant="h6" noWrap>{product.nombre}</Typography>
                    <Typography color="text.secondary" sx={{ fontWeight: 'bold' }}>${product.precio}</Typography>
                    
                    <Typography
                        variant="caption"
                        color={product.stock > 0 ? "success.main" : "error.main"}
                    >
                        {product.stock > 0 ? `Stock: ${product.stock}` : "Sin stock"}
                    </Typography>
                </CardContent>
            </Link>
            
            <CardActions sx={{ mt: 'auto' }}>
              <Button 
                size="small" 
                variant="contained" 
                color="primary"
                startIcon={<ShoppingCartIcon />}
                // 🚨 Usamos la nueva función para conectar con el carrito
                onClick={(e) => handleAddToCartClick(e, product)}
                disabled={product.stock === 0}
              >
                Agregar
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default ProductList;