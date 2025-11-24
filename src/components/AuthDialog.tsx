import { useState } from 'react';
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

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  
  const { login, register } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (!email || !password) {
        setError('Vänligen fyll i alla fält');
        return;
      }
      login(email, password);
      onOpenChange(false);
      setEmail('');
      setPassword('');
    } else {
      if (!email || !password || !name) {
        setError('Vänligen fyll i alla fält');
        return;
      }
      if (password.length < 6) {
        setError('Lösenordet måste vara minst 6 tecken');
        return;
      }
      register(email, password, name);
      onOpenChange(false);
      setEmail('');
      setPassword('');
      setName('');
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {isLogin ? 'Logga In' : 'Registrera Dig'}
          </DialogTitle>
          <DialogDescription>
            {isLogin
              ? 'Logga in på ditt konto för att fortsätta'
              : 'Skapa ett nytt konto för att börja handla'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Namn</Label>
              <Input
                id="name"
                type="text"
                placeholder="Ditt namn"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="font-body"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">E-post</Label>
            <Input
              id="email"
              type="email"
              placeholder="din@epost.se"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="font-body"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Lösenord</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="font-body"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button type="submit" className="w-full font-medium">
            {isLogin ? 'Logga In' : 'Registrera'}
          </Button>
        </form>
        <div className="text-center text-sm">
          <button
            type="button"
            onClick={switchMode}
            className="text-accent hover:underline font-medium"
          >
            {isLogin
              ? 'Har du inget konto? Registrera dig'
              : 'Har du redan ett konto? Logga in'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;






