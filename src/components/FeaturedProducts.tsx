import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import product1 from '@/assets/product-1.jpg';
import product2 from '@/assets/product-2.jpg';

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: 'Minimalist Blazer',
      price: '1,299 kr',
      image: product1,
      category: 'Jackor',
    },
    {
      id: 2,
      name: 'Läder Accessoarer',
      price: '899 kr',
      image: product2,
      category: 'Accessoarer',
    },
  ];

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
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={`${product.name} - Premium ${product.category.toLowerCase()}`}
                  className="w-full h-96 md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700 ease-elegant"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">
                      {product.category}
                    </p>
                    <h3 className="font-display text-xl font-semibold">
                      {product.name}
                    </h3>
                  </div>
                  <p className="text-lg font-semibold text-accent">
                    {product.price}
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
                >
                  Lägg i Kundvagn
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Button variant="default" size="lg" className="px-8">
            Se Alla Produkter
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;