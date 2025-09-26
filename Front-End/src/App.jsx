import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Componentes de la zona pública
import Header from './components/Header';
import Banner from './components/Banner';
import FilterBar from './components/FilterBar';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Chatbot from '../src/components/ChatBot';

// Componentes de la zona de administración
import AdminLayout from './Admin/components/AdminLayout';
import Dashboard from './Admin/pages/Dashboard';
import ProductCrud from './Admin/pages/ProductCrud';
import CategoryCrud from '../src/Admin/components/CategoryCrud';
import ClienteCrud from '../src/Admin/components/ClienteCrud';
import PedidoCrud from '../src/Admin/components/PedidoCrud';
import PedidoForm from '../src/Admin/components/PedidoForm';

// Nuevo componente de login para administradores
import AdminLoginPage from './Admin/pages/AdminLoginPage';

// Componente "guardián" para proteger las rutas
const PrivateAdminRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/admin/login" />;
};

// Componente de Layout para la zona pública
const PublicLayout = () => (
  <>
    <Header />
    <Banner />
    <FilterBar />
    <ProductList />
    <Hero />
    <Footer />
    <Chatbot />
  </>
);

// Componente de Layout para páginas de producto
const ProductLayout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
    <Chatbot />
  </>
);
function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para el inicio de sesión del administrador (PÚBLICA) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Rutas para la zona de administración (PROTEGIDAS) */}
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

        {/* Ruta para detalle de producto */}
        <Route 
          path="/producto/:id" 
          element={
            <ProductLayout>
              <ProductDetail />
            </ProductLayout>
          } 
        />
        {/* Ruta para la zona pública */}
        <Route path="/" element={<PublicLayout />} />
      </Routes>
    </Router>
  );
}

export default App;