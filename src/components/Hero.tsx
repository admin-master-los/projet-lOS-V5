import React from 'react';
import { ArrowRight, Star, Award, TrendingUp } from 'lucide-react';

const Hero: React.FC = () => {
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
      {/* Subtle gradient overlay on black */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2 backdrop-blur-sm">
              <TrendingUp size={16} className="text-cyan-400" />
              <span className="text-sm text-cyan-400 font-medium">Solutions Digitales sur Mesure</span>
            </div>

            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-white font-bold leading-[0.9] tracking-tight">
                <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                  NOUS
                </span>
                <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  DIGITALISONS
                </span>
                <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                  VOS PROCESSUS
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 font-light max-w-xl">
              Opération zéro papier, Zéro suspend
            </p>

            {/* Target Audience */}
            <div className="flex flex-wrap items-center gap-3 text-gray-400">
              <span className="text-sm font-medium">Spécialisés pour :</span>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white/5 rounded-full text-sm border border-cyan-500/20 text-cyan-400">
                  Banques
                </span>
                <span className="px-3 py-1 bg-white/5 rounded-full text-sm border border-purple-500/20 text-purple-400">
                  Assurances
                </span>
                <span className="px-3 py-1 bg-white/5 rounded-full text-sm border border-cyan-500/20 text-cyan-400">
                  Microfinance
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => scrollToSection('#contact')}
                className="group bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-lg hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-2 hover:scale-105"
              >
                Demander un devis
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => scrollToSection('#portfolio')}
                className="group border-2 border-white/20 text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                Nos réalisations
              </button>
            </div>

            {/* Credibility Badges */}
            <div className="flex flex-col sm:flex-row gap-6 pt-8 border-t border-white/10">
              {/* Badge 1 - Experience */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Award className="text-white" size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">+10 ans d'expertise</p>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px bg-white/10" />

              {/* Badge 2 - Projects */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">50+</p>
                  <p className="text-xs text-gray-400">Projets réussis</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Enhanced 3D Mockups like DigitalSilk */}
          <div className="relative hidden lg:block h-[700px]">
            
            {/* Back Screen - Left (More angled) */}
            <div 
              className="absolute top-1/2 left-0 w-[400px] h-[500px] rounded-xl overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.8)] border border-white/10 opacity-70 transition-all duration-700 hover:opacity-90 hover:scale-[1.02]"
              style={{
                transform: 'translateY(-50%) perspective(1200px) rotateY(25deg) rotateX(5deg)',
                zIndex: 1,
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <div className="flex-1 h-6 bg-white/5 rounded ml-2" />
                </div>
                
                {/* Content */}
                <div className="space-y-4">
                  <div className="h-10 bg-gradient-to-r from-cyan-500/30 to-transparent rounded animate-pulse" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-24 bg-white/5 rounded" />
                    <div className="h-24 bg-white/5 rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-16 bg-white/5 rounded" />
                    <div className="h-16 bg-white/5 rounded" />
                    <div className="h-16 bg-white/5 rounded" />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Screen - Center (Like DigitalSilk focal point) */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[600px] rounded-2xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)] border-[3px] border-white/20 transition-all duration-700 hover:scale-[1.03] hover:shadow-[0_50px_100px_-20px_rgba(6,182,212,0.3)]"
              style={{
                transform: 'translate(-50%, -50%) perspective(1200px) rotateY(-5deg) rotateX(2deg)',
                zIndex: 3,
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                {/* Enhanced browser chrome with glow */}
                <div className="bg-gradient-to-b from-gray-800/90 to-gray-800/70 px-4 py-3 backdrop-blur-sm border-b border-cyan-500/20">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
                    <div className="flex-1 h-7 bg-white/5 rounded-lg ml-3 flex items-center px-3">
                      <div className="w-3 h-3 bg-cyan-400/50 rounded-full mr-2" />
                      <div className="h-3 bg-white/10 rounded w-2/3" />
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  {/* Dashboard Header with glow effect */}
                  <div className="mb-8">
                    <h3 className="text-white font-bold text-2xl mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      Dashboard Bancaire
                    </h3>
                    <p className="text-gray-400 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      Vue d'ensemble en temps réel
                    </p>
                  </div>

                  {/* Enhanced Stats Cards with glassmorphism */}
                  <div className="grid grid-cols-2 gap-5 mb-8">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity" />
                      <div className="relative bg-gradient-to-br from-cyan-500 to-cyan-600 p-5 rounded-2xl border border-cyan-400/30">
                        <p className="text-white/90 text-xs font-medium mb-2 uppercase tracking-wider">Transactions</p>
                        <p className="text-white font-bold text-3xl">1.2M</p>
                        <div className="absolute top-2 right-2 text-white/30">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity" />
                      <div className="relative bg-gradient-to-br from-purple-500 to-purple-600 p-5 rounded-2xl border border-purple-400/30">
                        <p className="text-white/90 text-xs font-medium mb-2 uppercase tracking-wider">Clients</p>
                        <p className="text-white font-bold text-3xl">45K</p>
                        <div className="absolute top-2 right-2 text-white/30">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Chart with better design */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-gray-400 text-sm font-medium">Performance 2024</p>
                      <div className="flex gap-3 text-xs">
                        <span className="text-cyan-400">● Revenus</span>
                        <span className="text-purple-400">● Dépenses</span>
                      </div>
                    </div>
                    <div className="flex items-end justify-between h-48 gap-3">
                      <div className="flex-1 relative group">
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-lg transition-all duration-300 group-hover:from-cyan-400 group-hover:to-cyan-300" style={{ height: '65%' }} />
                      </div>
                      <div className="flex-1 relative group">
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg transition-all duration-300 group-hover:from-purple-400 group-hover:to-purple-300" style={{ height: '85%' }} />
                      </div>
                      <div className="flex-1 relative group">
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-lg transition-all duration-300 group-hover:from-cyan-400 group-hover:to-cyan-300" style={{ height: '75%' }} />
                      </div>
                      <div className="flex-1 relative group">
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg transition-all duration-300 group-hover:from-purple-400 group-hover:to-purple-300" style={{ height: '95%' }} />
                      </div>
                      <div className="flex-1 relative group">
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-lg transition-all duration-300 group-hover:from-cyan-400 group-hover:to-cyan-300" style={{ height: '80%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Front Screen - Right (Angled opposite) */}
            <div 
              className="absolute top-1/2 right-0 w-[400px] h-[500px] rounded-xl overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.8)] border border-white/10 opacity-70 transition-all duration-700 hover:opacity-90 hover:scale-[1.02]"
              style={{
                transform: 'translateY(-50%) perspective(1200px) rotateY(-25deg) rotateX(5deg)',
                zIndex: 2,
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-black via-gray-900 to-gray-800 p-6">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <div className="flex-1 h-6 bg-white/5 rounded ml-2" />
                </div>
                
                {/* Content */}
                <div className="mb-6">
                  <div className="h-8 bg-gradient-to-r from-purple-500/30 to-transparent rounded w-3/4 mb-3" />
                  <div className="h-5 bg-white/5 rounded w-1/2" />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="relative bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 p-4 rounded-xl border border-cyan-500/20">
                    <div className="h-4 bg-white/20 rounded w-full mb-2" />
                    <div className="h-7 bg-white/30 rounded w-2/3" />
                  </div>
                  <div className="relative bg-gradient-to-br from-purple-500/20 to-purple-600/10 p-4 rounded-xl border border-purple-500/20">
                    <div className="h-4 bg-white/20 rounded w-full mb-2" />
                    <div className="h-7 bg-white/30 rounded w-2/3" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-12 bg-white/5 rounded-lg" />
                  <div className="h-12 bg-white/5 rounded-lg" />
                  <div className="h-12 bg-white/5 rounded-lg" />
                </div>
              </div>
            </div>

            {/* Enhanced Floating Elements with glow */}
            <div className="absolute top-20 right-32 w-24 h-24 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-3xl opacity-10 blur-2xl animate-float" />
            <div className="absolute bottom-32 left-20 w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-500 rounded-3xl opacity-10 blur-2xl animate-float-delayed" />
            
            {/* Additional glow effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-full blur-3xl pointer-events-none" />
          </div>

        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite 1s;
        }
      `}</style>
    </section>
  );
};

export default Hero;
