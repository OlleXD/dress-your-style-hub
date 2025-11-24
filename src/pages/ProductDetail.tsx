import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { getProductById, getRelatedProducts } from '@/data/products';
import ProductGallery from '@/components/ProductGallery';
import { ShoppingCart, ArrowLeft, Check, Heart, Star, Package, Bell } from 'lucide-react';
import ProductNotification from '@/components/ProductNotification';
import SizeGuide from '@/components/SizeGuide';
import ProductRecommendations from '@/components/ProductRecommendations';
import { toast } from '@/hooks/use-toast';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, toggleFavorite, isFavorite } = useApp();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const product = id ? getProductById(parseInt(id)) : undefined;
  const relatedProducts = product ? getRelatedProducts(product.id) : [];

  // Get images based on selected color
  const getProductImages = () => {
    if (!product) return [];
    if (selectedColor && product.colorVariants) {
      const variant = product.colorVariants.find(v => v.color === selectedColor);
      if (variant) return variant.images || [variant.image];
    }
    return product.images || [product.image];
  };

  const productImages = getProductImages();

  // Set initial size/color from location state (when coming from favorites)
  useEffect(() => {
    if (location.state) {
      const { selectedSize: stateSize, selectedColor: stateColor } = location.state as { selectedSize?: string; selectedColor?: string };
      if (stateSize && product?.sizes?.includes(stateSize)) {
        setSelectedSize(stateSize);
      }
      if (stateColor && product?.colors?.includes(stateColor)) {
        setSelectedColor(stateColor);
      }
    }
  }, [location.state, product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="container mx-auto max-w-7xl py-16 px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Produkt hittades inte</h1>
            <Button onClick={() => navigate('/products')}>
              Tillbaka till produkter
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        title: 'Välj storlek',
        description: 'Vänligen välj en storlek innan du lägger till produkten i kundvagnen.',
        variant: 'destructive',
      });
      return;
    }

    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast({
        title: 'Välj färg',
        description: 'Vänligen välj en färg innan du lägger till produkten i kundvagnen.',
        variant: 'destructive',
      });
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize || undefined, selectedColor || undefined);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Breadcrumbs */}
        <section className="py-4 px-4 border-b border-border">
          <div className="container mx-auto max-w-7xl">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">
                Hem
              </Link>
              <span>/</span>
              <Link to="/products" className="hover:text-foreground transition-colors">
                Produkter
              </Link>
              <span>/</span>
              <span className="text-foreground">{product.category}</span>
              <span>/</span>
              <span className="text-foreground">{product.name}</span>
            </nav>
          </div>
        </section>

        {/* Product Detail Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-7xl">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tillbaka
            </Button>

            <div className="grid md:grid-cols-2 gap-12 mb-16">
              {/* Product Image */}
              <div className="relative">
                <ProductGallery
                  images={productImages}
                  productName={product.name}
                />
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm text-muted-foreground">
                      {product.category}
                      {product.gender && ` • ${product.gender}`}
                    </p>
                    <div className="flex items-center gap-1">
                      {product.inStock !== false && (
                        <ProductNotification product={product} />
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFavorite(product.id, selectedSize || undefined, selectedColor || undefined)}
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            isFavorite(product.id, selectedSize || undefined, selectedColor || undefined)
                              ? 'fill-red-500 text-red-500'
                              : ''
                          }`}
                        />
                      </Button>
                    </div>
                  </div>
                  <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-4 mb-4">
                    {product.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{product.rating}</span>
                        {product.reviewCount && (
                          <span className="text-sm text-muted-foreground">
                            ({product.reviewCount})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-3xl font-semibold text-accent mb-4">
                    {product.price}
                  </p>
                  {/* Stock Status */}
                  <div className="flex items-center gap-2 mb-6">
                    {product.inStock !== false ? (
                      <Badge variant="default" className="bg-green-500">
                        <Package className="h-3 w-3 mr-1" />
                        {product.stockCount
                          ? `${product.stockCount} i lager`
                          : 'I lager'}
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Slut i lager</Badge>
                    )}
                  </div>
                </div>

                {product.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Beskrivning</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                <Separator />

                {/* Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">Storlek</h3>
                      <SizeGuide gender={product.gender} category={product.category} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <Button
                          key={size}
                          variant={selectedSize === size ? 'default' : 'outline'}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[60px] ${
                            selectedSize === size
                              ? 'bg-primary text-primary-foreground'
                              : ''
                          }`}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Färg</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => {
                        const variant = product.colorVariants?.find(v => v.color === color);
                        const colorMap: Record<string, string> = {
                          'Svart': '#000000',
                          'Blå': '#0066CC',
                          'Grå': '#808080',
                          'Beige': '#F5F5DC',
                          'Vit': '#FFFFFF',
                          'Röd': '#FF0000',
                          'Navy': '#000080',
                          'Brun': '#8B4513',
                          'Rosa': '#FFC0CB',
                          'Gul': '#FFFF00',
                          'Grön': '#008000',
                          'Randig': '#CCCCCC',
                        };
                        const colorHex = colorMap[color] || '#CCCCCC';
                        return (
                          <Button
                            key={color}
                            variant={selectedColor === color ? 'default' : 'outline'}
                            onClick={() => setSelectedColor(color)}
                            className={`min-w-[100px] relative ${
                              selectedColor === color
                                ? 'bg-primary text-primary-foreground'
                                : ''
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded-full border border-border"
                                style={{ backgroundColor: colorHex }}
                              />
                              <span>{color}</span>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                    {selectedColor && product.colorVariants && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Bilderna uppdateras baserat på vald färg
                      </p>
                    )}
                  </div>
                )}

                <Separator />

                {/* Quantity Selection */}
                <div>
                  <h3 className="font-semibold mb-3">Antal</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-border rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={decrementQuantity}
                        className="rounded-none"
                      >
                        -
                      </Button>
                      <span className="px-6 py-2 min-w-[60px] text-center">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={incrementQuantity}
                        className="rounded-none"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  className="w-full h-12 text-lg"
                  size="lg"
                  disabled={product.inStock === false}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {product.inStock === false ? 'Slut i lager' : 'Lägg i Kundvagn'}
                </Button>


                {/* Product Details */}
                {product.details && product.details.length > 0 && (
                  <div className="pt-6">
                    <h3 className="font-semibold mb-3">Detaljer</h3>
                    <ul className="space-y-2">
                      {product.details.map((detail, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="py-12 px-4 bg-secondary/50">
            <div className="container mx-auto max-w-7xl">
              <h2 className="font-display text-3xl font-bold mb-8">
                Relaterade Produkter
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Card
                    key={relatedProduct.id}
                    className="group overflow-hidden border-0 shadow-soft hover:shadow-elegant transition-all duration-500 cursor-pointer"
                    onClick={() => navigate(`/products/${relatedProduct.id}`)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700 ease-elegant"
                      />
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
                    </div>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground font-medium mb-1">
                        {relatedProduct.category}
                      </p>
                      <h3 className="font-display text-lg font-semibold mb-2">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-base font-semibold text-accent">
                        {relatedProduct.price}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Product Recommendations */}
        <ProductRecommendations currentProductId={product.id} />
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;

