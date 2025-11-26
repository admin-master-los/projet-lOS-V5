import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  ArrowRight,
  Eye,
  Share2,
  BookOpen,
  Mail,
  Send,
  ChevronLeft,
  ChevronRight,
  Settings,
  X,
  ChevronDown,
  Facebook,
  Linkedin,
  Twitter,
  Link,
  Search,
  Filter,
  TrendingUp,
  RotateCcw,
  Loader,
} from 'lucide-react';

// ✨ Import hooks React Query pour blog Supabase
import { usePublishedBlogPosts } from '../admin/hooks/useBlogPosts';
import { useBlogCategories } from '../admin/hooks/useBlogCategories';

// ✨ Type pour les articles de blog (adapté à la structure Supabase)
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author: string;
  category_id: string;
  category_name?: string;
  category_color?: string;
  category_icon?: string;
  tags: string[];
  status: string;
  views: number;
  reading_time: number;
  published_at: string;
  created_at: string;
  // Champs compatibles ancien format
  category?: string;
  date?: string;
  read_time?: string;
  image?: string;
  content_blog?: string;
}

// Icons manquantes
const MessageCircle = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const HelpCircle = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 16v-4"></path>
    <path d="M12 8h.01"></path>
  </svg>
);

// Settings Panel Component
const SettingsPanel = ({
  isDark,
  setIsDark,
  showParticles,
  setShowParticles,
  isOpen,
  setIsOpen,
}) => {
  return (
    <div className="fixed top-20 right-4 z-40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300"
      >
        <Settings size={20} className="text-white" />
      </button>

      {isOpen && (
        <div className="absolute top-14 right-0 w-64 bg-black/80 backdrop-blur-md border border-white/20 rounded-2xl p-4 space-y-4">
          <h3 className="text-white font-semibold mb-3">Paramètres</h3>

          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Mode sombre</span>
            <button
              onClick={() => setIsDark(!isDark)}
              className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                isDark ? 'bg-cyan-500' : 'bg-gray-600'
              } relative`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${
                  isDark ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Particules</span>
            <button
              onClick={() => setShowParticles(!showParticles)}
              className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                showParticles ? 'bg-purple-500' : 'bg-gray-600'
              } relative`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${
                  showParticles ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Blog Tech Header Component
const BlogHeader = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 hover:scale-105 transition-all duration-300"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/25">
              lOS
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Blog Tech
              </span>
            </div>
          </button>

          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 font-medium hover:scale-105 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">Retour à l'accueil</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

// Hero Component
const Hero = ({ isDark, scrollToGrid }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />
        <div className="absolute inset-0 bg-gradient-to-tl from-purple-500/5 via-transparent to-cyan-500/5 animate-pulse" />
      </div>

      {/* Floating Tech Keywords */}
      <div className="absolute inset-0 overflow-hidden">
        {[
          'HTML',
          'CSS',
          'React',
          'Node.js',
          'AI',
          'Web3',
          'TypeScript',
          'Design',
        ].map((keyword, index) => (
          <div
            key={keyword}
            className="absolute text-gray-500/30 font-mono text-sm animate-pulse"
            style={{
              left: `${(index * 12) % 90}%`,
              top: `${(index * 15) % 80}%`,
              animationDelay: `${index * 0.5}s`,
              animationDuration: `${3 + (index % 3)}s`,
            }}
          >
            {keyword}
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
              Tech Insights
            </span>
            <br />
            <span className="text-3xl md:text-5xl lg:text-6xl text-gray-300 font-light">
              & Digital Trends
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed mb-12">
            Explore the latest innovations in design, tech, and creative
            development
          </p>
        </div>

        <button
          onClick={scrollToGrid}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-10 py-4 rounded-full hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 font-semibold text-lg hover:scale-105 inline-flex items-center gap-3 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative z-10 flex items-center gap-3">
            <BookOpen size={24} />
            Explore Articles
          </span>
        </button>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-cyan-400/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-cyan-400 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

// ✨ Advanced Search with Suggestions
const AdvancedSearch = ({
  searchTerm,
  setSearchTerm,
  articles,
  onArticleClick,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (searchTerm.length > 2) {
      const filtered = articles
        .filter(
          (article) =>
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.content_blog
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchTerm, articles]);

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        <Search
          size={20}
          className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Rechercher par titre, contenu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.length > 2 && setShowSuggestions(true)}
          className="w-full bg-white/5 border border-gray-700/50 rounded-full py-4 pl-14 pr-6 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:shadow-lg focus:shadow-cyan-500/20 transition-all duration-300"
        />
      </div>

      {/* ✨ Search Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-black/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl overflow-hidden z-50 shadow-2xl shadow-cyan-500/20">
          <div className="p-2">
            <div className="text-xs text-gray-400 px-3 py-2 font-medium">
              {suggestions.length} résultat{suggestions.length > 1 ? 's' : ''}{' '}
              trouvé{suggestions.length > 1 ? 's' : ''}
            </div>
            {suggestions.map((article) => (
              <button
                key={article.id}
                onClick={() => {
                  onArticleClick(article);
                  setShowSuggestions(false);
                }}
                className="w-full flex items-start gap-4 p-3 hover:bg-white/10 rounded-xl transition-all duration-300 text-left group"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {article.title}
                  </h4>
                  <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-cyan-400">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">
                      {article.read_time}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
};

// ✨ Smart Multi-Category Filter
const SmartCategoryFilter = ({
  categories,
  selectedCategories,
  onToggleCategory,
  onReset,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <button
              key={category}
              onClick={() => onToggleCategory(category)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30 animate-pulse'
                  : 'bg-white/5 border border-gray-700/50 text-gray-300 hover:border-cyan-500/50 hover:text-cyan-400'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* ✨ Reset Filters Button */}
      {selectedCategories.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-full hover:bg-red-500/20 transition-all duration-300 text-sm font-medium"
          >
            <RotateCcw size={16} />
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
};

// ✨ Advanced Sorting Component
const SortingDropdown = ({ sortBy, setSortBy }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = [
    { value: 'latest', label: 'Plus récents', icon: Clock },
    { value: 'popular', label: 'Plus populaires', icon: TrendingUp },
    { value: 'alphabetical', label: 'Alphabétique', icon: Filter },
  ];

  const currentOption = options.find((opt) => opt.value === sortBy);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-gray-700/50 rounded-full text-gray-300 hover:border-cyan-500/50 transition-all duration-300"
      >
        {currentOption && <currentOption.icon size={16} />}
        <span className="text-sm font-medium">
          {currentOption?.label || 'Trier par'}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div className="absolute top-full mt-2 right-0 w-48 bg-black/90 backdrop-blur-xl border border-cyan-500/30 rounded-xl overflow-hidden z-50 shadow-xl">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSortBy(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-all duration-300 ${
                  sortBy === option.value
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'text-gray-300'
                }`}
              >
                <option.icon size={16} />
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  );
};

// ✨ Vertical Category-Based Layout Component
const CategoryBasedLayout = ({ articles, onArticleClick }) => {
  // Group articles by category
  const articlesByCategory = useMemo(() => {
    const grouped = {};
    articles.forEach((article) => {
      if (!grouped[article.category]) {
        grouped[article.category] = [];
      }
      grouped[article.category].push(article);
    });
    return grouped;
  }, [articles]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      Développement: 'from-blue-500 to-cyan-500',
      Design: 'from-pink-500 to-purple-500',
      'IA & Innovation': 'from-green-500 to-teal-500',
      Performance: 'from-orange-500 to-red-500',
      Sécurité: 'from-red-500 to-pink-500',
      Business: 'from-purple-500 to-indigo-500',
      React: 'from-cyan-500 to-blue-500',
      Innovation: 'from-green-500 to-cyan-500',
    };
    return colors[category] || 'from-cyan-500 to-purple-500';
  };

  return (
    <div className="space-y-16">
      {Object.entries(articlesByCategory).map(
        ([category, categoryArticles]) => (
          <section key={category} className="animate-fade-in">
            {/* ✨ Category Header */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-cyan-400 border-b border-cyan-500/30 pb-2 inline-block">
                {category}
                <span className="ml-3 text-sm text-gray-400 font-normal">
                  ({categoryArticles.length} article
                  {categoryArticles.length > 1 ? 's' : ''})
                </span>
              </h2>
            </div>

            {/* ✨ Horizontal Scrollable Cards */}
            <div className="relative">
              <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-cyan-500/40 scrollbar-track-transparent">
                {categoryArticles.map((article, index) => (
                  <article
                    key={article.id}
                    onClick={() => onArticleClick(article)}
                    className="min-w-[320px] max-w-[320px] bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-500 cursor-pointer group hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/10 snap-start"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                      <div className="absolute top-4 left-4">
                        <span
                          className={`bg-gradient-to-r ${getCategoryColor(
                            article.category
                          )} text-white px-3 py-1 rounded-full text-xs font-medium`}
                        >
                          {article.category}
                        </span>
                      </div>

                      <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                        <Clock size={12} className="text-cyan-400" />
                        <span className="text-xs text-white">
                          {article.read_time}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{formatDate(article.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye size={14} />
                          <span>
                            {article.views ||
                              Math.floor(Math.random() * 500) + 100}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-gray-400 mb-4 line-clamp-3 text-sm leading-relaxed">
                        {article.excerpt}
                      </p>

                      <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium group/btn">
                        Lire la suite
                        <ArrowRight
                          size={16}
                          className="group-hover/btn:translate-x-1 transition-transform duration-300"
                        />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )
      )}
    </div>
  );
};

// ✨ Result Indicator
const ResultIndicator = ({ totalArticles, totalCategories }) => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-cyan-500/30 rounded-full px-6 py-3">
        <Filter size={16} className="text-cyan-400" />
        <span className="text-white font-medium">
          {totalArticles} article{totalArticles > 1 ? 's' : ''} trouvé
          {totalArticles > 1 ? 's' : ''}
        </span>
        <span className="text-gray-500">•</span>
        <span className="text-gray-400">
          {totalCategories} catégorie{totalCategories > 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
};

// Newsletter Component
const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <section className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-md border border-cyan-500/20 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 animate-pulse" />
          <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />

          <div className="relative z-10">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail size={32} className="text-white" />
            </div>

            <h3 className="text-3xl font-bold text-white mb-4">
              Restez à la Pointe de la Tech
            </h3>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Get the latest in tech and creative design directly to your inbox
            </p>

            {!isSubscribed ? (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="flex-1 bg-white/5 border border-gray-700/50 rounded-full py-4 px-6 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300"
                  required
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-full hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 font-semibold hover:scale-105 whitespace-nowrap flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  S'abonner
                </button>
              </form>
            ) : (
              <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-6 max-w-md mx-auto">
                <div className="text-green-400 text-2xl mb-2">✓</div>
                <p className="text-green-300 font-semibold">
                  Merci pour votre inscription !
                </p>
                <p className="text-green-400 text-sm">
                  Vous recevrez bientôt nos derniers articles.
                </p>
              </div>
            )}

            <p className="text-gray-500 text-sm mt-6">
              Pas de spam • Désabonnement facile • 2-3 emails par mois
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ✨ Immersive Article Modal
const ArticleModal = ({ post, onClose, onNavigate }) => {
  const [scrollY, setScrollY] = useState(0);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const shareArticle = (post, platform) => {
    const url = window.location.href + '#' + post.id;
    const title = post.title;
    const description = post.excerpt;

    if (platform === 'facebook') {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`,
        '_blank',
        'width=600,height=400'
      );
    } else if (platform === 'linkedin') {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(
          description
        )}`,
        '_blank',
        'width=600,height=400'
      );
    } else if (platform === 'twitter') {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          title
        )}&url=${encodeURIComponent(url)}`,
        '_blank',
        'width=600,height=400'
      );
    } else if (platform === 'quora') {
      window.open(
        `https://www.quora.com/share?url=${encodeURIComponent(
          url
        )}&title=${encodeURIComponent(title)}`,
        '_blank',
        'width=600,height=400'
      );
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url).then(() => {
        alert('Lien copié dans le presse-papiers !');
      });
    } else {
      if (navigator.share) {
        navigator.share({
          title: title,
          text: description,
          url: url,
        });
      } else {
        navigator.clipboard.writeText(url);
        alert('Lien copié dans le presse-papiers !');
      }
    }
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };

    const handleScroll = (e) => {
      const target = e.target;
      if (target) {
        const scrollTop = target.scrollTop;
        setScrollY(scrollTop);

        if (scrollTop > 100) {
          setShowScrollIndicator(false);
        }
      }
    };

    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    const modalContent = document.getElementById('modal-content');
    if (modalContent) {
      modalContent.addEventListener('scroll', handleScroll);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
      if (modalContent) {
        modalContent.removeEventListener('scroll', handleScroll);
      }
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" id="modal-content">
      {/* Image de couverture fixe */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${post.image})`,
        }}
      />

      {/* Overlay transparent avec gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/90" />

      {/* Contenu du modal */}
      <div className="relative z-10 min-h-screen">
        {/* Modal Header - Top Bar */}
        <div className="sticky top-0 z-20 bg-black/20 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="bg-gradient-to-r from-cyan-500/80 to-purple-500/80 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium">
                  {post.category}
                </span>
                <div className="hidden md:flex items-center gap-2 text-gray-300 text-sm">
                  <Calendar size={16} />
                  <span>{formatDate(post.date)}</span>
                  <span>•</span>
                  <Clock size={16} />
                  <span>{post.read_time}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Navigation buttons */}
                <button
                  onClick={() => onNavigate('prev')}
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 rounded-xl flex items-center justify-center transition-all duration-300"
                  title="Article précédent"
                >
                  <ChevronLeft
                    size={20}
                    className="text-gray-300 hover:text-white"
                  />
                </button>

                <button
                  onClick={() => onNavigate('next')}
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 rounded-xl flex items-center justify-center transition-all duration-300"
                  title="Article suivant"
                >
                  <ChevronRight
                    size={20}
                    className="text-gray-300 hover:text-white"
                  />
                </button>

                {/* Social Share Buttons (desktop) */}
                <div className="hidden md:flex items-center gap-2 ml-2">
                  <div className="mr-3 text-gray-300 text-sm font-medium hidden lg:block">
                    Partager →
                  </div>
                  <button
                    onClick={() => shareArticle(post, 'facebook')}
                    className="w-12 h-12 bg-blue-600/20 hover:bg-blue-600/30 backdrop-blur-sm border border-blue-500/30 hover:border-blue-500/50 rounded-xl flex items-center justify-center transition-all duration-300"
                    title="Partager sur Facebook"
                  >
                    <Facebook size={18} className="text-blue-400" />
                  </button>

                  <button
                    onClick={() => shareArticle(post, 'twitter')}
                    className="w-12 h-12 bg-sky-500/20 hover:bg-sky-500/30 backdrop-blur-sm border border-sky-400/30 hover:border-sky-400/50 rounded-xl flex items-center justify-center transition-all duration-300"
                    title="Partager sur Twitter"
                  >
                    <Twitter size={18} className="text-sky-400" />
                  </button>

                  <button
                    onClick={() => shareArticle(post, 'linkedin')}
                    className="w-12 h-12 bg-blue-700/20 hover:bg-blue-700/30 backdrop-blur-sm border border-blue-600/30 hover:border-blue-600/50 rounded-xl flex items-center justify-center transition-all duration-300"
                    title="Partager sur LinkedIn"
                  >
                    <Linkedin size={18} className="text-blue-500" />
                  </button>

                  <button
                    onClick={() => shareArticle(post, 'quora')}
                    className="w-12 h-12 bg-red-600/20 hover:bg-red-600/30 backdrop-blur-sm border border-red-500/30 hover:border-red-500/50 rounded-xl flex items-center justify-center transition-all duration-300"
                    title="Partager sur Quora"
                  >
                    <HelpCircle size={18} className="text-red-400" />
                  </button>

                  <button
                    onClick={() => shareArticle(post, 'copy')}
                    className="w-12 h-12 bg-green-600/20 hover:bg-green-600/30 backdrop-blur-sm border border-green-500/30 hover:border-green-500/50 rounded-xl flex items-center justify-center transition-all duration-300"
                    title="Copier le lien"
                  >
                    <Link size={18} className="text-green-400" />
                  </button>
                </div>

                {/* Mobile share button */}
                <button
                  onClick={() => shareArticle(post)}
                  className="md:hidden w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 rounded-xl flex items-center justify-center transition-all duration-300"
                  title="Partager"
                >
                  <Share2
                    size={18}
                    className="text-gray-300 hover:text-white"
                  />
                </button>

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 rounded-xl flex items-center justify-center transition-all duration-200 group ml-2"
                >
                  <X
                    size={20}
                    className="text-gray-300 group-hover:text-white"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              {post.title}
            </h1>

            <div className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
              {post.excerpt}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-300 text-lg">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-3">
                <Calendar size={20} />
                <span>{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-3">
                <Clock size={20} />
                <span>{post.read_time}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-3">
                <Eye size={20} />
                <span>
                  {post.views || Math.floor(Math.random() * 500) + 100} vues
                </span>
              </div>
            </div>

            {/* Scroll Indicator */}
            {showScrollIndicator && (
              <div className="mt-16 flex flex-col items-center text-white/90 cursor-pointer hover:text-white transition-all duration-300 group">
                <div className="text-base font-medium mb-4 tracking-wide uppercase">
                  Scroller pour lire
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-12 border-2 border-white/60 rounded-full flex justify-center relative overflow-hidden group-hover:border-cyan-400 transition-colors duration-300">
                    <div className="w-1 h-3 bg-white/80 rounded-full mt-2 animate-pulse group-hover:bg-cyan-400 transition-colors duration-300"></div>
                  </div>
                  <ChevronDown
                    size={24}
                    className="group-hover:text-cyan-400 transition-colors duration-300 animate-bounce"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Article Content */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 mb-12">
            <div className="prose prose-invert prose-xl max-w-none">
              <div
                className="text-gray-300 leading-relaxed space-y-8"
                style={{
                  lineHeight: '1.9',
                  fontSize: '1.2rem',
                }}
                dangerouslySetInnerHTML={{
                  __html: post.content_blog
                    .split('\n')
                    .filter((line) => line.trim() !== '')
                    .map((line) => {
                      if (line.startsWith('# ')) {
                        return `<h2 class="text-3xl md:text-4xl font-bold text-cyan-400 mt-16 mb-8">${line.substring(
                          2
                        )}</h2>`;
                      }
                      if (line.startsWith('## ')) {
                        return `<h3 class="text-2xl md:text-3xl font-bold text-cyan-300 mt-12 mb-6">${line.substring(
                          3
                        )}</h3>`;
                      }
                      if (line.startsWith('- ')) {
                        return `<li class="ml-8 mb-4 text-gray-100 text-lg">${line.substring(
                          2
                        )}</li>`;
                      }
                      if (line.startsWith('```')) {
                        return '';
                      }
                      return `<p class="mb-8 text-lg md:text-xl">${line}</p>`;
                    })
                    .join(''),
                }}
              />
            </div>

            {/* Mobile Social Share Buttons */}
            <div className="md:hidden mt-16 pt-8 border-t border-gray-700/50">
              <div className="text-center mb-6">
                <h4 className="text-xl font-semibold text-white mb-2">
                  Partager cet article
                </h4>
                <p className="text-gray-400 text-sm">
                  Cet article vous a aidé ? Partagez-le avec votre communauté !
                  🚀
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => shareArticle(post, 'facebook')}
                  className="flex items-center justify-center gap-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 hover:border-blue-500/50 rounded-xl py-4 px-4 transition-all duration-300"
                >
                  <Facebook size={20} className="text-blue-400" />
                  <span className="text-blue-300 font-medium">Facebook</span>
                </button>

                <button
                  onClick={() => shareArticle(post, 'twitter')}
                  className="flex items-center justify-center gap-3 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/30 hover:border-sky-400/50 rounded-xl py-4 px-4 transition-all duration-300"
                >
                  <Twitter size={20} className="text-sky-400" />
                  <span className="text-sky-300 font-medium">Twitter</span>
                </button>

                <button
                  onClick={() => shareArticle(post, 'linkedin')}
                  className="flex items-center justify-center gap-3 bg-blue-700/20 hover:bg-blue-700/30 border border-blue-600/30 hover:border-blue-600/50 rounded-xl py-4 px-4 transition-all duration-300"
                >
                  <Linkedin size={20} className="text-blue-500" />
                  <span className="text-blue-400 font-medium">LinkedIn</span>
                </button>

                <button
                  onClick={() => shareArticle(post, 'quora')}
                  className="flex items-center justify-center gap-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 hover:border-red-500/50 rounded-xl py-4 px-4 transition-all duration-300"
                >
                  <HelpCircle size={20} className="text-red-400" />
                  <span className="text-red-300 font-medium">Quora</span>
                </button>

                <button
                  onClick={() => shareArticle(post, 'copy')}
                  className="col-span-2 flex items-center justify-center gap-3 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 hover:border-green-500/50 rounded-xl py-4 px-4 transition-all duration-300"
                >
                  <Link size={20} className="text-green-400" />
                  <span className="text-green-300 font-medium">
                    Copier le lien
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-md border border-cyan-500/30 rounded-3xl p-12 text-center">
            <h4 className="text-3xl font-bold text-white mb-4">
              Cet article vous a plu ?
            </h4>
            <p className="text-gray-300 mb-8 text-xl max-w-3xl mx-auto leading-relaxed">
              Découvrez d'autres articles de notre blog tech et restez informé
              des dernières tendances du développement web.
            </p>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
              <p className="text-gray-300 text-lg mb-4">
                💡{' '}
                <strong className="text-cyan-400">
                  Vous avez aimé cet article ?
                </strong>
              </p>
              <p className="text-gray-400 text-base leading-relaxed">
                Aidez-nous à faire découvrir ce contenu à d'autres développeurs
                en le partageant sur vos réseaux sociaux. Chaque partage nous
                encourage à créer plus de contenu de qualité ! 🙏
              </p>
            </div>

            <button
              onClick={onClose}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-10 py-4 rounded-xl hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 font-bold text-lg inline-flex items-center gap-3 hover:scale-105 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-3">
                <ArrowRight size={20} />
                Découvrir d'autres articles
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✨ Loading Component
const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
      <p className="text-gray-400 text-lg">Chargement des articles...</p>
    </div>
  );
};

// ✨ Error Component
const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="text-6xl mb-4">⚠️</div>
      <h3 className="text-xl font-bold text-white mb-2">
        Erreur de chargement
      </h3>
      <p className="text-gray-400 mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 px-6 py-3 rounded-full hover:bg-cyan-500/30 transition-all duration-300 flex items-center gap-2"
      >
        <RotateCcw size={16} />
        Réessayer
      </button>
    </div>
  );
};

// ✨ Main Blog Tech Component with React Query hooks
const BlogTech = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('latest');

  // Modal states (plus utilisés mais gardés pour compatibilité)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // ✨ Utiliser les hooks React Query
  const { data: postsData, isLoading: loading, error: fetchError } = usePublishedBlogPosts();
  const { data: categoriesData } = useBlogCategories();

  // ✨ Adapter les données au format attendu par BlogTech
  const articles = useMemo(() => {
    if (!postsData) return [];
    
    return postsData.map((post: any) => ({
      ...post,
      // Compatibilité avec l'ancien format
      category: post.category_name || 'Non catégorisé',
      date: post.published_at,
      read_time: `${post.reading_time} min`,
      image: post.featured_image,
      content_blog: post.content,
    }));
  }, [postsData]);

  const error = fetchError ? 'Erreur lors du chargement des articles' : null;

  // ✨ Extract unique categories from Supabase data
  const categories = useMemo(() => {
    return Array.from(new Set(articles.map((article) => article.category)));
  }, [articles]);

  // ✨ Featured category detection (most articles)
  const featuredCategory = useMemo(() => {
    const categoryCounts = {};
    articles.forEach((article) => {
      categoryCounts[article.category] =
        (categoryCounts[article.category] || 0) + 1;
    });
    return Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  }, [articles]);

  // ✨ Filter and sort articles
  const filteredArticles = useMemo(() => {
    let filtered = articles.filter((article) => {
      const matchesSearch =
        searchTerm.length < 3 ||
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content_blog
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(article.category);

      return matchesSearch && matchesCategory;
    });

    // ✨ Apply sorting
    if (sortBy === 'latest') {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === 'alphabetical') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }, [articles, searchTerm, selectedCategories, sortBy]);

  // ✨ Count active categories
  const activeCategories = useMemo(() => {
    return new Set(filteredArticles.map((article) => article.category)).size;
  }, [filteredArticles]);

  useEffect(() => {
    document.body.className = isDark ? 'dark' : 'light';
  }, [isDark]);

  const scrollToGrid = () => {
    const element = document.getElementById('article-grid');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // ✨ Toggle category selection
  const handleToggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // ✨ Reset all filters
  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSearchTerm('');
    setSortBy('latest');
  };

  const openModal = (post) => {
    // Navigate vers la page article au lieu d'ouvrir modal
    navigate(`/blog/${post.slug}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  // ✨ Navigation circulaire
  const navigatePost = (direction) => {
    if (!selectedPost) return;

    const currentIndex = articles.findIndex(
      (article) => article.id === selectedPost.id
    );
    let newIndex;

    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : articles.length - 1;
    } else {
      newIndex = currentIndex < articles.length - 1 ? currentIndex + 1 : 0;
    }

    setSelectedPost(articles[newIndex]);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-[#0A0A0B] text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      {/* Blog Header */}
      <BlogHeader />

      {/* Settings Panel */}
      <SettingsPanel
        isDark={isDark}
        setIsDark={setIsDark}
        showParticles={showParticles}
        setShowParticles={setShowParticles}
        isOpen={isSettingsOpen}
        setIsOpen={setIsSettingsOpen}
      />

      {/* Main Content */}
      <main className="relative z-10">
        <Hero isDark={isDark} scrollToGrid={scrollToGrid} />

        {/* ✨ Article Grid Section */}
        <section id="article-grid" className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Tous les{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Articles
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Découvrez nos derniers articles sur les technologies et
                tendances du moment
              </p>
            </div>

            {/* ✨ Loading State */}
            {loading && <LoadingSpinner />}

            {/* ✨ Error State */}
            {error && !loading && (
              <ErrorMessage message={error} onRetry={() => window.location.reload()} />
            )}

            {/* ✨ Articles Content (only show when not loading and no error) */}
            {!loading && !error && (
              <>
                {/* ✨ Advanced Search */}
                <div className="mb-8">
                  <AdvancedSearch
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    articles={articles}
                    onArticleClick={openModal}
                  />
                </div>

                {/* ✨ Filters and Sorting Row */}
                <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {featuredCategory && (
                      <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full px-4 py-2">
                        <TrendingUp size={16} className="text-orange-400" />
                        <span className="text-sm font-medium text-orange-300">
                          🔥 Trending: {featuredCategory}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* ✨ Sorting Dropdown */}
                  <SortingDropdown sortBy={sortBy} setSortBy={setSortBy} />
                </div>

                {/* ✨ Smart Category Filters */}
                {categories.length > 0 && (
                  <div className="mb-12">
                    <SmartCategoryFilter
                      categories={categories}
                      selectedCategories={selectedCategories}
                      onToggleCategory={handleToggleCategory}
                      onReset={handleResetFilters}
                    />
                  </div>
                )}

                {/* ✨ Result Indicator */}
                <ResultIndicator
                  totalArticles={filteredArticles.length}
                  totalCategories={activeCategories}
                />

                {/* ✨ Vertical Category-Based Layout */}
                {filteredArticles.length > 0 ? (
                  <CategoryBasedLayout
                    articles={filteredArticles}
                    onArticleClick={openModal}
                  />
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Aucun article trouvé
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Essayez avec d'autres mots-clés ou catégories
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-full hover:bg-cyan-500/30 transition-all duration-300"
                    >
                      <RotateCcw size={16} />
                      Réinitialiser les filtres
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <Newsletter />
      </main>

      {/* Modal de lecture d'article */}
      {isModalOpen && selectedPost && (
        <ArticleModal
          post={selectedPost}
          onClose={closeModal}
          onNavigate={navigatePost}
        />
      )}
    </div>
  );
};

export default BlogTech;