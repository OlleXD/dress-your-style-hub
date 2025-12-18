import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useApp } from '@/contexts/AppContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DiscountCodeInput from '@/components/DiscountCodeInput';
import { Trash2, ArrowLeft, Loader2, CreditCard, Building2, Wallet } from 'lucide-react';

const Checkout = () => {
  const { cart, removeFromCart, updateCartItemQuantity, getCartTotal, clearCart, isAuthenticated } = useApp();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    deliveryMethod: 'standard',
    paymentMethod: 'card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) newErrors.firstName = 'Förnamn krävs';
    if (!formData.lastName) newErrors.lastName = 'Efternamn krävs';
    if (!formData.email) newErrors.email = 'E-post krävs';
    if (!formData.phone) newErrors.phone = 'Telefonnummer krävs';
    if (!formData.address) newErrors.address = 'Adress krävs';
    if (!formData.city) newErrors.city = 'Stad krävs';
    if (!formData.postalCode) newErrors.postalCode = 'Postnummer krävs';
    if (!formData.cardNumber) newErrors.cardNumber = 'Kortnummer krävs';
    if (!formData.cardName) newErrors.cardName = 'Kortinnehavarens namn krävs';
    if (!formData.expiryDate) newErrors.expiryDate = 'Utgångsdatum krävs';
    if (!formData.cvv) newErrors.cvv = 'CVV krävs';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      const orderData = {
        orderId: `ORD-${Date.now()}`,
        items: cart,
        subtotal: total,
        discount: discountPercent > 0 ? (total * discountPercent) / 100 : 0,
        discountCode: discountCode || null,
        shipping: getShippingCost(),
        total: getFinalTotal(),
        shippingInfo: formData,
        paymentMethod: formData.paymentMethod,
        date: new Date().toISOString(),
      };
      localStorage.setItem('lastOrder', JSON.stringify(orderData));
      clearCart();
      setIsSubmitting(false);
      navigate('/order-confirmation', { state: { orderData } });
    }
  };

  const getShippingCost = () => {
    switch (formData.deliveryMethod) {
      case 'express':
        return 149;
      case 'pickup':
        return 0;
      default:
        return 49;
    }
  };

  const getFinalTotal = () => {
    const subtotal = total;
    const discount = discountPercent > 0 ? (subtotal * discountPercent) / 100 : 0;
    const shipping = getShippingCost();
    return subtotal - discount + shipping;
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartItemQuantity(productId, newQuantity);
    }
  };

  const total = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-24">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Kundvagnen är tom</CardTitle>
              <CardDescription>Lägg till produkter för att fortsätta</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/')} className="w-full">
                Fortsätt Handla
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-24 max-w-6xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tillbaka
          </Button>
          <h1 className="font-display text-4xl font-bold mb-2">Kassa</h1>
          <p className="text-muted-foreground">Slutför din beställning</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-xl">Din Beställning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-display font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-accent">{item.price}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Separator />
                
                {/* Discount Code */}
                <DiscountCodeInput
                  onApplyDiscount={(code, discount) => {
                    setDiscountCode(code || null);
                    setDiscountPercent(discount);
                  }}
                  appliedCode={discountCode}
                />
                
                <Separator />
                
                {/* Order Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Delsumma:</span>
                    <span>{total.toFixed(0)} kr</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Rabatt ({discountCode}):</span>
                      <span>-{((total * discountPercent) / 100).toFixed(0)} kr</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Frakt:</span>
                    <span>{getShippingCost()} kr</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Totalt:</span>
                    <span className="text-xl font-display font-bold text-accent">
                      {getFinalTotal().toFixed(0)} kr
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-xl">Leveransinformation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Förnamn</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={errors.firstName ? 'border-destructive' : ''}
                      />
                      {errors.firstName && (
                        <p className="text-xs text-destructive">{errors.firstName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Efternamn</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={errors.lastName ? 'border-destructive' : ''}
                      />
                      {errors.lastName && (
                        <p className="text-xs text-destructive">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-post</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefonnummer</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? 'border-destructive' : ''}
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive">{errors.phone}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adress</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={errors.address ? 'border-destructive' : ''}
                    />
                    {errors.address && (
                      <p className="text-xs text-destructive">{errors.address}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Stad</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={errors.city ? 'border-destructive' : ''}
                      />
                      {errors.city && (
                        <p className="text-xs text-destructive">{errors.city}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postnummer</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className={errors.postalCode ? 'border-destructive' : ''}
                      />
                      {errors.postalCode && (
                        <p className="text-xs text-destructive">{errors.postalCode}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-xl">Leveransmetod</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={formData.deliveryMethod}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, deliveryMethod: value }))}
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-secondary/50 cursor-pointer">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="flex-1 cursor-pointer">
                        <div className="font-medium">Standard leverans</div>
                        <div className="text-sm text-muted-foreground">3-5 arbetsdagar - 49 kr</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-secondary/50 cursor-pointer">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express" className="flex-1 cursor-pointer">
                        <div className="font-medium">Express leverans</div>
                        <div className="text-sm text-muted-foreground">1-2 arbetsdagar - 149 kr</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-secondary/50 cursor-pointer">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                        <div className="font-medium">Hämta i butik</div>
                        <div className="text-sm text-muted-foreground">Gratis</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-xl">Betalningsmetod</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentMethod: value }))}
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-secondary/50 cursor-pointer">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span>Kort (Visa, Mastercard)</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-secondary/50 cursor-pointer">
                      <RadioGroupItem value="swish" id="swish" />
                      <Label htmlFor="swish" className="flex-1 cursor-pointer flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        <span>Swish</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-secondary/50 cursor-pointer">
                      <RadioGroupItem value="invoice" id="invoice" />
                      <Label htmlFor="invoice" className="flex-1 cursor-pointer flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span>Faktura</span>
                      </Label>
                    </div>
                  </RadioGroup>

                  {formData.paymentMethod === 'card' && (
                    <div className="mt-4 space-y-4 pt-4 border-t">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Kortnummer</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className={errors.cardNumber ? 'border-destructive' : ''}
                        />
                        {errors.cardNumber && (
                          <p className="text-xs text-destructive">{errors.cardNumber}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Kortinnehavarens namn</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className={errors.cardName ? 'border-destructive' : ''}
                        />
                        {errors.cardName && (
                          <p className="text-xs text-destructive">{errors.cardName}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Utgångsdatum</Label>
                          <Input
                            id="expiryDate"
                            name="expiryDate"
                            placeholder="MM/ÅÅ"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            className={errors.expiryDate ? 'border-destructive' : ''}
                          />
                          {errors.expiryDate && (
                            <p className="text-xs text-destructive">{errors.expiryDate}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className={errors.cvv ? 'border-destructive' : ''}
                          />
                          {errors.cvv && (
                            <p className="text-xs text-destructive">{errors.cvv}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'swish' && (
                    <div className="mt-4 p-4 bg-secondary/50 rounded-md">
                      <p className="text-sm text-muted-foreground">
                        Du kommer att få ett Swish-meddelande när du slutför beställningen. 
                        Ange ditt telefonnummer i leveransinformationen ovan.
                      </p>
                    </div>
                  )}

                  {formData.paymentMethod === 'invoice' && (
                    <div className="mt-4 p-4 bg-secondary/50 rounded-md">
                      <p className="text-sm text-muted-foreground">
                        Faktura skickas till angiven e-postadress. Betalningsvillkor: 30 dagar.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button 
                type="submit" 
                className="w-full font-medium" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Bearbetar beställning...
                  </>
                ) : (
                  'Slutför Beställning'
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;

