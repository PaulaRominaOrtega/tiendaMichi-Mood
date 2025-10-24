import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, Box, Alert, Typography } from '@mui/material';

//Importacion Componentes Públicos 
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/ChatBot'; 
import Banner from './components/Banner'; 
import ProductList from './components/ProductList'; 
import ProductDetail from './components/ProductDetail'; 
import CartPage from './components/CartPage'; 
import NosotrosPage from './components/NosotrosPage'; 
import ContactoPage from './components/ContactoPage'; 
import OrderConfirmationPage from './components/OrderConfirmationPage'; 
import LoginPage from './components/LoginPage'; 
import LoginSuccessHandler from './components/LoginSuccessHandler'; 
import RegisterPage from './components/RegisterPage'; 
import FilterBar from './components/FilterBar'; 


//Importaciones Administración
import AdminLoginPage from './Admin/pages/AdminLoginPage';
import AdminLayout from './Admin/components/AdminLayout'; 
import Dashboard from './Admin/pages/Dashboard'; 
import ProductCrud from './Admin/pages/ProductCrud'; 
import CategoryCrud from './Admin/components/CategoryCrud'; 
import ClienteCrud from './Admin/components/ClienteCrud'; 
import PedidoCrud from './Admin/components/PedidoCrud'; 
import PedidoForm from './Admin/components/PedidoForm'; 

//iimportacion contexto
import { CartProvider, useCart } from './context/CartContext'; 
import { AuthProvider, useAuth } from './context/AuthContext'; 

// Componente "guardián" para proteger las rutas de Usuario
const PrivateUserRoute = ({ children }) => {

    const { isAuthenticated, loading } = useAuth(); 

    if (loading) {
        return <Box sx={{ textAlign: 'center', py: 10 }}>Cargando sesión...</Box>; 
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

const PrivateAdminRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken'); 
  return token ? children : <Navigate to="/admin/login" />;
};

// mostrar las notificaciones del carrito
const NotificationBar = () => {
    const { notification, hideNotification } = useCart(); 

    React.useEffect(() => {
        if (notification) { 
            const timer = setTimeout(() => {
                hideNotification();
            }, 5000); 
            return () => clearTimeout(timer);
        }
    }, [notification, hideNotification]);
    
    if (!notification) {
        return null;
    }

    return (
        <Box sx={{ 
            position: 'fixed', 
            top: { xs: 8, sm: 20 }, 
            right: { xs: 8, sm: 20 }, 
            zIndex: 1300,
            maxWidth: '90%'
        }}>
            <Alert 
                severity={notification.severity} 
                variant="filled" 
                onClose={hideNotification} 
                sx={{ width: '100%' }}
            >
                {notification.message}
            </Alert>
        </Box>
    );
};


// Componente para la zona publica 
const MainLayout = ({ children }) => (
  <>
    <Header />
    <NotificationBar />
    <main style={{ minHeight: '80vh', padding: '20px 0' }}>{children}</main>
    <Footer />
    <Chatbot />
  </>
);

function App() {
  return (
    <Router>
        <AuthProvider> 
            <CartProvider>
                <CssBaseline />
                <Routes>
                    
                    {/* rutas de Administracion */}
                    <Route path="/admin/login" element={<AdminLoginPage />} />

                    <Route
                        path="/admin"
                        element={
                            <PrivateAdminRoute>
                                <AdminLayout />
                            </PrivateAdminRoute>
                        }
                    >
                        <Route index element={<Dashboard />} />
                        <Route path="productos" element={<ProductCrud />} />
                        <Route path="categorias" element={<CategoryCrud />} />
                        <Route path="clientes" element={<ClienteCrud />} />
                        <Route path="pedidos" element={<PedidoCrud />} />
                        
                        {/* !!! CORRECCIÓN CRÍTICA !!!
                            La ruta de detalle debe coincidir con el enlace creado en PedidoCrud.jsx, 
                            que es '/admin/pedidos/123' (sin la palabra 'editar'). 
                            Como está dentro del <Route path="/admin">, la ruta relativa es "pedidos/:id".
                            
                            (Anterior: <Route path="pedidos/editar/:id" element={<PedidoForm />} />)
                        */}
                        <Route path="pedidos/:id" element={<PedidoForm />} />

                    </Route>

                    {/* rutas publicas de Autenticacion*/}
                    <Route path="/login" element={
                        <MainLayout>
                            <LoginPage /> 
                        </MainLayout>
                    } />
                    
                    <Route path="/register" element={
                        <MainLayout>
                            <RegisterPage /> 
                        </MainLayout>
                    } />

                    {/* ruta protegida perfil*/}
                    <Route path="/profile" element={
                        <PrivateUserRoute> 
                            <MainLayout>
                                <FilterBar />
                            </MainLayout>
                        </PrivateUserRoute>
                    } />

                    {/* Ruta de manejo google */}
                    <Route path="/login-success" element={<LoginSuccessHandler />} /> 
                    
                    {/* ruta pblicas de Navegacion*/}
                    <Route path="/" element={
                        <MainLayout>
                            <Banner />
                            <ProductList /> 
                        </MainLayout>
                    } />
                    
                    <Route path="/productos" element={
                        <MainLayout>
                            <ProductList /> 
                        </MainLayout>
                    } />

                    <Route 
                        path="/producto/:id" 
                        element={
                            <MainLayout>
                                <ProductDetail />
                            </MainLayout>
                        } 
                    />

                    <Route path="/carrito" element={
                        <MainLayout>
                            <CartPage /> 
                        </MainLayout>
                    } />

                    <Route path="/confirmacion-pedido" element={
                        <MainLayout>
                            <OrderConfirmationPage /> 
                        </MainLayout>
                    } />
                   
                    <Route path="/nosotros" element={
                        <MainLayout>
                            <NosotrosPage /> 
                        </MainLayout>
                    } />
                    
                    <Route path="/contacto" element={
                        <MainLayout>
                            <ContactoPage /> 
                        </MainLayout>
                    } />
                    
                    <Route path="*" element={
                        <MainLayout>
                            <Box sx={{ textAlign: 'center', py: 10 }}>
                                <Typography variant="h4">404 - Página no encontrada 😕</Typography>
                                <Typography variant="body1" sx={{ mt: 2 }}>
                                    Parece que te perdiste en el universo de la tienda.
                                </Typography>
                            </Box>
                        </MainLayout>
                    } />

                </Routes>
            </CartProvider>
        </AuthProvider>
    </Router>
  );
}

export default App;