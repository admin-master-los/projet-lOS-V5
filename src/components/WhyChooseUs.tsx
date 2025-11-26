import React from 'react';
import { Shield, Target, Zap, Users } from 'lucide-react';

const WhyChooseUs: React.FC = () => {
  const reasons = [
    {
      number: '01',
      title: 'Expertise Sectorielle Pointue',
      description: 'Nous comprenons les spécificités du secteur financier en Afrique. Notre expérience avec les banques, assurances et institutions de microfinance nous permet de créer des solutions parfaitement adaptées à vos enjeux réglementaires et opérationnels.',
      color: 'text-cyan-500'
    },
    {
      number: '02',
      title: 'Solutions Sur Mesure & Sécurisées',
      description: 'Chaque institution financière est unique. Nous développons des solutions digitales personnalisées qui respectent les normes de sécurité les plus strictes (chiffrement, authentification multi-facteurs, conformité RGPD) tout en optimisant vos processus métiers.',
      color: 'text-blue-500'
    },
    {
      number: '03',
      title: 'Rapidité & Agilité d\'Exécution',
      description: 'Notre méthodologie agile éprouvée nous permet de livrer vos projets dans les délais convenus, avec des points de contrôle réguliers. Nous transformons vos idées en solutions opérationnelles rapidement, sans compromis sur la qualité.',
      color: 'text-purple-500'
    },
    {
      number: '04',
      title: 'Accompagnement Continu & Support Dédié',
      description: 'Nous ne vous laissons pas seul après le déploiement. Notre équipe reste à vos côtés avec un support technique 24/7, des formations pour vos équipes, et un accompagnement continu pour garantir le succès de votre transformation digitale.',
      color: 'text-cyan-500'
    }
  ];

  return (
    <section id="why-choose-us" className="py-20 relative overflow-hidden">
      {/* Background transparent - pas de fond */}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column - Content */}
          <div className="space-y-12">
            {/* Main Title */}
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-white">Pourquoi Choisir </span>
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Leonce Ouattara Studio
                </span>
                <span className="text-white"> ?</span>
              </h2>
            </div>

            {/* Reasons List */}
            <div className="space-y-12">
              {reasons.map((reason, index) => (
                <div key={index} className="group">
                  {/* Number & Title */}
                  <div className="flex items-start gap-4 mb-3">
                    <span className={`text-5xl md:text-6xl font-bold ${reason.color} leading-none`}>
                      {reason.number}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-white pt-2 group-hover:text-cyan-400 transition-colors duration-300">
                      {reason.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <div className="pl-20">
                    <p className="text-gray-400 text-lg leading-relaxed">
                      {reason.description}
                    </p>
                  </div>

                  {/* Separator line (except last item) */}
                  {index < reasons.length - 1 && (
                    <div className="mt-12 h-px bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - 3D Mockups */}
          <div className="hidden lg:block relative">
            {/* Main mockup container with perspective */}
            <div className="relative h-[800px] perspective-1000">
              
              {/* Mockup 1 - Front */}
              <div 
                className="absolute top-0 right-0 w-80 h-96 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-white/10 shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-500"
                style={{
                  transform: 'rotateY(-15deg) rotateX(5deg)',
                  zIndex: 3
                }}
              >
                {/* Browser chrome */}
                <div className="bg-gray-700 px-3 py-2 flex items-center gap-2 border-b border-white/10">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 bg-gray-600 rounded px-2 py-0.5 text-xs text-gray-300">
                    app.banque.com
                  </div>
                </div>
                
                {/* Content preview */}
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded w-3/4"></div>
                  <div className="h-2 bg-white/10 rounded w-full"></div>
                  <div className="h-2 bg-white/10 rounded w-5/6"></div>
                  <div className="h-32 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg mt-4"></div>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="h-16 bg-white/5 rounded"></div>
                    <div className="h-16 bg-white/5 rounded"></div>
                    <div className="h-16 bg-white/5 rounded"></div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/50 animate-float">
                  <Shield className="text-white" size={28} />
                </div>
              </div>

              {/* Mockup 2 - Middle */}
              <div 
                className="absolute top-32 right-32 w-72 h-80 bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl border border-white/10 shadow-xl overflow-hidden"
                style={{
                  transform: 'rotateY(-20deg) rotateX(10deg)',
                  zIndex: 2
                }}
              >
                {/* Browser chrome */}
                <div className="bg-blue-700 px-3 py-2 flex items-center gap-2 border-b border-white/10">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  </div>
                </div>
                
                {/* Content preview */}
                <div className="p-4 space-y-2">
                  <div className="h-2 bg-white/10 rounded w-2/3"></div>
                  <div className="h-2 bg-white/10 rounded w-full"></div>
                  <div className="h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg mt-3"></div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="h-12 bg-white/5 rounded"></div>
                    <div className="h-12 bg-white/5 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Mockup 3 - Back */}
              <div 
                className="absolute top-64 right-8 w-64 h-72 bg-gradient-to-br from-purple-900 to-purple-800 rounded-2xl border border-white/10 shadow-lg overflow-hidden"
                style={{
                  transform: 'rotateY(-25deg) rotateX(15deg)',
                  zIndex: 1
                }}
              >
                {/* Browser chrome */}
                <div className="bg-purple-700 px-3 py-2 flex items-center gap-2 border-b border-white/10">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                  </div>
                </div>
                
                {/* Content preview */}
                <div className="p-3 space-y-2">
                  <div className="h-2 bg-white/10 rounded w-1/2"></div>
                  <div className="h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg mt-2"></div>
                  <div className="space-y-1 mt-2">
                    <div className="h-1.5 bg-white/5 rounded"></div>
                    <div className="h-1.5 bg-white/5 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute top-20 left-0 w-20 h-20 bg-cyan-500/10 rounded-full blur-2xl animate-float-delayed"></div>
              <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite 0.5s;
        }
      `}</style>
    </section>
  );
};

export default WhyChooseUs;
