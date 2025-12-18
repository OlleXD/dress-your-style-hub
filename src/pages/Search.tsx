import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useFenroProducts } from '@/hooks/useFenroProducts';
import { FenroProduct } from '@/types/fenro';

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useApp();
  const query = searchParams.get('q') || '';
  
  // Fetch all active products
  const { products, loading } = useFenroProducts({ status: 'active' });

  const results = useMemo(() => {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return products.filter((product: FenroProduct) => {
      // Search in name
      if (product.name.toLowerCase().includes(searchTerm)) return true;
      
      // Search in description
      if (product.description?.toLowerCase().includes(searchTerm)) return true;
      
      // Search in category
      if (product.category?.toLowerCase().includes(searchTerm)) return true;
      
      // Search in keywords (tags)
      if (product.keywords && product.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchTerm)
      )) return true;
      
      // Search in manufacturer
      if (product.manufacturer?.toLowerCase().includes(searchTerm)) return true;
      
      return false;
    });
  }, [query, products]);

  const formatPrice = (price: number) => {
    return `${price.toLocaleString('sv-SE')} kr`;
  };

  const hasDiscount = (product: FenroProduct) => {
    return product.compare_price && product.compare_price > product.price;
  };

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
              {loading ? 'Laddar...' : `${results.length} ${results.length === 1 ? 'produkt hittades' : 'produkter hittades'}`}
            </p>

            {loading ? (
              <Card className="border-0 shadow-soft text-center py-12">
                <CardContent>
                  <p className="text-lg text-muted-foreground">Laddar produkter...</p>
                </CardContent>
              </Card>
            ) : results.length === 0 ? (
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
                {results.map((product: FenroProduct) => {
                  const discount = hasDiscount(product);
                  return (
                    <Card
                      key={product.id}
                      className="group overflow-hidden border-0 shadow-soft hover:shadow-elegant transition-all duration-500"
                    >
                      <div
                        className="relative overflow-hidden cursor-pointer"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700 ease-elegant"
                          />
                        ) : (
                          <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
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
                      <CardContent className="p-4">
                        <div
                          className="mb-3 cursor-pointer"
                          onClick={() => navigate(`/products/${product.id}`)}
                        >
                          {product.category && (
                            <p className="text-xs text-muted-foreground font-medium mb-1">
                              {product.category}
                            </p>
                          )}
                          <h3 className="font-display text-lg font-semibold mb-2 hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className={discount ? 'text-red-600 font-semibold' : 'text-base font-semibold text-accent'}>
                              {formatPrice(product.price)}
                            </span>
                            {discount && product.compare_price && (
                              <span className="text-gray-400 line-through text-sm">
                                {formatPrice(product.compare_price)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1"
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
                  );
                })}
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
