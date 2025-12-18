import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: number | string; // Support both number (legacy) and string (Fenro)
  name: string;
  price: string | number; // Support both string (legacy) and number (Fenro)
  image?: string;
  images?: string[];
  category?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  selectedVariant?: string;
}

interface User {
  email: string;
  name: string;
}

export interface FavoriteItem {
  productId: number | string; // Support both number and string IDs
  selectedSize?: string;
  selectedColor?: string;
  selectedVariant?: string;
}

interface AppContextType {
  user: User | null;
  cart: CartItem[];
  favorites: FavoriteItem[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  register: (email: string, password: string, name: string) => void;
  logout: () => void;
  addToCart: (product: Product, selectedSize?: string, selectedColor?: string, selectedVariant?: string) => void;
  removeFromCart: (productId: number | string) => void;
  updateCartItemQuantity: (productId: number | string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  toggleFavorite: (productId: number | string, selectedSize?: string, selectedColor?: string, selectedVariant?: string) => void;
  isFavorite: (productId: number | string, selectedSize?: string, selectedColor?: string, selectedVariant?: string) => boolean;
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

  const addToCart = (product: Product, selectedSize?: string, selectedColor?: string, selectedVariant?: string) => {
    setCart((prevCart) => {
      // Convert Fenro product to cart format
      const cartProduct: CartItem = {
        id: product.id,
        name: product.name,
        price: typeof product.price === 'number' 
          ? `${product.price.toLocaleString('sv-SE')} kr` 
          : product.price,
        image: product.images?.[0] || product.image || '',
        images: product.images,
        category: product.category,
        quantity: 1,
        selectedSize,
        selectedColor,
        selectedVariant,
      };

      // Check if exact same product with same size/color/variant exists
      const existingItem = prevCart.find(
        (item) => 
          String(item.id) === String(product.id) && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor &&
          item.selectedVariant === selectedVariant
      );
      if (existingItem) {
        return prevCart.map((item) =>
          String(item.id) === String(product.id) && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor &&
          item.selectedVariant === selectedVariant
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, cartProduct];
    });
  };

  const removeFromCart = (productId: number | string) => {
    setCart((prevCart) => prevCart.filter((item) => String(item.id) !== String(productId)));
  };

  const updateCartItemQuantity = (productId: number | string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        String(item.id) === String(productId) ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      let price: number;
      if (typeof item.price === 'number') {
        price = item.price;
      } else {
        price = parseFloat(item.price.replace(/[^\d,]/g, '').replace(',', '.'));
      }
      return total + price * item.quantity;
    }, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const toggleFavorite = (productId: number | string, selectedSize?: string, selectedColor?: string, selectedVariant?: string) => {
    setFavorites((prev) => {
      const existingIndex = prev.findIndex(
        (fav) =>
          String(fav.productId) === String(productId) &&
          fav.selectedSize === selectedSize &&
          fav.selectedColor === selectedColor &&
          fav.selectedVariant === selectedVariant
      );
      if (existingIndex >= 0) {
        return prev.filter((_, index) => index !== existingIndex);
      }
      return [...prev, { productId, selectedSize, selectedColor, selectedVariant }];
    });
  };

  const isFavorite = (productId: number | string, selectedSize?: string, selectedColor?: string, selectedVariant?: string) => {
    return favorites.some(
      (fav) =>
        String(fav.productId) === String(productId) &&
        fav.selectedSize === selectedSize &&
        fav.selectedColor === selectedColor &&
        fav.selectedVariant === selectedVariant
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


