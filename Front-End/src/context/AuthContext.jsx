import React, { createContext, useContext, useState, useMemo } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    
    const initialAccessToken = localStorage.getItem('accessToken');
    const initialClienteId = localStorage.getItem('clienteId');

    const [authData, setAuthData] = useState(() => ({
        isAuthenticated: !!initialAccessToken && !!initialClienteId, 
        accessToken: initialAccessToken || null,
        clienteId: initialClienteId || null,
        email: localStorage.getItem('email') || null,
    }));

    const login = (tokenData, loadCartFromServer) => { 
        localStorage.setItem('accessToken', tokenData.accessToken);
        localStorage.setItem('refreshToken', tokenData.refreshToken);
        localStorage.setItem('clienteId', tokenData.clienteId);
        localStorage.setItem('email', tokenData.email);

        const newAuthData = {
            isAuthenticated: true, 
            accessToken: tokenData.accessToken,
            clienteId: tokenData.clienteId,
            email: tokenData.email,
        };
        setAuthData(newAuthData);
        
        if (loadCartFromServer) {
            loadCartFromServer(tokenData.clienteId, tokenData.accessToken);
        }
    };

    const logout = (clearCartAndSave, type) => { 
        if (clearCartAndSave) clearCartAndSave();

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('clienteId');
        localStorage.removeItem('email');
        
        setAuthData({
            isAuthenticated: false,
            accessToken: null,
            clienteId: null,
            email: null,
        });

        if (type === 'google') {
        
        }
    };

    const value = useMemo(() => ({
        ...authData,
        login,
        logout,
    }), [authData]); 

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
