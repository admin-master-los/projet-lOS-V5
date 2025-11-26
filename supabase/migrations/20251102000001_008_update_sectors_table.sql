/*
  # Migration 008 - Mise à jour table sectors avec colonnes manquantes
  
  1. Modifications
    - Ajoute les colonnes manquantes : icon, content_modal, image
    - Ajoute la colonne updated_at
    - Met à jour les données existantes si nécessaire
    - Insère les nouvelles données depuis le CSV fourni
    
  2. Nouvelles colonnes
    - icon (text) : Nom de l'icône Lucide à afficher
    - content_modal (jsonb) : Contenu détaillé pour la modal du secteur
    - image (text) : URL de l'image du secteur
    - updated_at (timestamptz) : Date de dernière modification
*/

-- Ajouter les colonnes manquantes si elles n'existent pas
ALTER TABLE sectors ADD COLUMN IF NOT EXISTS icon text;
ALTER TABLE sectors ADD COLUMN IF NOT EXISTS content_modal jsonb;
ALTER TABLE sectors ADD COLUMN IF NOT EXISTS image text;
ALTER TABLE sectors ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Créer le trigger pour mettre à jour updated_at automatiquement
DROP TRIGGER IF EXISTS update_sectors_updated_at ON sectors;
CREATE TRIGGER update_sectors_updated_at
    BEFORE UPDATE ON sectors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Supprimer les données existantes (optionnel, à décommenter si besoin de repartir de zéro)
-- DELETE FROM sectors;

-- Insérer ou mettre à jour les données depuis le CSV
-- UPSERT : Si l'ID existe, on met à jour, sinon on insère

-- Secteur 1: E-commerce PME
INSERT INTO sectors (id, title, description, services, icon, content_modal, created_at, image) VALUES (
  'ecommerce-pme',
  'Boutique en Ligne PME/PMI',
  'Solutions e-commerce complètes avec gestion des stocks et paiements',
  ARRAY[
    'Boutiques Shopify/WooCommerce',
    'Gestion des stocks',
    'Paiements sécurisés',
    'Analytics de vente'
  ],
  'ShoppingCart',
  '{
    "hero_title": "E-commerce performant pour PME",
    "hero_subtitle": "Vendez en ligne avec une boutique professionnelle",
    "description": "Lancez ou optimisez votre boutique en ligne avec une solution complète : catalogue produits, gestion des stocks, paiements multi-devises et analytics de vente. Du simple site vitrine à la marketplace complexe.",
    "highlights": [
      {
        "icon": "ShoppingBag",
        "title": "Boutique Clé en Main",
        "description": "Shopify ou WooCommerce personnalisé, design responsive, catalogue illimité et optimisation mobile-first."
      },
      {
        "icon": "Package",
        "title": "Gestion des Stocks",
        "description": "Suivi en temps réel, alertes de rupture, multi-entrepôts, synchronisation avec vos fournisseurs."
      },
      {
        "icon": "CreditCard",
        "title": "Paiements Sécurisés",
        "description": "Stripe, PayPal, Mobile Money, cartes bancaires. Multi-devises et conformité PCI-DSS."
      },
      {
        "icon": "BarChart",
        "title": "Analytics de Vente",
        "description": "Tableaux de bord : CA, taux de conversion, panier moyen, clients récurrents et prévisions de vente."
      }
    ],
    "tech_stack": ["WooCommerce", "Stripe", "ShipStation", "Google Analytics"],
    "case_study": {
      "title": "Cas Client : Boutique Mode AfroChic",
      "results": [
        "+500K€ de CA en 12 mois",
        "+280% de taux de conversion",
        "2500+ commandes traitées/mois"
      ]
    },
    "cta_text": "Lancer votre boutique en ligne"
  }'::jsonb,
  '2025-10-25 01:29:20.924467+00',
  'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1920'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  services = EXCLUDED.services,
  icon = EXCLUDED.icon,
  content_modal = EXCLUDED.content_modal,
  image = EXCLUDED.image,
  updated_at = now();

-- Secteur 2: Éducation & Santé
INSERT INTO sectors (id, title, description, services, icon, content_modal, created_at, image) VALUES (
  'education-health',
  'Éducation & Santé',
  'Plateformes e-learning et systèmes de gestion patients',
  ARRAY[
    'Plateformes LMS',
    'Prise de RDV médical',
    'Dossiers patients',
    'Formation en ligne'
  ],
  'GraduationCap',
  '{
    "hero_title": "Digitalisez l''éducation et la santé",
    "hero_subtitle": "Plateformes e-learning et solutions de gestion médicale",
    "description": "Créez des expériences d''apprentissage engageantes ou optimisez la gestion de votre cabinet médical. Nos solutions combinent pédagogie, technologie et conformité RGPD.",
    "highlights": [
      {
        "icon": "BookOpen",
        "title": "Plateformes LMS Complètes",
        "description": "Cours en ligne, quiz interactifs, certificats, suivi de progression et gamification pour engager vos apprenants."
      },
      {
        "icon": "Calendar",
        "title": "Prise de RDV Médicaux",
        "description": "Agenda en ligne, rappels SMS/email, téléconsultation, paiement sécurisé et intégration avec votre logiciel métier."
      },
      {
        "icon": "FileText",
        "title": "Dossiers Patients Sécurisés",
        "description": "Gestion centralisée des dossiers médicaux avec conformité RGPD, hébergement HDS et accès multi-praticiens."
      },
      {
        "icon": "Video",
        "title": "Formation en Ligne",
        "description": "Streaming vidéo HD, classes virtuelles, forums de discussion et outils de collaboration pour formateurs."
      }
    ],
    "tech_stack": ["Next.js", "MongoDB", "AWS S3", "Zoom API"],
    "case_study": {
      "title": "Cas Client : Centre de Formation MedPro",
      "results": [
        "+250% d''inscriptions en 4 mois",
        "88% de taux de complétion des cours",
        "4.9/5 étoiles de satisfaction apprenants"
      ]
    },
    "cta_text": "Créer votre plateforme éducative"
  }'::jsonb,
  '2025-10-25 01:29:20.924467+00',
  'https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg?auto=compress&cs=tinysrgb&w=1920'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  services = EXCLUDED.services,
  icon = EXCLUDED.icon,
  content_modal = EXCLUDED.content_modal,
  image = EXCLUDED.image,
  updated_at = now();

-- Secteur 3: Entrepreneurs & Coachs
INSERT INTO sectors (id, title, description, services, icon, content_modal, created_at, image) VALUES (
  'entrepreneurs',
  'Entrepreneurs & Coachs',
  'Tunnels d''acquisition et stratégies de branding digital',
  ARRAY[
    'Landing pages premium',
    'Funnels de conversion',
    'Plateformes coaching',
    'Personal branding'
  ],
  'Target',
  '{
    "hero_title": "Boostez votre présence digitale",
    "hero_subtitle": "Solutions pour entrepreneurs et coachs ambitieux",
    "description": "Créez votre empire digital avec des landing pages qui convertissent, des funnels optimisés et une plateforme de coaching professionnelle. Automatisez votre croissance et multipliez votre impact.",
    "highlights": [
      {
        "icon": "Zap",
        "title": "Landing Pages Premium",
        "description": "Design moderne, optimisées pour la conversion, A/B testing, formulaires intelligents et analytics détaillées."
      },
      {
        "icon": "TrendingUp",
        "title": "Funnels de Conversion",
        "description": "Lead magnets, séquences email automatisées, upsells, downsells et maximisation de la lifetime value."
      },
      {
        "icon": "Users",
        "title": "Plateformes de Coaching",
        "description": "Espace membres, sessions en ligne, ressources téléchargeables, communauté privée et suivi de progression."
      },
      {
        "icon": "Award",
        "title": "Personal Branding",
        "description": "Site vitrine professionnel, blog optimisé SEO, portfolio de réalisations et stratégie de contenu."
      }
    ],
    "tech_stack": ["React", "Stripe", "Mailchimp", "Google Analytics"],
    "case_study": {
      "title": "Cas Client : Coach Business Julie Martin",
      "results": [
        "+400% de leads qualifiés en 3 mois",
        "35% de taux de conversion moyen",
        "150K€ de CA généré via les funnels"
      ]
    },
    "cta_text": "Développer votre empire digital"
  }'::jsonb,
  '2025-10-25 01:29:20.924467+00',
  'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1920'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  services = EXCLUDED.services,
  icon = EXCLUDED.icon,
  content_modal = EXCLUDED.content_modal,
  image = EXCLUDED.image,
  updated_at = now();

-- Secteur 4: Banques & Microfinance
INSERT INTO sectors (id, title, description, services, icon, content_modal, created_at, image) VALUES (
  'finance',
  'Banques & Microfinance',
  'Solutions sécurisées avec analyse de données avancée',
  ARRAY[
    'Portails bancaires',
    'Gestion microcrédits',
    'Tableaux de bord',
    'Sécurité renforcée'
  ],
  'Banknote',
  '{
    "hero_title": "Finance digitale sécurisée",
    "hero_subtitle": "Solutions bancaires et microfinance nouvelle génération",
    "description": "Développez des plateformes financières robustes avec sécurité renforcée, conformité réglementaire et analytics avancées. De la banque traditionnelle à la microfinance inclusive.",
    "highlights": [
      {
        "icon": "Shield",
        "title": "Sécurité Bancaire",
        "description": "Authentification multi-facteurs, chiffrement de bout en bout, conformité PCI-DSS et ISO 27001."
      },
      {
        "icon": "CreditCard",
        "title": "Gestion Microcrédits",
        "description": "Plateforme de gestion des prêts, scoring automatisé, suivi des remboursements et alertes clients."
      },
      {
        "icon": "TrendingUp",
        "title": "Tableaux de Bord Financiers",
        "description": "Analytics en temps réel : KPI, flux de trésorerie, risques, prévisions et reporting réglementaire."
      },
      {
        "icon": "Lock",
        "title": "Conformité RGPD",
        "description": "Gestion des données personnelles conforme, audit trails, droit à l''oubli et portabilité des données."
      }
    ],
    "tech_stack": ["Next.js", "PostgreSQL", "Auth0", "AWS"],
    "case_study": {
      "title": "Cas Client : MicroBank Solidaire",
      "results": [
        "+200% de demandes de crédit traitées",
        "50% de réduction du temps de traitement",
        "Certification ISO 27001 obtenue"
      ]
    },
    "cta_text": "Sécuriser votre plateforme financière"
  }'::jsonb,
  '2025-10-25 01:29:20.924467+00',
  'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=1920'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  services = EXCLUDED.services,
  icon = EXCLUDED.icon,
  content_modal = EXCLUDED.content_modal,
  image = EXCLUDED.image,
  updated_at = now();

-- Secteur 5: Hôtellerie & Restauration
INSERT INTO sectors (id, title, description, services, icon, content_modal, created_at, image) VALUES (
  'hospitality',
  'Hôtellerie & Restauration',
  'Sites immersifs avec systèmes de réservation intégrés',
  ARRAY[
    'Sites vitrines premium',
    'Réservation en ligne',
    'Menu digital interactif',
    'Gestion des avis clients'
  ],
  'Utensils',
  '{
    "hero_title": "Transformez l''expérience de vos clients",
    "hero_subtitle": "Solutions digitales haut de gamme pour l''hôtellerie et la restauration",
    "description": "Nous créons des expériences digitales immersives qui captent l''essence de votre établissement. De la réservation en ligne à la gestion des avis, chaque interaction est optimisée pour convertir et fidéliser.",
    "highlights": [
      {
        "icon": "Calendar",
        "title": "Réservations Intelligentes",
        "description": "Système de réservation en temps réel avec disponibilités, paiements sécurisés et confirmations automatiques."
      },
      {
        "icon": "Smartphone",
        "title": "Menu Digital Interactif",
        "description": "Menus dynamiques avec photos HD, allergènes, traductions multilingues et commande en ligne."
      },
      {
        "icon": "Star",
        "title": "Gestion des Avis",
        "description": "Centralisez et répondez aux avis clients depuis une interface unique. Boostez votre e-réputation."
      },
      {
        "icon": "BarChart3",
        "title": "Analytics Avancées",
        "description": "Tableaux de bord pour suivre les réservations, le CA, les tendances et optimiser votre stratégie."
      }
    ],
    "tech_stack": ["React", "Node.js", "Stripe", "Google Calendar API"],
    "case_study": {
      "title": "Cas Client : Restaurant Le Gourmet",
      "results": [
        "+180% de réservations en ligne en 3 mois",
        "45% de réduction du no-show grâce aux rappels automatiques",
        "4.8/5 étoiles de satisfaction client"
      ]
    },
    "cta_text": "Discuter de votre projet hôtelier"
  }'::jsonb,
  '2025-10-25 01:29:20.924467+00',
  'https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=1920'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  services = EXCLUDED.services,
  icon = EXCLUDED.icon,
  content_modal = EXCLUDED.content_modal,
  image = EXCLUDED.image,
  updated_at = now();

-- Secteur 6: Immobilier & BTP
INSERT INTO sectors (id, title, description, services, icon, content_modal, created_at, image) VALUES (
  'real-estate',
  'Immobilier & BTP',
  'Portails immobiliers avec visites virtuelles et gestion complète',
  ARRAY[
    'Portails d''annonces',
    'Visites virtuelles 360°',
    'CRM vendeurs/acheteurs',
    'Calculateurs de prêt'
  ],
  'Building2',
  '{
    "hero_title": "L''immobilier à l''ère digitale",
    "hero_subtitle": "Plateformes immobilières complètes avec CRM intégré",
    "description": "Créez une expérience immobilière moderne avec portails d''annonces, visites virtuelles 360° et outils de gestion. Automatisez votre prospection et fidélisez vos clients avec un CRM puissant.",
    "highlights": [
      {
        "icon": "Home",
        "title": "Portail Multi-annonces",
        "description": "Publiez vos biens avec galeries photos, descriptions détaillées, filtres avancés et géolocalisation."
      },
      {
        "icon": "Eye",
        "title": "Visites Virtuelles 360°",
        "description": "Intégration de visites immersives pour faire visiter vos biens à distance. Gain de temps et de leads qualifiés."
      },
      {
        "icon": "Users",
        "title": "CRM Vendeurs/Acheteurs",
        "description": "Suivez tous vos contacts, historique des interactions, alertes automatiques et pipeline de vente."
      },
      {
        "icon": "Calculator",
        "title": "Simulateurs Financiers",
        "description": "Calculateurs de prêt, frais de notaire, rentabilité locative. Outils interactifs pour convaincre vos clients."
      }
    ],
    "tech_stack": ["React", "PostgreSQL", "Matterport API", "Mapbox"],
    "case_study": {
      "title": "Cas Client : Agence Immobilière Prime",
      "results": [
        "+300% de leads qualifiés en 6 mois",
        "60% de gain de temps sur la gestion administrative",
        "95% de satisfaction des agents immobiliers"
      ]
    },
    "cta_text": "Lancer votre portail immobilier"
  }'::jsonb,
  '2025-10-25 01:29:20.924467+00',
  'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1920'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  services = EXCLUDED.services,
  icon = EXCLUDED.icon,
  content_modal = EXCLUDED.content_modal,
  image = EXCLUDED.image,
  updated_at = now();

-- Mettre à jour updated_at pour les enregistrements existants qui n'ont pas cette colonne
UPDATE sectors 
SET updated_at = created_at 
WHERE updated_at IS NULL;

-- Vérification finale
SELECT id, title, icon, 
       CASE WHEN content_modal IS NOT NULL THEN 'Oui' ELSE 'Non' END as has_modal,
       CASE WHEN image IS NOT NULL THEN 'Oui' ELSE 'Non' END as has_image
FROM sectors
ORDER BY created_at;
