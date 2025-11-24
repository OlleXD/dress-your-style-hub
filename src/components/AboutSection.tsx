const AboutSection = () => {
  return (
    <section id="about" className="py-24 px-4 bg-secondary">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Content */}
          <div className="space-y-6">
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              Vår Historia
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                NORA grundades med en vision om att skapa tidlös mode som kombinerar 
                skandinavisk minimalism med sofistikerad design. Varje plagg är noggrant 
                utvalt för att representera kvalitet, hållbarhet och elegans.
              </p>
              <p>
                Vi tror på långsiktiga investeringar i din garderob - stycken som 
                följer dig genom årstider och trender, alltid relevanta och alltid 
                vackra.
              </p>
            </div>
            
            {/* Values */}
            <div className="grid sm:grid-cols-3 gap-6 pt-8">
              <div className="text-center sm:text-left">
                <h3 className="font-display text-xl font-semibold mb-2">
                  Hållbarhet
                </h3>
                <p className="text-sm text-muted-foreground">
                  Miljömedvetna val i varje steg av produktionen
                </p>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-display text-xl font-semibold mb-2">
                  Kvalitet
                </h3>
                <p className="text-sm text-muted-foreground">
                  Premiummaterial och exceptionellt hantverk
                </p>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-display text-xl font-semibold mb-2">
                  Design
                </h3>
                <p className="text-sm text-muted-foreground">
                  Tidlös estetik med moderna detaljer
                </p>
              </div>
            </div>
          </div>

          {/* Image/Visual Element */}
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
  );
};

export default AboutSection;