import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, Box, Alert, Typography } from '@mui/material';

// === Importaciones de Componentes Públicos (Front-End/src/components) ===
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
import RegisterPage from './components/RegisterPage'; // 👈 ¡NUEVA IMPORTACIÓN!


// === Importaciones de Componentes de Administración (Front-End/src/Admin/...) ===
import AdminLoginPage from './Admin/pages/AdminLoginPage';
import AdminLayout from './Admin/components/AdminLayout'; 
import Dashboard from './Admin/pages/Dashboard'; 
import ProductCrud from './Admin/pages/ProductCrud'; 
import CategoryCrud from './Admin/components/CategoryCrud'; 
import ClienteCrud from './Admin/components/ClienteCrud'; 
import PedidoCrud from './Admin/components/PedidoCrud'; 
import PedidoForm from './Admin/components/PedidoForm'; 

// === Importaciones CLAVE de Contextos ===
import { CartProvider, useCart } from './context/CartContext'; 
import { AuthProvider } from './context/AuthContext'; 
// ------------------------------------------

// Componente "guardián" para proteger las rutas de administración
const PrivateAdminRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken'); 
  return token ? children : <Navigate to="/admin/login" />;
};

// Componente para mostrar las notificaciones del carrito
const NotificationBar = () => {
    // 1. Los Hooks se llaman SIEMPRE al inicio y sin condiciones
    const { notification, hideNotification } = useCart(); 

    // 2. El useEffect también se llama SIEMPRE
    React.useEffect(() => {
        // La condición para el temporizador va DENTRO del hook
        if (notification) { 
            const timer = setTimeout(() => {
                hideNotification();
            }, 5000); 
            return () => clearTimeout(timer);
        }
    }, [notification, hideNotification]);
    
    // 3. El renderizado condicional ocurre AL FINAL del componente
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


// Componente de Layout para la zona pública 
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
                    
                    {/* === Rutas de Administración === */}
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
                        <Route path="pedidos/editar/:id" element={<PedidoForm />} />
                    </Route>

                    {/* === Rutas Públicas de Autenticación === */}
                    <Route path="/login" element={
                        <MainLayout>
                            <LoginPage /> 
                        </MainLayout>
                    } />
                    
                    <Route path="/register" element={ // 👈 ¡NUEVA RUTA DE REGISTRO!
                        <MainLayout>
                            <RegisterPage /> 
                        </MainLayout>
                    } />

                    {/* Ruta de manejo de redirección exitosa de Google/OAuth */}
                    <Route path="/login-success" element={<LoginSuccessHandler />} /> 
                    
                    {/* === Rutas Públicas de Navegación === */}
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

                    {/* Ruta de Detalle de Producto */}
                    <Route 
                        path="/producto/:id" 
                        element={
                            <MainLayout>
                                <ProductDetail />
                            </MainLayout>
                        } 
                    />

                    {/* Ruta del Carrito */}
                    <Route path="/carrito" element={
                        <MainLayout>
                            <CartPage /> 
                        </MainLayout>
                    } />
                    
                    {/* Ruta de Confirmación de Pedido */}
                    <Route path="/confirmacion-pedido" element={
                        <MainLayout>
                            <OrderConfirmationPage /> 
                        </MainLayout>
                    } />
                    
                    {/* Otras Rutas Públicas */}
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
                    
                    {/* Ruta 404: Captura cualquier otra URL no definida */}
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