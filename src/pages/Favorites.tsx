import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { allProducts, getProductById } from '@/data/products';
import { Heart, ShoppingBag } from 'lucide-react';
import ShareWishlist from '@/components/ShareWishlist';

const Favorites = () => {
  const { favorites, toggleFavorite, addToCart } = useApp();
  const navigate = useNavigate();

  const favoriteProducts = favorites.map((fav) => {
    const product = getProductById(fav.productId);
    return product ? { ...product, favoriteData: fav } : null;
  }).filter(Boolean) as Array<typeof allProducts[0] & { favoriteData: { productId: number; selectedSize?: string; selectedColor?: string } }>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div>
                <h1 className="font-display text-4xl font-bold mb-4">Mina Favoriter</h1>
                <p className="text-muted-foreground">
                  {favoriteProducts.length}{' '}
                  {favoriteProducts.length === 1 ? 'produkt' : 'produkter'} sparade
                </p>
              </div>
              {favoriteProducts.length > 0 && <ShareWishlist />}
            </div>

            {favoriteProducts.length === 0 ? (
              <Card className="border-0 shadow-soft text-center py-12">
                <CardContent>
                  <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground mb-4">
                    Du har inga favoriter ännu
                  </p>
                  <Button variant="outline" onClick={() => navigate('/products')}>
                    Utforska Produkter
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="group overflow-hidden border-0 shadow-soft hover:shadow-elegant transition-all duration-500"
                  >
                    <div className="relative">
                      <div
                        className="relative overflow-hidden cursor-pointer"
                        onClick={() => navigate(`/products/${product.id}`, {
                          state: {
                            selectedSize: product.favoriteData.selectedSize,
                            selectedColor: product.favoriteData.selectedColor
                          }
                        })}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700 ease-elegant"
                        />
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                        onClick={() => toggleFavorite(product.favoriteData.productId, product.favoriteData.selectedSize, product.favoriteData.selectedColor)}
                      >
                        <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <div
                        className="mb-3 cursor-pointer"
                        onClick={() => navigate(`/products/${product.id}`, {
                          state: {
                            selectedSize: product.favoriteData.selectedSize,
                            selectedColor: product.favoriteData.selectedColor
                          }
                        })}
                      >
                        <p className="text-xs text-muted-foreground font-medium mb-1">
                          {product.category}
                        </p>
                        <h3 className="font-display text-lg font-semibold mb-2 hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        {product.favoriteData.selectedSize && (
                          <p className="text-xs text-muted-foreground">Storlek: {product.favoriteData.selectedSize}</p>
                        )}
                        {product.favoriteData.selectedColor && (
                          <p className="text-xs text-muted-foreground">Färg: {product.favoriteData.selectedColor}</p>
                        )}
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
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Lägg i Kundvagn
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/products/${product.id}`, {
                              state: {
                                selectedSize: product.favoriteData.selectedSize,
                                selectedColor: product.favoriteData.selectedColor
                              }
                            });
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

export default Favorites;

