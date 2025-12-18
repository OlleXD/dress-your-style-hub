import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Home } from 'lucide-react';

interface OrderData {
  orderId: string;
  items: any[];
  total: number;
  shipping: any;
  date: string;
}

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    const stateOrder = location.state?.orderData;
    if (stateOrder) {
      setOrderData(stateOrder);
    } else {
      // Try to get from localStorage
      const storedOrder = localStorage.getItem('lastOrder');
      if (storedOrder) {
        setOrderData(JSON.parse(storedOrder));
      } else {
        navigate('/');
      }
    }
  }, [location, navigate]);

  if (!orderData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="font-display text-4xl font-bold mb-2">
                Tack för din beställning!
              </h1>
              <p className="text-muted-foreground">
                Din beställning har mottagits och kommer att behandlas snart.
              </p>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="font-display text-xl">Orderinformation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Ordernummer</p>
                  <p className="font-semibold">{orderData.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Beställningsdatum</p>
                  <p className="font-semibold">
                    {new Date(orderData.date).toLocaleDateString('sv-SE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Leveransadress</p>
                  <p className="font-semibold">
                    {orderData.shipping.firstName} {orderData.shipping.lastName}
                    <br />
                    {orderData.shipping.address}
                    <br />
                    {orderData.shipping.postalCode} {orderData.shipping.city}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="font-display text-xl">Beställda Produkter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderData.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Antal: {item.quantity}
                        </p>
                        {item.selectedSize && (
                          <p className="text-sm text-muted-foreground">
                            Storlek: {item.selectedSize}
                          </p>
                        )}
                        {item.selectedColor && (
                          <p className="text-sm text-muted-foreground">
                            Färg: {item.selectedColor}
                          </p>
                        )}
                      </div>
                      <p className="font-semibold">{item.price}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Totalt:</span>
                    <span className="text-xl font-display font-bold text-accent">
                      {orderData.total.toFixed(0)} kr
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/products')}
              >
                <Package className="mr-2 h-4 w-4" />
                Fortsätt Handla
              </Button>
              <Button className="flex-1" onClick={() => navigate('/')}>
                <Home className="mr-2 h-4 w-4" />
                Till Startsidan
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;





