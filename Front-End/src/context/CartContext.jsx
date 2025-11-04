import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext'; 

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'; 

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

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
        
    }
};

export const CartProvider = ({ children }) => {
    
    const { isAuthenticated, accessToken, clienteId } = useAuth();
    
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

    const hideNotification = useCallback(() => setNotification(null), []);
    const showNotification = useCallback((message, severity = 'success') => {
        setNotification({ message, severity });
    }, []);
    
    useEffect(() => {
        try {
            localStorage.setItem('michimood_cart', JSON.stringify(cart));
            
            if (isAuthenticated && clienteId && accessToken) {
                
            }
            
        } catch (error) {
            console.error("Error guardando el carrito:", error);
        }
    }, [cart, isAuthenticated, clienteId, accessToken]); 

    const addToCart = useCallback((product, quantityToAdd = 1) => { 
        if (product.stock === 0) {
            showNotification('Producto sin stock.', 'error');
            return;
        }

        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);

            if (existingItem) {
                const newQuantity = existingItem.quantity + quantityToAdd;
                
                if (newQuantity > product.stock) {
                    showNotification(`Solo hay ${product.stock} unidades en stock.`, 'warning');
                    return prevCart; 
                }
                
                showNotification(`Se agregó ${quantityToAdd} unidad(es) de ${product.nombre}.`);
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: newQuantity }
                        : item
                );

            } else {
                if (quantityToAdd > product.stock) {
                     showNotification(`Solo hay ${product.stock} unidades en stock.`, 'warning');
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
                showNotification(`${product.nombre} agregado al carrito.`);
                return [...prevCart, newItem];
            }
        });
    }, [showNotification]);

    const updateQuantity = useCallback((productId, delta) => { 
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === productId);

            if (!existingItem) return prevCart;

            const newQuantity = existingItem.quantity + delta;

            if (newQuantity <= 0) {
                showNotification(`🗑️ ${existingItem.nombre} eliminado del carrito.`);
                return prevCart.filter(item => item.id !== productId);
            }

            if (newQuantity > existingItem.stock) {
                showNotification(` Máximo stock alcanzado (${existingItem.stock}).`, 'warning');
                return prevCart;
            }

            return prevCart.map(item =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            );
        });
    }, [showNotification]);
    
    const removeFromCart = useCallback((productId) => { 
        setCart(prevCart => {
            const itemToRemove = prevCart.find(item => item.id === productId);
            if (itemToRemove) {
                 showNotification(`${itemToRemove.nombre} eliminado del carrito.`);
            }
            return prevCart.filter(item => item.id !== productId);
        });
    }, [showNotification]);

    const clearCart = useCallback(() => { 
        setCart([]);
        localStorage.removeItem('michimood_cart'); 
    }, [showNotification]);
    
    const loadCartFromServer = useCallback(async (clienteId, accessToken) => {
        if (!clienteId || !accessToken) return; 
        
        console.log("Deshabilitada la carga del carrito desde el servidor para evitar bucles.");
        return Promise.resolve(); 
    }, []);

    
    const cartTotals = useMemo(() => cart.reduce(
        (acc, item) => {
            acc.totalItems += item.quantity;
            acc.totalPrice += item.quantity * item.precio;
            return acc;
        },
        { totalItems: 0, totalPrice: 0 }
    ), [cart]);
    
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