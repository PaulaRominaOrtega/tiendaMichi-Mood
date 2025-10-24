// src/Admin/pages/ProductCrud.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import ProductForm from '../components/ProductForm';
import { IoAdd } from 'react-icons/io5'; 

const ProductCrud = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const PASTEL_COLORS = {
    background: 'bg-pink-50',         
    paper: 'bg-white',                
    primary: 'bg-indigo-300',         
    primaryHover: 'hover:bg-indigo-400', 
    tableHeader: 'bg-teal-100',       
    tableHeaderText: 'text-gray-700', 
    text: 'text-gray-700',            
    title: 'text-purple-600',         
    error: 'text-red-500',
    paginationBg: 'bg-purple-200',    
    paginationHover: 'hover:bg-purple-300',
    editIconHover: 'hover:text-pink-500', 
    deleteIconHover: 'hover:text-red-400',
    hoverRow: 'hover:bg-teal-50', 
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5; 


  useEffect(() => {
    fetchProducts();
  }, [currentPage]); 

  const fetchProducts = async () => {
    if (isFormVisible) return;
    
    const url = `/productos?page=${currentPage}&limit=${itemsPerPage}`;
    
    try {
      setLoading(true);
      const response = await api.get(url);
      
      setProducts(response.data.data); 
      setTotalPages(response.data.pagination.totalPages || 1);
      setLoading(false);
      setError(null);

    } catch (error) {
      console.error('Error fetching products:', error);
      setError("Error al cargar los productos. Verifique la conexión con el backend.");
      setLoading(false);
      setProducts([]);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await api.delete(`/productos/${productId}`);
        fetchProducts(); 
      } catch (error) {
        console.error("Error deleting product:", error);
        setError("Error al eliminar el producto.");
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsFormVisible(true);
  };
  
  const handleAdd = () => {
    setEditingProduct(null);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingProduct(null);
    fetchProducts(); 
  };
  
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
        setCurrentPage(newPage);
    }
  };


  if (loading) return <div className={`p-4 text-center ${PASTEL_COLORS.text}`}>Cargando productos...</div>;
  if (error) return <div className={`p-4 text-center ${PASTEL_COLORS.error}`}>{error}</div>;


  return (
    <div className={`container mx-auto p-4 ${PASTEL_COLORS.background} rounded-lg shadow-xl`}>
      <h2 className={`text-3xl font-bold mb-6 text-center ${PASTEL_COLORS.title}`}>Gestión de Productos</h2>

      {isFormVisible && (
        <div className={`mb-6 p-6 ${PASTEL_COLORS.paper} shadow-lg rounded-lg border border-gray-200`}>
          <ProductForm
            editingProduct={editingProduct}
            onSave={handleCancel}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Lista de Productos y Botón de Acción */}
      <div className="overflow-x-auto mt-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className={`text-xl font-semibold ${PASTEL_COLORS.text}`}>Lista de Productos</h3>
            
            {!isFormVisible && (
                <button
                    onClick={handleAdd}
                    className={`${PASTEL_COLORS.primary} ${PASTEL_COLORS.primaryHover} text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.02] flex items-center shadow-md`}
                >
                    <IoAdd className="w-5 h-5 mr-1" /> 
                    Nuevo Producto
                </button>
            )}
        </div>
        
        {products.length === 0 ? (
          <div className={`text-center p-6 ${PASTEL_COLORS.paper} rounded-lg shadow-md`}>
            <p className={`${PASTEL_COLORS.text}`}>No hay productos en esta página. {currentPage > 1 && `Vuelve a la página anterior (${currentPage - 1}).`}</p>
          </div>
        ) : (
          <div className={`${PASTEL_COLORS.paper} shadow-lg rounded-lg overflow-hidden border border-gray-200`}>
            <table className="min-w-full">
              <thead className={`${PASTEL_COLORS.tableHeader} text-sm leading-normal`}>
                <tr>
                  <th className={`py-3 px-6 text-center ${PASTEL_COLORS.tableHeaderText}`}>N° Producto</th> 
                  <th className={`py-3 px-6 text-left ${PASTEL_COLORS.tableHeaderText}`}>Nombre</th>
                  <th className={`py-3 px-6 text-right ${PASTEL_COLORS.tableHeaderText}`}>Precio</th>
                  <th className={`py-3 px-6 text-center ${PASTEL_COLORS.tableHeaderText}`}>Acciones</th>
                </tr>
              </thead>
              <tbody className={`${PASTEL_COLORS.text} text-sm font-light`}>
                {products.map((product, index) => (
                  <tr 
                    key={product.id} 
                    className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${PASTEL_COLORS.hoverRow} transition duration-150`}
                  >
                    <td className="py-3 px-6 text-center whitespace-nowrap">{product.id}</td> 
                    <td className="py-3 px-6 text-left">{product.nombre}</td>
                    <td className="py-3 px-6 text-right">${parseFloat(product.precio).toFixed(2)}</td> 
                    
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center space-x-3">
                        <button
                          onClick={() => handleEdit(product)}
                          className={`w-5 h-5 text-gray-500 transform ${PASTEL_COLORS.editIconHover} hover:scale-110 transition duration-150`}
                          title="Editar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className={`w-5 h-5 text-gray-500 transform ${PASTEL_COLORS.deleteIconHover} hover:scale-110 transition duration-150`}
                          title="Eliminar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && !isFormVisible && ( 
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 ${PASTEL_COLORS.paginationBg} ${PASTEL_COLORS.text} font-bold rounded-lg ${PASTEL_COLORS.paginationHover} disabled:opacity-50 transition duration-300 ease-in-out`}
            title="Página Anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <span className={`${PASTEL_COLORS.text} mx-4`}>
            Página <span className="font-bold">{currentPage}</span> de <span className="font-bold">{totalPages}</span>
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={`p-2 ${PASTEL_COLORS.paginationBg} ${PASTEL_COLORS.text} font-bold rounded-lg ${PASTEL_COLORS.paginationHover} disabled:opacity-50 transition duration-300 ease-in-out`}
            title="Página Siguiente"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      )}
      
    </div>
  );
};

export default ProductCrud;