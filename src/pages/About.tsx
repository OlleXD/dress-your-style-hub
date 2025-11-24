import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Leaf, Award, Users, Mail, MapPin, Phone } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Leaf,
      title: 'Hållbarhet',
      description: 'Vi arbetar aktivt för att minska vår miljöpåverkan genom etiska produktionsmetoder och hållbara materialval.',
    },
    {
      icon: Award,
      title: 'Kvalitet',
      description: 'Varje plagg är noggrant utvalt för att garantera exceptionell kvalitet och hållbarhet som varar i åratal.',
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'Vår passion för mode och design driver oss att skapa plagg som inspirerar och ger självförtroende.',
    },
    {
      icon: Users,
      title: 'Gemenskap',
      description: 'Vi bygger en gemenskap kring medvetet modeval och delar vår kunskap om hållbart mode.',
    },
  ];

  const team = [
    {
      name: 'Emma Andersson',
      role: 'Grundare & Creative Director',
      description: 'Med över 15 års erfarenhet inom modeindustrin har Emma en passionerad vision för hållbart mode.',
    },
    {
      name: 'Marcus Lindqvist',
      role: 'Head of Design',
      description: 'Marcus kombinerar skandinavisk minimalism med internationell design för att skapa tidlösa plagg.',
    },
    {
      name: 'Sofia Bergström',
      role: 'Sustainability Manager',
      description: 'Sofia säkerställer att våra produktionsmetoder är etiska och miljövänliga i varje steg.',
    },
  ];

  return (
    <div className="min-h-screen bg-background border-0">
      <Header />
      <main className="border-0">
        {/* Hero Section */}
        <section className="relative py-32 px-4 bg-gradient-to-b from-background to-secondary border-0">
          <div className="container mx-auto max-w-4xl text-center border-0">
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Om NORA
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light animate-slide-up">
              Vår vision är att skapa tidlöst mode som kombinerar skandinavisk elegans med hållbarhet
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 px-4 border-0">
          <div className="container mx-auto max-w-6xl border-0">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="font-display text-4xl md:text-5xl font-bold">
                  Vår Historia
                </h2>
                <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    NORA grundades 2020 i Stockholm med en vision om att revolutionera modeindustrin 
                    genom hållbarhet och kvalitet. Vi började som ett litet team med en stor dröm: att 
                    skapa plagg som inte bara ser bra ut, utan också gör gott för planeten.
                  </p>
                  <p>
                    Idag är vi stolta över att ha byggt en varumärkesidentitet som kombinerar 
                    skandinavisk minimalism med sofistikerad design. Varje plagg i vår kollektion 
                    är noggrant utvalt för att representera kvalitet, hållbarhet och elegans.
                  </p>
                  <p>
                    Vi tror på långsiktiga investeringar i din garderob - stycken som följer dig 
                    genom årstider och trender, alltid relevanta och alltid vackra.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-accent rounded-lg shadow-elegant" />
                <div className="absolute inset-4 bg-background rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="font-display text-3xl font-bold mb-2">2020</h3>
                    <p className="text-muted-foreground">Grundat i Stockholm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 px-4 bg-secondary border-0">
          <div className="container mx-auto max-w-6xl border-0">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Våra Värderingar
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Det som driver oss framåt och formar varje beslut vi tar
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card
                    key={index}
                    className="border-0 shadow-soft hover:shadow-elegant transition-all duration-500 text-center"
                  >
                    <CardHeader>
                      <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                        <Icon className="h-8 w-8 text-accent" />
                      </div>
                      <CardTitle className="font-display text-xl font-semibold">
                        {value.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 px-4 border-0">
          <div className="container mx-auto max-w-6xl border-0">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Vårt Team
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                De passionerade människorna bakom NORA
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-soft hover:shadow-elegant transition-all duration-500 text-center"
                >
                  <CardHeader>
                    <div className="mx-auto mb-4 w-24 h-24 rounded-full bg-gradient-accent flex items-center justify-center">
                      <span className="font-display text-3xl font-bold text-accent-foreground">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <CardTitle className="font-display text-xl font-semibold">
                      {member.name}
                    </CardTitle>
                    <p className="text-sm text-accent font-medium mt-1">
                      {member.role}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 px-4 bg-secondary border-0">
          <div className="container mx-auto max-w-4xl border-0">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Kontakta Oss
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Vi älskar att höra från dig. Tveka inte att kontakta oss om du har frågor eller feedback.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-soft text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                    <Mail className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="font-display text-lg font-semibold">
                    E-post
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    info@nora.se
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-soft text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                    <Phone className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="font-display text-lg font-semibold">
                    Telefon
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    +46 8 123 45 67
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-soft text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="font-display text-lg font-semibold">
                    Adress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Drottninggatan 12<br />
                    111 51 Stockholm
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
