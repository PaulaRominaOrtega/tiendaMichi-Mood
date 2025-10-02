import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

// URL base del backend para servir las imágenes
const BACKEND_BASE_URL = "http://localhost:3000";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  // Cargar productos desde el backend
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BACKEND_BASE_URL}/api/productos`);
      // Asegurarnos que products sea un array (usando res.data.data si es el formato de tu backend)
      setProducts(res.data.data || []);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  /**
   * 🔑 CLAVE DE LA CORRECCIÓN: Obtiene la URL de la primera imagen.
   * Divide el string de imágenes separadas por coma y usa solo la primera.
   * @param {string} imageString El string de nombres de archivo (ej: "img1.jpg,img2.jpg")
   * @returns {string} La URL completa de la primera imagen o una imagen por defecto.
   */
  const getFirstImageUrl = (imageString) => {
    // 1. Verifica que exista el string y no esté vacío
    if (!imageString) {
      return "/images/default.jpg";
    }

    // 2. Divide el string por la coma (,)
    const imageNames = imageString.split(',');
    
    // 3. Usa el primer nombre de archivo (después de eliminar espacios en blanco)
    const firstName = imageNames[0].trim();
    
    // 4. Si el nombre es válido, retorna la URL completa, si no, retorna el default.
    return firstName 
      ? `${BACKEND_BASE_URL}/uploads/${firstName}` 
      : "/images/default.jpg";
  };


  return (
    <Box sx={{ padding: 4 }}>
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
          <Card key={product.id} sx={{ height: "100%" }}>
            <Link to={`/producto/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <CardMedia
              component="img"
              // 🚨 CORRECCIÓN APLICADA AQUÍ: Se llama a la función para obtener SOLO la primera URL
              image={getFirstImageUrl(product.imagen)} 
              alt={product.nombre}
              sx={{ height: 200, objectFit: "cover" }}
            />
            <CardContent>
              <Typography variant="h6">{product.nombre}</Typography>
              <Typography color="text.secondary">${product.precio}</Typography>
              <Typography variant="body2" color="text.secondary">
                {product.descripcion}
              </Typography>
              <Typography
                variant="caption"
                color={product.stock > 0 ? "green" : "red"}
              >
                {product.stock > 0 ? `Stock: ${product.stock}` : "Sin stock"}
              </Typography>
            </CardContent>
            </Link>
            <CardActions>
              <Button size="small" variant="contained" color="primary">
                Agregar al carrito
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default ProductList;