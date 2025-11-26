import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, Calendar, ArrowRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

/**
 * Composant BlogCard - Card article de blog
 * Utilisé dans la liste des articles (BlogList)
 */

interface BlogCardProps {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featured_image: string;
  category_name: string;
  category_color: string;
  category_icon: string;
  author: string;
  reading_time: number;
  views: number;
  published_at: string;
  variant?: 'default' | 'featured';
}

const BlogCard: React.FC<BlogCardProps> = ({
  slug,
  title,
  excerpt,
  featured_image,
  category_name,
  category_color,
  category_icon,
  author,
  reading_time,
  views,
  published_at,
  variant = 'default',
}) => {
  const renderIcon = (iconName: string, size = 16) => {
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

  const isFeatured = variant === 'featured';

  return (
    <Link
      to={`/blog/${slug}`}
      className={`group block bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/20 ${
        isFeatured ? 'md:col-span-2' : ''
      }`}
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-gray-800">
        {featured_image ? (
          <img
            src={featured_image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-600">
              {renderIcon(category_icon, 48)}
            </div>
          </div>
        )}

        {/* Badge catégorie sur l'image */}
        <div className="absolute top-4 left-4">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-md"
            style={{
              backgroundColor: `${category_color}40`,
              color: category_color,
              border: `1px solid ${category_color}60`,
            }}
          >
            {renderIcon(category_icon, 14)}
            {category_name}
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className={`p-6 ${isFeatured ? 'md:p-8' : ''}`}>
        {/* Titre */}
        <h3
          className={`font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2 ${
            isFeatured ? 'text-2xl md:text-3xl' : 'text-xl'
          }`}
        >
          {title}
        </h3>

        {/* Excerpt */}
        <p
          className={`text-gray-400 mb-4 ${
            isFeatured ? 'text-base line-clamp-3' : 'text-sm line-clamp-2'
          }`}
        >
          {excerpt}
        </p>

        {/* Meta infos */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          {/* Date */}
          <div className="flex items-center gap-1.5">
            <Calendar size={14} />
            {formatDate(published_at)}
          </div>

          {/* Temps de lecture */}
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            {reading_time} min
          </div>

          {/* Vues */}
          <div className="flex items-center gap-1.5">
            <Eye size={14} />
            {views || 0} vues
          </div>
        </div>

        {/* Séparateur */}
        <div className="h-px bg-gray-700/50 my-4"></div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Par <span className="text-white font-medium">{author}</span>
          </div>

          {/* Lien "Lire la suite" */}
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium group-hover:gap-3 transition-all">
            Lire la suite
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
