import React from 'react';
import { Github, Linkedin, Mail, Phone, MapPin, Shield } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-black/50 border-t border-gray-800/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Description */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Leonce Ouattara Studio
              </h3>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Expert IT spécialisé dans le développement de solutions
                digitales sur mesure. Je transforme vos idées en applications
                performantes et évolutives.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail size={16} />
                <span>contact@leonce-ouattara.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone size={16} />
                <span>+225 07 XX XX XX XX</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin size={16} />
                <span>Abidjan, Côte d'Ivoire</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 border border-gray-700/50 rounded-full flex items-center justify-center hover:border-cyan-500/50 hover:bg-cyan-500/20 transition-all duration-300 group"
              >
                <Github
                  size={18}
                  className="text-gray-400 group-hover:text-cyan-400"
                />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 border border-gray-700/50 rounded-full flex items-center justify-center hover:border-cyan-500/50 hover:bg-cyan-500/20 transition-all duration-300 group"
              >
                <Linkedin
                  size={18}
                  className="text-gray-400 group-hover:text-cyan-400"
                />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-3">
              {[
                { label: 'Accueil', href: '#home' },
                { label: 'À Propos', href: '#about' },
                { label: 'Services', href: '#services' },
                { label: 'Secteurs', href: '#sectors' },
                { label: 'Projets', href: '#portfolio' },
                { label: 'Blog', href: '#blog' },
                { label: 'Contact', href: '#contact' },
              ].map((item) => (
                <li key={item.href}>
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              {[
                'Développement Web',
                'Applications Métier',
                'Stratégie Digitale',
                'UX/UI Design',
                'Architecture Cloud',
                'Consulting IT',
              ].map((service) => (
                <li key={service}>
                  <span className="text-gray-400">{service}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>
                © {currentYear} Leonce Ouattara Studio. Tous droits réservés.
              </span>
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-green-400" />
                <span>Site éco-conçu</span>
              </div>
            </div>

            <div className="flex gap-6 text-sm">
              {['Mentions légales', 'Confidentialité', 'CGV', 'RGPD'].map(
                (link) => (
                  <button
                    key={link}
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                  >
                    {link}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
