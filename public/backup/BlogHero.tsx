import React from 'react';
import { FileText, TrendingUp, Users } from 'lucide-react';

/**
 * Composant BlogHero - Hero section pour la page blog
 */

interface BlogHeroProps {
  totalArticles: number;
  totalViews: number;
}

const BlogHero: React.FC<BlogHeroProps> = ({ totalArticles, totalViews }) => {
  return (
    <div className="relative py-20 px-6 text-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10"></div>
      
      {/* Cercles décoratifs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

      {/* Contenu */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-full text-sm text-gray-300 mb-6">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          Blog Tech & Dev
        </div>

        {/* Titre */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
          Articles & Tutoriels
        </h1>

        {/* Description */}
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Découvrez mes derniers articles sur le développement web, l'IA, 
          le DevOps et bien plus encore. Partagez mon parcours tech !
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          <div className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <FileText className="text-cyan-400" size={20} />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-white">{totalArticles}</div>
              <div className="text-xs text-gray-400">Articles</div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <TrendingUp className="text-purple-400" size={20} />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-white">
                {totalViews.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">Vues totales</div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl">
            <div className="p-2 bg-pink-500/20 rounded-lg">
              <Users className="text-pink-400" size={20} />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-white">+1k</div>
              <div className="text-xs text-gray-400">Lecteurs/mois</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogHero;
