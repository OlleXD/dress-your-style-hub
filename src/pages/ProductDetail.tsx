import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import ProductGallery from '@/components/ProductGallery';
import { ShoppingCart, ArrowLeft, Check, Heart, Package } from 'lucide-react';
import ProductNotification from '@/components/ProductNotification';
import SizeGuide from '@/components/SizeGuide';
import { toast } from '@/hooks/use-toast';
import { useFenroProducts } from '@/hooks/useFenroProducts';
import { FenroProduct } from '@/types/fenro';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, toggleFavorite, isFavorite } = useApp();
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // Fetch all products to find the one we need
  const { products, loading } = useFenroProducts({ status: 'all' });
  const product = id ? products.find((p: FenroProduct) => p.id === id) : undefined;

  // Set initial variant from location state
  useEffect(() => {
    if (location.state) {
      const { selectedVariant: stateVariant } = location.state as { selectedVariant?: string };
      if (stateVariant && product?.variants && stateVariant in product.variants) {
        setSelectedVariant(stateVariant);
      }
    }
  }, [location.state, product]);

  // Get available variants from product options
  const getAvailableVariants = () => {
    if (!product || !product.options || product.options.length === 0) return [];
    
    // Build variant combinations
    const variants: string[] = [];
    const optionNames = product.options.map(opt => opt.name);
    const optionValues = product.options.map(opt => opt.values);
    
    // Generate all combinations
    const generateCombinations = (arrays: string[][], index = 0, current: string[] = []): string[] => {
      if (index === arrays.length) {
        return [current.join(' / ')];
      }
      const result: string[] = [];
      for (const value of arrays[index]) {
        result.push(...generateCombinations(arrays, index + 1, [...current, value]));
      }
      return result;
    };
    
    return generateCombinations(optionValues);
  };

  const availableVariants = getAvailableVariants();
  const variantStock = selectedVariant && product?.variants 
    ? (product.variants[selectedVariant] ?? 0)
    : product?.stock ?? 0;

  // Get images - use product images or variant-specific if available
  const getProductImages = () => {
    if (!product) return [];
    return product.images || [];
  };

  const productImages = getProductImages();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="container mx-auto max-w-7xl py-16 px-4 text-center">
            <p className="text-lg">Laddar produkt...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
    if (availableVariants.length > 0 && !selectedVariant) {
      toast({
        title: 'Välj variant',
        description: 'Vänligen välj en variant innan du lägger till produkten i kundvagnen.',
        variant: 'destructive',
      });
      return;
    }

    if (variantStock <= 0) {
      toast({
        title: 'Slut i lager',
        description: 'Denna variant är tyvärr slut i lager.',
        variant: 'destructive',
      });
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product as any, selectedVariant || undefined);
    }
    
    toast({
      title: 'Tillagd i kundvagn',
      description: `${product.name} har lagts till i din kundvagn.`,
    });
  };

  const incrementQuantity = () => {
    const maxQuantity = variantStock;
    setQuantity(prev => Math.min(maxQuantity, prev + 1));
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString('sv-SE')} kr`;
  };

  const hasDiscount = product.compare_price && product.compare_price > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)
    : 0;

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
              {product.category && (
                <>
                  <span className="text-foreground">{product.category}</span>
                  <span>/</span>
                </>
              )}
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
                    <div>
                      {product.category && (
                        <p className="text-sm text-muted-foreground">
                          {product.category}
                        </p>
                      )}
                      {product.manufacturer && (
                        <p className="text-sm text-muted-foreground">
                          Tillverkare: {product.manufacturer}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(product.id, selectedVariant || undefined)}
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          isFavorite(product.id, selectedVariant || undefined)
                            ? 'fill-red-500 text-red-500'
                            : ''
                        }`}
                      />
                    </Button>
                  </div>
                  <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      {hasDiscount ? (
                        <>
                          <span className="text-3xl font-semibold text-red-600">
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-xl text-gray-400 line-through">
                            {formatPrice(product.compare_price!)}
                          </span>
                          <Badge variant="destructive" className="ml-2">
                            -{discountPercent}%
                          </Badge>
                        </>
                      ) : (
                        <span className="text-3xl font-semibold text-accent">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Stock Status */}
                  <div className="flex items-center gap-2 mb-6">
                    {variantStock > 0 ? (
                      <Badge variant="default" className="bg-green-500">
                        <Package className="h-3 w-3 mr-1" />
                        {variantStock} i lager
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Slut i lager</Badge>
                    )}
                  </div>
                </div>

                {product.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Beskrivning</h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                )}

                <Separator />

                {/* Variant Selection */}
                {availableVariants.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">Variant</h3>
                      {product.size_guide_id && (
                        <SizeGuide sizeGuideId={product.size_guide_id} productName={product.name} />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availableVariants.map((variant) => {
                        const stock = product.variants?.[variant] ?? 0;
                        const isSelected = selectedVariant === variant;
                        const isOutOfStock = stock <= 0;
                        
                        return (
                          <Button
                            key={variant}
                            variant={isSelected ? 'default' : 'outline'}
                            onClick={() => setSelectedVariant(variant)}
                            disabled={isOutOfStock}
                            className={`min-w-[100px] ${
                              isSelected
                                ? 'bg-primary text-primary-foreground'
                                : ''
                            } ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {variant}
                            {isOutOfStock && ' (Slut)'}
                          </Button>
                        );
                      })}
                    </div>
                    {selectedVariant && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Lager: {variantStock} st
                      </p>
                    )}
                  </div>
                )}

                {/* Size Guide Link */}
                {product.size_guide_id && availableVariants.length === 0 && (
                  <div>
                    <SizeGuide sizeGuideId={product.size_guide_id} productName={product.name} />
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
                        disabled={quantity >= variantStock}
                      >
                        +
                      </Button>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Max {variantStock} st
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  className="w-full h-12 text-lg"
                  size="lg"
                  disabled={variantStock <= 0}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {variantStock <= 0 ? 'Slut i lager' : 'Lägg i Kundvagn'}
                </Button>

                {/* Keywords/Tags */}
                {product.keywords && product.keywords.length > 0 && (
                  <div className="pt-6">
                    <h3 className="font-semibold mb-3">Taggar</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.keywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
