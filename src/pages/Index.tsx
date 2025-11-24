import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import NewsletterModal from '@/components/NewsletterModal';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <FeaturedProducts />
        <AboutSection />
      </main>
      <Footer />
      <NewsletterModal />
    </div>
  );
};

export default Index;