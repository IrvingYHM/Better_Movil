import React, { createContext, useState, ReactNode } from "react";

// Define la estructura del producto en el carrito
interface Product {
  IdProducto: number;
  quantity: number;
  // Agrega aquí cualquier otra propiedad necesaria
}

// Define la estructura del contexto
interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (product: Product) => void;
  clearCart: () => void;
}

// Crea el contexto
export const CartContext = createContext<CartContextType | undefined>(undefined);

// Crea el proveedor del contexto
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    const productInCartIndex = cart.findIndex(item => item.IdProducto === product.IdProducto);

    if (productInCartIndex >= 0) {
      const newCart = [...cart];
      newCart[productInCartIndex].quantity += product.quantity;
      setCart(newCart);
    } else {
      setCart(prevState => ([
        ...prevState,
        {
          ...product,
          quantity: product.quantity
        }
      ]));
    }
  };

  const removeFromCart = (product: Product) => {
    const productIndex = cart.findIndex(item => item.IdProducto === product.IdProducto);

    if (productIndex >= 0 && cart[productIndex].quantity > 1) {
      const updatedCart = [...cart];
      updatedCart[productIndex].quantity -= 1;
      setCart(updatedCart);
    } else {
      setCart(prevState => prevState.filter(item => item.IdProducto !== product.IdProducto));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
