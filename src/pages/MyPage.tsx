import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/contexts/AppContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { User, Mail, Package, ArrowLeft } from 'lucide-react';

const MyPage = () => {
  const { user, isAuthenticated, logout } = useApp();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-24">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Logga in krävs</CardTitle>
              <CardDescription>Du måste logga in för att se din sida</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => navigate('/login')} className="w-full">
                Logga In
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} className="w-full">
                Tillbaka
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
      <main className="container mx-auto px-4 py-24 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tillbaka
          </Button>
          <h1 className="font-display text-4xl font-bold mb-2">Min sida</h1>
          <p className="text-muted-foreground">Hantera ditt konto och beställningar</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-xl flex items-center gap-2">
                <User className="h-5 w-5" />
                Kontoinformation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Namn</p>
                <p className="font-medium">{user?.name}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  E-post
                </p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-xl flex items-center gap-2">
                <Package className="h-5 w-5" />
                Beställningar
              </CardTitle>
              <CardDescription>Dina tidigare beställningar</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center py-8">
                Du har inga beställningar ännu
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 space-y-6">
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-xl">Kontoinställningar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full sm:w-auto">
                Ändra lösenord
              </Button>
              <Separator />
              <Button
                variant="destructive"
                onClick={logout}
                className="w-full sm:w-auto"
              >
                Logga ut
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyPage;


