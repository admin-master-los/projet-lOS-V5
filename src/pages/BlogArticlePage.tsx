import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  User,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Mail,
  ChevronRight,
  Check,
  Phone,
  List,
} from 'lucide-react';
import { useBlogPostBySlug, useIncrementViews, useSimilarPosts } from '../admin/hooks/useBlogPosts';
import Footer from '../components/Footer';
import BlogComments from '../components/BlogComments';
import { trackShare, trackArticleRead, trackScrollDepth, trackNewsletterSignup } from '../components/GoogleAnalytics';
import mailchimpService from '../services/mailchimp';
import toast from 'react-hot-toast';

// Prism.js pour syntax highlighting
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';

/**
 * BlogArticlePage - Page article de blog dédiée (SEO optimisé)
 * Design inspiré de BDM (Blog du Modérateur)
 * Route: /blog/:slug
 */

const BlogArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: post, isLoading } = useBlogPostBySlug(slug || null);
  const incrementViews = useIncrementViews();
  
  // Articles similaires
  const { data: similarPosts } = useSimilarPosts(
    post?.id || null,
    post?.category_id || null,
    post?.tags || []
  );

  const [email, setEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeTocId, setActiveTocId] = useState<string>('');

  // Extraire Table des Matières du contenu
  const tableOfContents = useMemo(() => {
    if (!post?.content) return [];
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = post.content;
    
    const headings = tempDiv.querySelectorAll('h2, h3');
    const toc: { id: string; text: string; level: number }[] = [];
    
    headings.forEach((heading, index) => {
      const text = heading.textContent || '';
      const level = parseInt(heading.tagName.substring(1));
      const id = `heading-${index}`;
      
      // Ajouter l'ID au heading dans le contenu
      heading.id = id;
      
      toc.push({ id, text, level });
    });
    
    // Mettre à jour le contenu avec les IDs
    if (toc.length > 0) {
      post.content = tempDiv.innerHTML;
    }
    
    return toc;
  }, [post?.content]);

  // Syntax highlighting avec Prism
  useEffect(() => {
    if (post?.content) {
      // Petit délai pour laisser le DOM se mettre à jour
      setTimeout(() => {
        Prism.highlightAll();
      }, 100);
    }
  }, [post?.content]);

  // Intersection Observer pour TOC actif
  useEffect(() => {
    if (tableOfContents.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTocId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -35% 0px' }
    );

    tableOfContents.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [tableOfContents]);

  // Analytics: Track scroll depth
  useEffect(() => {
    if (!post) return;

    let maxScroll = 0;
    const trackScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        // Track milestones
        if ([25, 50, 75, 90, 100].includes(scrollPercent)) {
          trackScrollDepth(scrollPercent);
        }
      }
    };

    window.addEventListener('scroll', trackScroll, { passive: true });
    return () => window.removeEventListener('scroll', trackScroll);
  }, [post]);

  // Analytics: Track reading time
  useEffect(() => {
    if (!post) return;

    const startTime = Date.now();

    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000); // en secondes
      if (timeSpent > 10) { // Minimum 10 secondes
        trackArticleRead(post.slug, timeSpent);
      }
    };
  }, [post]);

  // Incrémenter les vues au chargement
  useEffect(() => {
    if (post?.id) {
      incrementViews.mutate(post.id);
    }
  }, [post?.id]);

  // SEO: Mettre à jour le titre de la page et ajouter Schema.org
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Leonce Ouattara`;
      
      // Meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', post.excerpt || '');
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = post.excerpt || '';
        document.head.appendChild(meta);
      }

      // Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', post.title);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'og:title');
        meta.content = post.title;
        document.head.appendChild(meta);
      }

      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', post.excerpt || '');
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'og:description');
        meta.content = post.excerpt || '';
        document.head.appendChild(meta);
      }

      if (post.featured_image) {
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) {
          ogImage.setAttribute('content', post.featured_image);
        } else {
          const meta = document.createElement('meta');
          meta.setAttribute('property', 'og:image');
          meta.content = post.featured_image;
          document.head.appendChild(meta);
        }
      }

      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) {
        ogUrl.setAttribute('content', window.location.href);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'og:url');
        meta.content = window.location.href;
        document.head.appendChild(meta);
      }

      // Twitter Card tags
      const twitterCard = document.querySelector('meta[name="twitter:card"]');
      if (!twitterCard) {
        const meta = document.createElement('meta');
        meta.name = 'twitter:card';
        meta.content = 'summary_large_image';
        document.head.appendChild(meta);
      }

      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle) {
        twitterTitle.setAttribute('content', post.title);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'twitter:title';
        meta.content = post.title;
        document.head.appendChild(meta);
      }

      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescription) {
        twitterDescription.setAttribute('content', post.excerpt || '');
      } else {
        const meta = document.createElement('meta');
        meta.name = 'twitter:description';
        meta.content = post.excerpt || '';
        document.head.appendChild(meta);
      }

      if (post.featured_image) {
        const twitterImage = document.querySelector('meta[name="twitter:image"]');
        if (twitterImage) {
          twitterImage.setAttribute('content', post.featured_image);
        } else {
          const meta = document.createElement('meta');
          meta.name = 'twitter:image';
          meta.content = post.featured_image;
          document.head.appendChild(meta);
        }
      }

      // Schema.org JSON-LD
      let schemaScript = document.querySelector('script[type="application/ld+json"]');
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }

      const schema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt || '',
        image: post.featured_image || '',
        datePublished: post.published_at,
        dateModified: post.updated_at || post.published_at,
        author: {
          '@type': 'Person',
          name: post.author || 'Leonce Ouattara',
          url: 'https://leonceouattara.com',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Leonce Ouattara Studio',
          logo: {
            '@type': 'ImageObject',
            url: 'https://leonceouattara.com/logo.png',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': window.location.href,
        },
        wordCount: post.content ? post.content.replace(/<[^>]*>/g, '').split(/\s+/).length : 0,
        articleBody: post.excerpt || '',
        keywords: post.tags ? post.tags.join(', ') : '',
      };

      schemaScript.textContent = JSON.stringify(schema);
    }

    return () => {
      document.title = 'Leonce Ouattara - Portfolio';
      // Nettoyer Schema.org
      const schemaScript = document.querySelector('script[type="application/ld+json"]');
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [post]);

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
      
      // Track GA event
      if (post) {
        trackShare(platform, post.slug);
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Veuillez entrer votre adresse email');
      return;
    }

    try {
      const response = await mailchimpService.subscribe({
        email,
        source: 'article',
        tags: post?.category_name ? [post.category_name] : [],
      });

      if (response.success) {
        setNewsletterSubmitted(true);
        setEmail('');
        toast.success(response.message);
        
        // Track GA event
        trackNewsletterSignup('article');
        
        setTimeout(() => setNewsletterSubmitted(false), 5000);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Newsletter error:', error);
      toast.error('Erreur lors de l\'inscription. Veuillez réessayer.');
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
          <button
            onClick={() => navigate('/blog')}
            className="text-cyan-400 hover:underline flex items-center gap-2 justify-center mx-auto"
          >
            <ArrowLeft size={20} />
            Retour au blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Arrière-plan sobre sans animation pour meilleure lecture */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 -z-10"></div>
      
      {/* Header Simple - Logo + Bouton RDV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 hover:scale-105 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/25">
                lOS
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Leonce Ouattara Studio
                </span>
              </div>
            </Link>

            {/* Bouton Prendre RDV */}
            <a
              href="/#contact"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all font-medium"
            >
              <Phone size={20} />
              <span className="hidden sm:inline">Prendre RDV</span>
              <span className="sm:hidden">RDV</span>
            </a>
          </div>
        </div>
      </nav>

      <div className="relative z-10">
        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto px-6 pt-24">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link to="/" className="hover:text-cyan-400 transition-colors">
              Accueil
            </Link>
            <ChevronRight size={16} />
            <Link to="/blog" className="hover:text-cyan-400 transition-colors">
              Blog
            </Link>
            {post.category_name && (
              <>
                <ChevronRight size={16} />
                <span className="text-cyan-400">{post.category_name}</span>
              </>
            )}
          </nav>

          {/* Catégorie Badge */}
          {post.category_name && (
            <div className="mb-6">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: `${post.category_color}20`,
                  color: post.category_color,
                  border: `1px solid ${post.category_color}40`,
                }}
              >
                {post.category_name}
              </span>
            </div>
          )}

          {/* Titre */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-6 text-gray-400 pb-8 mb-8 border-b border-gray-700/50">
            <div className="flex items-center gap-2">
              <User size={18} />
              <span className="font-medium">{post.author}</span>
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

          {/* Partage Social (Sticky top) */}
          <div className="mb-8 p-4 bg-white/5 border border-gray-700/50 rounded-xl">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <p className="text-sm text-gray-400">Partager cet article :</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-3 bg-[#0A66C2] hover:bg-[#004182] rounded-lg transition-colors"
                  title="Partager sur LinkedIn"
                >
                  <Linkedin size={20} />
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-3 bg-[#1877F2] hover:bg-[#0d5dbf] rounded-lg transition-colors"
                  title="Partager sur Facebook"
                >
                  <Facebook size={20} />
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-3 bg-[#1DA1F2] hover:bg-[#0d8bd9] rounded-lg transition-colors"
                  title="Partager sur Twitter"
                >
                  <Twitter size={20} />
                </button>
                <button
                  onClick={handleCopyLink}
                  className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors relative"
                  title="Copier le lien"
                >
                  {copySuccess ? <Check size={20} className="text-green-400" /> : <Link2 size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Image à la une */}
        {post.featured_image && (
          <div className="max-w-5xl mx-auto px-6 mb-12">
            <div className="aspect-video rounded-2xl overflow-hidden border border-gray-700/50">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Contenu principal */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="flex gap-8">
            {/* Sidebar Table des Matières (desktop only) */}
            {tableOfContents.length > 0 && (
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24">
                  <div className="bg-white/5 border border-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <List size={20} className="text-cyan-400" />
                      <h3 className="font-semibold text-white">Table des matières</h3>
                    </div>
                    <nav className="space-y-2">
                      {tableOfContents.map(({ id, text, level }) => (
                        <a
                          key={id}
                          href={`#${id}`}
                          className={`block text-sm transition-colors ${
                            level === 3 ? 'pl-4' : ''
                          } ${
                            activeTocId === id
                              ? 'text-cyan-400 font-medium'
                              : 'text-gray-400 hover:text-white'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(id)?.scrollIntoView({
                              behavior: 'smooth',
                              block: 'start',
                            });
                          }}
                        >
                          {text}
                        </a>
                      ))}
                    </nav>
                  </div>
                </div>
              </aside>
            )}

            {/* Contenu principal */}
            <div className="flex-1 max-w-4xl">
              {/* Article content - Styles améliorés pour TinyMCE */}
          <style>
            {`
              .article-content {
                color: #d1d5db;
                font-size: 18px;
                line-height: 1.8;
              }
              
              /* Titres */
              .article-content h1 {
                color: #ffffff;
                font-size: 2.5rem;
                font-weight: 700;
                margin-top: 3rem;
                margin-bottom: 1.5rem;
                line-height: 1.2;
              }
              
              .article-content h2 {
                color: #ffffff;
                font-size: 2rem;
                font-weight: 700;
                margin-top: 3rem;
                margin-bottom: 1.5rem;
                line-height: 1.3;
                border-bottom: 2px solid #374151;
                padding-bottom: 0.5rem;
              }
              
              .article-content h3 {
                color: #ffffff;
                font-size: 1.5rem;
                font-weight: 600;
                margin-top: 2rem;
                margin-bottom: 1rem;
                line-height: 1.4;
              }
              
              .article-content h4 {
                color: #e5e7eb;
                font-size: 1.25rem;
                font-weight: 600;
                margin-top: 1.5rem;
                margin-bottom: 0.75rem;
              }
              
              /* Paragraphes */
              .article-content p {
                color: #d1d5db;
                margin-bottom: 1.5rem;
                line-height: 1.8;
              }
              
              /* Listes à puces */
              .article-content ul {
                list-style-type: disc;
                margin-left: 2rem;
                margin-bottom: 1.5rem;
                color: #d1d5db;
              }
              
              .article-content ul li {
                margin-bottom: 0.75rem;
                padding-left: 0.5rem;
                line-height: 1.7;
              }
              
              .article-content ul li::marker {
                color: #06b6d4;
              }
              
              /* Listes numérotées */
              .article-content ol {
                list-style-type: decimal;
                margin-left: 2rem;
                margin-bottom: 1.5rem;
                color: #d1d5db;
              }
              
              .article-content ol li {
                margin-bottom: 0.75rem;
                padding-left: 0.5rem;
                line-height: 1.7;
              }
              
              .article-content ol li::marker {
                color: #06b6d4;
                font-weight: 600;
              }
              
              /* Listes imbriquées */
              .article-content ul ul,
              .article-content ol ol,
              .article-content ul ol,
              .article-content ol ul {
                margin-top: 0.5rem;
                margin-bottom: 0.5rem;
              }
              
              /* Liens */
              .article-content a {
                color: #06b6d4;
                text-decoration: none;
                border-bottom: 1px solid transparent;
                transition: all 0.2s;
              }
              
              .article-content a:hover {
                border-bottom-color: #06b6d4;
              }
              
              /* Strong */
              .article-content strong {
                color: #ffffff;
                font-weight: 600;
              }
              
              /* Em */
              .article-content em {
                font-style: italic;
                color: #e5e7eb;
              }
              
              /* Blockquotes */
              .article-content blockquote {
                border-left: 4px solid #06b6d4;
                background: rgba(6, 182, 212, 0.1);
                padding: 1.5rem;
                margin: 2rem 0;
                border-radius: 0 0.5rem 0.5rem 0;
                font-style: italic;
                color: #e5e7eb;
              }
              
              /* Code inline */
              .article-content code {
                background: #1f2937;
                color: #06b6d4;
                padding: 0.25rem 0.5rem;
                border-radius: 0.25rem;
                font-size: 0.9em;
                font-family: 'Courier New', monospace;
              }
              
              /* Code blocks */
              .article-content pre {
                background: #111827;
                border: 1px solid #374151;
                border-radius: 0.75rem;
                padding: 1.5rem;
                margin: 2rem 0;
                overflow-x: auto;
              }
              
              .article-content pre code {
                background: transparent;
                padding: 0;
                color: #e5e7eb;
                font-size: 0.95em;
              }
              
              /* Images */
              .article-content img {
                border-radius: 0.75rem;
                margin: 2rem 0;
                max-width: 100%;
                height: auto;
                border: 1px solid #374151;
              }
              
              /* Tables */
              .article-content table {
                width: 100%;
                border-collapse: collapse;
                margin: 2rem 0;
                border: 1px solid #374151;
              }
              
              .article-content th {
                background: #1f2937;
                color: #ffffff;
                padding: 0.75rem;
                text-align: left;
                font-weight: 600;
                border: 1px solid #374151;
              }
              
              .article-content td {
                padding: 0.75rem;
                border: 1px solid #374151;
                color: #d1d5db;
              }
              
              .article-content tr:nth-child(even) {
                background: rgba(255, 255, 255, 0.02);
              }
              
              /* HR */
              .article-content hr {
                border: none;
                border-top: 2px solid #374151;
                margin: 3rem 0;
              }
            `}
          </style>
          
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Tags associés</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white/5 border border-gray-700/50 rounded-lg text-sm text-gray-300 hover:text-white hover:border-cyan-500/50 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Articles Similaires */}
          {similarPosts && similarPosts.length > 0 && (
            <div className="mt-16 pt-8 border-t border-gray-700/50">
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-cyan-500 to-purple-500 rounded-full"></div>
                Lire aussi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {similarPosts.map((similarPost: any) => (
                  <Link
                    key={similarPost.id}
                    to={`/blog/${similarPost.slug}`}
                    className="group bg-white/5 border border-gray-700/50 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
                  >
                    {/* Image */}
                    {similarPost.featured_image && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={similarPost.featured_image}
                          alt={similarPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    {/* Contenu */}
                    <div className="p-4">
                      {/* Badge catégorie */}
                      {similarPost.category_name && (
                        <div className="mb-3">
                          <span
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                            style={{
                              backgroundColor: `${similarPost.category_color}20`,
                              color: similarPost.category_color,
                            }}
                          >
                            {similarPost.category_name}
                          </span>
                        </div>
                      )}
                      
                      {/* Titre */}
                      <h4 className="font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {similarPost.title}
                      </h4>
                      
                      {/* Meta */}
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          {similarPost.reading_time} min
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye size={12} />
                          {similarPost.views || 0}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Newsletter Section (comme BDM) */}
          <div className="mt-16 p-8 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-2xl">
            <div className="max-w-2xl mx-auto text-center">
              <Mail size={48} className="mx-auto mb-4 text-cyan-400" />
              <h3 className="text-2xl font-bold text-white mb-3">
                Restez informé des dernières tendances tech
              </h3>
              <p className="text-gray-400 mb-6">
                Recevez chaque semaine nos meilleurs articles directement dans votre boîte mail.
              </p>

              {newsletterSubmitted ? (
                <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl">
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <Check size={20} />
                    <span className="font-medium">Merci pour votre inscription !</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    required
                    className="flex-1 px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                  >
                    S'abonner
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Section Commentaires */}
          {post && <BlogComments postId={post.id} />}

          {/* Partage final + Retour */}
          <div className="mt-12 pt-8 border-t border-gray-700/50">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <button
                onClick={() => navigate('/blog')}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-gray-700/50 rounded-xl transition-colors"
              >
                <ArrowLeft size={20} />
                Retour au blog
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Partager :</span>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Linkedin size={20} className="text-gray-400 hover:text-[#0A66C2]" />
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Facebook size={20} className="text-gray-400 hover:text-[#1877F2]" />
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Twitter size={20} className="text-gray-400 hover:text-[#1DA1F2]" />
                </button>
              </div>
            </div>
          </div>
            </div> {/* Fin contenu principal */}
          </div> {/* Fin flex */}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogArticlePage;
