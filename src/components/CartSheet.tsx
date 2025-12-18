import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useApp } from '@/contexts/AppContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartSheet = ({ open, onOpenChange }: CartSheetProps) => {
  const { cart, removeFromCart, updateCartItemQuantity, getCartTotal, clearCart } = useApp();
  const navigate = useNavigate();

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartItemQuantity(productId, newQuantity);
    }
  };

  const formatPrice = (price: string) => {
    return price;
  };

  const total = getCartTotal();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Kundvagn</SheetTitle>
          <SheetDescription>
            {cart.length === 0
              ? 'Din kundvagn är tom'
              : `${cart.length} ${cart.length === 1 ? 'produkt' : 'produkter'} i kundvagnen`}
          </SheetDescription>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground mb-2">
              Din kundvagn är tom
            </p>
            <p className="text-sm text-muted-foreground">
              Lägg till produkter för att börja handla
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 border border-border rounded-lg hover:shadow-soft transition-shadow"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display font-semibold text-sm">{item.name}</h3>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                      {item.selectedSize && (
                        <p className="text-xs text-muted-foreground">Storlek: {item.selectedSize}</p>
                      )}
                      {item.selectedColor && (
                        <p className="text-xs text-muted-foreground">Färg: {item.selectedColor}</p>
                      )}
                      <p className="text-sm font-semibold text-accent mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 ml-auto text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Totalt:</span>
                <span className="text-xl font-display font-bold text-accent">
                  {total.toFixed(0)} kr
                </span>
              </div>
              <Separator />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={clearCart}
                >
                  Rensa Kundvagn
                </Button>
                <Button 
                  className="flex-1 font-medium"
                  onClick={() => {
                    onOpenChange(false);
                    navigate('/checkout');
                  }}
                >
                  Till Kassan
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;

