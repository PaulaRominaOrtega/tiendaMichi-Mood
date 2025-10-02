import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const BACKEND_BASE_URL = 'http://localhost:3000'; 


const ProductForm = ({ onSave, editingProduct, onCancel }) => {
  // 🆕 ESTADOS PARA CATEGORÍAS
  const [categorias, setCategorias] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  // Estado inicial del formulario con todos los campos necesarios
  const [formData, setFormData] = useState(
    editingProduct
      ? {
          nombre: editingProduct.nombre || '',
          descripcion: editingProduct.descripcion || '',
          material: editingProduct.material || '',
          capacidad: editingProduct.capacidad || '',
          caracteristicas_especiales: editingProduct.caracteristicas_especiales || '',
          precio: editingProduct.precio || 0,
          stock: editingProduct.stock || 0,
          oferta: editingProduct.oferta || false,
          descuento: editingProduct.descuento || 0,
          idAdministrador: editingProduct.idAdministrador || 1, // Asume un ID por defecto
          // 🔑 Inicializa idCategoria con el valor del producto si existe, si no, vacío
          idCategoria: editingProduct.idCategoria || '', 
        }
      : {
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
          idCategoria: '', // 🔑 Inicializa vacío
        }
  );

  const [selectedFiles, setSelectedFiles] = useState([]);
  
  const getInitialImageUrls = (product) => {
    return product?.imagen 
      ? product.imagen.split(',').map(name => `${BACKEND_BASE_URL}/uploads/${name.trim()}`)
      : [];
  };
  
  const initialImageUrls = getInitialImageUrls(editingProduct);
  const [previewUrls, setPreviewUrls] = useState(initialImageUrls);

  // 🔑 1. HOOK PARA CARGAR LAS CATEGORÍAS
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // 🎯 Asegúrate de que esta ruta '/categorias' sea la correcta en tu API
        const response = await api.get('/categorias'); 
        if (response.data.success && response.data.data) {
          const fetchedCategories = response.data.data;
          setCategorias(fetchedCategories);

          // Si es un producto nuevo y tenemos categorías, selecciona la primera por defecto
          if (!editingProduct && fetchedCategories.length > 0) {
            setFormData(prev => ({
              ...prev,
              idCategoria: fetchedCategories[0].id,
            }));
          // Si es edición y no tiene categoría asignada (o la que se cargó no existe)
          } else if (editingProduct && !formData.idCategoria && fetchedCategories.length > 0) {
              setFormData(prev => ({
                  ...prev,
                  idCategoria: fetchedCategories[0].id,
              }));
          }
        }
      } catch (error) {
        console.error('Error al obtener categorías:', error);
        // Podrías manejar un estado de error para mostrar un mensaje al usuario
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
    
    // Hook para limpiar la memoria de las URLs temporales
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

  // Manejo de cambios en campos de texto/número/checkbox
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Manejo de la selección de archivos
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Revocar URLs antiguas antes de crear nuevas, si las hay
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
  
  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    let currentSelectedFiles = selectedFiles;

    try {
      const formDataToSend = new FormData();
      
      // Agregar campos de texto y valores
      Object.keys(formData).forEach(key => {
        // El backend debe recibir idCategoria como texto o número, no hay problema
        const value = typeof formData[key] === 'boolean' ? (formData[key] ? 'true' : 'false') : formData[key];
        formDataToSend.append(key, value);
      });
      
      // Envía CADA archivo con la clave 'imagenes' (plural)
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
      
      // Limpiar URLs después del éxito
      currentSelectedFiles.forEach(file => {
        if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
      }); 
      
      onSave();
      
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      if (error.response && error.response.data) {
        console.error("Respuesta del servidor:", error.response.data);
      }
      
      // Limpiar URLs en caso de fallo
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
          </h3>
          <button 
            onClick={onCancel} 
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
          <div className="flex-grow overflow-y-auto pr-2">
            
            {/* Campo: Nombre */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre del Producto"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 🔑 2. CAMPO: SELECTOR DE CATEGORÍA */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Categoría</label>
              {loadingCategories ? (
                  <p className="mt-1 text-gray-500">Cargando categorías...</p>
              ) : categorias.length > 0 ? (
                  <select
                      name="idCategoria" // 🎯 ¡CLAVE! El nombre debe coincidir con el campo de la BD
                      value={formData.idCategoria}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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

            {/* Campo: Descripción */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Descripción detallada del producto"
                required
                rows="3"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Campos Opcionales (Material, Capacidad, Características) */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                {/* ... (Tus inputs de Material, Capacidad, Características) ... */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Material</label>
                    <input
                        type="text"
                        name="material"
                        value={formData.material}
                        onChange={handleChange}
                        placeholder="Ej: Cerámica"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Capacidad</label>
                    <input
                        type="text"
                        name="capacidad"
                        value={formData.capacidad}
                        onChange={handleChange}
                        placeholder="Ej: 500ml"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Características</label>
                    <input
                        type="text"
                        name="caracteristicas_especiales"
                        value={formData.caracteristicas_especiales}
                        onChange={handleChange}
                        placeholder="Ej: Apto lavavajillas"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
            </div>

            {/* Campos: Precio y Stock */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                {/* ... (Tus inputs de Precio y Stock) ... */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Precio</label>
                    <input
                        type="number"
                        name="precio"
                        value={formData.precio}
                        onChange={handleChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
            </div>

            {/* Campo: Múltiples Imágenes (Máx 3) */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Imágenes del Producto (Máx 3)</label>
              <input
                type="file"
                name="imagenes" 
                accept="image/*"
                multiple 
                onChange={handleFileChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {/* Mostrar todas las previsualizaciones */}
              {previewUrls.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {previewUrls.map((url, index) => (
                    <img 
                      key={url}
                      src={url} 
                      alt={`Preview ${index + 1}`} 
                      onError={(e) => { 
                          e.target.onerror = null; 
                          e.target.src = 'https://via.placeholder.com/80?text=Error'; 
                      }}
                      className="w-20 h-20 object-cover rounded-md border"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Campo: Oferta y Descuento */}
            <div className="flex items-center mb-4 space-x-4">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="oferta"
                        checked={formData.oferta}
                        onChange={handleChange}
                        id="oferta"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="oferta" className="ml-2 block text-sm font-medium text-gray-700">
                        Producto en Oferta
                    </label>
                </div>
                {formData.oferta && (
                    <div>
                        <label htmlFor="descuento" className="block text-sm font-medium text-gray-700">
                            Descuento (%)
                        </label>
                        <input
                            type="number"
                            name="descuento"
                            value={formData.descuento}
                            onChange={handleChange}
                            placeholder="Descuento"
                            min="0"
                            max="100"
                            className="mt-1 block w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                )}
            </div>
            
            {/* Campo oculto de Administrador (se mantiene) */}
            <input type="hidden" name="idAdministrador" value={formData.idAdministrador} />
            {/* ❌ ELIMINAMOS EL CAMPO OCULTO DE idCategoria, ya que usamos el <select> */}

          </div>
          {/* Botones de acción */}
          <div className="flex justify-end space-x-2 mt-4">
            <button 
              type="button" 
              onClick={onCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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