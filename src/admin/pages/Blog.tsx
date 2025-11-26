import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Folder,
} from 'lucide-react';
import {
  useBlogPosts,
  useDeleteBlogPost,
  usePublishBlogPost,
  useUnpublishBlogPost,
} from '../hooks/useBlogPosts';
import { useBlogCategories } from '../hooks/useBlogCategories';
import { toast } from 'react-hot-toast';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featured_image: string;
  category_id: string;
  category_name?: string;
  category_color?: string;
  tags: string[];
  status: 'draft' | 'published';
  views: number;
  reading_time: number;
  published_at: string;
  created_at: string;
}

const Blog: React.FC = () => {
  const { data: posts, isLoading: loading } = useBlogPosts();
  const { data: categories } = useBlogCategories();
  const deleteMutation = useDeleteBlogPost();
  const publishMutation = usePublishBlogPost();
  const unpublishMutation = useUnpublishBlogPost();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const stats = useMemo(() => {
    if (!posts) return { total: 0, published: 0, draft: 0, totalViews: 0 };
    
    return {
      total: posts.length,
      published: posts.filter((p: BlogPost) => p.status === 'published').length,
      draft: posts.filter((p: BlogPost) => p.status === 'draft').length,
      totalViews: posts.reduce((sum: number, p: BlogPost) => sum + (p.views || 0), 0),
    };
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    
    return posts.filter((post: BlogPost) => {
      const matchesSearch = 
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        !selectedCategory || post.category_id === selectedCategory;
      
      const matchesStatus = 
        !selectedStatus || post.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [posts, searchTerm, selectedCategory, selectedStatus]);

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('✅ Article supprimé avec succès !');
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('❌ Erreur lors de la suppression de l\'article');
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await publishMutation.mutateAsync(id);
      toast.success('✅ Article publié avec succès !');
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
      toast.error('❌ Erreur lors de la publication');
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      await unpublishMutation.mutateAsync(id);
      toast.success('✅ Article mis en brouillon');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('❌ Erreur lors de la dépublication');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FileText className="text-cyan-400" size={32} />
            Articles de Blog
          </h1>
          <p className="text-gray-400 mt-2">
            Gérez vos articles, brouillons et publications
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/blog/categories"
            className="flex items-center gap-2 px-6 py-3 border border-gray-600 text-white rounded-xl hover:bg-white/5 transition-colors"
          >
            <Folder size={20} />
            Catégories
          </Link>
          <Link
            to="/admin/blog/new"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
          >
            <Plus size={20} />
            Nouvel Article
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/20 rounded-lg">
              <FileText className="text-cyan-400" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Articles</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <CheckCircle className="text-green-400" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Publiés</p>
              <p className="text-2xl font-bold text-white">{stats.published}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <AlertCircle className="text-yellow-400" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Brouillons</p>
              <p className="text-2xl font-bold text-white">{stats.draft}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <TrendingUp className="text-purple-400" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Vues</p>
              <p className="text-2xl font-bold text-white">
                {stats.totalViews.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et Recherche */}
      <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="relative min-w-[200px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer"
            >
              <option value="">Toutes les catégories</option>
              {categories?.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative min-w-[200px]">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer"
            >
              <option value="">Tous les statuts</option>
              <option value="published">Publiés</option>
              <option value="draft">Brouillons</option>
            </select>
          </div>

          {(searchTerm || selectedCategory || selectedStatus) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedStatus('');
              }}
              className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Liste des articles */}
      <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-gray-700/50">
              <tr>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold">Article</th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold">Catégorie</th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold">Statut</th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold">Stats</th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold">Date</th>
                <th className="text-right px-6 py-4 text-gray-400 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    {searchTerm || selectedCategory || selectedStatus
                      ? 'Aucun article ne correspond à vos critères'
                      : 'Aucun article pour le moment'}
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post: BlogPost) => (
                  <tr
                    key={post.id}
                    className="border-b border-gray-700/30 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {post.featured_image && (
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-20 h-14 object-cover rounded-lg"
                          />
                        )}
                        <div className="max-w-md">
                          <p className="font-semibold text-white line-clamp-1">
                            {post.title}
                          </p>
                          <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {post.category_name && (
                        <span
                          className="px-3 py-1 rounded-full text-sm font-medium"
                          style={{
                            backgroundColor: `${post.category_color}20`,
                            color: post.category_color,
                          }}
                        >
                          {post.category_name}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {post.status === 'published' ? (
                        <span className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium w-fit">
                          <CheckCircle size={14} />
                          Publié
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium w-fit">
                          <AlertCircle size={14} />
                          Brouillon
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Eye size={14} />
                          {post.views || 0} vues
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          {post.reading_time || 0} min
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-400">
                        {post.status === 'published' && post.published_at
                          ? new Date(post.published_at).toLocaleDateString('fr-FR')
                          : new Date(post.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {post.status === 'draft' ? (
                          <button
                            onClick={() => handlePublish(post.id)}
                            className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-colors"
                            title="Publier"
                          >
                            <CheckCircle size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnpublish(post.id)}
                            className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-lg transition-colors"
                            title="Mettre en brouillon"
                          >
                            <AlertCircle size={18} />
                          </button>
                        )}

                        <Link
                          to={`/admin/blog/${post.id}/edit`}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </Link>

                        {deleteConfirm === post.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="px-3 py-1 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors text-xs"
                            >
                              Confirmer
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-3 py-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors text-xs"
                            >
                              Annuler
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(post.id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Résumé */}
      <div className="text-center text-gray-400 text-sm">
        {filteredPosts.length} article{filteredPosts.length > 1 ? 's' : ''} affiché
        {filteredPosts.length > 1 ? 's' : ''}
        {(searchTerm || selectedCategory || selectedStatus) && ` sur ${posts?.length || 0} total`}
      </div>
    </div>
  );
};

export default Blog;
