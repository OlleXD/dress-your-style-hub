import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';

const News = () => {
  const newsItems = [
    {
      id: 1,
      title: 'Vår Höstkollektion 2024 är här',
      date: '15 september 2024',
      excerpt: 'Upptäck vår senaste kollektion med fokus på hållbarhet och tidlös design. Varje plagg är noggrant utvalt för att skapa en garderob som varar.',
      category: 'Kollektion',
      image: 'bg-gradient-to-br from-primary/20 to-accent/20',
    },
    {
      id: 2,
      title: 'Modeveckan Stockholm: Vårt deltagande',
      date: '8 september 2024',
      excerpt: 'Vi är stolta över att ha deltagit i Modeveckan Stockholm och presenterat vår vision om hållbart mode för framtiden.',
      category: 'Event',
      image: 'bg-gradient-to-br from-accent/20 to-primary/20',
    },
    {
      id: 3,
      title: '5 Tips för att bygga en hållbar garderob',
      date: '1 september 2024',
      excerpt: 'Lär dig hur du skapar en garderob som är både stilren och miljövänlig. Vi delar våra bästa tips för medvetet modeval.',
      category: 'Tips',
      image: 'bg-gradient-to-br from-secondary to-accent/10',
    },
    {
      id: 4,
      title: 'Nya samarbeten med lokala designers',
      date: '25 augusti 2024',
      excerpt: 'Vi samarbetar nu med tre lovande svenska designers för att skapa exklusiva plagg som kombinerar tradition med modernitet.',
      category: 'Samarbete',
      image: 'bg-gradient-to-br from-primary/10 to-secondary',
    },
    {
      id: 5,
      title: 'Vinterkollektionen: Förhandsvisning',
      date: '18 augusti 2024',
      excerpt: 'Få en förhandsvisning av vår kommande vinterkollektion. Eleganta plagg designade för den nordiska vintern.',
      category: 'Kollektion',
      image: 'bg-gradient-to-br from-accent/10 to-primary/20',
    },
    {
      id: 6,
      title: 'Hållbarhet i fokus: Vårt åtagande',
      date: '10 augusti 2024',
      excerpt: 'Läs mer om vårt åtagande för hållbarhet och hur vi arbetar för att minska vår miljöpåverkan i varje steg.',
      category: 'Hållbarhet',
      image: 'bg-gradient-to-br from-secondary to-accent/20',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-32 px-4 bg-gradient-to-b from-background to-secondary">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Nyheter
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light animate-slide-up">
              Håll dig uppdaterad med våra senaste kollektioner, events och modeinsights
            </p>
          </div>
        </section>

        {/* News Grid */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsItems.map((item) => (
                <Card
                  key={item.id}
                  className="group overflow-hidden border-0 shadow-soft hover:shadow-elegant transition-all duration-500 flex flex-col"
                >
                  <div className={`h-48 ${item.image} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />
                  </div>
                  <CardHeader className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Calendar className="h-3 w-3" />
                      <span>{item.date}</span>
                    </div>
                    <div className="mb-2">
                      <span className="text-xs font-medium text-accent uppercase tracking-wide">
                        {item.category}
                      </span>
                    </div>
                    <CardTitle className="font-display text-xl font-semibold mb-2 group-hover:text-accent transition-colors duration-200">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {item.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="ghost"
                      className="w-full group-hover:text-accent transition-colors duration-200"
                    >
                      Läs mer
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-24 px-4 bg-secondary">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Prenumerera på vårt nyhetsbrev
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Få exklusiva erbjudanden, förhandsvisningar av nya kollektioner och modeinsights direkt i din inkorg
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Din e-postadress"
                className="flex-1 px-4 py-3 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button className="font-medium px-8">
                Prenumerera
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default News;
