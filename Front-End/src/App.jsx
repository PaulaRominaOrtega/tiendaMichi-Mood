import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



// Componentes de la zona pública (Front-End)
import Header from './components/Header';
import Banner from './components/Banner';
import FilterBar from './components/FilterBar';
import ProductList from './components/ProductList';
import Hero from './components/Hero';
import Footer from './components/Footer';

// Componentes de la zona de administración (Back-End)
import AdminLayout from './Admin/components/AdminLayout';
import Dashboard from './Admin/pages/Dashboard';
import ProductCrud from './Admin/pages/ProductCrud';
import CategoryCrud from '../src/Admin/components/CategoryCrud'; 
import ClienteCrud from '../src/Admin/components/ClienteCrud'; 
import PedidoCrud from '../src/Admin/components/PedidoCrud'; 
import PedidoForm from '../src/Admin/components/PedidoForm'; 

// Componente de Layout para la zona pública
const PublicLayout = () => (
  <>
    <Header />
    <Banner />
    <FilterBar />
    <ProductList />
    <Hero />
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas para la zona de administración */}
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          
          <Route path="productos" element={<ProductCrud />} />
          
          <Route path="categorias" element={<CategoryCrud />} />
          
          <Route path="clientes" element={<ClienteCrud />} />

          <Route path="pedidos" element={<PedidoCrud />} />
          <Route path="pedidos/editar/:id" element={<PedidoForm />} />
        </Route>
        
        <Route path="/" element={<PublicLayout />} />
      </Routes>
    </Router>
  );
}

export default App;