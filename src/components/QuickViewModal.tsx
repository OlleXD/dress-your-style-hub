import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/contexts/AppContext';
import { ProductData } from '@/data/products';
import { ShoppingCart, Heart, Star, Package, X } from 'lucide-react';

interface QuickViewModalProps {
  product: ProductData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuickViewModal = ({ product, open, onOpenChange }: QuickViewModalProps) => {
  const navigate = useNavigate();
  const { addToCart, toggleFavorite, isFavorite } = useApp();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  if (!product) return null;

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      return;
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      return;
    }
    addToCart(product, selectedSize || undefined, selectedColor || undefined);
    onOpenChange(false);
  };

  const handleViewFullDetails = () => {
    onOpenChange(false);
    navigate(`/products/${product.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{product.name}</DialogTitle>
          <DialogDescription>{product.category}</DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg border border-border">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.inStock !== false ? (
              <Badge className="absolute top-2 left-2 bg-green-500">
                <Package className="h-3 w-3 mr-1" />
                {product.stockCount ? `${product.stockCount} i lager` : 'I lager'}
              </Badge>
            ) : (
              <Badge variant="destructive" className="absolute top-2 left-2">
                Slut i lager
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div>
              {product.rating && (
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-sm">{product.rating}</span>
                  {product.reviewCount && (
                    <span className="text-xs text-muted-foreground">
                      ({product.reviewCount} recensioner)
                    </span>
                  )}
                </div>
              )}
              <p className="text-2xl font-semibold text-accent mb-4">{product.price}</p>
              {product.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {product.description}
                </p>
              )}
            </div>

            <Separator />

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Storlek</h4>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[50px] ${
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
                <h4 className="font-semibold text-sm mb-2">Färg</h4>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedColor(color)}
                      className={`min-w-[80px] ${
                        selectedColor === color
                          ? 'bg-primary text-primary-foreground'
                          : ''
                      }`}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={handleAddToCart}
                className="flex-1"
                disabled={product.inStock === false}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Lägg i Kundvagn
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleFavorite(product.id, selectedSize || undefined, selectedColor || undefined)}
              >
                <Heart
                  className={`h-4 w-4 ${
                    isFavorite(product.id, selectedSize || undefined, selectedColor || undefined)
                      ? 'fill-red-500 text-red-500'
                      : ''
                  }`}
                />
              </Button>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleViewFullDetails}
            >
              Se Fullständig Information
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;





