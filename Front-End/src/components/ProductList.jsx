import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  // Cargar productos desde el backend
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/productos");
      // Asegurarnos que products sea un array
      setProducts(res.data.data || []);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
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
            <CardMedia
              component="img"
              image={product.imagen || "/images/default.jpg"}
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
