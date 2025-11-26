import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  ArrowRight,
  Search,
  Share2,
  BookOpen,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Linkedin,
  Mail,
  Link,
  ChevronDown,
  Twitter,
} from 'lucide-react';
import { useBlogPosts } from '../lib/useSupabaseData';

// ✨ Modification design modal : Ajout de l'icône Copy depuis lucide-react (si non disponible, utiliser Link comme fallback)
// ✨ Modification partage : Ajout de Twitter pour les partages sociaux

const Blog: React.FC = () => {
  const navigate = useNavigate();
  const { data: blogPosts, loading } = useBlogPosts();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage = 6;

  // État pour le modal de lecture
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  // ✨ Modification design modal : Ajout d'états pour le scroll tracking et l'indicateur
  const [scrollY, setScrollY] = useState<number>(0);
  const [showScrollIndicator, setShowScrollIndicator] = useState<boolean>(true);

  const categories = [
    'all',
    'Développement',
    'Design',
    'Business',
    'Innovation',
    'Performance',
    'Sécurité',
    'React',
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Fonction pour naviguer vers l'article
  const openArticle = (post: any) => {
    navigate(`/blog/${post.slug}`);
  };

  // Fonction pour fermer le modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    // ✨ Modification design modal : Reset du scroll tracking
    setScrollY(0);
    setShowScrollIndicator(true);
    document.body.style.overflow = 'unset';
  };

  // ✨ Modification design modal : Navigation circulaire (avec boucle)
  const navigatePost = (direction: 'prev' | 'next') => {
    if (!selectedPost) return;

    const currentIndex = blogPosts.findIndex(
      (post) => post.id === selectedPost.id
    );
    let newIndex;

    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : blogPosts.length - 1;
    } else {
      newIndex = currentIndex < blogPosts.length - 1 ? currentIndex + 1 : 0;
    }

    setSelectedPost(blogPosts[newIndex]);
  };

  // ✨ Modification design modal : Fonction de partage mise à jour avec LinkedIn, Twitter, Quora et copy link
  const shareArticle = (
    post: any,
    platform?: 'facebook' | 'linkedin' | 'twitter' | 'quora' | 'copy'
  ) => {
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

  // ✨ Modification design modal : Gestion du scroll et de la touche Escape
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.keyCode === 27) closeModal();
    };

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      if (target && selectedPost) {
        const scrollTop = target.scrollTop;
        setScrollY(scrollTop);

        if (scrollTop > 100) {
          setShowScrollIndicator(false);
        }
      }
    };

    document.addEventListener('keydown', handleEsc);

    if (selectedPost) {
      const modalContent = document.getElementById('modal-content');
      if (modalContent) {
        modalContent.addEventListener('scroll', handleScroll);
        return () => {
          modalContent.removeEventListener('scroll', handleScroll);
        };
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [selectedPost]);

  // Icônes manquantes de lucide-react
  const MessageCircle = ({ size }: { size: number }) => (
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

  const HelpCircle = ({ size }: { size: number }) => (
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

  // ✨ Modification design modal : Composant Modal complètement redessiné style Sectors
  const ArticleModal = ({ post }: { post: any }) => {
    if (!post) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto" id="modal-content">
        {/* ✨ Modification design modal : Image de couverture fixe */}
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${post.image})`,
          }}
        />

        {/* ✨ Modification design modal : Overlay transparent avec gradient */}
        <div className="fixed inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/90" />

        {/* ✨ Modification design modal : Contenu du modal */}
        <div className="relative z-10 min-h-screen">
          {/* ✨ Modification design modal : Modal Header - Top Bar */}
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
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* ✨ Modification design modal : Navigation buttons */}
                  <button
                    onClick={() => navigatePost('prev')}
                    className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 rounded-xl flex items-center justify-center transition-all duration-300"
                    title="Article précédent"
                  >
                    <ChevronLeft
                      size={20}
                      className="text-gray-300 hover:text-white"
                    />
                  </button>

                  <button
                    onClick={() => navigatePost('next')}
                    className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 rounded-xl flex items-center justify-center transition-all duration-300"
                    title="Article suivant"
                  >
                    <ChevronRight
                      size={20}
                      className="text-gray-300 hover:text-white"
                    />
                  </button>

                  {/* ✨ Modification design modal : Social Share Buttons (desktop) */}
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

                  {/* ✨ Modification design modal : Mobile share button */}
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

                  {/* ✨ Modification design modal : Close button */}
                  <button
                    onClick={closeModal}
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

          {/* ✨ Modification design modal : Contenu principal */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* ✨ Modification design modal : Hero Section */}
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
                  <span>{post.readTime}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-3">
                  <Eye size={20} />
                  <span>{Math.floor(Math.random() * 500) + 100} vues</span>
                </div>
              </div>

              {/* ✨ Modification design modal : Scroll Indicator */}
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
                      className="group-hover:text-cyan-400 transition-colors duration-300"
                      style={{
                        animation: 'bounce 2s infinite',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ✨ Modification design modal : Article Content avec contenu HTML */}
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
                      .filter((line: string) => line.trim() !== '')
                      .map((line: string) => {
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

              {/* ✨ Modification design modal : Mobile Social Share Buttons */}
              <div className="md:hidden mt-16 pt-8 border-t border-gray-700/50">
                <div className="text-center mb-6">
                  <h4 className="text-xl font-semibold text-white mb-2">
                    Partager cet article
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Cet article vous a aidé ? Partagez-le avec votre communauté
                    ! 🚀
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

            {/* ✨ Modification design modal : Footer CTA */}
            <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-md border border-cyan-500/30 rounded-3xl p-12 text-center">
              <h4 className="text-3xl font-bold text-white mb-4">
                Cet article vous a plu ?
              </h4>
              <p className="text-gray-300 mb-8 text-xl max-w-3xl mx-auto leading-relaxed">
                Découvrez d'autres articles de notre blog tech et restez informé
                des dernières tendances du développement web.
              </p>

              {/* ✨ Modification partage : Note d'incitation au partage */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
                <p className="text-gray-300 text-lg mb-4">
                  💡{' '}
                  <strong className="text-cyan-400">
                    Vous avez aimé cet article ?
                  </strong>
                </p>
                <p className="text-gray-400 text-base leading-relaxed">
                  Aidez-nous à faire découvrir ce contenu à d'autres
                  développeurs en le partageant sur vos réseaux sociaux. Chaque
                  partage nous encourage à créer plus de contenu de qualité ! 🙏
                </p>
              </div>

              <button
                onClick={closeModal}
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

  return (
    <section id="blog" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Blog{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Tech
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Actualités, tutoriels et insights sur les dernières tendances du
            développement web
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-12 space-y-6">
          {/* Search Bar */}
          <div className="flex justify-center">
            <div className="relative max-w-md w-full">
              <Search
                size={20}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-white/5 border border-gray-700/50 rounded-full py-3 pl-12 pr-6 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white/5 border border-gray-700/50 text-gray-300 hover:border-cyan-500/50 hover:text-cyan-400'
                }`}
              >
                {category === 'all' ? 'Tous' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Nouvelle disposition avec 2 grands articles + 4 petits */}
        {currentPage === 1 && filteredPosts.length > 0 ? (
          <>
            {/* Articles à la Une - 2 grandes cartes */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {filteredPosts.slice(0, 2).map((post, index) => (
                <article
                  key={post.id}
                  onClick={() => openArticle(post)}
                  className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-500 cursor-pointer group hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/10"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Post Image */}
                  <div className="relative overflow-hidden h-64">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                      <BookOpen size={12} className="text-cyan-400" />
                      <span className="text-xs text-white">
                        {post.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatDate(post.date)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-purple-400">
                        <Eye size={14} />
                        <span className="text-xs">
                          {Math.floor(Math.random() * 500) + 100}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <button
                      onClick={() => openArticle(post)}
                      className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium group/btn"
                    >
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

            {/* Articles Standard - 4 petites cartes */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {filteredPosts.slice(2, 6).map((post, index) => (
                <article
                  key={post.id}
                  onClick={() => openArticle(post)}
                  className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-500 cursor-pointer group hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/10"
                  style={{ animationDelay: `${(index + 2) * 0.1}s` }}
                >
                  {/* Post Image */}
                  <div className="relative overflow-hidden h-40">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <Calendar size={12} />
                      <span>{formatDate(post.date)}</span>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-400 mb-3 line-clamp-2 text-xs leading-relaxed">
                      {post.excerpt}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openArticle(post);
                      }}
                      className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium text-xs group/btn"
                    >
                      Lire
                      <ArrowRight
                        size={12}
                        className="group-hover/btn:translate-x-0.5 transition-transform duration-300"
                      />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Bouton "Voir tous les articles" - affichage permanent */}
            <div className="text-center mb-12">
              <button
                onClick={() => (window.location.href = '/blog-tech')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-full hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 font-semibold hover:scale-105"
              >
                Voir tous les articles
                <ArrowRight size={20} />
              </button>
            </div>
          </>
        ) : (
          // Grille standard si page > 1 ou recherche active
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {currentPosts.map((post, index) => (
              <article
                key={post.id}
                onClick={() => openArticle(post)}
                className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-500 cursor-pointer group hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/10"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Post Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                    <BookOpen size={12} className="text-cyan-400" />
                    <span className="text-xs text-white">{post.readTime}</span>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatDate(post.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-purple-400">
                      <Eye size={14} />
                      <span className="text-xs">
                        {Math.floor(Math.random() * 500) + 100}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openArticle(post);
                    }}
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium group/btn"
                  >
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
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mb-12">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white/5 border border-gray-700/50 rounded-full text-gray-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-10 h-10 rounded-full font-medium transition-all duration-300 ${
                    currentPage === index + 1
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                      : 'bg-white/5 border border-gray-700/50 text-gray-300 hover:border-cyan-500/50 hover:text-cyan-400'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white/5 border border-gray-700/50 rounded-full text-gray-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        )}

        {/* No Results */}
        {currentPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">
              Aucun article trouvé
            </h3>
            <p className="text-gray-400">
              Essayez avec d'autres mots-clés ou catégories
            </p>
          </div>
        )}

        {/* Blog Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">
              {blogPosts.length}
            </div>
            <div className="text-gray-400">Articles publiés</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {categories.length - 1}
            </div>
            <div className="text-gray-400">Catégories</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">2.5K+</div>
            <div className="text-gray-400">Lecteurs mensuels</div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Restez à jour avec les dernières tendances
          </h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Recevez nos meilleurs articles et conseils techniques directement
            dans votre boîte mail
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="votre@email.com"
              className="flex-1 bg-white/5 border border-gray-700/50 rounded-full py-3 px-6 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300"
            />
            <button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-3 rounded-full hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 font-semibold hover:scale-105 whitespace-nowrap">
              S'abonner
            </button>
          </div>
        </div>
      </div>

      {/* Modal de lecture d'article */}
      {isModalOpen && selectedPost && <ArticleModal post={selectedPost} />}
    </section>
  );
};

export default Blog;
