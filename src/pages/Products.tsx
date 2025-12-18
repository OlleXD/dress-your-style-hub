import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { X, Filter, Heart, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFenroProducts } from '@/hooks/useFenroProducts';
import { useFenroCategories } from '@/hooks/useFenroCategories';
import { useFenroCollections } from '@/hooks/useFenroCollections';
import { FenroProduct } from '@/types/fenro';
import QuickViewModal from '@/components/QuickViewModal';

const Products = () => {
  const { addToCart, toggleFavorite, isFavorite } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState<string>('default');
  const [showOutOfStock, setShowOutOfStock] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [quickViewProduct, setQuickViewProduct] = useState<FenroProduct | null>(null);
  const [minPriceInput, setMinPriceInput] = useState<string>('0');
  const [maxPriceInput, setMaxPriceInput] = useState<string>('10000');
  
  const ITEMS_PER_PAGE = 12;

  // Get collection and category from URL params
  const collectionParam = searchParams.get('collection');
  const categoryParam = searchParams.get('category');

  // Fetch data from Fenro API
  const { products, loading: productsLoading, error: productsError } = useFenroProducts({
    collection: selectedCollection || collectionParam || undefined,
    category: selectedCategories.length === 1 ? selectedCategories[0] : categoryParam || undefined,
    pollingInterval: 5000,
  });

  const { categories, loading: categoriesLoading } = useFenroCategories();
  const { collections, loading: collectionsLoading } = useFenroCollections(true);

  // Initialize from URL params
  useEffect(() => {
    if (collectionParam) {
      setSelectedCollection(collectionParam);
    }
    if (categoryParam) {
      const decodedCategory = decodeURIComponent(categoryParam);
      setSelectedCategories([decodedCategory]);
    }
  }, [collectionParam, categoryParam]);

  // Calculate price range from products
  const priceStats = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 10000 };
    const prices = products.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [products]);

  // Initialize price range when products load
  useEffect(() => {
    if (priceStats.max > 0) {
      setPriceRange([priceStats.min, priceStats.max]);
      setMinPriceInput(priceStats.min.toString());
      setMaxPriceInput(priceStats.max.toString());
    }
  }, [priceStats]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleCollectionToggle = (collectionId: string) => {
    setSelectedCollection(prev => prev === collectionId ? null : collectionId);
  };

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product: FenroProduct) => {
      const matchesCategory =
        selectedCategories.length === 0 || 
        (product.category && selectedCategories.includes(product.category));
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesStock = showOutOfStock || product.stock > 0;
      return matchesCategory && matchesPrice && matchesStock;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Keep original order
        break;
    }

    return filtered;
  }, [products, selectedCategories, priceRange, sortBy, showOutOfStock]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCollection, selectedCategories, priceRange, sortBy, showOutOfStock]);

  const clearFilters = () => {
    setSelectedCollection(null);
    setSelectedCategories([]);
    setPriceRange([priceStats.min, priceStats.max]);
    setMinPriceInput(priceStats.min.toString());
    setMaxPriceInput(priceStats.max.toString());
    setShowOutOfStock(false);
    navigate('/products');
  };

  // Sync price inputs with slider
  useEffect(() => {
    setMinPriceInput(priceRange[0].toString());
    setMaxPriceInput(priceRange[1].toString());
  }, [priceRange]);

  // Handle price input changes
  const handleMinPriceChange = (value: string) => {
    setMinPriceInput(value);
    const numValue = parseInt(value) || 0;
    if (numValue >= priceStats.min && numValue <= priceRange[1]) {
      setPriceRange([numValue, priceRange[1]]);
    }
  };

  const handleMaxPriceChange = (value: string) => {
    setMaxPriceInput(value);
    const numValue = parseInt(value) || priceStats.max;
    if (numValue <= priceStats.max && numValue >= priceRange[0]) {
      setPriceRange([priceRange[0], numValue]);
    }
  };

  const handlePriceInputBlur = () => {
    const min = parseInt(minPriceInput) || priceStats.min;
    const max = parseInt(maxPriceInput) || priceStats.max;
    
    if (min < priceStats.min) {
      setMinPriceInput(priceStats.min.toString());
      setPriceRange([priceStats.min, priceRange[1]]);
    } else if (min > priceRange[1]) {
      setMinPriceInput(priceRange[1].toString());
      setPriceRange([priceRange[1], priceRange[1]]);
    } else {
      setPriceRange([min, priceRange[1]]);
    }

    if (max > priceStats.max) {
      setMaxPriceInput(priceStats.max.toString());
      setPriceRange([priceRange[0], priceStats.max]);
    } else if (max < priceRange[0]) {
      setMaxPriceInput(priceRange[0].toString());
      setPriceRange([priceRange[0], priceRange[0]]);
    } else {
      setPriceRange([priceRange[0], max]);
    }
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Rensa alla
        </Button>
      </div>

      <Separator />

      {/* Collections Filter */}
      {!collectionsLoading && collections.length > 0 && (
        <>
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Kollektioner</h4>
            <div className="space-y-3">
              {collections.map((collection) => (
                <div key={collection.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`collection-${collection.id}`}
                    checked={selectedCollection === collection.id}
                    onCheckedChange={() => handleCollectionToggle(collection.id)}
                  />
                  <Label
                    htmlFor={`collection-${collection.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {collection.name}
                    {collection.product_count !== undefined && (
                      <span className="text-muted-foreground ml-1">
                        ({collection.product_count})
                      </span>
                    )}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Categories */}
      {!categoriesLoading && categories.length > 0 && (
        <>
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Kategorier</h4>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.name}
                    checked={selectedCategories.includes(category.name)}
                    onCheckedChange={() => handleCategoryToggle(category.name)}
                  />
                  <Label
                    htmlFor={category.name}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category.name}
                    {category.product_count !== undefined && (
                      <span className="text-muted-foreground ml-1">
                        ({category.product_count})
                      </span>
                    )}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Price Range */}
      {priceStats.max > 0 && (
        <>
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Pris</h4>
            <div className="space-y-4">
              <Slider
                value={priceRange}
                onValueChange={(value) => {
                  setPriceRange(value);
                  setMinPriceInput(value[0].toString());
                  setMaxPriceInput(value[1].toString());
                }}
                max={priceStats.max}
                min={priceStats.min}
                step={50}
                className="w-full"
              />
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label htmlFor="min-price" className="text-xs text-muted-foreground mb-1 block">
                    Från
                  </Label>
                  <Input
                    id="min-price"
                    type="number"
                    value={minPriceInput}
                    onChange={(e) => handleMinPriceChange(e.target.value)}
                    onBlur={handlePriceInputBlur}
                    min={priceStats.min}
                    max={priceStats.max}
                    className="w-full"
                    placeholder="Min"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="max-price" className="text-xs text-muted-foreground mb-1 block">
                    Till
                  </Label>
                  <Input
                    id="max-price"
                    type="number"
                    value={maxPriceInput}
                    onChange={(e) => handleMaxPriceChange(e.target.value)}
                    onBlur={handlePriceInputBlur}
                    min={priceStats.min}
                    max={priceStats.max}
                    className="w-full"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Show Out of Stock */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="showOutOfStock"
            checked={showOutOfStock}
            onCheckedChange={(checked) => setShowOutOfStock(checked === true)}
          />
          <Label htmlFor="showOutOfStock" className="text-sm font-normal cursor-pointer">
            Visa slut i lager
          </Label>
        </div>
      </div>
    </div>
  );

  const formatPrice = (price: number) => {
    return `${price.toLocaleString('sv-SE')} kr`;
  };

  const hasDiscount = (product: FenroProduct) => {
    return product.compare_price && product.compare_price > product.price;
  };

  const getDiscountPercent = (product: FenroProduct) => {
    if (!hasDiscount(product)) return 0;
    return Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-background to-secondary border-0">
          <div className="container mx-auto max-w-7xl">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Våra Produkter
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Upptäck vår kompletta kollektion av tidlöst mode
            </p>
          </div>
        </section>

        {/* Mobile Filter Button */}
        <div className="lg:hidden px-4 py-4 border-b border-border">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
            {(selectedCategories.length > 0 || selectedCollection) && (
              <span className="ml-2 bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full">
                {selectedCategories.length + (selectedCollection ? 1 : 0)}
              </span>
            )}
          </Button>
        </div>

        {/* Mobile Filter Sidebar */}
        {showMobileFilters && (
          <div className="lg:hidden fixed inset-0 z-50 bg-background">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileFilters(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100vh-64px)]">
              <FilterSidebar />
            </div>
          </div>
        )}

        {/* Main Content */}
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-7xl">
            {productsError && (
              <Card className="border-0 shadow-soft mb-6">
                <CardContent className="p-6">
                  <p className="text-destructive">
                    Fel vid hämtning av produkter: {productsError.message}
                  </p>
                </CardContent>
              </Card>
            )}
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Desktop Filter Sidebar */}
              <aside className="hidden lg:block">
                <Card className="border-0 shadow-soft sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
                  <CardContent className="p-6">
                    <FilterSidebar />
                  </CardContent>
                </Card>
              </aside>

              {/* Products Grid */}
              <div className="lg:col-span-3">
                <div className="mb-6 flex items-center justify-end flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="sort" className="text-sm">Sortera:</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger id="sort" className="w-[180px]">
                        <SelectValue placeholder="Sortera produkter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Standard</SelectItem>
                        <SelectItem value="price-low">Pris: Lägst först</SelectItem>
                        <SelectItem value="price-high">Pris: Högst först</SelectItem>
                        <SelectItem value="name-asc">Namn: A-Ö</SelectItem>
                        <SelectItem value="name-desc">Namn: Ö-A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {productsLoading ? (
                  <Card className="border-0 shadow-soft text-center py-12">
                    <CardContent>
                      <p className="text-lg text-muted-foreground">Laddar produkter...</p>
                    </CardContent>
                  </Card>
                ) : filteredProducts.length === 0 ? (
                  <Card className="border-0 shadow-soft text-center py-12">
                    <CardContent>
                      <p className="text-lg text-muted-foreground mb-4">
                        Inga produkter matchar dina filter
                      </p>
                      <Button variant="outline" onClick={clearFilters}>
                        Rensa filter
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {paginatedProducts.map((product: FenroProduct) => {
                        const discount = hasDiscount(product);
                        const discountPercent = getDiscountPercent(product);
                        return (
                          <Card
                            key={product.id}
                            className="group overflow-hidden border-0 shadow-soft hover:shadow-elegant transition-all duration-500"
                          >
                            <div className="relative">
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
                                    -{discountPercent}%
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
                                    setQuickViewProduct(product);
                                  }}
                                  title="Snabbvy"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                    {totalPages > 1 && (
                      <div className="mt-8 flex justify-center items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          size="icon"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          Sida {currentPage} av {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                          disabled={currentPage >= totalPages}
                          size="icon"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct as any}
          open={!!quickViewProduct}
          onOpenChange={(open) => !open && setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};

export default Products;
