import React, { useState } from 'react';
import {
  Settings,
  Save,
  Globe,
  Mail,
  Search as SearchIcon,
  Lock,
  Zap,
  AlertCircle,
} from 'lucide-react';
import {
  useSettings,
  useUpdateSetting,
  useUpdateMultipleSettings,
} from '../../hooks/useSettings';
import Button from '../common/Button';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import { useToast } from '../../hooks/useToast';

interface SettingCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const CATEGORIES: SettingCategory[] = [
  {
    id: 'general',
    title: 'Général',
    description: 'Paramètres généraux du site',
    icon: <Globe className="w-5 h-5" />,
  },
  {
    id: 'email',
    title: 'Email',
    description: 'Configuration SMTP',
    icon: <Mail className="w-5 h-5" />,
  },
  {
    id: 'seo',
    title: 'SEO',
    description: 'Optimisation pour les moteurs de recherche',
    icon: <SearchIcon className="w-5 h-5" />,
  },
  {
    id: 'integrations',
    title: 'Intégrations',
    description: 'Services tiers et API',
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: 'security',
    title: 'Sécurité',
    description: 'Paramètres de sécurité',
    icon: <Lock className="w-5 h-5" />,
  },
];

const SystemSettingsTab: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('general');
  const [editedSettings, setEditedSettings] = useState<Record<string, any>>({});

  const { showToast } = useToast();

  // Hooks
  const { data: allSettings, isLoading } = useSettings();
  const updateSettingMutation = useUpdateSetting();
  const updateMultipleMutation = useUpdateMultipleSettings();

  // Filtrer les paramètres par catégorie
  const categorySettings = allSettings?.filter(
    (setting) => setting.category === activeCategory
  );

  // Gérer les changements
  const handleChange = (key: string, value: any) => {
    setEditedSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Sauvegarder les modifications
  const handleSave = async () => {
    try {
      const updates = Object.entries(editedSettings).map(([key, value]) => ({
        key,
        value,
      }));

      if (updates.length === 0) {
        showToast('Aucune modification à sauvegarder', 'info');
        return;
      }

      await updateMultipleMutation.mutateAsync(updates);
      showToast('Paramètres sauvegardés avec succès', 'success');
      setEditedSettings({});
    } catch (error) {
      showToast('Erreur lors de la sauvegarde', 'error');
    }
  };

  // Obtenir la valeur d'un paramètre (édité ou original)
  const getValue = (key: string, originalValue: any) => {
    return editedSettings[key] !== undefined
      ? editedSettings[key]
      : originalValue;
  };

  // Vérifier si des modifications ont été faites
  const hasChanges = Object.keys(editedSettings).length > 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec bouton de sauvegarde */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Paramètres Système
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Configurez les paramètres globaux de l'application
          </p>
        </div>
        <Button
          onClick={handleSave}
          icon={Save}
          disabled={!hasChanges}
          loading={updateMultipleMutation.isPending}
        >
          Sauvegarder les modifications
        </Button>
      </div>

      {/* Modifications en attente */}
      {hasChanges && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-900">
              Modifications non sauvegardées
            </p>
            <p className="text-sm text-amber-700 mt-1">
              Vous avez {Object.keys(editedSettings).length} modification(s) en
              attente. N'oubliez pas de sauvegarder.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar des catégories */}
        <div className="lg:col-span-1 space-y-2">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`w-full flex items-start gap-3 p-4 rounded-lg border transition-colors text-left ${
                activeCategory === category.id
                  ? 'bg-blue-50 border-blue-200 text-blue-900'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  activeCategory === category.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {category.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{category.title}</div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {category.description}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Contenu des paramètres */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {categorySettings && categorySettings.length > 0 ? (
              <div className="space-y-6">
                {categorySettings.map((setting) => (
                  <div key={setting.key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {setting.key
                        .replace(/_/g, ' ')
                        .split(' ')
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(' ')}
                    </label>

                    {setting.description && (
                      <p className="text-xs text-gray-500">
                        {setting.description}
                      </p>
                    )}

                    {/* Champ selon le type */}
                    {typeof setting.value === 'boolean' ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={setting.key}
                          checked={getValue(setting.key, setting.value)}
                          onChange={(e) =>
                            handleChange(setting.key, e.target.checked)
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor={setting.key}
                          className="text-sm text-gray-700"
                        >
                          Activé
                        </label>
                      </div>
                    ) : typeof setting.value === 'number' ? (
                      <input
                        type="number"
                        value={getValue(setting.key, setting.value)}
                        onChange={(e) =>
                          handleChange(setting.key, parseInt(e.target.value))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : setting.key.includes('description') ||
                      setting.key.includes('bio') ? (
                      <textarea
                        value={getValue(setting.key, setting.value)}
                        onChange={(e) =>
                          handleChange(setting.key, e.target.value)
                        }
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <input
                        type={
                          setting.key.includes('email')
                            ? 'email'
                            : setting.key.includes('password')
                            ? 'password'
                            : 'text'
                        }
                        value={getValue(setting.key, setting.value)}
                        onChange={(e) =>
                          handleChange(setting.key, e.target.value)
                        }
                        placeholder={
                          !setting.is_public ? '••••••' : undefined
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    )}

                    {!setting.is_public && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Paramètre privé
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucun paramètre dans cette catégorie
                </h3>
                <p className="text-gray-500">
                  Les paramètres de cette catégorie seront ajoutés
                  prochainement.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Aide contextuelle */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Aide sur les paramètres
        </h3>
        <div className="text-sm text-blue-800 space-y-1">
          {activeCategory === 'general' && (
            <>
              <p>• Les paramètres généraux affectent l'ensemble du site</p>
              <p>
                • Le mode maintenance désactive temporairement l'accès public
              </p>
            </>
          )}
          {activeCategory === 'email' && (
            <>
              <p>
                • Configurez votre serveur SMTP pour l'envoi d'emails
                automatiques
              </p>
              <p>• Testez la configuration après chaque modification</p>
            </>
          )}
          {activeCategory === 'seo' && (
            <>
              <p>
                • Les méta-données SEO améliorent le référencement naturel
              </p>
              <p>• Utilisez des mots-clés pertinents et uniques</p>
            </>
          )}
          {activeCategory === 'integrations' && (
            <>
              <p>• Les clés API sont sensibles, ne les partagez jamais</p>
              <p>
                • Certaines intégrations peuvent nécessiter une configuration
                supplémentaire
              </p>
            </>
          )}
          {activeCategory === 'security' && (
            <>
              <p>
                • Les paramètres de sécurité protègent votre application
              </p>
              <p>
                • Un mot de passe fort doit contenir au moins 8 caractères
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsTab;
