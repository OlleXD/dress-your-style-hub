import { useState } from 'react';
import { Share2, Copy, Mail, Check } from 'lucide-react';
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
import { useApp } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';

const ShareWishlist = () => {
  const { favorites } = useApp();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);

  const generateShareLink = () => {
    const baseUrl = window.location.origin;
    const favoriteIds = favorites.map(f => `${f.productId}${f.selectedSize ? `-${f.selectedSize}` : ''}${f.selectedColor ? `-${f.selectedColor}` : ''}`).join(',');
    return `${baseUrl}/shared-wishlist?items=${encodeURIComponent(favoriteIds)}`;
  };

  const shareLink = generateShareLink();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    toast({
      title: 'Länk kopierad!',
      description: 'Länken har kopierats till urklipp.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailShare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        title: 'Ogiltig e-post',
        description: 'Vänligen ange en giltig e-postadress.',
        variant: 'destructive',
      });
      return;
    }

    const subject = encodeURIComponent('Min önskelista från Nora');
    const body = encodeURIComponent(`Hej!\n\nJag vill dela min önskelista med dig:\n\n${shareLink}\n\nHälsningar`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setOpen(false);
    toast({
      title: 'E-post öppnad',
      description: 'Din e-postklient har öppnats.',
    });
  };

  if (favorites.length === 0) {
    return null;
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="w-full sm:w-auto"
      >
        <Share2 className="mr-2 h-4 w-4" />
        Dela Önskelista
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Dela din önskelista</DialogTitle>
            <DialogDescription>
              Dela din önskelista med vänner och familj
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Dela via länk</Label>
              <div className="flex gap-2">
                <Input
                  value={shareLink}
                  readOnly
                  className="flex-1 font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Skicka via e-post</Label>
              <form onSubmit={handleEmailShare} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="mottagare@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" variant="outline" size="icon">
                  <Mail className="h-4 w-4" />
                </Button>
              </form>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Min önskelista från Nora',
                      text: 'Kolla in min önskelista!',
                      url: shareLink,
                    });
                  }
                }}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Dela (Native)
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShareWishlist;





