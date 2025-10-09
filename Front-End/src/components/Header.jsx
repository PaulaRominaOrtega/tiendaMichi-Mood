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
import Badge from '@mui/material/Badge'; 
import Divider from '@mui/material/Divider';
import LoginIcon from '@mui/icons-material/Login'; 
import LogoutIcon from '@mui/icons-material/Logout'; 
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; 

// --- Importar Hooks y Contextos ---
import useCategories from '../hooks/useCategories'; 
import { useCart } from '../context/CartContext'; // 🚨 Necesario para obtener clearCart
import { useAuth } from '../context/AuthContext'; 
// ------------------------------

// Rutas de navegación estáticas
const pagesWithRoutes = [
  { name: 'Inicio', path: '/' },
  { name: 'Nosotros', path: '/nosotros' },
  { name: 'Contacto', path: '/contacto' }, 
];

// Configuraciones del menú de usuario
const settings = ['Perfil', 'Cuenta', 'Panel'];


function Header() {
  const navigate = useNavigate();
  const { categories: fetchedCategories, loading, error } = useCategories(); 
  
  // 🚨 OBTENEMOS EL ESTADO DE AUTENTICACIÓN Y LA FUNCIÓN LOGOUT 🚨
  const { isAuthenticated, logout, email } = useAuth(); 
  
  // 🚨 OBTENEMOS EL CARRO Y LA FUNCIÓN DE LIMPIEZA 🚨
  const { totalItems, clearCart } = useCart(); 
  
  const categoriesToShow = fetchedCategories.filter(cat => 
      ['Deco Hogar', 'Cocina', 'Librería', 'Accesorios'].includes(cat.nombre)
  );

  const [anchorElProducts, setAnchorElProducts] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  
  // --- Manejo de Menús ---
  const handleOpenProductsMenu = (event) => {
    setAnchorElProducts(event.currentTarget);
  };

  const handleCloseProductsMenu = () => {
    setAnchorElProducts(null);
  };
  
  const handleCategoryClick = (categoryName) => {
      handleCloseProductsMenu();
      const regex = new RegExp("\\s", "g"); 
      const slug = categoryName.toLowerCase().replace(regex, '-'); 
      navigate(`/productos?categoria=${slug}`); 
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // --- LÓGICA DE LOGIN / LOGOUT (Modificado para pasar clearCart) ---
  const handleAuthAction = (action) => {
    handleCloseUserMenu();
    if (action === 'login') {
        navigate('/login');
    } else if (action === 'logout') {
        // 🚨 CAMBIO CLAVE: Pasamos clearCart a la función logout 🚨
        logout(clearCart); 
    }
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
            
            {/* Páginas estáticas y Categorías */}
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
                onClick={handleOpenProductsMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
            >
                Categorías
            </Button>
            
            {/* --- MENÚ SIMPLE DINÁMICO (Categorías) --- */}
            <Menu
              id="simple-menu"
              anchorEl={anchorElProducts}
              open={Boolean(anchorElProducts)}
              onClose={handleCloseProductsMenu}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
              {loading && <MenuItem disabled><CircularProgress size={20} /></MenuItem>}
              {error && <MenuItem disabled><Alert severity="error">Error al cargar categorías</Alert></MenuItem>}
                
              {!loading && categoriesToShow.length > 0 && categoriesToShow.map((category) => (
                <MenuItem 
                    key={category.id} 
                    onClick={() => handleCategoryClick(category.nombre)}
                >
                    {category.nombre}
                </MenuItem>
              ))}
            </Menu>
            {/* ------------------------------------------- */}

          </Box>

          {/* Íconos de Carrito, Autenticación y Configuración */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
            
            {/* 🚨 BOTÓN DE LOGIN / LOGOUT DINÁMICO (Desktop) 🚨 */}
            <Button
                color="inherit"
                variant="outlined"
                size="small"
                onClick={() => handleAuthAction(isAuthenticated ? 'logout' : 'login')}
                startIcon={isAuthenticated ? <LogoutIcon /> : <LoginIcon />}
                sx={{ 
                    display: { xs: 'none', md: 'flex' }, 
                    textTransform: 'none', 
                    borderColor: 'white',
                    color: 'white'
                }}
            >
                {isAuthenticated ? 'Cerrar Sesión' : 'Iniciar Sesión'}
            </Button>


            <Tooltip title="Ver carrito">
              <IconButton 
                color="inherit" 
                onClick={() => navigate('/carrito')}
              >
                <Badge badgeContent={totalItems} color="error" max={99}> 
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            {/* Menú de Usuario (Configuración) */}
            <Tooltip title={isAuthenticated && email ? email : "Abrir Configuración"}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {/* Muestra la inicial del email si existe, o el icono de usuario */}
                <Avatar alt="Usuario" sx={{ bgcolor: 'secondary.main' }}> 
                    {isAuthenticated && email ? email[0].toUpperCase() : <AccountCircleIcon />}
                </Avatar>
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
              
              {/* 🚨 Opción de Logout en el menú desplegable también 🚨 */}
              <Divider />
              <MenuItem onClick={() => handleAuthAction(isAuthenticated ? 'logout' : 'login')}>
                <Typography 
                    textAlign="center" 
                    color={isAuthenticated ? 'error' : 'primary'}
                >
                    {isAuthenticated ? 'Cerrar Sesión' : 'Iniciar Sesión'}
                </Typography>
              </MenuItem>

            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;