import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  User,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  ChevronRight,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import {
  useBlogPostBySlug,
  useIncrementViews,
} from '../admin/hooks/useBlogPosts';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackgroundAnimation from '../components/BackgroundAnimation';

/**
 * Page BlogPost - Affichage d'un article de blog détaillé
 * Route: /blog/:slug
 */

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useBlogPostBySlug(slug || null);
  const incrementViews = useIncrementViews();

  // Incrémenter les vues au chargement
  useEffect(() => {
    if (post?.id) {
      incrementViews.mutate(post.id);
    }
  }, [post?.id]);

  const renderIcon = (iconName: string, size = 20) => {
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.FileText;
    return <Icon size={size} />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = post?.title || '';

  const handleShare = (platform: string) => {
    const urls: { [key: string]: string } = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Article introuvable</h1>
          <Link
            to="/blog"
            className="text-cyan-400 hover:underline flex items-center gap-2 justify-center"
          >
            <ArrowLeft size={20} />
            Retour au blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <BackgroundAnimation />
      <Header />

      <div className="relative z-10">
        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto px-6 pt-8">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-white transition-colors">
              Accueil
            </Link>
            <ChevronRight size={16} />
            <Link to="/blog" className="hover:text-white transition-colors">
              Blog
            </Link>
            <ChevronRight size={16} />
            {post.category_name && (
              <>
                <span className="hover:text-white transition-colors">
                  {post.category_name}
                </span>
                <ChevronRight size={16} />
              </>
            )}
            <span className="text-white truncate max-w-[200px]">{post.title}</span>
          </nav>
        </div>

        {/* Header Article */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Catégorie */}
          {post.category_name && (
            <div className="mb-6">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: `${post.category_color}20`,
                  color: post.category_color,
                  border: `1px solid ${post.category_color}40`,
                }}
              >
                {renderIcon(post.category_icon, 16)}
                {post.category_name}
              </div>
            </div>
          )}

          {/* Titre */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-6 text-gray-400 pb-8 border-b border-gray-700/50">
            <div className="flex items-center gap-2">
              <User size={18} />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{formatDate(post.published_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{post.reading_time} min de lecture</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye size={18} />
              <span>{post.views || 0} vues</span>
            </div>
          </div>
        </div>

        {/* Image à la une */}
        {post.featured_image && (
          <div className="max-w-5xl mx-auto px-6 mb-12">
            <div className="aspect-video rounded-2xl overflow-hidden">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Contenu + Sidebar */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contenu principal */}
            <div className="lg:col-span-2">
              {/* Article content */}
              <div
                className="prose prose-invert prose-lg max-w-none
                  prose-headings:text-white prose-headings:font-bold
                  prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                  prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                  prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                  prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-white prose-strong:font-semibold
                  prose-ul:text-gray-300 prose-ol:text-gray-300
                  prose-li:mb-2
                  prose-blockquote:border-l-4 prose-blockquote:border-cyan-500 
                  prose-blockquote:bg-cyan-500/10 prose-blockquote:py-4 prose-blockquote:px-6
                  prose-blockquote:rounded-r-lg prose-blockquote:text-gray-300
                  prose-code:text-cyan-400 prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded
                  prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700
                  prose-img:rounded-xl prose-img:my-8
                  prose-table:border prose-table:border-gray-700
                  prose-th:bg-gray-800 prose-th:text-white
                  prose-td:border prose-td:border-gray-700
                "
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white/5 border border-gray-700/50 rounded-full text-sm text-gray-400 hover:text-white hover:border-cyan-500/50 transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Partage */}
                <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Share2 size={20} />
                    Partager
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      <Facebook size={18} />
                      Facebook
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-sky-500 hover:bg-sky-600 rounded-lg transition-colors"
                    >
                      <Twitter size={18} />
                      Twitter
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
                    >
                      <Linkedin size={18} />
                      LinkedIn
                    </button>
                  </div>
                </div>

                {/* Retour au blog */}
                <Link
                  to="/blog"
                  className="block w-full px-6 py-3 bg-white/5 hover:bg-white/10 border border-gray-700/50 rounded-xl transition-colors text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-white">
                    <ArrowLeft size={18} />
                    Retour au blog
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogPost;
