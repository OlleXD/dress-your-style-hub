import { useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useApp } from '@/contexts/AppContext';
import { ProductData } from '@/data/products';
import { toast } from '@/hooks/use-toast';

interface ProductNotificationProps {
  product: ProductData;
}

const ProductNotification = ({ product }: ProductNotificationProps) => {
  const { user } = useApp();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(user?.email || '');
  const [notifyStock, setNotifyStock] = useState(false);
  const [notifyPrice, setNotifyPrice] = useState(false);

  const getStoredNotifications = () => {
    const stored = localStorage.getItem('productNotifications');
    return stored ? JSON.parse(stored) : [];
  };

  const isNotificationSet = () => {
    const notifications = getStoredNotifications();
    return notifications.some((n: any) => n.productId === product.id);
  };

  const getNotificationTypes = () => {
    const notifications = getStoredNotifications();
    const productNotifications = notifications.filter((n: any) => n.productId === product.id);
    return {
      stock: productNotifications.some((n: any) => n.type === 'stock'),
      price: productNotifications.some((n: any) => n.type === 'price'),
    };
  };

  const handleSetNotification = (e: React.FormEvent) => {
    e.preventDefault();
    const finalEmail = user?.email || email;
    if (!finalEmail || !finalEmail.includes('@')) {
      toast({
        title: 'Ogiltig e-post',
        description: 'Vänligen ange en giltig e-postadress.',
        variant: 'destructive',
      });
      return;
    }

    if (!notifyStock && !notifyPrice) {
      toast({
        title: 'Välj minst ett alternativ',
        description: 'Vänligen välj minst en typ av notifikation.',
        variant: 'destructive',
      });
      return;
    }

    const notifications = getStoredNotifications();
    // Remove existing notifications for this product
    const filtered = notifications.filter((n: any) => n.productId !== product.id);
    
    if (notifyStock) {
      filtered.push({
        productId: product.id,
        productName: product.name,
        email: finalEmail,
        type: 'stock',
        date: new Date().toISOString(),
      });
    }

    if (notifyPrice) {
      filtered.push({
        productId: product.id,
        productName: product.name,
        email: finalEmail,
        type: 'price',
        date: new Date().toISOString(),
      });
    }

    localStorage.setItem('productNotifications', JSON.stringify(filtered));

    toast({
      title: 'Notifikation aktiverad',
      description: 'Du kommer att få meddelanden enligt dina val.',
    });

    setOpen(false);
    setNotifyStock(false);
    setNotifyPrice(false);
  };

  const handleRemoveNotification = () => {
    const notifications = getStoredNotifications();
    const filtered = notifications.filter((n: any) => n.productId !== product.id);
    localStorage.setItem('productNotifications', JSON.stringify(filtered));
    toast({
      title: 'Notifikation borttagen',
      description: 'Du kommer inte längre få meddelanden om denna produkt.',
    });
    setOpen(false);
  };

  const notificationTypes = getNotificationTypes();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setOpen(true);
          if (isNotificationSet()) {
            const types = getNotificationTypes();
            setNotifyStock(types.stock);
            setNotifyPrice(types.price);
          }
        }}
        className="relative"
      >
        {isNotificationSet() ? (
          <BellOff className="h-5 w-5" />
        ) : (
          <Bell className="h-5 w-5" />
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Produktnotifikation
            </DialogTitle>
            <DialogDescription>
              Få meddelande när denna produkt ändras
            </DialogDescription>
          </DialogHeader>

          {isNotificationSet() ? (
            <div className="space-y-4 mt-4">
              <p className="text-sm text-muted-foreground">
                Du har redan aktiva notifikationer för denna produkt:
              </p>
              {notificationTypes.stock && (
                <p className="text-sm">• Meddela mig när produkten finns i lager</p>
              )}
              {notificationTypes.price && (
                <p className="text-sm">• Meddela mig vid prissänkning</p>
              )}
              <Button
                variant="destructive"
                onClick={handleRemoveNotification}
                className="w-full"
              >
                Ta bort notifikationer
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSetNotification} className="space-y-4 mt-4">
              {user ? (
                <div className="space-y-2">
                  <Label>E-postadress</Label>
                  <p className="text-sm text-muted-foreground">
                    Skickas till {user.email}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>E-postadress</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="din@email.com"
                  />
                </div>
              )}

              <div className="space-y-3">
                <Label>Välj notifikationer</Label>
                <div className="space-y-3">
                  {product.inStock === false && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="notifyStock"
                        checked={notifyStock}
                        onCheckedChange={(checked) => setNotifyStock(checked === true)}
                      />
                      <Label htmlFor="notifyStock" className="cursor-pointer text-sm">
                        Meddela mig när produkten finns i lager
                      </Label>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notifyPrice"
                      checked={notifyPrice}
                      onCheckedChange={(checked) => setNotifyPrice(checked === true)}
                    />
                    <Label htmlFor="notifyPrice" className="cursor-pointer text-sm">
                      Meddela mig vid prissänkning
                    </Label>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Aktivera notifikationer
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductNotification;
