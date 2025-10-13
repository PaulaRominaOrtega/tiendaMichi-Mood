import React, { createContext, useContext, useState, useMemo } from 'react';

// Se mantiene la API_URL por si se necesita para cualquier otra petición
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'; 

// 1. Crear el Contexto
const AuthContext = createContext();

// 2. Hook personalizado
export const useAuth = () => useContext(AuthContext);

// 3. Proveedor del Contexto
export const AuthProvider = ({ children }) => {
    
    // Inicialización de estado desde localStorage
    const initialAccessToken = localStorage.getItem('accessToken');
    const initialClienteId = localStorage.getItem('clienteId');

    const [authData, setAuthData] = useState(() => ({
        isAuthenticated: !!initialAccessToken && !!initialClienteId, 
        accessToken: initialAccessToken || null,
        clienteId: initialClienteId || null,
        email: localStorage.getItem('email') || null,
        // El refresh token no necesita estar en el estado, solo en localStorage
    }));

    /**
     * Maneja el proceso de inicio de sesión, guarda tokens y datos del usuario.
     * @param {object} tokenData - Contiene accessToken, refreshToken, clienteId, email.
     * @param {function} loadCartFromServer - Función del CartContext para sincronizar.
     */
    const login = (tokenData, loadCartFromServer) => { 
        // 1. Guardar en localStorage
        localStorage.setItem('accessToken', tokenData.accessToken);
        localStorage.setItem('refreshToken', tokenData.refreshToken);
        localStorage.setItem('clienteId', tokenData.clienteId);
        localStorage.setItem('email', tokenData.email);

        // 2. Actualizar el estado
        const newAuthData = {
            isAuthenticated: true, 
            accessToken: tokenData.accessToken,
            clienteId: tokenData.clienteId,
            email: tokenData.email,
        };
        setAuthData(newAuthData);
        
        // 3. Cargar el carrito del servidor
        if (loadCartFromServer) {
            // El loadCartFromServer usará el nuevo accessToken y clienteId
            loadCartFromServer(tokenData.clienteId, tokenData.accessToken);
        }
    };

    /**
     * Maneja el proceso de cierre de sesión, limpia tokens y estado.
     * @param {function} clearCartAndSave - Función del CartContext para limpiar y guardar el carrito.
     * @param {string} type - Opcional. Indica el tipo de logout (e.g., 'google' para redireccionar).
     */
    const logout = (clearCartAndSave, type) => { 
        // 1. Ejecutar la función de CartContext (limpieza y guardado)
        if (clearCartAndSave) {
            clearCartAndSave(); 
        }

        // 2. Limpiar localStorage de Auth
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('clienteId');
        localStorage.removeItem('email');
        
        // 3. Limpiar el estado de Auth
        setAuthData({
            isAuthenticated: false,
            accessToken: null,
            clienteId: null,
            email: null,
        });

        // 4. (Opcional) Redireccionar a la ruta de cierre de sesión del Back-End si es necesario
        // Esto solo es crucial para proveedores de OAuth (como Google) para invalidar su sesión.
        if (type === 'google') {
            // **IMPORTANTE**: Define API_URL si usas esta lógica.
            // window.location.href = `${API_URL}/auth/logout`; 
        }
        
        // Si no es un logout de Google, React Router se encargará de la redirección
        // (Por ejemplo, al Landing Page /)
    };

    
    // Uso de useMemo para optimizar el contexto
    const value = useMemo(() => ({
        ...authData,
        login,
        logout,
        // Opcional: Función para verificar si el token es válido/refrescar si fuera necesario
    }), [authData]); 

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};