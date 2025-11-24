import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface User {
  email: string;
  name: string;
}

export interface FavoriteItem {
  productId: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface AppContextType {
  user: User | null;
  cart: CartItem[];
  favorites: FavoriteItem[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  register: (email: string, password: string, name: string) => void;
  logout: () => void;
  addToCart: (product: Product, selectedSize?: string, selectedColor?: string) => void;
  removeFromCart: (productId: number) => void;
  updateCartItemQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  toggleFavorite: (productId: number, selectedSize?: string, selectedColor?: string) => void;
  isFavorite: (productId: number, selectedSize?: string, selectedColor?: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      const parsed = JSON.parse(storedFavorites);
      // Migrate old format (number[]) to new format (FavoriteItem[])
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'number') {
        return parsed.map((id: number) => ({ productId: id }));
      }
      return parsed;
    }
    return [];
  });

  // Save cart to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Save favorites to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const login = (email: string, password: string) => {
    // Simple login - in a real app, this would call an API
    const userData: User = {
      email,
      name: email.split('@')[0],
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const register = (email: string, password: string, name: string) => {
    // Simple registration - in a real app, this would call an API
    const userData: User = {
      email,
      name,
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const addToCart = (product: Product, selectedSize?: string, selectedColor?: string) => {
    setCart((prevCart) => {
      // Check if exact same product with same size/color exists
      const existingItem = prevCart.find(
        (item) => 
          item.id === product.id && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1, selectedSize, selectedColor }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateCartItemQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^\d,]/g, '').replace(',', '.'));
      return total + price * item.quantity;
    }, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const toggleFavorite = (productId: number, selectedSize?: string, selectedColor?: string) => {
    setFavorites((prev) => {
      const existingIndex = prev.findIndex(
        (fav) =>
          fav.productId === productId &&
          fav.selectedSize === selectedSize &&
          fav.selectedColor === selectedColor
      );
      if (existingIndex >= 0) {
        return prev.filter((_, index) => index !== existingIndex);
      }
      return [...prev, { productId, selectedSize, selectedColor }];
    });
  };

  const isFavorite = (productId: number, selectedSize?: string, selectedColor?: string) => {
    return favorites.some(
      (fav) =>
        fav.productId === productId &&
        fav.selectedSize === selectedSize &&
        fav.selectedColor === selectedColor
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        cart,
        favorites,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};


