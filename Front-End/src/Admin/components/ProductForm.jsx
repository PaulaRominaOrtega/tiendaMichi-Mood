import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const BACKEND_BASE_URL = 'http://localhost:3000'; 

const ProductForm = ({ onSave, editingProduct, onCancel }) => {
  
  const [categorias, setCategorias] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const getInitialFormData = (product) => 
    product ? {
        nombre: product.nombre || '',
        descripcion: product.descripcion || '',
        material: product.material || '',
        capacidad: product.capacidad || '',
        caracteristicas_especiales: product.caracteristicas_especiales || '',
        precio: product.precio || 0,
        stock: product.stock || 0,
        oferta: product.oferta || false,
        descuento: product.descuento || 0,
        idAdministrador: product.idAdministrador || 1, 
        idCategoria: product.idCategoria || '', 
      } : {
        nombre: '',
        descripcion: '',
        material: '',
        capacidad: '',
        caracteristicas_especiales: '',
        precio: 0,
        stock: 0,
        oferta: false,
        descuento: 0,
        idAdministrador: 1,
        idCategoria: '',
      };

  const [formData, setFormData] = useState(getInitialFormData(editingProduct));
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  const getInitialImageUrls = (product) => {
    return product?.imagen 
      ? product.imagen.split(',').map(name => `${BACKEND_BASE_URL}/uploads/${name.trim()}`)
      : [];
  };
  
  const initialImageUrls = getInitialImageUrls(editingProduct);
  const [previewUrls, setPreviewUrls] = useState(initialImageUrls);
  
  const PASTEL_COLORS = {
    modalOverlay: 'bg-gray-900 bg-opacity-60',
    paper: 'bg-white',
    title: 'text-purple-600',
    text: 'text-gray-700',
    inputFocus: 'focus:ring-indigo-300 focus:border-indigo-300',
    saveButton: 'bg-indigo-300 hover:bg-indigo-400',
    cancelButton: 'bg-gray-400 hover:bg-gray-500',
    checkbox: 'text-indigo-400',
  };


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categorias'); 
        if (response.data.success && response.data.data) {
          const fetchedCategories = response.data.data;
          setCategorias(fetchedCategories);
          
          const initialCategory = editingProduct?.idCategoria || fetchedCategories[0]?.id || '';

          setFormData(prev => ({
              ...prev,
              idCategoria: initialCategory,
          }));
        }
      } catch (error) {
        console.error('Error al obtener categorías:', error);
       
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
    
    return () => {
      if (selectedFiles.length > 0) {
        selectedFiles.forEach(file => {
            if (file instanceof File && file.previewUrl) {
                URL.revokeObjectURL(file.previewUrl);
            }
        });
      }
    };
  }, [editingProduct, selectedFiles.length]); 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    selectedFiles.forEach(file => {
      if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
    });

    if (files.length > 0) {
      const limitedFiles = files.slice(0, 3);
      
      const filesWithUrls = limitedFiles.map(file => {
          const previewUrl = URL.createObjectURL(file);
          return Object.assign(file, { previewUrl }); 
      });

      setSelectedFiles(filesWithUrls);
      setPreviewUrls(filesWithUrls.map(f => f.previewUrl));
      
    } else {
        setSelectedFiles([]);
        setPreviewUrls(initialImageUrls); 
    }
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    let currentSelectedFiles = selectedFiles;

    try {
      const formDataToSend = new FormData();
      
    
      Object.keys(formData).forEach(key => {
        const value = typeof formData[key] === 'boolean' ? (formData[key] ? 'true' : 'false') : formData[key];
        formDataToSend.append(key, value);
      });
      
      if (currentSelectedFiles.length > 0) {
        currentSelectedFiles.forEach(file => {
          formDataToSend.append('imagenes', file); 
        });
      }
      
      if (editingProduct) {
        await api.put(`/productos/${editingProduct.id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await api.post('/productos', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      
      currentSelectedFiles.forEach(file => {
        if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
      }); 
      
      onSave();
      
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      if (error.response && error.response.data) {
        console.error("Respuesta del servidor:", error.response.data);
      }
      
      currentSelectedFiles.forEach(file => {
        if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
      }); 
      setSelectedFiles([]); 
      if (editingProduct) {
          setPreviewUrls(initialImageUrls);
      }
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${PASTEL_COLORS.modalOverlay}`}>
      <div className={`${PASTEL_COLORS.paper} p-6 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto flex flex-col border border-purple-100`}>
        <div className="flex justify-between items-center mb-4 border-b pb-2 border-gray-200">
          <h3 className={`text-2xl font-bold ${PASTEL_COLORS.title}`}>
            {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
          </h3>
          <button 
            onClick={onCancel} 
            className="text-gray-500 hover:text-red-500 text-3xl font-bold leading-none transition duration-150"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
          <div className="flex-grow overflow-y-auto pr-2 space-y-4">
           
            <div>
              <label className={`block text-sm font-medium ${PASTEL_COLORS.text}`}>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre del Producto"
                required
                className={`mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 ${PASTEL_COLORS.inputFocus} transition duration-150`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${PASTEL_COLORS.text}`}>Categoría</label>
              {loadingCategories ? (
                  <p className={`mt-1 ${PASTEL_COLORS.text}`}>Cargando categorías...</p>
              ) : categorias.length > 0 ? (
                  <select
                      name="idCategoria" 
                      value={formData.idCategoria}
                      onChange={handleChange}
                      required
                      className={`mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 ${PASTEL_COLORS.inputFocus} transition duration-150`}
                  >
                      <option value="" disabled>Selecciona una Categoría</option> 
                      
                      {categorias.map(cat => (
                          <option key={cat.id} value={cat.id}>
                              {cat.nombre}
                          </option>
                      ))}
                  </select>
              ) : (
                  <p className="mt-1 text-red-500">
                      No hay categorías disponibles. Por favor, crea una.
                  </p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium ${PASTEL_COLORS.text}`}>Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Descripción detallada del producto"
                required
                rows="3"
                className={`mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 ${PASTEL_COLORS.inputFocus} transition duration-150`}
              />
            </div>
    
            <div className="grid grid-cols-3 gap-4">
               
                <div>
                    <label className={`block text-sm font-medium ${PASTEL_COLORS.text}`}>Material</label>
                    <input
                        type="text"
                        name="material"
                        value={formData.material}
                        onChange={handleChange}
                        placeholder="Ej: Cerámica"
                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 ${PASTEL_COLORS.inputFocus} transition duration-150`}
                    />
                </div>
                <div>
                    <label className={`block text-sm font-medium ${PASTEL_COLORS.text}`}>Capacidad</label>
                    <input
                        type="text"
                        name="capacidad"
                        value={formData.capacidad}
                        onChange={handleChange}
                        placeholder="Ej: 500ml"
                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 ${PASTEL_COLORS.inputFocus} transition duration-150`}
                    />
                </div>
                <div>
                    <label className={`block text-sm font-medium ${PASTEL_COLORS.text}`}>Características</label>
                    <input
                        type="text"
                        name="caracteristicas_especiales"
                        value={formData.caracteristicas_especiales}
                        onChange={handleChange}
                        placeholder="Ej: Apto lavavajillas"
                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 ${PASTEL_COLORS.inputFocus} transition duration-150`}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={`block text-sm font-medium ${PASTEL_COLORS.text}`}>Precio</label>
                    <input
                        type="number"
                        name="precio"
                        value={formData.precio}
                        onChange={handleChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 ${PASTEL_COLORS.inputFocus} transition duration-150`}
                    />
                </div>
                <div>
                    <label className={`block text-sm font-medium ${PASTEL_COLORS.text}`}>Stock</label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        required
                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 ${PASTEL_COLORS.inputFocus} transition duration-150`}
                    />
                </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${PASTEL_COLORS.text}`}>Imágenes del Producto (Máx 3)</label>
              <input
                type="file"
                name="imagenes" 
                accept="image/*"
                multiple 
                onChange={handleFileChange}
                className={`mt-1 block w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-100 file:text-purple-700 hover:file:bg-pink-200 border border-gray-300 rounded-lg shadow-sm transition duration-150`}
              />
              {previewUrls.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {previewUrls.map((url, index) => (
                    <img 
                      key={url}
                      src={url} 
                      alt={`Preview ${index + 1}`} 
                      onError={(e) => { 
                          e.target.onerror = null; 
                          e.target.src = 'https://via.placeholder.com/80?text=Error'; 
                      }}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-300 shadow-md"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-6 pt-2">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="oferta"
                        checked={formData.oferta}
                        onChange={handleChange}
                        id="oferta"
                        className={`h-4 w-4 rounded border-gray-300 ${PASTEL_COLORS.checkbox} focus:ring-0`}
                    />
                    <label htmlFor="oferta" className={`ml-2 block text-sm font-medium ${PASTEL_COLORS.text}`}>
                        Producto en Oferta
                    </label>
                </div>
                {formData.oferta && (
                    <div>
                        <label htmlFor="descuento" className={`block text-sm font-medium ${PASTEL_COLORS.text}`}>
                            Descuento (%)
                        </label>
                        <input
                            type="number"
                            name="descuento"
                            value={formData.descuento}
                            onChange={handleChange}
                            placeholder="0-100"
                            min="0"
                            max="100"
                            className={`mt-1 block w-24 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 ${PASTEL_COLORS.inputFocus} transition duration-150`}
                        />
                    </div>
                )}
            </div>
            
            <input type="hidden" name="idAdministrador" value={formData.idAdministrador} />
            
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button 
              type="button" 
              onClick={onCancel}
              className={`${PASTEL_COLORS.cancelButton} text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out shadow-md hover:scale-[1.02]`}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className={`${PASTEL_COLORS.saveButton} text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out shadow-md hover:scale-[1.02]`}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;