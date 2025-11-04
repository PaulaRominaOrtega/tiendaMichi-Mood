import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import Pagination from "@mui/material/Pagination";
import FilterBar from './FilterBar';
import { useCart } from '../context/CartContext';

const BACKEND_BASE_URL = "http://localhost:3000";
const DEFAULT_IMAGE_PATH = "/images/default.jpg";
const CUSTOM_LILA = '#C8A2C8';
const CUSTOM_LILA_HOVER = '#EAE2EA';

const formatPrice = (price) => {
  const num = parseFloat(price);
  if (num % 1 === 0) return num.toFixed(0);
  return num.toFixed(2);
};

const calculateDiscountedPrice = (price, discount) => {
  if (typeof discount === 'number' && discount > 0) {
    const discountedPrice = price * (1 - discount / 100);
    return formatPrice(discountedPrice);
  }
  return formatPrice(price);
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const { addToCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlPage = parseInt(params.get('page'), 10) || 1;
    setCurrentPage(urlPage);

    const categoriaSlug = params.get('categoria');
    const categoriaNombre = categoriaSlug
      ? categoriaSlug.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      : null;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      let url = `${BACKEND_BASE_URL}/api/productos?page=${urlPage}&limit=${itemsPerPage}`;

      params.forEach((value, key) => {
        if (key !== 'page' && key !== 'limit' && key !== 'categoria') {
          url += `&${key}=${encodeURIComponent(value)}`;
        }
      });

      if (categoriaNombre) {
        url += `&categoria=${encodeURIComponent(categoriaNombre)}`;
      }

      console.log('Fetching products ->', { urlPage, itemsPerPage, url });

      try {
        const res = await axios.get(url);
        setProducts(res.data.data || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
      } catch (err) {
        console.error("Error al obtener productos:", err);
        setError("Error al cargar la lista de productos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

  const getFirstImageUrl = (imageString) => {
    if (!imageString) return DEFAULT_IMAGE_PATH;
    const imageNames = imageString.split(',');
    const firstName = imageNames[0].trim();
    return firstName ? `${BACKEND_BASE_URL}/uploads/${firstName}` : DEFAULT_IMAGE_PATH;
  };

  const handleAddToCartClick = (e, product) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product, 1);
  };

  const handlePageChange = (event, value) => {
    const currentParams = new URLSearchParams(location.search);
    currentParams.set('page', value);
    navigate(`?${currentParams.toString()}`);
  
    const element = document.getElementById('product-list-start');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    } else {
      window.scrollTo(0, 0);
    }
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
        id="product-list-start" 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          mb: 4 
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mr: { sm: 2 }, mb: { xs: 2, sm: 0 } }}>
          {(() => {
            const params = new URLSearchParams(location.search);
            const slug = params.get('categoria');
            return slug ? slug.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Todos los Productos';
          })()}
        </Typography>
        <Box sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: 250, maxWidth: '100%' }}>
          <FilterBar />
        </Box>
      </Box>

      <Divider sx={{ mb: 6 }} />

      {products.length === 0 && (
        <Alert severity="info" sx={{ mb: 4 }}>
          {new URLSearchParams(location.search).get('categoria')
            ? `No se encontraron productos para la categoría o con los filtros aplicados.`
            : "No hay productos disponibles o la búsqueda no arrojó resultados."
          }
        </Alert>
      )}

      <Box sx={{
        display: "grid",
        gridTemplateColumns: { xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(5, 1fr)" },
        gap: 4,
        alignItems: 'stretch'
      }}>
        {products.map((product) => (
          <Card key={product.id} sx={{
            height: "100%", display: 'flex', flexDirection: 'column',
            borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.3s, box-shadow 0.3s, background-color 0.3s', cursor: 'pointer',
            '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)', backgroundColor: CUSTOM_LILA_HOVER }
          }}>
            <Link to={`/producto/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia component="img" image={getFirstImageUrl(product.imagen)} alt={product.nombre} sx={{ height: 200, objectFit: "cover", borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }} />
                {product.oferta && product.descuento > 0 && (
                  <Typography variant="caption" color="white" sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'darkred', fontWeight: 'bold', p: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', zIndex: 1 }}>
                    -{product.descuento}% OFF
                  </Typography>
                )}
              </Box>

              <CardContent sx={{ flexGrow: 1, minHeight: 110, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle1" noWrap sx={{ fontWeight: 500, mb: 0.5 }}>{product.nombre}</Typography>
                {product.oferta && product.descuento > 0 && <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through', mb: 0.5 }}>${formatPrice(product.precio)}</Typography>}
                <Typography variant="h6" component="p" color={product.oferta && product.descuento > 0 ? 'error.main' : 'primary'} sx={{ fontWeight: product.oferta && product.descuento > 0 ? '900' : 'bold' }}>
                  ${calculateDiscountedPrice(product.precio, product.descuento)}
                </Typography>
                <Typography variant="body2" color={product.stock === 1 ? "error.main" : (product.stock > 1 ? "success.main" : "error.main")} sx={{ fontWeight: '600', mt: 0.5, marginTop: 'auto' }}>
                  {product.stock === 1 ? "¡Última Unidad!" : (product.stock > 1 ? `Disponibles: ${product.stock}` : "Sin stock")}
                </Typography>
              </CardContent>

              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Button variant="contained" size="medium" sx={{ width: '100%', fontSize: 11, backgroundColor: CUSTOM_LILA, '&:hover': { backgroundColor: `${CUSTOM_LILA}E0` }, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '8px', fontWeight: 'bold', padding: '10px 10px' }} startIcon={<ShoppingCartIcon sx={{ fontSize: 13 }} />} onClick={(e) => handleAddToCartClick(e, product)} disabled={product.stock === 0}>
                  {product.stock === 0 ? "Agotado" : "Agregar al Carrito"}
                </Button>
              </Box>
            </Link>
          </Card>
        ))}
      </Box>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 2 }}>
          <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" size="large" />
        </Box>
      )}
    </Container>
  );
};

export default ProductList;