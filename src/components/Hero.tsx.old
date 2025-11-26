import React, { useState, useEffect } from 'react';
import { ArrowDown, Download, MessageCircle } from 'lucide-react';

const Hero: React.FC = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = 'Intégrateur-développeur, Spécialiste web et IT';

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            {/* Title */}
            <div className="mb-8">
              {/* Title occupying full column width */}
              <h1 className="w-full font-bold text-white leading-tight mb-6">
                <span
                  className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x"
                  style={{
                    fontSize: 'clamp(3rem, 8vw, 6rem)',
                    lineHeight: '1.1',
                  }}
                >
                  Leonce Ouattara
                </span>
                <br />
                <span
                  className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x font-light block w-full"
                  style={{
                    fontSize: 'clamp(4rem, 12vw, 10rem)',
                    lineHeight: '1.1',
                    animationDelay: '0.5s',
                    letterSpacing: '0.1em',
                  }}
                >
                  STUDIO
                </span>
              </h1>
            </div>
          </div>

          {/* Right Column - Photo */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative group">
              <div className="w-80 h-96 md:w-96 md:h-[500px] relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-md border border-cyan-500/30 group-hover:border-cyan-400/50 transition-all duration-500 group-hover:bg-white/20">
                <img
                  src="https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Leonce Ouattara - Expert IT"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse rounded-3xl" />

              {/* Floating elements */}
              <div
                className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: '0s' }}
              />
              <div
                className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full animate-bounce"
                style={{ animationDelay: '1s' }}
              />
            </div>
          </div>
        </div>

        {/* Speech Below - Full Width */}
        <div className="text-center">
          {/* Typewriter Speech - Large and Prominent */}
          <div className="mb-12">
            <div className="text-2xl md:text-3xl lg:text-4xl text-gray-300 mb-6 h-12 flex items-center justify-center font-light">
              <span className="font-mono">{typedText}</span>
              <span className="animate-blink text-cyan-400 ml-2">|</span>
            </div>
          </div>

          {/* Pitch */}
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
            Je transforme vos{' '}
            <span className="text-cyan-400 font-semibold">défis business</span>{' '}
            en
            <span className="text-purple-400 font-semibold">
              {' '}
              solutions digitales performantes
            </span>{' '}
            pour accélérer votre croissance
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={() => scrollToSection('#portfolio')}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-full hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 font-semibold text-lg hover:scale-105 flex items-center gap-2 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-2">
                <Download size={20} />
                Découvrir mes projets
              </span>
            </button>
            <button
              onClick={() => scrollToSection('#contact')}
              className="border-2 border-cyan-400 text-cyan-400 px-8 py-4 rounded-full hover:bg-cyan-400 hover:text-black transition-all duration-300 font-semibold text-lg hover:scale-105 flex items-center gap-2 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              <span className="relative z-10 flex items-center gap-2 group-hover:text-black">
                <MessageCircle size={20} />
                Consultation gratuite
              </span>
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce cursor-pointer">
            <button
              onClick={() => scrollToSection('#about')}
              className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 p-2 rounded-full hover:bg-white/5"
            >
              <ArrowDown size={32} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
