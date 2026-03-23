import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
    id: string;
    title: string;
    price: number;
    image_url?: string;
    seller_name?: string;
    [key: string]: any;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addToCart = (product: Product, quantity: number = 1): void => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);

            if (existingItem) {
                // Update quantity if item already exists
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // Add new item
                return [...prevItems, { ...product, quantity }];
            }
        });
    };

    const removeFromCart = (productId: string): void => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number): void => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = (): void => {
        setCartItems([]);
    };

    const getCartTotal = (): number => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = (): number => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const value: CartContextType = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
