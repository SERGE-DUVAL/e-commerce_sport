import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1, taille = null, couleur = null) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(
        item => item.id_produit === product.id_produit && 
                item.taille === taille && 
                item.couleur === couleur
      );

      if (existingItem) {
        return prevCart.map(item =>
          item.id_produit === product.id_produit && 
          item.taille === taille && 
          item.couleur === couleur
            ? { ...item, quantite: item.quantite + quantity }
            : item
        );
      }

      return [
        ...prevCart,
        {
          id_produit: product.id_produit,
          titre: product.titre,
          prix_xaf: product.prix_xaf,
          quantite: quantity,
          taille,
          couleur,
          image: product.image
        }
      ];
    });
  };

  const removeFromCart = (productId, taille, couleur) => {
    setCart(prevCart =>
      prevCart.filter(
        item => !(item.id_produit === productId && item.taille === taille && item.couleur === couleur)
      )
    );
  };

  const updateQuantity = (productId, taille, couleur, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, taille, couleur);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id_produit === productId && item.taille === taille && item.couleur === couleur
          ? { ...item, quantite: quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.prix_xaf * item.quantite, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantite, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
