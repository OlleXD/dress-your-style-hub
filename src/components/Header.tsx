import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, Search, Heart } from 'lucide-react';
import CartSheet from './CartSheet';
import SearchBar from './SearchBar';
import GenderDropdown from './GenderDropdown';
import { useApp } from '@/contexts/AppContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isAuthenticated, user, logout, getCartItemCount, favorites } = useApp();
  const navigate = useNavigate();

  const navigationItems = [
    { name: 'Nyheter', href: '/news', isDropdown: false },
    { name: 'Damer', href: '/products?gender=women', isDropdown: true, gender: 'women' as const },
    { name: 'Herrar', href: '/products?gender=men', isDropdown: true, gender: 'men' as const },
    { name: 'Accessoarer', href: '#accessories', isDropdown: false },
    { name: 'Om Oss', href: '/about', isDropdown: false },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="font-display text-2xl font-semibold tracking-tight cursor-pointer hover:text-accent transition-colors duration-200">
              NORA
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              if (item.isDropdown && item.gender) {
                return (
                  <GenderDropdown
                    key={item.name}
                    gender={item.gender}
                    label={item.name}
                  />
                );
              }
              return item.href.startsWith('/') || item.href.startsWith('/products') ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-sm font-medium text-foreground hover:text-accent transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-foreground hover:text-accent transition-colors duration-200"
                >
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:block">
              <SearchBar />
            </div>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 hover:text-accent transition-colors duration-200"
            >
              <Search size={20} />
            </button>
            
            {/* Favorites */}
            <button
              onClick={() => navigate('/favorites')}
              className="relative p-2 hover:text-accent transition-colors duration-200 w-10 h-10 flex items-center justify-center shrink-0"
            >
              <Heart size={20} />
              {favorites && favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => navigate('/my-page')}
                className="p-2 hover:text-accent transition-colors duration-200 w-10 h-10 flex items-center justify-center shrink-0"
              >
                <User size={20} />
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="p-2 hover:text-accent transition-colors duration-200 w-10 h-10 flex items-center justify-center shrink-0"
              >
                <User size={20} />
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:text-accent transition-colors duration-200 w-10 h-10 flex items-center justify-center shrink-0"
            >
              <ShoppingBag size={20} />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </button>
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:text-accent transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden border-t border-border p-4">
            <SearchBar onClose={() => setIsSearchOpen(false)} />
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border">
            <nav className="py-4 space-y-4">
              {navigationItems.map((item) => (
                item.href.startsWith('/') || item.href.startsWith('/products') ? (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block text-sm font-medium text-foreground hover:text-accent transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block text-sm font-medium text-foreground hover:text-accent transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                )
              ))}
            </nav>
          </div>
        )}
      </div>
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </header>
  );
};

export default Header;