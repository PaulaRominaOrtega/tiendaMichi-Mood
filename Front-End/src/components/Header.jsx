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
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Badge from '@mui/material/Badge';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import useCategories from '../hooks/useCategories';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CUSTOM_LILA = '#C8A2C8';
const NEUTRAL_GRAY_BG = '#9e9e9e';
const AVATAR_PURPLE = '#9370DB';

const pagesWithRoutes = [
  { name: 'Inicio', path: '/' },
  { name: 'Nosotros', path: '/nosotros' },
  { name: 'Contacto', path: '/contacto' },
];

const settings = [];

function Header() {
  const navigate = useNavigate();
  const { categories: fetchedCategories, loading, error } = useCategories();
  const { isAuthenticated, logout, email } = useAuth();
  const { totalItems, clearCart } = useCart();

  const categoriesToShow = fetchedCategories.filter(cat =>
    ['Deco Hogar', 'Cocina', 'Librería', 'Accesorios'].includes(cat.nombre)
  );

  const [anchorElProducts, setAnchorElProducts] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenProductsMenu = (event) => setAnchorElProducts(event.currentTarget);
  const handleCloseProductsMenu = () => setAnchorElProducts(null);

  const handleCategoryClick = (categoryName) => {
    handleCloseProductsMenu();
    const slug = categoryName.toLowerCase().replace(/\s/g, '-');
    navigate(`/productos?categoria=${slug}`);
  };

  const handleAuthAction = (path, action) => {
    if (action === 'logout') logout(clearCart);
    navigate(path);
  };

  return (
    <AppBar position="static" sx={{ mt: 2, backgroundColor: NEUTRAL_GRAY_BG, boxShadow: 'none' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            component={Link}
            to="/"
            sx={{
              mr: 4,
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <img
              src="/images/michi.png"
              alt="Logo MichiMood"
              style={{ height: 62, width: 'auto', borderRadius: '12px' }} 
              
            />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-start' }}>
            {pagesWithRoutes.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.path}
                sx={{
                  my: 2,
                  color: 'white',
                  display: 'block',
                  fontWeight: 600,
                  '&:hover': { color: CUSTOM_LILA, backgroundColor: 'transparent' }
                }}
              >
                {page.name.toUpperCase()}
              </Button>
            ))}

            <Button
              key="Categorias"
              aria-controls={anchorElProducts ? 'simple-menu' : undefined}
              aria-haspopup="true"
              onClick={handleOpenProductsMenu}
              sx={{
                my: 2,
                color: 'white',
                display: 'block',
                fontWeight: 600,
                '&:hover': { color: CUSTOM_LILA, backgroundColor: 'transparent' }
              }}
            >
              CATEGORÍAS
            </Button>

            <Menu
              id="simple-menu"
              anchorEl={anchorElProducts}
              open={Boolean(anchorElProducts)}
              onClose={handleCloseProductsMenu}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
              {loading && <MenuItem disabled><CircularProgress size={20} /></MenuItem>}
              {error && <MenuItem disabled><Alert severity="error">Error al cargar categorías</Alert></MenuItem>}
              {!loading && categoriesToShow.length > 0 && categoriesToShow.map((category) => (
                <MenuItem key={category.id} onClick={() => handleCategoryClick(category.nombre)}>
                  {category.nombre}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 1 }}>

            {isAuthenticated ? (
              <Button
                color="inherit"
                variant="outlined"
                size="medium"
                onClick={() => handleAuthAction('/', 'logout')}
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  textTransform: 'uppercase',
                  borderColor: 'white',
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': { borderColor: CUSTOM_LILA, color: CUSTOM_LILA }
                }}
              >
                Cerrar Sesión
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  size="medium"
                  onClick={() => handleAuthAction('/register')}
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    backgroundColor: CUSTOM_LILA,
                    color: 'white',
                    '&:hover': { backgroundColor: `${CUSTOM_LILA}E0` }
                  }}
                >
                  CREAR CUENTA
                </Button>
                <Button
                  color="inherit"
                  variant="outlined"
                  size="medium"
                  onClick={() => handleAuthAction('/login')}
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    textTransform: 'uppercase',
                    borderColor: 'white',
                    color: 'white',
                    fontWeight: 600,
                    '&:hover': { borderColor: CUSTOM_LILA, color: CUSTOM_LILA }
                  }}
                >
                  Iniciar Sesión
                </Button>
              </>
            )}

            <Tooltip title="Ver carrito">
              <IconButton
                color="inherit"
                onClick={() => navigate('/carrito')}
                sx={{ color: 'white', '&:hover': { color: CUSTOM_LILA } }}
              >
                <Badge badgeContent={totalItems} color="error" max={99}>
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title={isAuthenticated && email ? email : "Abrir Menú"}>
              <IconButton
                onClick={!isAuthenticated ? (e) => setAnchorElUser(e.currentTarget) : undefined}
                sx={{ p: 0 }}
              >
                <Avatar alt="Usuario" sx={{ bgcolor: AVATAR_PURPLE, width: 32, height: 32 }}>
                  {isAuthenticated && email ? email[0].toUpperCase() : <AccountCircleIcon />}
                </Avatar>
              </IconButton>
            </Tooltip>

            {!isAuthenticated && (
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorElUser)}
                onClose={() => setAnchorElUser(null)}
              >
                <MenuItem onClick={() => handleAuthAction('/login')}>
                  <Typography textAlign="center">Iniciar Sesión</Typography>
                </MenuItem>
                <MenuItem onClick={() => handleAuthAction('/register')}>
                  <Typography textAlign="center">Crear Cuenta</Typography>
                </MenuItem>
              </Menu>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
