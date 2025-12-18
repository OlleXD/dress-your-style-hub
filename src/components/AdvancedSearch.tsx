import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { allProducts } from '@/data/products';
import { Search, X } from 'lucide-react';

const AdvancedSearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>('relevance');

  const categories = Array.from(new Set(allProducts.map(p => p.category)));

  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    // Gender
    if (selectedGender) {
      filtered = filtered.filter(p => p.gender === selectedGender);
    }

    // Price range
    filtered = filtered.filter(
      p => p.priceValue >= priceRange[0] && p.priceValue <= priceRange[1]
    );

    // Rating
    if (minRating > 0) {
      filtered = filtered.filter(p => (p.rating || 0) >= minRating);
    }

    // Stock
    if (inStockOnly) {
      filtered = filtered.filter(p => p.inStock !== false);
    }

    // Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.priceValue - b.priceValue);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.priceValue - a.priceValue);
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Relevance - keep original order
        break;
    }

    return sorted;
  }, [
    searchQuery,
    selectedCategories,
    selectedGender,
    priceRange,
    minRating,
    inStockOnly,
    sortBy,
  ]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedGender(null);
    setPriceRange([0, 5000]);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy('relevance');
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="font-display text-4xl font-bold mb-2">Avancerad Sökning</h1>
          <p className="text-muted-foreground">
            Hitta exakt vad du letar efter med våra avancerade filter
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="border-0 shadow-soft sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Filter</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Rensa
                  </Button>
                </div>

                {/* Search */}
                <div className="space-y-2">
                  <Label>Sök</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Sök produkter..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label>Kön</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={selectedGender === 'Kvinnor' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedGender(selectedGender === 'Kvinnor' ? null : 'Kvinnor')}
                    >
                      Damer
                    </Button>
                    <Button
                      variant={selectedGender === 'Herrar' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedGender(selectedGender === 'Herrar' ? null : 'Herrar')}
                    >
                      Herrar
                    </Button>
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <Label>Kategorier</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {categories.map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`cat-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => handleCategoryToggle(category)}
                        />
                        <Label
                          htmlFor={`cat-${category}`}
                          className="text-sm cursor-pointer"
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <Label>Pris: {priceRange[0]} - {priceRange[1]} kr</Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={5000}
                    min={0}
                    step={100}
                  />
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <Label>Minimibetyg: {minRating > 0 ? `${minRating}+` : 'Ingen'}</Label>
                  <Slider
                    value={[minRating]}
                    onValueChange={(value) => setMinRating(value[0])}
                    max={5}
                    min={0}
                    step={0.5}
                  />
                </div>

                {/* In Stock Only */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inStock"
                    checked={inStockOnly}
                    onCheckedChange={(checked) => setInStockOnly(checked === true)}
                  />
                  <Label htmlFor="inStock" className="text-sm cursor-pointer">
                    Endast produkter i lager
                  </Label>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <p className="text-sm text-muted-foreground">
                {filteredProducts.length} produkter hittades
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sortera" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevans</SelectItem>
                  <SelectItem value="price-low">Pris: Lägst först</SelectItem>
                  <SelectItem value="price-high">Pris: Högst först</SelectItem>
                  <SelectItem value="rating">Högsta betyg</SelectItem>
                  <SelectItem value="name-asc">Namn: A-Ö</SelectItem>
                  <SelectItem value="name-desc">Namn: Ö-A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredProducts.length === 0 ? (
              <Card className="border-0 shadow-soft text-center py-12">
                <CardContent>
                  <p className="text-lg text-muted-foreground mb-4">
                    Inga produkter hittades
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Rensa filter
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <Card
                    key={product.id}
                    className="group overflow-hidden border-0 shadow-soft hover:shadow-elegant transition-all duration-500 cursor-pointer"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground font-medium mb-1">
                        {product.category}
                      </p>
                      <h3 className="font-display text-lg font-semibold mb-2">
                        {product.name}
                      </h3>
                      <p className="text-base font-semibold text-accent">
                        {product.price}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;





