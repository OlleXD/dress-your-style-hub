import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFenroProducts } from '@/hooks/useFenroProducts';
import { FenroProduct } from '@/types/fenro';

interface SearchBarProps {
  onClose?: () => void;
}

const SearchBar = ({ onClose }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<FenroProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch all active products for search
  const { products } = useFenroProducts({ status: 'active' });

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const searchTerm = searchQuery.toLowerCase();
      const filtered = products.filter((product: FenroProduct) => {
        // Search in name
        if (product.name.toLowerCase().includes(searchTerm)) return true;
        
        // Search in description
        if (product.description?.toLowerCase().includes(searchTerm)) return true;
        
        // Search in category
        if (product.category?.toLowerCase().includes(searchTerm)) return true;
        
        // Search in keywords (tags) - this is the main search field
        if (product.keywords && product.keywords.some(keyword => 
          keyword.toLowerCase().includes(searchTerm)
        )) return true;
        
        // Search in manufacturer
        if (product.manufacturer?.toLowerCase().includes(searchTerm)) return true;
        
        return false;
      });
      setResults(filtered.slice(0, 5));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [searchQuery, products]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
    setSearchQuery('');
    setIsOpen(false);
    onClose?.();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsOpen(false);
      onClose?.();
    }
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString('sv-SE')} kr`;
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Sök produkter..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
            onClick={() => {
              setSearchQuery('');
              setIsOpen(false);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </form>

      {isOpen && results.length > 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 border shadow-lg">
          <CardContent className="p-2">
            <div className="space-y-1">
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="w-full text-left p-2 hover:bg-accent rounded-md transition-colors flex items-center gap-3"
                >
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">Ingen bild</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(product.price)}</p>
                  </div>
                </button>
              ))}
              {results.length >= 5 && (
                <Button
                  variant="ghost"
                  className="w-full mt-2"
                  onClick={handleSearch}
                >
                  Visa alla resultat
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchBar;
