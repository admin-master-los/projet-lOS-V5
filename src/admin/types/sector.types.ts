/**
 * Types TypeScript pour les secteurs d'activité
 * Définit la structure complète des données secteurs incluant le contenu modal enrichi
 */

/**
 * Structure d'un point fort (highlight) dans le contenu modal
 * Chaque highlight représente une fonctionnalité ou avantage clé du secteur
 */
export interface SectorHighlight {
  icon: string;          // Nom de l'icône Lucide (ex: 'ShoppingBag')
  title: string;         // Titre du point fort
  description: string;   // Description détaillée
}

/**
 * Structure de l'étude de cas (case study) dans le contenu modal
 * Présente un exemple concret de réussite client
 */
export interface SectorCaseStudy {
  title: string;         // Titre de l'étude de cas (ex: "Cas Client : Boutique AfroChic")
  results: string[];     // Liste des résultats chiffrés
}

/**
 * Structure complète du contenu modal d'un secteur
 * Ce contenu est stocké en JSONB dans Supabase et contient toute la richesse
 * d'information affichée dans la modal de détail du secteur
 */
export interface SectorContentModal {
  hero_title: string;        // Titre principal de la modal
  hero_subtitle: string;     // Sous-titre explicatif
  description: string;       // Description complète du secteur
  highlights: SectorHighlight[];  // Liste des points forts (généralement 4)
  tech_stack: string[];      // Technologies utilisées (ex: ['React', 'Node.js'])
  case_study: SectorCaseStudy;   // Étude de cas avec résultats
  cta_text: string;          // Texte du bouton d'appel à l'action
}

/**
 * Interface principale d'un secteur
 * Représente un secteur d'activité complet avec toutes ses données
 */
export interface Sector {
  id: string;                    // Identifiant unique (ex: 'ecommerce-pme')
  title: string;                 // Titre du secteur (ex: 'Boutique en Ligne PME/PMI')
  description: string;           // Description courte pour la card
  services: string[];            // Liste des services offerts
  icon: string;                  // Nom de l'icône Lucide (ex: 'ShoppingCart')
  content_modal: SectorContentModal;  // Contenu enrichi pour la modal
  image: string;                 // URL de l'image (généralement Pexels)
  created_at: string;            // Date de création (ISO 8601)
  updated_at?: string;           // Date de dernière modification (ISO 8601)
}

/**
 * Données pour créer un nouveau secteur
 * Similaire à Sector mais sans id, created_at et updated_at qui sont générés automatiquement
 */
export interface SectorCreateInput {
  id: string;                    // ID personnalisé (slug-format: 'mon-secteur')
  title: string;
  description: string;
  services: string[];
  icon: string;
  content_modal: SectorContentModal;
  image: string;
}

/**
 * Données pour mettre à jour un secteur existant
 * Tous les champs sont optionnels sauf l'ID
 */
export interface SectorUpdateInput {
  id: string;                    // ID du secteur à modifier (requis)
  title?: string;
  description?: string;
  services?: string[];
  icon?: string;
  content_modal?: SectorContentModal;
  image?: string;
}

/**
 * Type pour les données de formulaire dans l'interface
 * Utilisé pour l'édition avant conversion vers SectorCreateInput/UpdateInput
 */
export interface SectorFormData {
  id: string;
  title: string;
  description: string;
  services: string[];
  icon: string;
  image: string;
  // Champs du content_modal dépliés pour faciliter l'édition
  hero_title: string;
  hero_subtitle: string;
  modal_description: string;
  highlights: SectorHighlight[];
  tech_stack: string[];
  case_study_title: string;
  case_study_results: string[];
  cta_text: string;
}
