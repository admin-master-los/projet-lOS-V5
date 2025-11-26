import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  ExternalLink,
  FolderOpen,
  Calendar,
  Tag,
} from 'lucide-react';
import { useProjects, useDeleteProject } from '../hooks/useProjects';
import { toast } from 'react-hot-toast';

/**
 * Page admin de gestion des projets
 * Liste, recherche, filtres, et actions CRUD
 */

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tech: string[];
  results: string[];
  link: string;
  content_project_modal: any;
  created_at: string;
}

const Projects: React.FC = () => {
  const { data: projects, isLoading: loading } = useProjects();
  const deleteMutation = useDeleteProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Extraire toutes les technologies uniques
  const allTechnologies = React.useMemo(() => {
    if (!projects) return [];
    const techSet = new Set<string>();
    projects.forEach((project: Project) => {
      project.tech?.forEach((t: string) => techSet.add(t));
    });
    return Array.from(techSet).sort();
  }, [projects]);

  // Filtrer les projets
  const filteredProjects = React.useMemo(() => {
    if (!projects) return [];
    
    return projects.filter((project: Project) => {
      const matchesSearch = 
        project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTech = 
        !selectedTech || project.tech?.includes(selectedTech);
      
      return matchesSearch && matchesTech;
    });
  }, [projects, searchTerm, selectedTech]);

  // Supprimer un projet
  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('✅ Projet supprimé avec succès !');
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('❌ Erreur lors de la suppression du projet');
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
            <FolderOpen className="text-cyan-400" size={32} />
            Projets Portfolio
          </h1>
          <p className="text-gray-400 mt-2">
            Gérez vos projets et réalisations
          </p>
        </div>
        <Link
          to="/admin/projects/new"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
        >
          <Plus size={20} />
          Nouveau Projet
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/20 rounded-lg">
              <FolderOpen className="text-cyan-400" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Projets</p>
              <p className="text-2xl font-bold text-white">{projects?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Tag className="text-purple-400" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Technologies</p>
              <p className="text-2xl font-bold text-white">{allTechnologies.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <ExternalLink className="text-green-400" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Avec Démo</p>
              <p className="text-2xl font-bold text-white">
                {projects?.filter((p: Project) => 
                  p.content_project_modal?.demo_link && 
                  p.content_project_modal?.demo_link !== '#'
                ).length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Calendar className="text-orange-400" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Ce mois</p>
              <p className="text-2xl font-bold text-white">
                {projects?.filter((p: Project) => {
                  const projectDate = new Date(p.created_at);
                  const now = new Date();
                  return projectDate.getMonth() === now.getMonth() &&
                         projectDate.getFullYear() === now.getFullYear();
                }).length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et Recherche */}
      <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un projet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Filtre technologie */}
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer"
            >
              <option value="">Toutes les technologies</option>
              {allTechnologies.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
          </div>

          {/* Reset filtres */}
          {(searchTerm || selectedTech) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedTech('');
              }}
              className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Liste des projets */}
      <div className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-gray-700/50">
              <tr>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold">Image</th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold">Projet</th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold">Technologies</th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold">Résultats</th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold">Date</th>
                <th className="text-right px-6 py-4 text-gray-400 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    {searchTerm || selectedTech 
                      ? 'Aucun projet ne correspond à vos critères de recherche'
                      : 'Aucun projet pour le moment'
                    }
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project: Project) => (
                  <tr
                    key={project.id}
                    className="border-b border-gray-700/30 hover:bg-white/5 transition-colors"
                  >
                    {/* Image */}
                    <td className="px-6 py-4">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </td>

                    {/* Titre et description */}
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="font-semibold text-white truncate">
                          {project.title}
                        </p>
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                    </td>

                    {/* Technologies */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {project.tech?.slice(0, 3).map((tech: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-md"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.tech?.length > 3 && (
                          <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-md">
                            +{project.tech.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Résultats */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-400">
                        {project.results?.[0] || 'N/A'}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-400">
                        {new Date(project.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* Voir */}
                        {project.link && project.link !== '#' && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                            title="Voir le projet"
                          >
                            <Eye size={18} />
                          </a>
                        )}

                        {/* Modifier */}
                        <Link
                          to={`/admin/projects/${project.id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </Link>

                        {/* Supprimer */}
                        {deleteConfirm === project.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDelete(project.id)}
                              className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors text-xs"
                            >
                              Confirmer
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors text-xs"
                            >
                              Annuler
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(project.id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
        {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''} affiché{filteredProjects.length > 1 ? 's' : ''}
        {(searchTerm || selectedTech) && ` sur ${projects?.length || 0} total`}
      </div>
    </div>
  );
};

export default Projects;
