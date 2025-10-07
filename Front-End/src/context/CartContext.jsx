import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

// 1. Crear el Contexto
const CartContext = createContext();

// 2. Hook personalizado para usar el carrito fácilmente
export const useCart = () => {
    // Si usas un hook fuera del provider, esto te ayuda a debugear
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

// 3. Proveedor del Contexto (Aquí va toda la lógica)
export const CartProvider = ({ children }) => {
    // Inicializa el carrito leyendo desde localStorage para persistencia
    const [cart, setCart] = useState(() => {
        try {
            const storedCart = localStorage.getItem('michimood_cart');
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
            console.error("Error leyendo el carrito de localStorage:", error);
            return [];
        }
    });
    const [notification, setNotification] = useState(null); // Para mensajes de error/éxito

    // 4. Efecto para guardar el carrito en localStorage cada vez que cambia
    useEffect(() => {
        try {
            localStorage.setItem('michimood_cart', JSON.stringify(cart));
        } catch (error) {
            console.error("Error guardando el carrito en localStorage:", error);
        }
    }, [cart]);

    // -----------------------------------------------------------
    // FUNCIONES CLAVE DEL CARRITO
    // -----------------------------------------------------------

    const showNotification = (message, severity = 'success') => {
        setNotification({ message, severity });
        setTimeout(() => setNotification(null), 3000); // Ocultar después de 3s
    };

    const addToCart = (product, quantityToAdd = 1) => {
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
                
                const updatedCart = prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: newQuantity }
                        : item
                );
                showNotification(`✅ Se agregó ${quantityToAdd} unidad(es) de ${product.nombre}.`);
                return updatedCart;

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
    };

    const updateQuantity = (productId, delta) => {
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
    };
    
    const removeFromCart = (productId) => {
        setCart(prevCart => {
            const itemToRemove = prevCart.find(item => item.id === productId);
            if (itemToRemove) {
                 showNotification(`🗑️ ${itemToRemove.nombre} eliminado del carrito.`);
            }
            return prevCart.filter(item => item.id !== productId);
        });
    };

    /**
     * 🚨 FUNCIÓN FALTANTE: Limpia completamente el carrito.
     */
    const clearCart = () => {
        setCart([]);
        // Limpiar también el almacenamiento local
        localStorage.removeItem('michimood_cart'); 
        showNotification('🛒 Carrito vaciado con éxito.', 'info');
    };
    
    // -----------------------------------------------------------

    const cartTotals = cart.reduce(
        (acc, item) => {
            acc.totalItems += item.quantity;
            acc.totalPrice += item.quantity * item.precio;
            return acc;
        },
        { totalItems: 0, totalPrice: 0 }
    );
    
    // Usar useMemo para evitar recrear el objeto de contexto innecesariamente
    const contextValue = useMemo(() => ({
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart, // 🚨 ¡CORRECCIÓN CLAVE: AÑADIDO AQUÍ!
        ...cartTotals, 
        notification
    }), [cart, cartTotals.totalItems, cartTotals.totalPrice, notification]); // Dependencias para re-render

    return (
        <CartContext.Provider value={contextValue}>
            {children}
            {/* Opcional: Renderizar notificaciones aquí, si usas MUI Alert */}
        </CartContext.Provider>
    );
};