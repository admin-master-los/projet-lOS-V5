import React, { useState } from 'react';
import { 
  Search, 
  Lightbulb, 
  Code2, 
  Rocket,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const Process: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    {
      number: '01',
      title: 'Découverte & Analyse',
      description: 'Nous analysons en profondeur vos besoins, vos processus actuels et vos objectifs pour définir la solution idéale.',
      icon: Search,
      color: 'from-cyan-500 to-cyan-600',
      highlights: [
        'Audit des processus existants',
        'Identification des points de friction',
        'Définition des objectifs mesurables',
        'Établissement du cahier des charges'
      ]
    },
    {
      number: '02',
      title: 'Conception & Prototype',
      description: 'Notre équipe conçoit l\'architecture de votre solution et crée des prototypes interactifs pour validation.',
      icon: Lightbulb,
      color: 'from-purple-500 to-purple-600',
      highlights: [
        'Design UX/UI sur mesure',
        'Architecture technique robuste',
        'Prototypes interactifs',
        'Validation avec vos équipes'
      ]
    },
    {
      number: '03',
      title: 'Développement Agile',
      description: 'Nous développons votre solution en sprints itératifs avec des points de contrôle réguliers pour garantir la qualité.',
      icon: Code2,
      color: 'from-cyan-500 to-purple-500',
      highlights: [
        'Développement par sprints',
        'Tests continus et automatisés',
        'Revues régulières avec vous',
        'Documentation technique complète'
      ]
    },
    {
      number: '04',
      title: 'Déploiement & Support',
      description: 'Mise en production sécurisée, formation de vos équipes et accompagnement continu pour assurer votre succès.',
      icon: Rocket,
      color: 'from-purple-500 to-pink-500',
      highlights: [
        'Déploiement progressif sécurisé',
        'Formation des utilisateurs',
        'Support technique 24/7',
        'Maintenance et évolutions'
      ]
    }
  ];

  return (
    <section id="process" className="py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
            <span className="text-cyan-400 text-sm font-medium">Notre Méthodologie</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Comment Nous{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Travaillons
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Un processus éprouvé en 4 étapes pour transformer vos idées en solutions digitales performantes
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === index;
            
            return (
              <div
                key={index}
                onMouseEnter={() => setActiveStep(index)}
                onMouseLeave={() => setActiveStep(null)}
                className="relative group"
              >
                {/* Connection Line (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-8 h-0.5 bg-gradient-to-r from-cyan-500/30 to-transparent z-0" />
                )}

                {/* Step Card */}
                <div
                  className={`
                    relative bg-white/5 backdrop-blur-sm border rounded-2xl p-6
                    transition-all duration-500 ease-out
                    ${isActive 
                      ? 'border-cyan-500/50 bg-white/10 scale-105 shadow-lg shadow-cyan-500/20' 
                      : 'border-white/10 hover:border-cyan-500/30'
                    }
                  `}
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-cyan-400 font-bold text-lg">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className={`w-14 h-14 mb-6 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center transition-transform duration-300 ${isActive ? 'scale-110 rotate-6' : 'group-hover:scale-105'}`}>
                    <Icon size={28} className="text-white" />
                  </div>

                  {/* Title */}
                  <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${isActive ? 'text-cyan-400' : 'text-white'}`}>
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Highlights - Show on hover */}
                  <div
                    className={`
                      space-y-2 transition-all duration-500 overflow-hidden
                      ${isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                    `}
                  >
                    <div className="border-t border-white/10 pt-4 mt-4">
                      {step.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-2 mb-2">
                          <CheckCircle2 size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300 text-xs">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hover Arrow */}
                  <div
                    className={`
                      mt-4 flex items-center gap-2 text-cyan-400 text-sm font-medium
                      transition-all duration-300
                      ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
                    `}
                  >
                    En savoir plus
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-6 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
            <p className="text-gray-300">
              Prêt à démarrer votre projet ?
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
            >
              Discutons-en
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float-delayed" />

      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(-10px); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 6s ease-in-out infinite 1s;
        }
      `}</style>
    </section>
  );
};

export default Process;
