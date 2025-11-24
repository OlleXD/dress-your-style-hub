import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { allProducts } from '@/data/products';
import { Heart } from 'lucide-react';

const FeaturedProducts = () => {
  const { addToCart, toggleFavorite, isFavorite } = useApp();
  const navigate = useNavigate();
  // Visa de första två produkterna som utvalda
  const products = allProducts.slice(0, 2);

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
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden border-0 shadow-soft hover:shadow-elegant transition-all duration-500">
              <div className="relative">
                <div 
                  className="relative overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <img
                    src={product.image}
                    alt={`${product.name} - Premium ${product.category.toLowerCase()}`}
                    className="w-full h-96 md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700 ease-elegant"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
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
                    <p className="text-sm text-muted-foreground font-medium mb-1">
                      {product.category}
                    </p>
                    <h3 className="font-display text-xl font-semibold hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </div>
                  <p className="text-lg font-semibold text-accent">
                    {product.price}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
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
          ))}
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