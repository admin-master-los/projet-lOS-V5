import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Eye,
  X,
  Plus,
  FileText,
  Code,
  Tag as TagIcon,
  Calendar,
} from 'lucide-react';
import {
  useBlogPost,
  useCreateBlogPost,
  useUpdateBlogPost,
  generateSlug,
} from '../hooks/useBlogPosts';
import { useBlogCategories } from '../hooks/useBlogCategories';
import { toast } from 'react-hot-toast';
import TinyMCEEditor from '../components/blog/TinyMCEEditor';
import ImageUploader from '../components/common/ImageUploader';

interface BlogFormData {
  title: string;
  slug: string;
  category_id: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author: string;
  tags: string[];
  status: 'draft' | 'published';
  reading_time: number;
  meta_title: string;
  meta_description: string;
  published_at: string;
}

const BlogForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const { data: postData, isLoading: loadingData } = useBlogPost(id || null);
  const { data: categories } = useBlogCategories();
  const createMutation = useCreateBlogPost();
  const updateMutation = useUpdateBlogPost();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [newTag, setNewTag] = useState('');

  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    category_id: '',
    excerpt: '',
    content: '',
    featured_image: '',
    author: 'Leonce Ouattara',
    tags: [],
    status: 'draft',
    reading_time: 0,
    meta_title: '',
    meta_description: '',
    published_at: '',
  });

  useEffect(() => {
    if (postData) {
      setFormData({
        title: postData.title || '',
        slug: postData.slug || '',
        category_id: postData.category_id || '',
        excerpt: postData.excerpt || '',
        content: postData.content || '',
        featured_image: postData.featured_image || '',
        author: postData.author || 'Leonce Ouattara',
        tags: postData.tags || [],
        status: postData.status || 'draft',
        reading_time: postData.reading_time || 0,
        meta_title: postData.meta_title || '',
        meta_description: postData.meta_description || '',
        published_at: postData.published_at || '',
      });
    }
  }, [postData]);

  useEffect(() => {
    if (!isEditMode && formData.title) {
      const autoSlug = generateSlug(formData.title);
      setFormData((prev) => ({ ...prev, slug: autoSlug }));
    }
  }, [formData.title, isEditMode]);

  useEffect(() => {
    if (formData.content) {
      const text = formData.content.replace(/<[^>]*>/g, '');
      const wordCount = text.split(/\s+/).filter(Boolean).length;
      const readingTime = Math.max(1, Math.round(wordCount / 200));
      setFormData((prev) => ({ ...prev, reading_time: readingTime }));
    }
  }, [formData.content]);

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.title.trim()) {
        toast.error('Le titre est requis');
        setLoading(false);
        return;
      }
      if (!formData.content.trim()) {
        toast.error('Le contenu est requis');
        setLoading(false);
        return;
      }
      if (!formData.category_id) {
        toast.error('La catégorie est requise');
        setLoading(false);
        return;
      }

      const postData = {
        ...formData,
        status: publish ? 'published' : formData.status,
        published_at:
          publish && !formData.published_at
            ? new Date().toISOString()
            : formData.published_at,
      };

      if (isEditMode && id) {
        await updateMutation.mutateAsync({
          id,
          data: postData,
        });
        toast.success(
          publish
            ? '✅ Article publié avec succès !'
            : '✅ Article modifié avec succès !'
        );
      } else {
        await createMutation.mutateAsync({
          slug: postData.slug,
          title: postData.title,
          excerpt: postData.excerpt,
          content: postData.content,
          featured_image: postData.featured_image,
          author: postData.author,
          category_id: postData.category_id,
          tags: postData.tags,
          status: postData.status,
          reading_time: postData.reading_time,
          meta_title: postData.meta_title,
          meta_description: postData.meta_description,
          published_at: postData.published_at,
        });
        toast.success(
          publish
            ? '✅ Article créé et publié !'
            : '✅ Article créé en brouillon !'
        );
      }

      navigate('/admin/blog');
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(`❌ Erreur: ${error.message || 'Une erreur est survenue'}`);
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'content', label: 'Contenu', icon: FileText },
    { id: 'editor', label: 'Éditeur', icon: Code },
    { id: 'seo', label: 'Tags & SEO', icon: TagIcon },
    { id: 'publication', label: 'Publication', icon: Calendar },
  ];

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/blog')}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <ArrowLeft className="text-gray-400" size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {isEditMode ? 'Modifier l\'article' : 'Nouvel article'}
            </h1>
            <p className="text-gray-400 mt-1">
              {isEditMode
                ? 'Modifiez les informations de l\'article'
                : 'Créez un nouvel article pour votre blog'}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/blog')}
            className="px-6 py-3 border border-gray-600 text-white rounded-xl hover:bg-white/5 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors disabled:opacity-50"
          >
            <Save size={20} />
            {loading ? 'Enregistrement...' : 'Enregistrer brouillon'}
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50"
          >
            <Eye size={20} />
            Publier
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl p-2">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors
                  ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8">
        {/* TAB 1: Contenu */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              Informations de base
            </h2>

            <div>
              <label className="block text-white font-semibold mb-2">
                Titre de l'article *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                placeholder="Mon Premier Article React"
                required
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Slug (URL)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                placeholder="mon-premier-article-react"
              />
              <p className="text-sm text-gray-400 mt-2">
                URL de l'article : /blog/{formData.slug || 'slug-automatique'}
              </p>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Catégorie *
              </label>
              <select
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer"
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {categories?.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Résumé (Excerpt)
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                rows={4}
                maxLength={200}
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 resize-none"
                placeholder="Un résumé court de votre article (150-200 caractères)..."
              />
              <p className="text-sm text-gray-400 mt-2">
                {formData.excerpt.length}/200 caractères
              </p>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Image à la une
              </label>
              <ImageUploader
                value={formData.featured_image}
                onChange={(url) =>
                  setFormData({ ...formData, featured_image: url })
                }
                folder="blog"
                label=""
                helpText="Recommandé : 1200×630px minimum, format JPG ou PNG"
              />
            </div>
          </div>
        )}

        {/* TAB 2: Éditeur */}
        {activeTab === 'editor' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Contenu de l'article
              </h2>
              <div className="text-sm text-gray-400">
                {formData.content
                  ? `${
                      formData.content.replace(/<[^>]*>/g, '').split(/\s+/)
                        .length
                    } mots`
                  : '0 mots'}
              </div>
            </div>

            <TinyMCEEditor
              value={formData.content}
              onChange={(content) =>
                setFormData({ ...formData, content })
              }
              height={600}
              placeholder="Écrivez votre article ici..."
            />
          </div>
        )}

        {/* TAB 3: Tags & SEO */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              Tags & Référencement
            </h2>

            <div>
              <label className="block text-white font-semibold mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === 'Enter' && (e.preventDefault(), addTag())
                  }
                  className="flex-1 px-4 py-2 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                  placeholder="Ex: React, TypeScript, Tutorial..."
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-2 px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-400"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Meta Title (SEO)
              </label>
              <input
                type="text"
                value={formData.meta_title}
                onChange={(e) =>
                  setFormData({ ...formData, meta_title: e.target.value })
                }
                maxLength={60}
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                placeholder="Titre pour les moteurs de recherche (60 caractères max)"
              />
              <p className="text-sm text-gray-400 mt-2">
                {formData.meta_title.length}/60 caractères
              </p>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Meta Description (SEO)
              </label>
              <textarea
                value={formData.meta_description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    meta_description: e.target.value,
                  })
                }
                rows={3}
                maxLength={160}
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 resize-none"
                placeholder="Description pour les moteurs de recherche (160 caractères max)"
              />
              <p className="text-sm text-gray-400 mt-2">
                {formData.meta_description.length}/160 caractères
              </p>
            </div>

            <div className="p-4 bg-white/5 border border-gray-700/50 rounded-xl">
              <p className="text-xs text-gray-500 mb-2">
                Aperçu Google Search:
              </p>
              <div className="space-y-1">
                <p className="text-blue-500 text-lg">
                  {formData.meta_title || formData.title || 'Titre de l\'article'}
                </p>
                <p className="text-xs text-green-600">
                  votresite.com › blog › {formData.slug || 'slug'}
                </p>
                <p className="text-sm text-gray-400">
                  {formData.meta_description ||
                    formData.excerpt ||
                    'Description de l\'article...'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Publication */}
        {activeTab === 'publication' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              Options de publication
            </h2>

            <div>
              <label className="block text-white font-semibold mb-2">
                Statut
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, status: 'draft' })
                  }
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    formData.status === 'draft'
                      ? 'border-yellow-500 bg-yellow-500/20'
                      : 'border-gray-600 hover:border-yellow-500/50'
                  }`}
                >
                  <p className="text-white font-semibold">Brouillon</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Visible uniquement par vous
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, status: 'published' })
                  }
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    formData.status === 'published'
                      ? 'border-green-500 bg-green-500/20'
                      : 'border-gray-600 hover:border-green-500/50'
                  }`}
                >
                  <p className="text-white font-semibold">Publié</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Visible par tous
                  </p>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Auteur
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Temps de lecture (minutes)
              </label>
              <input
                type="number"
                value={formData.reading_time}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reading_time: parseInt(e.target.value) || 0,
                  })
                }
                min="1"
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
              />
              <p className="text-sm text-gray-400 mt-2">
                ℹ️ Calculé automatiquement (200 mots/min). Vous pouvez le
                modifier manuellement.
              </p>
            </div>

            {formData.status === 'published' && (
              <div>
                <label className="block text-white font-semibold mb-2">
                  Date de publication
                </label>
                <input
                  type="datetime-local"
                  value={
                    formData.published_at
                      ? new Date(formData.published_at)
                          .toISOString()
                          .slice(0, 16)
                      : ''
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      published_at: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : '',
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  );
};

export default BlogForm;
