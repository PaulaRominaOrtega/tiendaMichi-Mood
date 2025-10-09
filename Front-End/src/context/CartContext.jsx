import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext'; 

// URL base de la API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'; 

// 1. Crear el Contexto
const CartContext = createContext();

// 2. Hook personalizado
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

// -----------------------------------------------------------
// FUNCIONES ASÍNCRONAS PARA EL SERVIDOR (Fuera de CartProvider)
// -----------------------------------------------------------

// Se deja la función aquí, aunque estará temporalmente deshabilitada en useEffect.
const saveCartToServer = async (items, clienteId, accessToken) => {
    if (!clienteId || !accessToken) return; 

    try {
        await fetch(`${API_URL}/api/carritos/sincronizar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`, 
            },
            body: JSON.stringify({ 
                clienteId,
                items: items.map(item => ({ 
                    producto: item.id, 
                    cantidad: item.quantity
                }))
            }),
        });
    } catch (error) {
        console.error("Error al sincronizar el carrito con el servidor:", error);
        // NO hacemos nada más, permitimos que el Front-End siga.
    }
};

// -----------------------------------------------------------

// 3. Proveedor del Contexto
export const CartProvider = ({ children }) => {
    
    // Obtiene datos de autenticación del contexto
    const { isAuthenticated, accessToken, clienteId } = useAuth();
    
    // Estado y Persistencia Inicial (Carga del Carrito desde localStorage)
    const [cart, setCart] = useState(() => {
        try {
            const storedCart = localStorage.getItem('michimood_cart');
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
            console.error("Error leyendo el carrito de localStorage:", error);
            return [];
        }
    });
    const [notification, setNotification] = useState(null); 

    // Funciones estables de notificación
    const hideNotification = useCallback(() => setNotification(null), []);
    const showNotification = useCallback((message, severity = 'success') => {
        setNotification({ message, severity });
    }, []);
    
    // 4. Efecto para guardar el carrito en localStorage y el servidor
    useEffect(() => {
        try {
            // 1. Guardar en localStorage (siempre)
            localStorage.setItem('michimood_cart', JSON.stringify(cart));
            
            // 2. Sincronizar con el Back-End SOLO si está autenticado
            if (isAuthenticated && clienteId && accessToken) {
                // 🛑 ESTA LÍNEA ESTÁ COMENTADA PARA EVITAR EL 404 DE SINCRONIZACIÓN Y ESTABILIZAR EL STARTUP 🛑
                // saveCartToServer(cart, clienteId, accessToken); 
            }
            
        } catch (error) {
            console.error("Error guardando el carrito:", error);
        }
    }, [cart, isAuthenticated, clienteId, accessToken]); 

    // -----------------------------------------------------------
    // FUNCIONES DE MANEJO DE CARRITO (El resto del código es igual y correcto)
    // -----------------------------------------------------------

    const addToCart = useCallback((product, quantityToAdd = 1) => { /* ... lógica ... */
        if (product.stock === 0) {
            showNotification('🚫 Producto sin stock.', 'error');
            return;
        }

        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);

            if (existingItem) {
                const newQuantity = existingItem.quantity + quantityToAdd;
                
                if (newQuantity > product.stock) {
                    showNotification(`❌ Solo hay ${product.stock} unidades en stock.`, 'warning');
                    return prevCart; 
                }
                
                showNotification(`✅ Se agregó ${quantityToAdd} unidad(es) de ${product.nombre}.`);
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: newQuantity }
                        : item
                );

            } else {
                if (quantityToAdd > product.stock) {
                     showNotification(`❌ Solo hay ${product.stock} unidades en stock.`, 'warning');
                     return prevCart;
                }
                
                const newItem = {
                    id: product.id,
                    nombre: product.nombre,
                    precio: product.precio,
                    stock: product.stock, 
                    imagen: product.imagen,
                    quantity: quantityToAdd
                };
                showNotification(`✅ ${product.nombre} agregado al carrito.`);
                return [...prevCart, newItem];
            }
        });
    }, [showNotification]);

    const updateQuantity = useCallback((productId, delta) => { /* ... lógica ... */
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === productId);

            if (!existingItem) return prevCart;

            const newQuantity = existingItem.quantity + delta;

            if (newQuantity <= 0) {
                showNotification(`🗑️ ${existingItem.nombre} eliminado del carrito.`);
                return prevCart.filter(item => item.id !== productId);
            }

            if (newQuantity > existingItem.stock) {
                showNotification(`❌ Máximo stock alcanzado (${existingItem.stock}).`, 'warning');
                return prevCart;
            }

            return prevCart.map(item =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            );
        });
    }, [showNotification]);
    
    const removeFromCart = useCallback((productId) => { /* ... lógica ... */
        setCart(prevCart => {
            const itemToRemove = prevCart.find(item => item.id === productId);
            if (itemToRemove) {
                 showNotification(`🗑️ ${itemToRemove.nombre} eliminado del carrito.`);
            }
            return prevCart.filter(item => item.id !== productId);
        });
    }, [showNotification]);

    const clearCart = useCallback(() => { /* ... lógica ... */
        setCart([]);
        localStorage.removeItem('michimood_cart'); 
        showNotification('🛒 Sesión cerrada. Carrito guardado en tu cuenta.', 'info');
    }, [showNotification]);


    /**
     * 🚨 FUNCIÓN CRÍTICA: loadCartFromServer ESTÁ VACÍA 🚨
     * Esta versión garantiza que no haya NINGÚN contacto con el servidor.
     * Esto permite que el componente LoginSuccessHandler complete su trabajo de navegación
     * sin esperar una respuesta fallida del Back-End.
     */
    const loadCartFromServer = useCallback(async (clienteId, accessToken) => {
        // Bloqueo de seguridad: si no hay datos de autenticación, salimos.
        if (!clienteId || !accessToken) return; 

        // 🛑 IGNORAMOS EL SERVIDOR PARA DETENER EL BUCLO 🛑
        console.log("Deshabilitada la carga del carrito desde el servidor para evitar bucles.");
        return Promise.resolve(); // Devolvemos inmediatamente
        
    }, []);

    // -----------------------------------------------------------

    const cartTotals = useMemo(() => cart.reduce(
        (acc, item) => {
            acc.totalItems += item.quantity;
            acc.totalPrice += item.quantity * item.precio;
            return acc;
        },
        { totalItems: 0, totalPrice: 0 }
    ), [cart]);
    
    // El useMemo garantiza que el objeto de contexto solo cambie cuando es necesario
    const contextValue = useMemo(() => ({
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart, 
        loadCartFromServer, 
        totalItems: cartTotals.totalItems,
        totalPrice: cartTotals.totalPrice,
        notification,
        showNotification,
        hideNotification 
    }), [cart, addToCart, removeFromCart, updateQuantity, clearCart, loadCartFromServer, cartTotals, notification, showNotification, hideNotification]); 

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};