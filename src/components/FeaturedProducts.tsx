import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { useFenroProducts } from '@/hooks/useFenroProducts';
import { Heart } from 'lucide-react';
import { FenroProduct } from '@/types/fenro';

const FeaturedProducts = () => {
  const { addToCart, toggleFavorite, isFavorite } = useApp();
  const navigate = useNavigate();
  
  // Fetch first 2 active products as featured
  const { products, loading } = useFenroProducts({ 
    status: 'active',
    limit: 2 
  });

  const formatPrice = (price: number) => {
    return `${price.toLocaleString('sv-SE')} kr`;
  };

  const hasDiscount = (product: FenroProduct) => {
    return product.compare_price && product.compare_price > product.price;
  };

  if (loading) {
    return (
      <section id="new" className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Utvalda Produkter
            </h2>
            <p className="text-lg text-muted-foreground">Laddar produkter...</p>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section id="new" className="py-24 px-4">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Utvalda Produkter
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handplockade stycken från vår senaste kollektion, designade för den moderna och medvetna konsumenten.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {products.map((product: FenroProduct) => {
            const discount = hasDiscount(product);
            return (
              <Card key={product.id} className="group overflow-hidden border-0 shadow-soft hover:shadow-elegant transition-all duration-500">
                <div className="relative">
                  <div 
                    className="relative overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-96 md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700 ease-elegant"
                      />
                    ) : (
                      <div className="w-full h-96 md:h-[500px] bg-gray-100 flex items-center justify-center">
                        <span className="text-muted-foreground">Ingen bild</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
                    {discount && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                        Rabatt
                      </span>
                    )}
                    {product.stock <= 0 && (
                      <span className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 text-xs rounded">
                        Slutsåld
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isFavorite(product.id)
                          ? 'fill-red-500 text-red-500'
                          : ''
                      }`}
                    />
                  </Button>
                </div>
                
                <div className="p-6">
                  <div 
                    className="flex justify-between items-start mb-4 cursor-pointer"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    <div>
                      {product.category && (
                        <p className="text-sm text-muted-foreground font-medium mb-1">
                          {product.category}
                        </p>
                      )}
                      <h3 className="font-display text-xl font-semibold hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </div>
                    <div className="flex flex-col items-end">
                      {discount && product.compare_price ? (
                        <>
                          <span className="text-lg font-semibold text-red-600">
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(product.compare_price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-semibold text-accent">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product as any);
                      }}
                      disabled={product.stock <= 0}
                    >
                      Lägg i Kundvagn
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/products/${product.id}`);
                      }}
                    >
                      →
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Button 
            variant="default" 
            size="lg" 
            className="px-8"
            onClick={() => navigate('/products')}
          >
            Se Alla Produkter
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
