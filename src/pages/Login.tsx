import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  
  const { login, register } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (!email || !password) {
        setError('Vänligen fyll i alla fält');
        return;
      }
      login(email, password);
      navigate('/');
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
      navigate('/');
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
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-3xl">
              {isLogin ? 'Logga In' : 'Registrera Dig'}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? 'Logga in på ditt konto för att fortsätta'
                : 'Skapa ett nytt konto för att börja handla'}
            </CardDescription>
          </CardHeader>
          <CardContent>
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
            <div className="text-center text-sm mt-4">
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
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Login;






