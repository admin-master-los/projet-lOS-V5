import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { useServices } from '../lib/useSupabaseData';

const Services: React.FC = () => {
  const { data: services, loading } = useServices();
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  const getIcon = (iconName: string) => {
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];
    return IconComponent || LucideIcons.Code2;
  };

  return (
    <section id="services" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Services &{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Expertises
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Solutions complètes pour digitaliser et optimiser votre activité
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!loading && services.map((service) => {
            const IconComponent = getIcon(service.icon);
            const isHovered = hoveredService === service.id;
            return (
              <div
                key={service.id}
                className="relative bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-500 cursor-pointer group hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/10 overflow-hidden"
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
              >
                {/* Background animation */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 transition-opacity duration-500 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-6">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center transition-all duration-500 ${
                        isHovered
                          ? 'scale-110 rotate-12 shadow-lg shadow-cyan-500/50'
                          : ''
                      }`}
                    >
                      <IconComponent
                        size={32}
                        className={`text-white transition-transform duration-300 ${
                          isHovered ? 'scale-110' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <h3
                    className={`text-xl font-bold mb-4 transition-colors duration-300 ${
                      isHovered ? 'text-cyan-400' : 'text-white'
                    }`}
                  >
                    {service.title}
                  </h3>
                  <p
                    className={`mb-6 leading-relaxed transition-colors duration-300 ${
                      isHovered ? 'text-gray-300' : 'text-gray-400'
                    }`}
                  >
                    {service.description}
                  </p>

                  {/* Features */}
                  <div
                    className={`space-y-3 transition-all duration-500 ${
                      isHovered ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden`}
                  >
                    <div className="border-t border-gray-600/50 pt-4">
                      {service.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 py-1"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse" />
                          <span className="text-gray-300 text-sm font-medium">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hover indicator */}
                  <div className="mt-6 flex items-center justify-center">
                    <div
                      className={`w-8 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-300 ${
                        isHovered ? 'w-16 opacity-100' : 'w-8 opacity-50'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-8">
            Besoin d'une solution personnalisée ? Discutons de votre projet
          </p>
          <button
            onClick={() =>
              document
                .querySelector('#contact')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-full hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 font-semibold text-lg hover:scale-105 inline-flex items-center gap-2 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2">
              <LucideIcons.MessageCircle size={20} />
              Demander un devis
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
