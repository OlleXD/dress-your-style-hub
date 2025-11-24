import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { allProducts, ProductData } from '@/data/products';
import { toast } from '@/hooks/use-toast';
import { X, Tag } from 'lucide-react';

interface DiscountCodeProps {
  onApplyDiscount: (code: string, discount: number) => void;
  appliedCode: string | null;
}

const DiscountCodeInput = ({ onApplyDiscount, appliedCode }: DiscountCodeProps) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  // Valid discount codes
  const discountCodes: Record<string, number> = {
    'WELCOME10': 10,
    'SUMMER20': 20,
    'SAVE15': 15,
    'NEW25': 25,
  };

  const handleApply = () => {
    const upperCode = code.toUpperCase().trim();
    if (discountCodes[upperCode]) {
      onApplyDiscount(upperCode, discountCodes[upperCode]);
      setCode('');
      setError('');
      toast({
        title: 'Rabattkod tillämpad!',
        description: `Du får ${discountCodes[upperCode]}% rabatt på din beställning.`,
      });
    } else {
      setError('Ogiltig rabattkod');
      toast({
        title: 'Ogiltig rabattkod',
        description: 'Koden du angav är inte giltig.',
        variant: 'destructive',
      });
    }
  };

  const handleRemove = () => {
    onApplyDiscount('', 0);
    setCode('');
    setError('');
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="discount-code">Rabattkod</Label>
      {appliedCode ? (
        <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
          <Tag className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-700 dark:text-green-400">
            {appliedCode} tillämpad
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="ml-auto h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            id="discount-code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError('');
            }}
            placeholder="Ange rabattkod"
            className={error ? 'border-destructive' : ''}
            onKeyPress={(e) => e.key === 'Enter' && handleApply()}
          />
          <Button type="button" onClick={handleApply} variant="outline">
            Använd
          </Button>
        </div>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default DiscountCodeInput;





