import React from 'react';
import * as LucideIcons from 'lucide-react';
import { CheckCircle, Award, Code2, Lightbulb, Shield } from 'lucide-react';
import { useSkills } from '../lib/useSupabaseData';

const About: React.FC = () => {
  const { data: skills, loading } = useSkills();
  const values = [
    {
      icon: Code2,
      title: 'Excellence Technique',
      description: 'Code de qualité, bonnes pratiques et technologies modernes',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Solutions créatives adaptées à vos enjeux métier',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Shield,
      title: 'Accompagnement',
      description: 'Support continu et formation de vos équipes',
      color: 'from-green-500 to-teal-500',
    },
    {
      icon: Award,
      title: 'Qualité',
      description: 'Livraison dans les délais avec les plus hauts standards',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const stats = [
    { number: '8+', label: "Années d'expérience" },
    { number: '50+', label: 'Projets réalisés' },
    { number: '100%', label: 'Clients satisfaits' },
    { number: '24/7', label: 'Support technique' },
  ];

  return (
    <section id="about" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Votre{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Partenaire Digital
            </span>{' '}
            de Confiance
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Spécialisé dans la création de solutions digitales performantes qui
            transforment votre business
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          {/* Left Column - Photo */}
          <div className="relative group">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-gray-700/50 group-hover:border-cyan-500/50 transition-all duration-500">
              <img
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Leonce Ouattara at work"
                className="w-full h-96 lg:h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              {/* Floating stats */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="grid grid-cols-2 gap-4">
                  {stats.slice(0, 2).map((stat, index) => (
                    <div
                      key={index}
                      className="bg-black/70 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-4 text-center"
                    >
                      <div className="text-2xl font-bold text-cyan-400 mb-1">
                        {stat.number}
                      </div>
                      <div className="text-xs text-gray-300">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8">
            {/* Approach */}
            <div className="bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8 hover:bg-white/10 hover:border-cyan-500/40 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <CheckCircle className="text-cyan-400" size={28} />
                Mon Approche
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">
                      Analyse & Conseil
                    </h4>
                    <p className="text-gray-400">
                      Audit de vos besoins et recommandations techniques
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">
                      Développement
                    </h4>
                    <p className="text-gray-400">
                      Création de solutions robustes et évolutives
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">
                      Support & Évolution
                    </h4>
                    <p className="text-gray-400">
                      Maintenance et amélioration continue
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.slice(2).map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 text-center hover:bg-white/10 hover:border-purple-500/40 transition-all duration-300"
                >
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:bg-white/10 hover:border-cyan-500/50 transition-all duration-300 group hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/10"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`w-12 h-12 bg-gradient-to-r ${value.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <value.icon size={24} className="text-white" />
              </div>
              <h4 className="text-white font-semibold mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                {value.title}
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* Skills Section */}
        <div className="bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            Expertises Techniques
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {!loading && skills.map((skill, index) => {
              // Mapping des icônes selon les technologies
              const getSkillIcon = (skillName: string) => {
                if (
                  skillName.includes('React') ||
                  skillName.includes('TypeScript')
                )
                  return 'Code2';
                if (
                  skillName.includes('Node.js') ||
                  skillName.includes('Express')
                )
                  return 'Server';
                if (
                  skillName.includes('Python') ||
                  skillName.includes('Django')
                )
                  return 'Terminal';
                if (skillName.includes('Vue.js') || skillName.includes('Nuxt'))
                  return 'Layers';
                if (skillName.includes('PHP') || skillName.includes('Laravel'))
                  return 'Globe';
                if (skillName.includes('Database')) return 'Database';
                if (skillName.includes('Cloud')) return 'Cloud';
                if (skillName.includes('UX/UI') || skillName.includes('Design'))
                  return 'Palette';
                return 'Code2'; // Icône par défaut
              };

              const iconName = getSkillIcon(skill.name);
              const IconComponent =
                LucideIcons[iconName as keyof typeof LucideIcons] ||
                LucideIcons.Code2;

              return (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-300 group hover:scale-105 text-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                    <IconComponent size={24} className="text-white" />
                  </div>
                  <h4 className="text-white font-medium text-sm group-hover:text-cyan-400 transition-colors duration-300">
                    {skill.name}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
