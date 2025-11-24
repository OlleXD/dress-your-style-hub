import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { allProducts, ProductData } from '@/data/products';
import { ShoppingCart } from 'lucide-react';

interface ProductRecommendationsProps {
  currentProductId: number;
  limit?: number;
}

const ProductRecommendations = ({ currentProductId, limit = 4 }: ProductRecommendationsProps) => {
  const navigate = useNavigate();
  const currentProduct = allProducts.find(p => p.id === currentProductId);

  // Get recommendations based on:
  // 1. Same category
  // 2. Same gender
  // 3. Similar price range (±30%)
  const recommendations = useMemo(() => {
    if (!currentProduct) return [];

    const priceRange = currentProduct.priceValue * 0.3;
    const minPrice = currentProduct.priceValue - priceRange;
    const maxPrice = currentProduct.priceValue + priceRange;

    return allProducts
      .filter(product => {
        if (product.id === currentProductId) return false;
        
        const sameCategory = product.category === currentProduct.category;
        const sameGender = product.gender === currentProduct.gender || 
                          (product.gender === null && currentProduct.gender === null);
        const similarPrice = product.priceValue >= minPrice && product.priceValue <= maxPrice;
        
        // Prioritize same category, then same gender, then similar price
        return sameCategory || (sameGender && similarPrice);
      })
      .slice(0, limit);
  }, [currentProductId, limit, currentProduct]);

  if (recommendations.length === 0) return null;

  return (
    <section className="py-12 px-4 bg-secondary/50">
      <div className="container mx-auto max-w-7xl">
        <h2 className="font-display text-3xl font-bold mb-2">
          Kunder som köpte detta köpte också...
        </h2>
        <p className="text-muted-foreground mb-8">
          Rekommenderade produkter baserat på ditt val
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-0 shadow-soft hover:shadow-elegant transition-all duration-500 cursor-pointer"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700 ease-elegant"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
              </div>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground font-medium mb-1">
                  {product.category}
                </p>
                <h3 className="font-display text-lg font-semibold mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-base font-semibold text-accent">
                    {product.price}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/products/${product.id}`);
                    }}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductRecommendations;





