import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Crear el Contexto
const CartContext = createContext();

// 2. Hook personalizado para usar el carrito fácilmente
export const useCart = () => {
    return useContext(CartContext);
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

    /**
     * Agrega un producto o incrementa su cantidad.
     * @param {Object} product - El objeto producto completo (con stock).
     * @param {number} quantityToAdd - Cantidad a añadir (por defecto 1).
     */
    const addToCart = (product, quantityToAdd = 1) => {
        if (product.stock === 0) {
            showNotification('🚫 Producto sin stock.', 'error');
            return;
        }

        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);

            if (existingItem) {
                // Si ya existe: Verificar Stock antes de incrementar
                const newQuantity = existingItem.quantity + quantityToAdd;
                
                if (newQuantity > product.stock) {
                    showNotification(`❌ Solo hay ${product.stock} unidades en stock.`, 'warning');
                    return prevCart; // No modificar el carrito
                }
                
                // Incrementar la cantidad
                const updatedCart = prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: newQuantity }
                        : item
                );
                showNotification(`✅ Se agregó ${quantityToAdd} unidad(es) de ${product.nombre}.`);
                return updatedCart;

            } else {
                // Si es nuevo: Asegurar que la cantidad inicial no exceda el stock
                if (quantityToAdd > product.stock) {
                     showNotification(`❌ Solo hay ${product.stock} unidades en stock.`, 'warning');
                     return prevCart;
                }
                
                // Agregar nuevo producto
                const newItem = {
                    id: product.id,
                    nombre: product.nombre,
                    precio: product.precio,
                    stock: product.stock, // Guardamos el stock actual del producto
                    imagen: product.imagen,
                    quantity: quantityToAdd
                };
                showNotification(`✅ ${product.nombre} agregado al carrito.`);
                return [...prevCart, newItem];
            }
        });
    };

    /**
     * Incrementa o decrementa la cantidad de un producto.
     * @param {number} productId - ID del producto.
     * @param {number} delta - +1 para sumar, -1 para restar.
     */
    const updateQuantity = (productId, delta) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === productId);

            if (!existingItem) return prevCart;

            const newQuantity = existingItem.quantity + delta;

            if (newQuantity <= 0) {
                // Si la nueva cantidad es 0 o menos, eliminar el producto
                showNotification(`🗑️ ${existingItem.nombre} eliminado del carrito.`);
                return prevCart.filter(item => item.id !== productId);
            }

            if (newQuantity > existingItem.stock) {
                // Verificar Stock
                showNotification(`❌ Máximo stock alcanzado (${existingItem.stock}).`, 'warning');
                return prevCart;
            }

            // Actualizar la cantidad
            return prevCart.map(item =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            );
        });
    };
    
    /**
     * Elimina un producto completamente del carrito.
     * @param {number} productId - ID del producto.
     */
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
     * Calcula el total de productos y el costo total.
     */
    const cartTotals = cart.reduce(
        (acc, item) => {
            acc.totalItems += item.quantity;
            acc.totalPrice += item.quantity * item.precio;
            return acc;
        },
        { totalItems: 0, totalPrice: 0 }
    );
    
    // -----------------------------------------------------------

    const contextValue = {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        ...cartTotals, // totalItems y totalPrice
        notification
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
            {/* Opcional: Renderizar notificaciones aquí, si usas MUI Alert */}
        </CartContext.Provider>
    );
};