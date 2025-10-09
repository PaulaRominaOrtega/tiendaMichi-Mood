import React, { createContext, useContext, useState, useMemo } from 'react';

// Asumiendo que esta URL es necesaria para el logout del Back-End
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'; 

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
    }));

    // Función para manejar el LOGIN
    // 🚨 CAMBIO: Ahora acepta 'loadCartFromServer' como segundo argumento 🚨
    const login = (tokenData, loadCartFromServer) => { 
        // 1. Guardar en localStorage
        localStorage.setItem('accessToken', tokenData.accessToken);
        localStorage.setItem('refreshToken', tokenData.refreshToken);
        localStorage.setItem('clienteId', tokenData.clienteId);
        localStorage.setItem('email', tokenData.email);

        // 2. Actualizar el estado (esto dispara la re-renderización)
        const newAuthData = {
            isAuthenticated: true, 
            accessToken: tokenData.accessToken,
            clienteId: tokenData.clienteId,
            email: tokenData.email,
        };
        setAuthData(newAuthData);
        
        // 3. Cargar el carrito del servidor después de guardar el estado
        if (loadCartFromServer) {
            loadCartFromServer(tokenData.clienteId, tokenData.accessToken);
        }
    };

    // Función para manejar el LOGOUT
    // 🚨 CAMBIO: Ahora acepta 'clearCart' (que también guarda en el servidor) 🚨
    const logout = (clearCartAndSave) => { 
        // 1. Ejecutar la función de limpieza y guardado (proviene de CartContext, vía Header)
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

        // 4. Redirigir al Back-End para cerrar la sesión de Passport
        window.location.href = `${API_URL}/auth/logout`;
    };

    
    // Uso de useMemo
    const value = useMemo(() => ({
        ...authData,
        login,
        logout,
    }), [authData]); 

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};