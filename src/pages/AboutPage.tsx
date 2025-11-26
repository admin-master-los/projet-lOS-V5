import React from 'react';
import { 
  Target, 
  Eye, 
  Award, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  Code2,
  Lightbulb,
  Clock,
  Headphones,
  Lock
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutPage: React.FC = () => {
  const values = [
    {
      icon: Award,
      title: 'Excellence',
      description: 'Nous visons l\'excellence dans chaque projet, en livrant des solutions de qualité supérieure qui dépassent les attentes de nos clients.',
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      icon: Shield,
      title: 'Sécurité',
      description: 'La sécurité des données est notre priorité absolue. Toutes nos solutions respectent les standards les plus stricts du secteur financier.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Nous adoptons les technologies les plus récentes pour créer des solutions innovantes qui transforment les processus métiers.',
      color: 'from-cyan-500 to-purple-500'
    },
    {
      icon: Users,
      title: 'Partenariat',
      description: 'Nous travaillons main dans la main avec nos clients, en établissant des relations durables basées sur la confiance et la transparence.',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const methodology = [
    {
      number: '01',
      title: 'Analyse & Diagnostic',
      description: 'Audit complet de vos processus actuels, identification des points de friction et recommandations stratégiques.',
      deliverables: ['Rapport d\'audit', 'Cartographie des processus', 'Cahier des charges']
    },
    {
      number: '02',
      title: 'Conception & Prototype',
      description: 'Design des interfaces utilisateur, architecture technique et création de prototypes interactifs pour validation.',
      deliverables: ['Maquettes UX/UI', 'Architecture technique', 'Prototype fonctionnel']
    },
    {
      number: '03',
      title: 'Développement',
      description: 'Développement agile avec sprints réguliers, tests continus et déploiement progressif pour minimiser les risques.',
      deliverables: ['Code source', 'Documentation technique', 'Tests unitaires']
    },
    {
      number: '04',
      title: 'Déploiement & Formation',
      description: 'Mise en production sécurisée, formation des équipes et accompagnement post-lancement pour garantir l\'adoption.',
      deliverables: ['Déploiement production', 'Formation utilisateurs', 'Support 24/7']
    }
  ];

  const expertise = [
    {
      icon: Briefcase,
      title: 'Banques',
      items: ['Gestion des comptes', 'Crédit & épargne', 'Mobile banking', 'Back-office']
    },
    {
      icon: Shield,
      title: 'Assurances',
      items: ['Souscription digitale', 'Gestion sinistres', 'Portail clients', 'Reporting']
    },
    {
      icon: TrendingUp,
      title: 'Microfinance',
      items: ['Scoring crédit', 'Gestion portefeuille', 'Recouvrement', 'Analytics']
    }
  ];

  const differentiators = [
    {
      icon: Clock,
      title: 'Rapidité d\'Exécution',
      description: 'Nous livrons vos projets dans les délais convenus grâce à notre méthodologie agile éprouvée et notre expertise technique pointue.',
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      icon: Shield,
      title: 'Sécurité Maximale',
      description: 'Conformité totale aux normes du secteur financier avec chiffrement, authentification multi-facteurs et audits de sécurité réguliers.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Headphones,
      title: 'Support Dédié',
      description: 'Une équipe dédiée disponible pour vous accompagner avant, pendant et après le déploiement de votre solution digitale.',
      color: 'from-cyan-500 to-purple-500'
    },
    {
      icon: Lock,
      title: 'Confidentialité Garantie',
      description: 'Vos données et processus restent strictement confidentiels. Nous signons des accords de non-divulgation stricts avec tous nos clients.',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <>
      {/* Header */}
      <Header />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-[#0a1628] to-gray-900">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
            <span className="text-cyan-400 text-sm font-medium">À Propos de Nous</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Leonce Ouattara Studio
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
            Votre partenaire de confiance pour la transformation digitale du secteur financier en Afrique
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="#contact" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
            >
              Demander un Devis
              <ArrowRight size={20} />
            </a>
            <a 
              href="#methodology" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              Notre Approche
            </a>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 rounded-3xl p-8 lg:p-12 hover:border-cyan-500/40 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6">
                <Target size={32} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Notre Mission</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Digitaliser les processus des institutions financières africaines pour leur permettre d'atteindre l'<span className="text-cyan-400 font-semibold">opération zéro papier</span> et d'améliorer significativement leur efficacité opérationnelle.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Nous croyons que la technologie doit être au service de l'inclusion financière et de la croissance économique en Afrique.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-3xl p-8 lg:p-12 hover:border-purple-500/40 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Eye size={32} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Notre Vision</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Devenir le <span className="text-purple-400 font-semibold">partenaire technologique de référence</span> pour les institutions financières en Afrique de l'Ouest, reconnu pour l'excellence de nos solutions et la qualité de notre accompagnement.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                D'ici 2027, équiper plus de 100 institutions financières avec nos solutions digitales innovantes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Differentiators Section - Ce Qui Nous Différencie */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5 border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ce Qui Nous Différencie
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Des avantages concrets qui font de nous le partenaire idéal pour votre transformation digitale
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {differentiators.map((diff, index) => (
              <div 
                key={index}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 group text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${diff.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <diff.icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300">
                  {diff.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {diff.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Notre Expertise Sectorielle
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Une connaissance approfondie des enjeux spécifiques à chaque segment du secteur financier
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {expertise.map((sector, index) => (
              <div 
                key={index}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <sector.icon size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300">
                  {sector.title}
                </h3>
                <ul className="space-y-3">
                  {sector.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-300">
                      <CheckCircle2 size={18} className="text-cyan-400 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="methodology" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cyan-500/5 to-purple-500/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Notre Méthodologie Éprouvée
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Un processus structuré en 4 phases pour garantir le succès de votre transformation digitale
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {methodology.map((phase, index) => (
              <div 
                key={index}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">{phase.number}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3">{phase.title}</h3>
                    <p className="text-gray-300 mb-4 leading-relaxed">{phase.description}</p>
                    <div className="space-y-2">
                      <p className="text-sm text-cyan-400 font-semibold mb-2">Livrables :</p>
                      {phase.deliverables.map((deliverable, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                          <span>{deliverable}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Nos Valeurs Fondamentales
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Les principes qui guident chacune de nos actions et décisions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 group text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5 border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Technologies & Compétences
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Un stack technologique moderne pour des solutions performantes et évolutives
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 rounded-3xl p-8">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-6">
                <Code2 size={24} className="text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Frontend</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Next.js', 'Vue.js', 'Tailwind CSS'].map((tech, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-3xl p-8">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                <Shield size={24} className="text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Backend</h3>
              <div className="flex flex-wrap gap-2">
                {['Node.js', 'Python', 'PHP', 'PostgreSQL', 'MongoDB'].map((tech, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-3xl p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                <Lightbulb size={24} className="text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Autres</h3>
              <div className="flex flex-wrap gap-2">
                {['Docker', 'AWS', 'Git', 'CI/CD', 'Agile'].map((tech, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-3xl p-12 text-center relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Prêt à Digitaliser Vos Processus ?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Discutons de votre projet et découvrez comment nous pouvons vous accompagner dans votre transformation digitale
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="#contact" 
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
                >
                  Demander un Devis Gratuit
                  <ArrowRight size={20} />
                </a>
                <a 
                  href="tel:+2250000000000" 
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  Nous Appeler
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    
    {/* Footer */}
    <Footer />
  </>
  );
};

export default AboutPage;
