import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, Box, Alert, CircularProgress, Typography } from '@mui/material';

// === Importaciones de Componentes Públicos (Front-End/src/components) ===
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/ChatBot'; 
import Hero from './components/Hero'; 
import Banner from './components/Banner'; 
import FilterBar from './components/FilterBar'; 
import ProductList from './components/ProductList'; 
import ProductDetail from './components/ProductDetail'; 
import CartPage from './components/CartPage'; 
import NosotrosPage from './components/NosotrosPage'; 
import ContactoPage from './components/ContactoPage'; // 🚨 NUEVA IMPORTACIÓN DE CONTACTO


// === Importaciones de Componentes de Administración (Front-End/src/Admin/...) ===
import AdminLoginPage from './Admin/pages/AdminLoginPage';
import AdminLayout from './Admin/components/AdminLayout'; 
import Dashboard from './Admin/pages/Dashboard'; 
import ProductCrud from './Admin/pages/ProductCrud'; 
import CategoryCrud from './Admin/components/CategoryCrud'; 
import ClienteCrud from './Admin/components/ClienteCrud'; 
import PedidoCrud from './Admin/components/PedidoCrud'; 
import PedidoForm from './Admin/components/PedidoForm'; 

// === Importaciones CLAVE para el Carrito ===
import { CartProvider, useCart } from './context/CartContext'; 
// ------------------------------------------

// Componente "guardián" para proteger las rutas de administración
const PrivateAdminRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/admin/login" />;
};

// Componente para mostrar las notificaciones del carrito
const NotificationBar = () => {
    const { notification } = useCart();

    if (!notification) return null;

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
    <NotificationBar /> {/* Mostramos las notificaciones dentro del Layout */}
    <main style={{ minHeight: '80vh' }}>{children}</main>
    <Footer />
    <Chatbot />
  </>
);

function App() {
  return (
    <Router>
        {/* Envolvemos toda la lógica de rutas y componentes en el CartProvider */}
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

                {/* === Rutas Públicas de la Tienda === */}
                
                <Route path="/" element={
                    <MainLayout>
                        <Hero />
                        <Banner />
                        <FilterBar />
                        <ProductList /> 
                    </MainLayout>
                } />
                
                <Route path="/productos" element={
                    <MainLayout>
                        <FilterBar />
                        <ProductList /> 
                    </MainLayout>
                } />

                <Route path="/nosotros" element={
                    <MainLayout>
                        <NosotrosPage /> 
                    </MainLayout>
                } />
                
                {/* 🚨 NUEVA RUTA DE CONTACTO 🚨 */}
                <Route path="/contacto" element={
                    <MainLayout>
                        <ContactoPage /> 
                    </MainLayout>
                } />
                
                <Route path="/carrito" element={
                    <MainLayout>
                        <CartPage /> 
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
                
                {/* Ruta 404: Captura cualquier otra URL no definida */}
                <Route path="*" element={
                    <MainLayout>
                        <Box sx={{ textAlign: 'center', py: 5 }}>
                            <Typography variant="h4">404 - Página no encontrada</Typography>
                        </Box>
                    </MainLayout>
                } />

            </Routes>
        </CartProvider>
    </Router>
  );
}

export default App;