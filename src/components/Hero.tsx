import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-fashion.jpg';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="NORA Fashion Collection - Elegant contemporary designs"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/40 backdrop-blur-[0.5px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground mb-6 animate-fade-in">
          Tidlös
          <span className="block text-accent">Elegans</span>
        </h1>
        <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto font-light animate-slide-up">
          Upptäck vår kurerade kollektion av premium mode. Sofistikerade designer för den moderna garderoben.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
          <Button variant="default" size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-medium px-8">
            Shoppa Nu
          </Button>
          <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-medium px-8">
            Se Kollektionen
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/60 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary-foreground/60 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;