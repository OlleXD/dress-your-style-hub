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
import { allProducts } from '@/data/products';
import QuickViewModal from '@/components/QuickViewModal';

const Products = () => {
  const { addToCart, toggleFavorite, isFavorite } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState<string>('default');
  const [showOutOfStock, setShowOutOfStock] = useState<boolean>(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [quickViewProduct, setQuickViewProduct] = useState<typeof allProducts[0] | null>(null);
  const [minPriceInput, setMinPriceInput] = useState<string>('0');
  const [maxPriceInput, setMaxPriceInput] = useState<string>('5000');
  
  const ITEMS_PER_PAGE = 12;

  const categories = ['Jackor', 'Klänningar', 'Kostymer', 'Skjortor', 'Byxor', 'Tröjor', 'Accessoarer'];

  // Calculate max price from all products
  const maxProductPrice = Math.max(...allProducts.map(p => p.priceValue), 5000);
  const minProductPrice = Math.min(...allProducts.map(p => p.priceValue), 0);

  useEffect(() => {
    const gender = searchParams.get('gender');
    const category = searchParams.get('category');
    if (gender === 'women' || gender === 'men') {
      setSelectedGender(gender === 'women' ? 'Kvinnor' : 'Herrar');
    }
    if (category) {
      const decodedCategory = decodeURIComponent(category);
      if (categories.includes(decodedCategory)) {
        setSelectedCategories([decodedCategory]);
      }
    }
  }, [searchParams]);

  // Initialize price range on mount
  useEffect(() => {
    setPriceRange([minProductPrice, maxProductPrice]);
    setMinPriceInput(minProductPrice.toString());
    setMaxPriceInput(maxProductPrice.toString());
  }, []);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter((product) => {
      const matchesGender =
        !selectedGender || product.gender === null || product.gender === selectedGender;
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesPrice =
        product.priceValue >= priceRange[0] && product.priceValue <= priceRange[1];
      return matchesGender && matchesCategory && matchesPrice;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.priceValue - b.priceValue);
        break;
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.priceValue - a.priceValue);
        break;
      case 'name-asc':
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // Keep original order
        break;
    }

    return filtered;
  }, [selectedGender, selectedCategories, priceRange, sortBy]);

  // Pagination logic - 12 products per page
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGender, selectedCategories, priceRange, sortBy, showOutOfStock, selectedColors, selectedSizes]);

  const clearFilters = () => {
    setSelectedGender(null);
    setSelectedCategories([]);
    setPriceRange([minProductPrice, maxProductPrice]);
    setMinPriceInput(minProductPrice.toString());
    setMaxPriceInput(maxProductPrice.toString());
    setShowOutOfStock(false);
    setSelectedColors([]);
    setSelectedSizes([]);
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
    if (numValue >= minProductPrice && numValue <= priceRange[1]) {
      setPriceRange([numValue, priceRange[1]]);
    }
  };

  const handleMaxPriceChange = (value: string) => {
    setMaxPriceInput(value);
    const numValue = parseInt(value) || maxProductPrice;
    if (numValue <= maxProductPrice && numValue >= priceRange[0]) {
      setPriceRange([priceRange[0], numValue]);
    }
  };

  const handlePriceInputBlur = () => {
    const min = parseInt(minPriceInput) || minProductPrice;
    const max = parseInt(maxPriceInput) || maxProductPrice;
    
    if (min < minProductPrice) {
      setMinPriceInput(minProductPrice.toString());
      setPriceRange([minProductPrice, priceRange[1]]);
    } else if (min > priceRange[1]) {
      setMinPriceInput(priceRange[1].toString());
      setPriceRange([priceRange[1], priceRange[1]]);
    } else {
      setPriceRange([min, priceRange[1]]);
    }

    if (max > maxProductPrice) {
      setMaxPriceInput(maxProductPrice.toString());
      setPriceRange([priceRange[0], maxProductPrice]);
    } else if (max < priceRange[0]) {
      setMaxPriceInput(priceRange[0].toString());
      setPriceRange([priceRange[0], priceRange[0]]);
    } else {
      setPriceRange([priceRange[0], max]);
    }
  };

  // Get all available colors and sizes from filtered products
  const availableColors = Array.from(
    new Set(
      allProducts
        .filter(p => {
          const matchesGender = !selectedGender || p.gender === null || p.gender === selectedGender;
          const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
          return matchesGender && matchesCategory;
        })
        .flatMap(p => p.colors || [])
    )
  ).sort();

  const availableSizes = Array.from(
    new Set(
      allProducts
        .filter(p => {
          const matchesGender = !selectedGender || p.gender === null || p.gender === selectedGender;
          const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
          return matchesGender && matchesCategory;
        })
        .flatMap(p => p.sizes || [])
    )
  ).sort();

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

      {/* Gender Filter */}
      <div className="space-y-4">
        <h4 className="font-semibold text-sm">Kön</h4>
        <div className="flex gap-2">
          <Button
            variant={selectedGender === 'Kvinnor' ? 'default' : 'outline'}
            className={`flex-1 rounded-none ${
              selectedGender === 'Kvinnor'
                ? 'bg-primary text-primary-foreground'
                : ''
            }`}
            onClick={() => setSelectedGender(selectedGender === 'Kvinnor' ? null : 'Kvinnor')}
          >
            Damer
          </Button>
          <Button
            variant={selectedGender === 'Herrar' ? 'default' : 'outline'}
            className={`flex-1 rounded-none ${
              selectedGender === 'Herrar'
                ? 'bg-primary text-primary-foreground'
                : ''
            }`}
            onClick={() => setSelectedGender(selectedGender === 'Herrar' ? null : 'Herrar')}
          >
            Herrar
          </Button>
        </div>
      </div>

      <Separator />

      {/* Categories */}
      <div className="space-y-4">
        <h4 className="font-semibold text-sm">Kategorier</h4>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => handleCategoryToggle(category)}
              />
              <Label
                htmlFor={category}
                className="text-sm font-normal cursor-pointer"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
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
            max={maxProductPrice}
            min={minProductPrice}
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
                min={minProductPrice}
                max={maxProductPrice}
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
                min={minProductPrice}
                max={maxProductPrice}
                className="w-full"
                placeholder="Max"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

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

      <Separator />

      {/* Colors */}
      {availableColors.length > 0 && (
        <>
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Färg</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableColors.map((color) => (
                <div key={color} className="flex items-center space-x-2">
                  <Checkbox
                    id={`color-${color}`}
                    checked={selectedColors.includes(color)}
                    onCheckedChange={() => {
                      setSelectedColors((prev) =>
                        prev.includes(color)
                          ? prev.filter((c) => c !== color)
                          : [...prev, color]
                      );
                    }}
                  />
                  <Label
                    htmlFor={`color-${color}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {color}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Sizes */}
      {availableSizes.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Storlek</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableSizes.map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox
                  id={`size-${size}`}
                  checked={selectedSizes.includes(size)}
                  onCheckedChange={() => {
                    setSelectedSizes((prev) =>
                      prev.includes(size)
                        ? prev.filter((s) => s !== size)
                        : [...prev, size]
                    );
                  }}
                />
                <Label
                  htmlFor={`size-${size}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {size}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

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
            {selectedCategories.length > 0 && (
              <span className="ml-2 bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full">
                {selectedCategories.length}
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
                        <SelectItem value="rating">Högsta betyg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {filteredProducts.length === 0 ? (
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
                      {paginatedProducts.map((product) => (
                      <Card
                        key={product.id}
                        className="group overflow-hidden border-0 shadow-soft hover:shadow-elegant transition-all duration-500"
                      >
                        <div className="relative">
                          <div 
                            className="relative overflow-hidden cursor-pointer"
                            onClick={() => navigate(`/products/${product.id}`)}
                          >
                            <img
                              src={product.image}
                              alt={`${product.name} - Premium ${product.category.toLowerCase()}`}
                              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700 ease-elegant"
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
                            <p className="text-base font-semibold text-accent">
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
                                setQuickViewProduct(product);
                              }}
                              title="Snabbvy"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      ))}
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
      <QuickViewModal
        product={quickViewProduct}
        open={!!quickViewProduct}
        onOpenChange={(open) => !open && setQuickViewProduct(null)}
      />
    </div>
  );
};

export default Products;

