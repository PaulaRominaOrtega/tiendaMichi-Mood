import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import GitHubIcon from '@mui/icons-material/GitHub';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; 
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Badge from '@mui/material/Badge'; // 🚨 IMPORTADO: Necesario para el conteo

// --- Importar el Custom Hook ---
import useCategories from '../hooks/useCategories'; 
// ------------------------------

// 🚨 IMPORTACIÓN CLAVE: El hook para usar el carrito
import { useCart } from '../context/CartContext'; 
// ------------------------------

// Rutas de navegación estáticas
const pagesWithRoutes = [
  { name: 'Inicio', path: '/' },
  { name: 'Nosotros', path: '/nosotros' },
  { name: 'Contacto', path: '/contacto' }, 
];
const settings = ['Perfil', 'Cuenta', 'Panel', 'Cerrar cuenta'];


function Header() {
  const navigate = useNavigate();
  // Uso el hook para obtener las categorías
  const { categories: fetchedCategories, loading, error } = useCategories(); 
  
  // 🚨 Usamos el hook para obtener el conteo total de ítems
  const { totalItems } = useCart(); 
  // ----------------------------------------------------
  
  // Filtramos solo las categorías que queremos mostrar en el menú simple
  // ⚠️ Importante: Verifica que 'Deco Hogar' coincida con tu DB. Lo dejé con H mayúscula como lo enviaste.
  const categoriesToShow = fetchedCategories.filter(cat => 
      ['Deco Hogar', 'Cocina', 'Librería', 'Accesorios'].includes(cat.nombre)
  );

  const [anchorElProducts, setAnchorElProducts] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  
  // --- Manejo del Menú de Productos (Abrir/Cerrar al hacer click) ---
  const handleOpenProductsMenu = (event) => {
    setAnchorElProducts(event.currentTarget);
  };

  const handleCloseProductsMenu = () => {
    setAnchorElProducts(null);
  };
  
  // --- Manejo de Navegación y Filtro (CLAVE) ---
  const handleCategoryClick = (categoryName) => {
      handleCloseProductsMenu();
      
      const regex = new RegExp("\\s", "g"); 
      const slug = categoryName.toLowerCase().replace(regex, '-'); 
      
      navigate(`/productos?categoria=${slug}`); 
  };

  // --- Manejo del Menú de Usuario ---
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  return (
    <AppBar position="static" sx={{ mt:2, backgroundColor: '#9e9e9e' }}> 
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          
          {/* Logo y Nombre de la Tienda (Desktop) */}
          <GitHubIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link} 
            to="/" 
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            MichiMood
          </Typography>

          {/* Enlaces de navegación Desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            
            {/* Páginas estáticas */}
            {pagesWithRoutes.map((page) => (
              <Button
                key={page.name}
                component={Link} 
                to={page.path} 
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.name}
              </Button>
            ))}

            {/* --- Botón de CATEGORÍAS con Menú Simple --- */}
            <Button
                key="Categorias"
                aria-controls={anchorElProducts ? 'simple-menu' : undefined}
                aria-haspopup="true"
                onClick={handleOpenProductsMenu} // Abre el menú al hacer clic
                sx={{ my: 2, color: 'white', display: 'block' }}
            >
                Categorías
            </Button>
            
            {/* --- MENÚ SIMPLE DINÁMICO --- */}
            <Menu
              id="simple-menu"
              anchorEl={anchorElProducts}
              open={Boolean(anchorElProducts)}
              onClose={handleCloseProductsMenu}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              // Aseguramos que el menú aparezca debajo del botón
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
              {loading && <MenuItem disabled><CircularProgress size={20} /></MenuItem>}
              {error && <MenuItem disabled><Alert severity="error">Error al cargar categorías</Alert></MenuItem>}
                
              {!loading && categoriesToShow.length > 0 && categoriesToShow.map((category) => (
                <MenuItem 
                    key={category.id} 
                    onClick={() => handleCategoryClick(category.nombre)} // Navega al filtro
                >
                    {category.nombre}
                </MenuItem>
              ))}
              
              {!loading && categoriesToShow.length === 0 && (
                  <MenuItem disabled>No hay categorías disponibles.</MenuItem>
              )}
            </Menu>
            {/* ------------------------------------------- */}

          </Box>

          {/* Íconos de Carrito y Configuración */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Ver carrito">
              {/* 🚨 MODIFICADO: Usamos totalItems y onClick con navigate */}
              <IconButton 
                color="inherit" 
                onClick={() => navigate('/carrito')} // Redirige a la página del carrito
              >
                <Badge badgeContent={totalItems} color="error" max={99}> 
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            {/* Menú de Usuario (Configuración) */}
            <Tooltip title="Abrir Configuración">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Usuario" src="/images/avatar.jpeg" /> 
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;