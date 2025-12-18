import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/contexts/AppContext';
import { ProductData } from '@/data/products';
import { ShoppingCart, Package, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProductBundleProps {
  products: ProductData[];
  bundleName: string;
  discount: number; // Percentage discount
}

const ProductBundle = ({ products, bundleName, discount }: ProductBundleProps) => {
  const navigate = useNavigate();
  const { addToCart } = useApp();
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(
    new Set(products.map(p => p.id))
  );

  if (products.length < 2) return null;

  const totalPrice = products.reduce((sum, p) => sum + p.priceValue, 0);
  const selectedPrice = products
    .filter(p => selectedProducts.has(p.id))
    .reduce((sum, p) => sum + p.priceValue, 0);
  const discountAmount = (selectedPrice * discount) / 100;
  const finalPrice = selectedPrice - discountAmount;

  const toggleProduct = (productId: number) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleAddBundleToCart = () => {
    if (selectedProducts.size < 2) {
      toast({
        title: 'Välj minst 2 produkter',
        description: 'En bundle måste innehålla minst 2 produkter.',
        variant: 'destructive',
      });
      return;
    }

    products
      .filter(p => selectedProducts.has(p.id))
      .forEach(product => {
        addToCart(product);
      });

    toast({
      title: 'Bundle tillagd!',
      description: `${selectedProducts.size} produkter har lagts till i kundvagnen.`,
    });
  };

  return (
    <Card className="border-0 shadow-soft">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-2xl font-bold">{bundleName}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Köp tillsammans och spara {discount}%
            </p>
          </div>
          <Badge variant="default" className="bg-green-500">
            <Package className="h-3 w-3 mr-1" />
            Bundle
          </Badge>
        </div>

        <Separator className="mb-4" />

        <div className="space-y-3 mb-6">
          {products.map(product => (
            <div
              key={product.id}
              className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedProducts.has(product.id)
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => toggleProduct(product.id)}
            >
              <input
                type="checkbox"
                checked={selectedProducts.has(product.id)}
                onChange={() => toggleProduct(product.id)}
                className="w-4 h-4"
              />
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{product.name}</h4>
                <p className="text-xs text-muted-foreground">{product.category}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{product.price}</p>
              </div>
            </div>
          ))}
        </div>

        <Separator className="mb-4" />

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>Ursprungligt pris:</span>
            <span className="line-through text-muted-foreground">
              {selectedPrice.toLocaleString('sv-SE')} kr
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Rabatt ({discount}%):</span>
            <span className="text-green-500 font-semibold">
              -{discountAmount.toLocaleString('sv-SE')} kr
            </span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Totalt:</span>
            <span className="text-accent">
              {finalPrice.toLocaleString('sv-SE')} kr
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Du sparar {discountAmount.toLocaleString('sv-SE')} kr!
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleAddBundleToCart}
            className="flex-1"
            disabled={selectedProducts.size < 2}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Lägg Bundle i Kundvagn
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/products')}
          >
            Se Alla Produkter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductBundle;





