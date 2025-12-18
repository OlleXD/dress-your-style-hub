import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const NewsletterModal = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if user has seen newsletter modal before
    const hasSeenNewsletter = localStorage.getItem('hasSeenNewsletter');
    if (!hasSeenNewsletter) {
      // Show after 2 seconds
      setTimeout(() => {
        setOpen(true);
      }, 2000);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        title: 'Ogiltig e-post',
        description: 'Vänligen ange en giltig e-postadress.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    localStorage.setItem('hasSeenNewsletter', 'true');
    localStorage.setItem('newsletterEmail', email);
    
    toast({
      title: 'Tack!',
      description: 'Du är nu prenumerant på vårt nyhetsbrev.',
    });
    
    setIsSubmitting(false);
    setOpen(false);
  };

  const handleClose = () => {
    localStorage.setItem('hasSeenNewsletter', 'true');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Gå inte miste om våra erbjudanden!
          </DialogTitle>
          <DialogDescription>
            Prenumerera på vårt nyhetsbrev och få 10% rabatt på ditt första köp plus exklusiva erbjudanden direkt i din inkorg.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="newsletter-email">E-postadress</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="newsletter-email"
                type="email"
                placeholder="din@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
            >
              Nej tack
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registrerar...' : 'Prenumerera'}
            </Button>
          </div>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Genom att prenumerera godkänner du vår integritetspolicy. Du kan avbryta prenumerationen när som helst.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterModal;





