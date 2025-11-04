import { useState, useEffect } from 'react';
const API_BASE_URL = 'http://localhost:3000/api'; 

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/categorias?limit=100&activa=true`); 
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudieron cargar las categorías.`);
        }
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
            setCategories(data.data); 
        } else {
            setCategories([]); 
            if (data.success) {
               console.warn("API de categorías devolvió una respuesta exitosa, pero el array de datos está vacío.");
            }
        }
        
      } catch (err) {
        console.error("Error al obtener categorías:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export default useCategories;