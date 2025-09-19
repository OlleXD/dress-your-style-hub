import { Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    'Kundservice': [
      'Kontakta Oss',
      'Storleksguide',
      'Retur & Byten',
      'Frakt & Leverans',
      'FAQ'
    ],
    'Företag': [
      'Om NORA',
      'Karriär',
      'Hållbarhet',
      'Press',
      'Investerare'
    ],
    'Följ Oss': [
      'Instagram',
      'Facebook',
      'Twitter',
      'Newsletter',
      'Blogg'
    ]
  };

  return (
    <footer className="bg-primary text-primary-foreground py-16 px-4">
      <div className="container mx-auto">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h3 className="font-display text-2xl font-bold mb-4">NORA</h3>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              Tidlös elegans och hållbar mode för den moderna garderoben. 
              Upptäck vår kurerade kollektion av premiumplagg.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors duration-200">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors duration-200">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors duration-200">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-200 text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-primary-foreground/20 pt-8 mb-8">
          <div className="max-w-md">
            <h4 className="font-semibold mb-3">Prenumerera på vårt nyhetsbrev</h4>
            <p className="text-primary-foreground/80 text-sm mb-4">
              Få de senaste nyheterna om nya kollektioner och exklusiva erbjudanden.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Din e-postadress"
                className="flex-1 px-4 py-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded-md text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:border-accent"
              />
              <button className="px-6 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors duration-200 font-medium">
                Prenumerera
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-primary-foreground/80">
          <p>&copy; 2024 NORA. Alla rättigheter förbehållna.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary-foreground transition-colors duration-200">
              Integritetspolicy
            </a>
            <a href="#" className="hover:text-primary-foreground transition-colors duration-200">
              Användarvillkor
            </a>
            <a href="#" className="hover:text-primary-foreground transition-colors duration-200">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;