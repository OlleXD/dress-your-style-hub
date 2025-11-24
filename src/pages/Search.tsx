import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { allProducts } from '@/data/products';

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useApp();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<typeof allProducts>([]);

  useEffect(() => {
    if (query.trim()) {
      const filtered = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          product.description?.toLowerCase().includes(query.toLowerCase()) ||
          product.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-7xl">
            <h1 className="font-display text-4xl font-bold mb-4">
              Sökresultat{query && `: "${query}"`}
            </h1>
            <p className="text-muted-foreground mb-8">
              {results.length} {results.length === 1 ? 'produkt hittades' : 'produkter hittades'}
            </p>

            {results.length === 0 ? (
              <Card className="border-0 shadow-soft text-center py-12">
                <CardContent>
                  <p className="text-lg text-muted-foreground mb-4">
                    Inga produkter matchade din sökning
                  </p>
                  <Button variant="outline" onClick={() => navigate('/products')}>
                    Se alla produkter
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((product) => (
                  <Card
                    key={product.id}
                    className="group overflow-hidden border-0 shadow-soft hover:shadow-elegant transition-all duration-500"
                  >
                    <div
                      className="relative overflow-hidden cursor-pointer"
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700 ease-elegant"
                      />
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
                    </div>
                    <CardContent className="p-4">
                      <div
                        className="mb-3 cursor-pointer"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        <p className="text-xs text-muted-foreground font-medium mb-1">
                          {product.category}
                        </p>
                        <h3 className="font-display text-lg font-semibold mb-2 hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-base font-semibold text-accent">{product.price}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
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
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/products/${product.id}`);
                          }}
                        >
                          →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Search;

