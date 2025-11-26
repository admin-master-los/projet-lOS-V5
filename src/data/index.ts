// Mise à jour : Ajout du champ "content_project_modal" pour chaque projet
// Ce contenu sera affiché dans la modale immersive full-screen

import { NavItem, Service, Sector, Project, BlogPost } from '../types';

// Interface TypeScript pour le content_project_modal

interface ProjectModalContent {
  hero_title: string;
  hero_subtitle: string;
  description: string;
  challenge: {
    title: string;
    description: string;
  };
  solution: {
    title: string;
    description: string;
    features: string[];
  };
  technologies: {
    frontend: string[];
    backend: string[];
    infrastructure: string[];
  };
  gallery: string[]; // URLs des captures d'écran du projet
  metrics: {
    label: string;
    value: string;
    description: string;
  }[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };
  cta_text: string;
  demo_link?: string;
  github_link?: string;
}

export const navigation: NavItem[] = [
  { id: 'home', label: 'Accueil', href: '#home' },
  { id: 'about', label: 'À Propos', href: '#about' },
  { id: 'services', label: 'Services', href: '#services' },
  { id: 'sectors', label: 'Secteurs', href: '#sectors' },
  { id: 'portfolio', label: 'Projets', href: '#portfolio' },
  { id: 'blog', label: 'Blog', href: '#blog' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

export const services: Service[] = [
  {
    id: 'web-development',
    icon: 'Code2',
    title: 'Développement Web & CMS',
    description:
      'Sites vitrines, e-commerce et CMS personnalisés avec les dernières technologies',
    features: [
      'React/Vue.js',
      'WordPress/Headless CMS',
      'E-commerce Shopify/WooCommerce',
      'Progressive Web Apps',
    ],
  },
  {
    id: 'custom-software',
    icon: 'Settings',
    title: 'Logiciels Métiers',
    description:
      "Applications de gestion spécialisées adaptées à votre secteur d'activité",
    features: [
      'Gestion commerciale',
      'CRM/ERP personnalisé',
      'Outils de productivité',
      'Intégrations API',
    ],
  },
  {
    id: 'digital-strategy',
    icon: 'TrendingUp',
    title: 'Stratégie Digitale PME',
    description:
      'Audit, conseil et accompagnement dans votre transformation numérique',
    features: [
      'Audit digital complet',
      'Stratégie de croissance',
      'Formation équipes',
      'Support technique',
    ],
  },
  {
    id: 'ux-ui-design',
    icon: 'Palette',
    title: 'UX/UI Design',
    description:
      'Interfaces utilisateur orientées conversion et performance optimale',
    features: [
      'Design system complet',
      'Prototypage interactif',
      'Tests utilisateurs',
      'Optimisation conversion',
    ],
  },
  {
    id: 'web-architecture',
    icon: 'Server',
    title: 'Architecture Web',
    description:
      'Infrastructure scalable, sécurisée et optimisée pour vos besoins',
    features: [
      'Cloud Architecture',
      'Sécurité avancée',
      'Performance optimization',
      'Monitoring & Analytics',
    ],
  },
  {
    id: 'business-tools',
    icon: 'Briefcase',
    title: 'Outils Métiers',
    description: "Solutions de réservation, gestion d'annonces et CRM intégrés",
    features: [
      'Systèmes de réservation',
      'Gestion multi-annonces',
      'CRM clients avancé',
      'Reporting intelligent',
    ],
  },
];

// 🎯 Mise à jour : Ajout du champ "content_modal" pour chaque secteur
// Ce contenu sera affiché dans la modale immersive full-screen

export const sectors: Sector[] = [
  {
    id: 'hospitality',
    title: 'Hôtellerie & Restauration',
    description: 'Sites immersifs avec systèmes de réservation intégrés',
    services: [
      'Sites vitrines premium',
      'Réservation en ligne',
      'Menu digital interactif',
      'Gestion des avis clients',
    ],
    icon: 'Utensils',
    // 📌 Nouveau champ : contenu détaillé pour la modale
    content_modal: {
      hero_title: "Transformez l'expérience de vos clients",
      hero_subtitle:
        "Solutions digitales haut de gamme pour l'hôtellerie et la restauration",
      description:
        "Nous créons des expériences digitales immersives qui captent l'essence de votre établissement. De la réservation en ligne à la gestion des avis, chaque interaction est optimisée pour convertir et fidéliser.",
      highlights: [
        {
          icon: 'Calendar',
          title: 'Réservations Intelligentes',
          description:
            'Système de réservation en temps réel avec disponibilités, paiements sécurisés et confirmations automatiques.',
        },
        {
          icon: 'Smartphone',
          title: 'Menu Digital Interactif',
          description:
            'Menus dynamiques avec photos HD, allergènes, traductions multilingues et commande en ligne.',
        },
        {
          icon: 'Star',
          title: 'Gestion des Avis',
          description:
            'Centralisez et répondez aux avis clients depuis une interface unique. Boostez votre e-réputation.',
        },
        {
          icon: 'BarChart3',
          title: 'Analytics Avancées',
          description:
            'Tableaux de bord pour suivre les réservations, le CA, les tendances et optimiser votre stratégie.',
        },
      ],
      case_study: {
        title: 'Cas Client : Restaurant Le Gourmet',
        results: [
          '+180% de réservations en ligne en 3 mois',
          '45% de réduction du no-show grâce aux rappels automatiques',
          '4.8/5 étoiles de satisfaction client',
        ],
      },
      cta_text: 'Discuter de votre projet hôtelier',
      tech_stack: ['React', 'Node.js', 'Stripe', 'Google Calendar API'],
    },
  },
  {
    id: 'real-estate',
    title: 'Immobilier & BTP',
    description:
      'Portails immobiliers avec visites virtuelles et gestion complète',
    services: [
      "Portails d'annonces",
      'Visites virtuelles 360°',
      'CRM vendeurs/acheteurs',
      'Calculateurs de prêt',
    ],
    icon: 'Building2',
    content_modal: {
      hero_title: "L'immobilier à l'ère digitale",
      hero_subtitle: 'Plateformes immobilières complètes avec CRM intégré',
      description:
        "Créez une expérience immobilière moderne avec portails d'annonces, visites virtuelles 360° et outils de gestion. Automatisez votre prospection et fidélisez vos clients avec un CRM puissant.",
      highlights: [
        {
          icon: 'Home',
          title: 'Portail Multi-annonces',
          description:
            'Publiez vos biens avec galeries photos, descriptions détaillées, filtres avancés et géolocalisation.',
        },
        {
          icon: 'Eye',
          title: 'Visites Virtuelles 360°',
          description:
            'Intégration de visites immersives pour faire visiter vos biens à distance. Gain de temps et de leads qualifiés.',
        },
        {
          icon: 'Users',
          title: 'CRM Vendeurs/Acheteurs',
          description:
            'Suivez tous vos contacts, historique des interactions, alertes automatiques et pipeline de vente.',
        },
        {
          icon: 'Calculator',
          title: 'Simulateurs Financiers',
          description:
            'Calculateurs de prêt, frais de notaire, rentabilité locative. Outils interactifs pour convaincre vos clients.',
        },
      ],
      case_study: {
        title: 'Cas Client : Agence Immobilière Prime',
        results: [
          '+300% de leads qualifiés en 6 mois',
          '60% de gain de temps sur la gestion administrative',
          '95% de satisfaction des agents immobiliers',
        ],
      },
      cta_text: 'Lancer votre portail immobilier',
      tech_stack: ['React', 'PostgreSQL', 'Matterport API', 'Mapbox'],
    },
  },
  {
    id: 'education-health',
    title: 'Éducation & Santé',
    description: 'Plateformes e-learning et systèmes de gestion patients',
    services: [
      'Plateformes LMS',
      'Prise de RDV médical',
      'Dossiers patients',
      'Formation en ligne',
    ],
    icon: 'GraduationCap',
    content_modal: {
      hero_title: "Digitalisez l'éducation et la santé",
      hero_subtitle: 'Plateformes e-learning et solutions de gestion médicale',
      description:
        "Créez des expériences d'apprentissage engageantes ou optimisez la gestion de votre cabinet médical. Nos solutions combinent pédagogie, technologie et conformité RGPD.",
      highlights: [
        {
          icon: 'BookOpen',
          title: 'Plateformes LMS Complètes',
          description:
            'Cours en ligne, quiz interactifs, certificats, suivi de progression et gamification pour engager vos apprenants.',
        },
        {
          icon: 'Calendar',
          title: 'Prise de RDV Médicaux',
          description:
            'Agenda en ligne, rappels SMS/email, téléconsultation, paiement sécurisé et intégration avec votre logiciel métier.',
        },
        {
          icon: 'FileText',
          title: 'Dossiers Patients Sécurisés',
          description:
            'Gestion centralisée des dossiers médicaux avec conformité RGPD, hébergement HDS et accès multi-praticiens.',
        },
        {
          icon: 'Video',
          title: 'Formation en Ligne',
          description:
            'Streaming vidéo HD, classes virtuelles, forums de discussion et outils de collaboration pour formateurs.',
        },
      ],
      case_study: {
        title: 'Cas Client : Centre de Formation MedPro',
        results: [
          "+250% d'inscriptions en 4 mois",
          '88% de taux de complétion des cours',
          '4.9/5 étoiles de satisfaction apprenants',
        ],
      },
      cta_text: 'Créer votre plateforme éducative',
      tech_stack: ['Next.js', 'MongoDB', 'AWS S3', 'Zoom API'],
    },
  },
  {
    id: 'finance',
    title: 'Banques & Microfinance',
    description: 'Solutions sécurisées avec analyse de données avancée',
    services: [
      'Portails bancaires',
      'Gestion microcrédits',
      'Tableaux de bord',
      'Sécurité renforcée',
    ],
    icon: 'Banknote',
    content_modal: {
      hero_title: 'Finance digitale sécurisée',
      hero_subtitle: 'Solutions bancaires et microfinance nouvelle génération',
      description:
        'Développez des plateformes financières robustes avec sécurité renforcée, conformité réglementaire et analytics avancées. De la banque traditionnelle à la microfinance inclusive.',
      highlights: [
        {
          icon: 'Shield',
          title: 'Sécurité Bancaire',
          description:
            'Authentification multi-facteurs, chiffrement de bout en bout, conformité PCI-DSS et ISO 27001.',
        },
        {
          icon: 'CreditCard',
          title: 'Gestion Microcrédits',
          description:
            'Plateforme de gestion des prêts, scoring automatisé, suivi des remboursements et alertes clients.',
        },
        {
          icon: 'TrendingUp',
          title: 'Tableaux de Bord Financiers',
          description:
            'Analytics en temps réel : KPI, flux de trésorerie, risques, prévisions et reporting réglementaire.',
        },
        {
          icon: 'Lock',
          title: 'Conformité RGPD',
          description:
            "Gestion des données personnelles conforme, audit trails, droit à l'oubli et portabilité des données.",
        },
      ],
      case_study: {
        title: 'Cas Client : MicroBank Solidaire',
        results: [
          '+200% de demandes de crédit traitées',
          '50% de réduction du temps de traitement',
          'Certification ISO 27001 obtenue',
        ],
      },
      cta_text: 'Sécuriser votre plateforme financière',
      tech_stack: ['Next.js', 'PostgreSQL', 'Auth0', 'AWS'],
    },
  },
  {
    id: 'entrepreneurs',
    title: 'Entrepreneurs & Coachs',
    description: "Tunnels d'acquisition et stratégies de branding digital",
    services: [
      'Landing pages premium',
      'Funnels de conversion',
      'Plateformes coaching',
      'Personal branding',
    ],
    icon: 'Target',
    content_modal: {
      hero_title: 'Boostez votre présence digitale',
      hero_subtitle: 'Solutions pour entrepreneurs et coachs ambitieux',
      description:
        'Créez votre empire digital avec des landing pages qui convertissent, des funnels optimisés et une plateforme de coaching professionnelle. Automatisez votre croissance et multipliez votre impact.',
      highlights: [
        {
          icon: 'Zap',
          title: 'Landing Pages Premium',
          description:
            'Design moderne, optimisées pour la conversion, A/B testing, formulaires intelligents et analytics détaillées.',
        },
        {
          icon: 'TrendingUp',
          title: 'Funnels de Conversion',
          description:
            'Lead magnets, séquences email automatisées, upsells, downsells et maximisation de la lifetime value.',
        },
        {
          icon: 'Users',
          title: 'Plateformes de Coaching',
          description:
            'Espace membres, sessions en ligne, ressources téléchargeables, communauté privée et suivi de progression.',
        },
        {
          icon: 'Award',
          title: 'Personal Branding',
          description:
            'Site vitrine professionnel, blog optimisé SEO, portfolio de réalisations et stratégie de contenu.',
        },
      ],
      case_study: {
        title: 'Cas Client : Coach Business Julie Martin',
        results: [
          '+400% de leads qualifiés en 3 mois',
          '35% de taux de conversion moyen',
          '150K€ de CA généré via les funnels',
        ],
      },
      cta_text: 'Développer votre empire digital',
      tech_stack: ['React', 'Stripe', 'Mailchimp', 'Google Analytics'],
    },
  },
  {
    id: 'ecommerce-pme',
    title: 'Boutique en Ligne PME/PMI',
    description:
      'Solutions e-commerce complètes avec gestion des stocks et paiements',
    services: [
      'Boutiques Shopify/WooCommerce',
      'Gestion des stocks',
      'Paiements sécurisés',
      'Analytics de vente',
    ],
    icon: 'ShoppingCart',
    content_modal: {
      hero_title: 'E-commerce performant pour PME',
      hero_subtitle: 'Vendez en ligne avec une boutique professionnelle',
      description:
        'Lancez ou optimisez votre boutique en ligne avec une solution complète : catalogue produits, gestion des stocks, paiements multi-devises et analytics de vente. Du simple site vitrine à la marketplace complexe.',
      highlights: [
        {
          icon: 'ShoppingBag',
          title: 'Boutique Clé en Main',
          description:
            'Shopify ou WooCommerce personnalisé, design responsive, catalogue illimité et optimisation mobile-first.',
        },
        {
          icon: 'Package',
          title: 'Gestion des Stocks',
          description:
            'Suivi en temps réel, alertes de rupture, multi-entrepôts, synchronisation avec vos fournisseurs.',
        },
        {
          icon: 'CreditCard',
          title: 'Paiements Sécurisés',
          description:
            'Stripe, PayPal, Mobile Money, cartes bancaires. Multi-devises et conformité PCI-DSS.',
        },
        {
          icon: 'BarChart',
          title: 'Analytics de Vente',
          description:
            'Tableaux de bord : CA, taux de conversion, panier moyen, clients récurrents et prévisions de vente.',
        },
      ],
      case_study: {
        title: 'Cas Client : Boutique Mode AfroChic',
        results: [
          '+500K€ de CA en 12 mois',
          '+280% de taux de conversion',
          '2500+ commandes traitées/mois',
        ],
      },
      cta_text: 'Lancer votre boutique en ligne',
      tech_stack: ['WooCommerce', 'Stripe', 'ShipStation', 'Google Analytics'],
    },
  },
];

export const projects: Project[] = [
  {
    id: 'ecommerce-b2b',
    title: 'Plateforme E-commerce B2B',
    description:
      'Solution complète de vente en ligne pour distributeurs professionnels',
    image:
      'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
    tech: ['React', 'Node.js', 'Stripe', 'MongoDB', 'Redis'],
    results: ['+150% conversion', '500K€ CA/mois', '99.9% uptime'],
    link: '#',
    // 📌 Nouveau champ : contenu détaillé pour la modale
    content_project_modal: {
      hero_title: 'Plateforme E-commerce B2B Haute Performance',
      hero_subtitle: "Transformation digitale d'un distributeur professionnel",
      description:
        "Développement d'une plateforme e-commerce B2B complète permettant aux distributeurs professionnels de gérer leur catalogue, traiter les commandes en masse et automatiser leur processus de vente. Une solution robuste qui a transformé le modèle commercial du client.",
      challenge: {
        title: 'Le Défi',
        description:
          "Le client gérait manuellement des milliers de références produits et traitait les commandes via Excel et email. Les erreurs étaient fréquentes, le traitement lent, et l'expérience client insatisfaisante. Il fallait une solution scalable capable de gérer 10 000+ SKUs et 500+ clients B2B.",
      },
      solution: {
        title: 'La Solution',
        description: 'Nous avons conçu une plateforme moderne avec :',
        features: [
          'Catalogue produits intelligent avec recherche avancée et filtres métiers',
          'Système de commandes en masse avec import CSV et validation automatique',
          'Gestion des prix personnalisés par client et grilles tarifaires dynamiques',
          "Tableau de bord analytique en temps réel pour piloter l'activité",
          'Intégration ERP/CRM pour synchronisation bidirectionnelle des données',
          'Paiements sécurisés via Stripe avec gestion des échéanciers B2B',
        ],
      },
      technologies: {
        frontend: [
          'React 18',
          'TypeScript',
          'TailwindCSS',
          'Zustand',
          'React Query',
        ],
        backend: ['Node.js', 'Express', 'MongoDB', 'Redis', 'Bull Queue'],
        infrastructure: ['AWS EC2', 'S3', 'CloudFront', 'Route53', 'Docker'],
      },
      gallery: [
        'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/6476589/pexels-photo-6476589.jpeg?auto=compress&cs=tinysrgb&w=1200',
      ],
      metrics: [
        {
          label: 'Conversion',
          value: '+150%',
          description:
            'Augmentation du taux de conversion des visiteurs en clients',
        },
        {
          label: "Chiffre d'Affaires",
          value: '500K€/mois',
          description: 'CA mensuel moyen généré via la plateforme',
        },
        {
          label: 'Disponibilité',
          value: '99.9%',
          description: 'Uptime garanti avec monitoring 24/7',
        },
        {
          label: 'Temps de traitement',
          value: '-70%',
          description: 'Réduction du temps de traitement des commandes',
        },
      ],
      testimonial: {
        quote:
          'Cette plateforme a révolutionné notre façon de travailler. Nous avons multiplié notre CA par 3 en 18 mois tout en réduisant nos coûts opérationnels de 40%.',
        author: 'Jean-Marc Dubois',
        role: 'Directeur Commercial',
        company: 'DistribPro Solutions',
      },
      cta_text: 'Discuter de votre projet e-commerce',
      demo_link: 'https://demo.projet.com',
      github_link: '#',
    },
  },
  {
    id: 'hotel-crm',
    title: 'CRM Hôtelier avec Réservations',
    description:
      'Système intégré de gestion hôtelière et réservations en temps réel',
    image:
      'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
    tech: ['Vue.js', 'Laravel', 'MySQL', 'WebSocket', 'PayPal API'],
    results: [
      '+80% réservations',
      '40h/semaine économisées',
      '98% satisfaction',
    ],
    link: '#',
    content_project_modal: {
      hero_title: 'CRM Hôtelier Intelligent & Réservations',
      hero_subtitle:
        "Digitalisation complète d'un établissement hôtelier 4 étoiles",
      description:
        "Création d'un système de gestion hôtelière tout-en-un combinant CRM client, moteur de réservations en temps réel, gestion des chambres et des services. Une solution qui a permis à l'hôtel d'augmenter drastiquement ses réservations directes.",
      challenge: {
        title: 'Le Défi',
        description:
          "L'hôtel dépendait à 80% des plateformes OTA (Booking, Expedia) avec des commissions élevées. Pas de vision centralisée des clients, gestion manuelle des réservations et communication désorganisée entre les équipes. L'objectif : reprendre le contrôle des réservations et améliorer l'expérience client.",
      },
      solution: {
        title: 'La Solution',
        description: 'Nous avons développé un écosystème digital complet :',
        features: [
          'Moteur de réservation en temps réel avec disponibilités synchronisées',
          'CRM clients 360° avec historique, préférences et programmes de fidélité',
          'Gestion des chambres : planning visuel, maintenance, housekeeping',
          'Paiements en ligne sécurisés avec acomptes et gestion des annulations',
          'Notifications automatiques SMS/Email pour confirmations et rappels',
          "Tableaux de bord KPI : taux d'occupation, RevPAR, satisfaction client",
        ],
      },
      technologies: {
        frontend: [
          'Vue.js 3',
          'Composition API',
          'Pinia',
          'TailwindCSS',
          'Chart.js',
        ],
        backend: ['Laravel 10', 'MySQL', 'Redis', 'WebSocket', 'Queue Workers'],
        infrastructure: [
          'DigitalOcean',
          'Nginx',
          'Cloudflare',
          'Backup automatisé',
        ],
      },
      gallery: [
        'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1200',
      ],
      metrics: [
        {
          label: 'Réservations Directes',
          value: '+80%',
          description: 'Augmentation des réservations via le site vs OTA',
        },
        {
          label: 'Gain de temps',
          value: '40h/semaine',
          description: 'Économisées sur la gestion administrative',
        },
        {
          label: 'Satisfaction Client',
          value: '98%',
          description: 'Score de satisfaction post-séjour',
        },
        {
          label: 'Réduction commissions',
          value: '-45%',
          description: 'Économies sur les frais OTA annuels',
        },
      ],
      testimonial: {
        quote:
          'Grâce à ce système, nous avons repris le contrôle de notre activité. Les équipes gagnent un temps fou et nos clients adorent la facilité de réservation. Un investissement rapidement rentabilisé !',
        author: 'Sophie Lambert',
        role: 'Directrice Générale',
        company: 'Hôtel Le Grand Prestige',
      },
      cta_text: 'Digitaliser votre établissement hôtelier',
      demo_link: 'https://demo.projet.com',
    },
  },
  {
    id: 'banking-website',
    title: 'Site Institutionnel Bancaire',
    description:
      'Refonte complète avec espace client sécurisé et conformité RGPD',
    image:
      'https://images.pexels.com/photos/259209/pexels-photo-259209.jpeg?auto=compress&cs=tinysrgb&w=800',
    tech: ['Next.js', 'Strapi CMS', 'PostgreSQL', 'Auth0', 'AWS'],
    results: ['+200% trafic', '50% moins de support', 'Certification ISO27001'],
    link: '#',
    content_project_modal: {
      hero_title: 'Plateforme Bancaire Sécurisée Nouvelle Génération',
      hero_subtitle: "Refonte digitale d'une institution financière africaine",
      description:
        "Modernisation complète du site institutionnel d'une banque avec création d'un espace client sécurisé, système de gestion de contenu CMS, et conformité totale aux normes RGPD et ISO 27001. Un projet stratégique touchant 150 000+ clients.",
      challenge: {
        title: 'Le Défi',
        description:
          'Site web obsolète datant de 2010, espace client peu fonctionnel, contenus statiques difficiles à mettre à jour, et surtout : non-conformité RGPD avec des failles de sécurité critiques. La banque devait moderniser son infrastructure digitale tout en respectant des contraintes réglementaires strictes.',
      },
      solution: {
        title: 'La Solution',
        description:
          "Une refonte totale axée sur la sécurité et l'expérience utilisateur :",
        features: [
          'Architecture moderne avec Next.js pour des performances optimales',
          'CMS Strapi headless pour une gestion autonome des contenus',
          'Espace client sécurisé avec authentification multi-facteurs (Auth0)',
          'Consultation de comptes, virements et téléchargement de documents',
          "Conformité RGPD : gestion des consentements, droit à l'oubli, portabilité",
          'Audit de sécurité et certification ISO 27001 obtenue',
          'Design responsive optimisé mobile-first (70% du trafic sur mobile)',
        ],
      },
      technologies: {
        frontend: ['Next.js 14', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
        backend: ['Strapi CMS', 'PostgreSQL', 'Auth0', 'Node.js', 'Prisma ORM'],
        infrastructure: [
          'AWS ECS',
          'RDS',
          'S3',
          'CloudFront',
          'WAF',
          'GuardDuty',
        ],
      },
      gallery: [
        'https://images.pexels.com/photos/259209/pexels-photo-259209.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/210600/pexels-photo-210600.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/8761562/pexels-photo-8761562.jpeg?auto=compress&cs=tinysrgb&w=1200',
      ],
      metrics: [
        {
          label: 'Trafic Web',
          value: '+200%',
          description: 'Augmentation du trafic organique en 6 mois',
        },
        {
          label: 'Réduction Support',
          value: '-50%',
          description: "Moins de tickets support grâce à l'ergonomie",
        },
        {
          label: 'Certification',
          value: 'ISO 27001',
          description: 'Certification de sécurité obtenue',
        },
        {
          label: 'Performance',
          value: '95/100',
          description: 'Score Lighthouse pour les performances',
        },
      ],
      testimonial: {
        quote:
          "Ce projet a marqué un tournant dans notre stratégie digitale. Nos clients apprécient la modernité et la simplicité d'utilisation, et nous avons enfin une infrastructure sécurisée et conforme.",
        author: 'Dr. Amadou Koné',
        role: "Directeur des Systèmes d'Information",
        company: "Banque Internationale d'Afrique",
      },
      cta_text: 'Sécuriser votre plateforme bancaire',
      demo_link: 'https://demo.projet.com',
    },
  },
  {
    id: 'real-estate-crm',
    title: 'CRM Gestion immobilière avec site web',
    description:
      'Plateforme complète de gestion immobilière avec CRM intégré et site web vitrine',
    image:
      'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=800',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Express', 'Tailwind CSS'],
    results: [
      '+300% leads qualifiés',
      '60% gain de temps',
      '95% satisfaction agents',
    ],
    link: '#',
    content_project_modal: {
      hero_title: 'Écosystème Digital Immobilier Complet',
      hero_subtitle: 'CRM, site vitrine et gestion locative unifiés',
      description:
        "Développement d'une solution complète pour une agence immobilière : site web vitrine avec portail d'annonces, CRM de gestion des contacts/biens, système de gestion locative et tableau de bord analytique. Une plateforme qui a transformé l'efficacité opérationnelle de l'agence.",
      challenge: {
        title: 'Le Défi',
        description:
          "L'agence jonglait entre 5 outils différents : site web externe, CRM obsolète, Excel pour la gestion locative, documents papier pour les contrats. Perte de temps massive, risque d'erreurs élevé, et expérience client médiocre. Besoin urgent d'une solution centralisée et moderne.",
      },
      solution: {
        title: 'La Solution',
        description: 'Un écosystème digital all-in-one sur mesure :',
        features: [
          "Site vitrine moderne avec portail d'annonces et recherche avancée",
          'CRM 360° : gestion contacts, historique interactions, pipeline de vente',
          'Gestion des biens : photos, documents, visites virtuelles 360°',
          'Module gestion locative : contrats, quittances, suivi paiements',
          'Estimation automatique des biens via algorithme de pricing',
          'Tableaux de bord : KPI, performance agents, prévisions CA',
          'Application mobile pour agents terrain (iOS/Android)',
        ],
      },
      technologies: {
        frontend: [
          'React 18',
          'TypeScript',
          'TailwindCSS',
          'React Router',
          'Zustand',
        ],
        backend: ['Node.js', 'Express', 'PostgreSQL', 'Prisma', 'JWT Auth'],
        infrastructure: ['Docker', 'AWS EC2', 'RDS', 'S3', 'CloudWatch'],
      },
      gallery: [
        'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200',
      ],
      metrics: [
        {
          label: 'Leads Qualifiés',
          value: '+300%',
          description: 'Triplement des demandes de contact qualifiées',
        },
        {
          label: 'Gain de temps',
          value: '60%',
          description: 'Économie de temps sur les tâches administratives',
        },
        {
          label: 'Satisfaction Agents',
          value: '95%',
          description: 'Taux de satisfaction des agents immobiliers',
        },
        {
          label: 'Transactions',
          value: '+180%',
          description: 'Augmentation du nombre de transactions conclues',
        },
      ],
      testimonial: {
        quote:
          "Enfin un outil qui répond à tous nos besoins ! Nos agents adorent la simplicité et moi je peux piloter l'activité en temps réel. Le ROI a été atteint en moins de 6 mois.",
        author: 'Marie-Claire Diallo',
        role: 'Directrice',
        company: 'Agence Immobilière Prime Location',
      },
      cta_text: 'Moderniser votre agence immobilière',
      demo_link: 'https://demo.projet.com',
      github_link: '#',
    },
  },
];

// ✨ Modification ajoutée : Export du type BlogPost étendu
export interface BlogPostExtended extends BlogPost {
  content_blog: string;
}

// ✨ Mock data generator for demo articles - Préparation Supabase
// 📍 Localisation : Cherchez "export const generateDemoArticles" dans index.ts
// 🔧 Action : Remplacez TOUTE la fonction par celle-ci

export const generateDemoArticles = (): BlogPostExtended[] => {
  const demoArticles: BlogPostExtended[] = [
    // ========== CATÉGORIE : IA & Innovation (5 articles) ==========
    {
      id: 'ai-revolution-2025',
      title: "L'IA Générative Révolutionne le Développement Web",
      excerpt:
        "Comment l'intelligence artificielle transforme notre façon de coder et de concevoir des applications modernes.",
      category: 'IA & Innovation',
      date: '2025-01-20',
      readTime: '8 min',
      image:
        'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
      content_blog: `
# L'IA Générative Révolutionne le Développement Web

L'intelligence artificielle générative change la donne dans le développement web. De GitHub Copilot aux outils de génération de code automatisée, découvrez comment l'IA transforme notre façon de créer des applications.

## 1. Génération de Code Intelligente

Les outils d'IA peuvent maintenant générer du code complexe à partir de descriptions en langage naturel. Cette révolution permet aux développeurs de se concentrer sur la logique métier plutôt que sur la syntaxe.

## 2. Optimisation Automatique

L'IA analyse le code existant et propose des optimisations de performance, de sécurité et de maintenabilité en temps réel.

## 3. Tests Automatisés

Génération automatique de tests unitaires et d'intégration basés sur l'analyse du code source.

Conclusion : L'IA générative n'est pas une menace pour les développeurs, mais un outil puissant qui amplifie notre créativité et notre productivité.
      `,
    },
    {
      id: 'web3-future',
      title: "Web3 et Blockchain : L'Avenir du Web Décentralisé",
      excerpt:
        'Explorez les possibilités infinies du Web3 et son impact sur les applications modernes.',
      category: 'IA & Innovation',
      date: '2025-01-15',
      readTime: '10 min',
      image:
        'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=800',
      content_blog: `
# Web3 et Blockchain : L'Avenir du Web Décentralisé

Le Web3 représente une nouvelle ère d'internet décentralisé. Découvrez comment cette technologie révolutionne les applications web.

## 1. Décentralisation des Données

Les utilisateurs reprennent le contrôle de leurs données personnelles grâce à la blockchain.

## 2. Smart Contracts

Automatisation des processus métier sans intermédiaires centralisés.

## 3. NFTs et Propriété Numérique

Nouvelle économie basée sur la propriété vérifiable d'actifs numériques.

Conclusion : Le Web3 ouvre de nouvelles perspectives pour créer des applications plus équitables et transparentes.
      `,
    },
    {
      id: 'machine-learning-web',
      title: 'Machine Learning dans le Navigateur avec TensorFlow.js',
      excerpt:
        'Découvrez comment intégrer des modèles de ML directement dans vos applications web.',
      category: 'IA & Innovation',
      date: '2025-01-12',
      readTime: '11 min',
      image:
        'https://images.pexels.com/photos/8438982/pexels-photo-8438982.jpeg?auto=compress&cs=tinysrgb&w=800',
      content_blog: `
# Machine Learning dans le Navigateur avec TensorFlow.js

Le machine learning n'est plus réservé aux serveurs. TensorFlow.js permet d'exécuter des modèles d'IA directement dans le navigateur.

## 1. Reconnaissance d'Images en Temps Réel

Détectez des objets, des visages et des émotions sans envoyer de données au serveur.

## 2. Traitement du Langage Naturel

Analysez et comprenez le texte directement côté client pour une expérience ultra-rapide.

## 3. Prédictions en Temps Réel

Offrez des recommandations personnalisées instantanées sans latence réseau.

## 4. Vie Privée Préservée

Les données restent sur l'appareil de l'utilisateur, garantissant une confidentialité totale.

Conclusion : TensorFlow.js démocratise le ML et ouvre la voie à des applications web intelligentes.
      `,
    },
    {
      id: 'quantum-computing-future',
      title: 'Informatique Quantique : Préparer le Web de Demain',
      excerpt:
        "Comment l'informatique quantique va transformer le développement web dans les années à venir.",
      category: 'IA & Innovation',
      date: '2025-01-08',
      readTime: '13 min',
      image:
        'https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?auto=compress&cs=tinysrgb&w=800',
      content_blog: `
# Informatique Quantique : Préparer le Web de Demain

L'informatique quantique n'est plus de la science-fiction. Les premiers ordinateurs quantiques sont déjà opérationnels.

## 1. Cryptographie Post-Quantique

Préparez vos applications aux algorithmes de chiffrement résistants aux ordinateurs quantiques.

## 2. Optimisation Complexe

Résolvez des problèmes d'optimisation impossibles pour les ordinateurs classiques.

## 3. Simulation Moléculaire

Révolutionnez la recherche médicale et scientifique via le web.

## 4. APIs Quantiques

IBM, Google et Amazon proposent déjà des APIs pour expérimenter avec le calcul quantique.

Conclusion : L'informatique quantique va redéfinir ce qui est possible dans le développement web.
      `,
    },
    {
      id: 'edge-ai-revolution',
      title:
        "Edge AI : L'Intelligence Artificielle au Plus Près des Utilisateurs",
      excerpt:
        "L'IA déployée en périphérie pour des applications ultra-rapides et privées.",
      category: 'IA & Innovation',
      date: '2025-01-05',
      readTime: '9 min',
      image:
        'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800',
      content_blog: `
# Edge AI : L'Intelligence Artificielle au Plus Près des Utilisateurs

L'Edge AI combine la puissance de l'IA avec la rapidité du edge computing pour des expériences utilisateur révolutionnaires.

## 1. Latence Quasi-Nulle

Traitez les données localement pour des réponses instantanées sans aller-retour serveur.

## 2. Fonctionnement Hors Ligne

Vos applications restent intelligentes même sans connexion internet.

## 3. Réduction des Coûts Cloud

Diminuez drastiquement vos factures de serveur en traitant localement.

## 4. Sécurité Renforcée

Les données sensibles ne quittent jamais l'appareil de l'utilisateur.

Conclusion : L'Edge AI est l'avenir des applications web intelligentes et respectueuses de la vie privée.
      `,
    },

    // ========== CATÉGORIE : Développement (5 articles) ==========
    {
      id: 'react-19-features',
      title: 'React 19 : Les Nouvelles Fonctionnalités à Connaître',
      excerpt:
        'Découvrez les innovations majeures de React 19 qui vont transformer vos applications.',
      category: 'Développement',
      date: '2025-01-18',
      readTime: '12 min',
      image:
        'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
      content_blog: `
# React 19 : Les Nouvelles Fonctionnalités à Connaître

React 19 apporte des améliorations significatives pour les développeurs. Explorons les fonctionnalités clés qui vont révolutionner votre façon de développer.

## 1. Server Components Améliorés

Les Server Components offrent maintenant une meilleure intégration avec les frameworks full-stack et une performance optimisée.

## 2. Concurrent Features Stabilisées

Les fonctionnalités concurrentes sont maintenant stables et prêtes pour la production.

## 3. Nouvelle API de Gestion d'État

Une approche simplifiée pour gérer l'état global sans bibliothèques externes.

Conclusion : React 19 marque une étape importante dans l'évolution de l'écosystème React.
      `,
    },
    {
      id: 'cloud-native-apps',
      title: 'Applications Cloud-Native : Architecture du Futur',
      excerpt:
        "Construisez des applications scalables et résilientes avec l'architecture cloud-native.",
      category: 'Développement',
      date: '2025-01-05',
      readTime: '13 min',
      image:
        'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800',
      content_blog: `
# Applications Cloud-Native : Architecture du Futur

L'architecture cloud-native offre de nombreux avantages : scalabilité, résilience, et efficacité. Découvrez comment l'implémenter.

## 1. Microservices Architecture

Décomposez vos applications en services indépendants et scalables.

## 2. Containerisation avec Docker

Empaquetez vos applications pour un déploiement cohérent.

## 3. Orchestration Kubernetes

Gérez vos containers à grande échelle avec Kubernetes.

Conclusion : Le cloud-native n'est pas juste une technologie, c'est une philosophie de développement.
      `,
    },
    {
      id: 'api-design-best-practices',
      title: 'API Design : Meilleures Pratiques et Standards',
      excerpt:
        'Créez des APIs robustes et maintenables avec ces principes de design éprouvés.',
      category: 'Développement',
      date: '2025-01-01',
      readTime: '14 min',
      image:
        'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800',
      content_blog: `
# API Design : Meilleures Pratiques et Standards

Le design d'API nécessite une approche méthodique. Découvrez les principes pour créer des APIs robustes et évolutives.

## 1. RESTful Design Principles

Respectez les conventions REST pour une API intuitive et prévisible.

## 2. Documentation Interactive

Utilisez OpenAPI/Swagger pour une documentation vivante et testable.

## 3. Versioning Strategy

Gérez l'évolution de votre API sans casser les intégrations existantes.

## 4. Error Handling

Messages d'erreur clairs et codes de statut HTTP appropriés.

Conclusion : Une API bien conçue est un investissement à long terme pour votre écosystème technique.
      `,
    },
    {
      id: 'typescript-advanced-patterns',
      title: 'TypeScript : Patterns Avancés pour Développeurs Experts',
      excerpt:
        'Maîtrisez les types génériques, les conditional types et les patterns avancés TypeScript.',
      category: 'Développement',
      date: '2024-12-28',
      readTime: '16 min',
      image:
        'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800',
      content_blog: `
# TypeScript : Patterns Avancés pour Développeurs Experts

TypeScript va bien au-delà du simple typage statique. Découvrez les patterns avancés qui font la différence.

## 1. Conditional Types

Créez des types qui s'adaptent dynamiquement en fonction d'autres types.

## 2. Mapped Types

Transformez des types existants pour créer de nouveaux types dérivés.

## 3. Template Literal Types

Manipulez des chaînes de caractères au niveau des types pour une validation ultra-précise.

## 4. Type Guards Avancés

Affinez le typage avec des guards personnalisés et des assertions de type.

Conclusion : Maîtriser TypeScript avancé, c'est écrire du code plus sûr et plus maintenable.
      `,
    },
    {
      id: 'monorepo-architecture',
      title: 'Monorepo : Gérer Plusieurs Projets dans un Seul Repository',
      excerpt:
        'Découvrez comment structurer efficacement vos projets avec Nx, Turborepo et pnpm workspaces.',
      category: 'Développement',
      date: '2024-12-25',
      readTime: '15 min',
      image:
        'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=800',
      content_blog: `
# Monorepo : Gérer Plusieurs Projets dans un Seul Repository

Les monorepos révolutionnent la gestion de projets multiples. Google, Facebook et Microsoft les utilisent massivement.

## 1. Avantages du Monorepo

Partagez du code facilement, synchronisez les versions et simplifiez la collaboration.

## 2. Outils Modernes

Nx, Turborepo et pnpm workspaces offrent des performances exceptionnelles.

## 3. CI/CD Optimisé

Ne construisez et ne testez que ce qui a changé pour des pipelines ultra-rapides.

## 4. Gestion des Dépendances

Centralisez les versions et évitez les conflits de dépendances.

Conclusion : Les monorepos sont l'avenir de la gestion de code pour les équipes modernes.
      `,
    },

    // ========== CATÉGORIE : Performance (5 articles) ==========
    {
      id: 'performance-optimization-2025',
      title: 'Optimisation Performance : Techniques Avancées 2025',
      excerpt:
        "Maîtrisez les dernières techniques d'optimisation pour des applications ultra-rapides.",
      category: 'Performance',
      date: '2025-01-12',
      readTime: '15 min',
      image:
        'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=800',
      content_blog: `
# Optimisation Performance : Techniques Avancées 2025

L'optimisation des performances est cruciale pour l'expérience utilisateur. Découvrez les techniques les plus avancées pour 2025.

## 1. Core Web Vitals Optimisés

Maîtrisez les métriques essentielles : LCP, FID, CLS pour un référencement optimal.

## 2. Edge Computing

Rapprochez vos données des utilisateurs avec les CDN et l'edge computing.

## 3. Lazy Loading Intelligent

Chargement différé adaptatif basé sur le comportement utilisateur.

Conclusion : Une application performante est une application qui convertit mieux.
      `,
    },
    {
      id: 'web-vitals-mastery',
      title: 'Core Web Vitals : Le Guide Complet 2025',
      excerpt:
        'Optimisez LCP, FID et CLS pour un SEO parfait et une expérience utilisateur exceptionnelle.',
      category: 'Performance',
      date: '2025-01-09',
      readTime: '12 min',
      image:
        'https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg?auto=compress&cs=tinysrgb&w=800',
      content_blog: `
# Core Web Vitals : Le Guide Complet 2025

Les Core Web Vitals sont désormais des facteurs de classement Google essentiels. Maîtrisez-les pour dominer les SERPs.

## 1. Largest Contentful Paint (LCP)

Optimisez le chargement du plus grand élément visible pour un LCP sous 2.5 secondes.

## 2. First Input Delay (FID)

Garantissez une interactivité instantanée avec un FID inférieur à 100ms.

## 3. Cumulative Layout Shift (CLS)

Éliminez les décalages de mise en page pour un CLS sous 0.1.

## 4. Outils de Mesure

PageSpeed Insights, Lighthouse et Web Vitals Extension vous guident.

Conclusion : Les Core Web Vitals ne sont pas optionnels, ils sont critiques pour votre succès en ligne.
      `,
    },
    {
      id: 'image-optimization-techniques',
      title: "Optimisation d'Images : WebP, AVIF et Techniques Avancées",
      excerpt:
        'Réduisez le poids de vos images de 80% sans perte de qualité visible.',
      category: 'Performance',
      date: '2025-01-06',
      readTime: '10 min',
      image:
        'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800',
      content_blog: `
# Optimisation d'Images : WebP, AVIF et Techniques Avancées

Les images représentent 50% du poids d'une page web. Optimisez-les intelligemment pour des performances exceptionnelles.

## 1. Formats Modernes

WebP offre 30% de compression supplémentaire, AVIF va encore plus loin avec 50%.

## 2. Responsive Images

Utilisez srcset et sizes pour servir la bonne image selon le device.

## 3. Lazy Loading Natif

Le loading="lazy" natif du HTML économise de la bande passante sans JavaScript.

## 4. CDN d'Images

Cloudinary et Imgix transforment et optimisent vos images à la volée.

Conclusion : L'optimisation d'images est le gain de performance le plus facile à obtenir.
      `,
    },
    {
      id: 'caching-strategies',
      title: 'Stratégies de Cache : Du Navigateur au CDN',
      excerpt:
        'Maîtrisez le cache HTTP, Service Workers et CDN pour des performances imbattables.',
      category: 'Performance',
      date: '2025-01-03',
      readTime: '14 min',
      image:
        'https://images.pexels.com/photos/1181304/pexels-photo-1181304.jpeg?auto=compress&cs=tinysrgb&w=800',
      content_blog: `
# Stratégies de Cache : Du Navigateur au CDN

Le cache est l'optimisation de performance la plus puissante. Découvrez comment l'exploiter à tous les niveaux.

## 1. Cache HTTP

Maîtrisez les headers Cache-Control, ETag et Last-Modified pour un cache optimal.

## 2. Service Workers

Créez des expériences offline avec une stratégie de cache intelligente.

## 3. CDN Global

Distribuez vos assets statiques mondialement pour une latence minimale.

## 4. Cache Invalidation

Gérez efficacement l'invalidation du cache pour des mises à jour instantanées.

Conclusion : Un bon cache réduit les coûts serveur et améliore drastiquement l'expérience utilisateur.
      `,
    },
    {
      id: 'javascript-performance',
      title: 'Performance JavaScript : Code Splitting et Tree Shaking',
      excerpt:
        'Réduisez la taille de vos bundles JS de 70% avec ces techniques éprouvées.',
      category: 'Performance',
      date: '2024-12-30',
      readTime: '11 min',
      image:
        'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=800',
      content_blog: `
# Performance JavaScript : Code Splitting et Tree Shaking

JavaScript représente souvent le principal goulet d'étranglement des applications web. Optimisez intelligemment.

## 1. Code Splitting Intelligent

Divisez votre bundle en chunks pour charger uniquement le code nécessaire.

## 2. Tree Shaking Efficace

Éliminez le code mort avec Webpack ou Vite pour des bundles minimaux.

## 3. Dynamic Imports

Chargez les modules à la demande avec import() dynamique.

## 4. Bundle Analysis

Visualisez votre bundle avec webpack-bundle-analyzer pour identifier les optimisations.

Conclusion : Moins de JavaScript, c'est plus de performance et une meilleure expérience utilisateur.
      `,
    },

    // ========== CATÉGORIE : Sécurité (5 articles) ==========
    {
      id: 'cybersecurity-trends',
      title: 'Cybersécurité : Protéger vos Applications en 2025',
      excerpt:
        'Les meilleures pratiques de sécurité pour protéger vos applications contre les nouvelles menaces.',
      category: 'Sécurité',
      date: '2025-01-10',
      readTime: '11 min',
      image:
        'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800',
      content_blog: `
# Cybersécurité : Protéger vos Applications en 2025

La cybersécurité est plus importante que jamais. Découvrez les meilleures pratiques pour sécuriser vos applications web.

## 1. Zero Trust Architecture

Ne faites confiance à personne, vérifiez tout. L'approche Zero Trust révolutionne la sécurité.

## 2. Authentification Multi-Facteurs

Renforcez la sécurité avec des méthodes d'authentification multiples.

## 3. Chiffrement de Bout en Bout

Protégez les données sensibles avec un chiffrement robuste.

Conclusion : La sécurité doit être intégrée dès la conception, pas ajoutée après coup.
      `,
    },
    {
      id: 'owasp-top-10-2025',
      title: 'OWASP Top 10 2025 : Nouvelles Vulnérabilités Web',
      excerpt:
        'Découvrez les 10 vulnérabilités web les plus critiques et comment les prévenir.',
      category: 'Sécurité',
      date: '2025-01-07',
      readTime: '13 min',
      image:
        'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=800',
      content_blog: `
# OWASP Top 10 2025 : Nouvelles Vulnérabilités Web

L'OWASP met à jour sa liste des vulnérabilités critiques. Restez protégé contre les menaces émergentes.

## 1. Injection Attacks

SQL, NoSQL, LDAP, OS Command... Les injections restent la menace n°1.

## 2. Broken Authentication

Sessions, tokens, mots de passe : sécurisez vos mécanismes d'authentification.

## 3. Sensitive Data Exposure

Chiffrez les données en transit et au repos. HTTPS est obligatoire.

## 4. API Security

Les APIs mal sécurisées sont une porte d'entrée pour les attaquants.

Conclusion : Connaître les vulnérabilités, c'est savoir comment les prévenir.
      `,
    },
    {
      id: 'zero-trust-architecture',
      title: 'Zero Trust : Ne Faites Confiance à Personne',
      excerpt:
        'Implémentez une architecture Zero Trust pour une sécurité maximale.',
      category: 'Sécurité',
      date: '2025-01-04',
      readTime: '12 min',
      image:
        'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=800',
      content_blog: `
# Zero Trust : Ne Faites Confiance à Personne

Le modèle Zero Trust révolutionne la sécurité des entreprises. Vérifiez toujours, ne faites jamais confiance aveuglément.

## 1. Principe Fondamental

"Never trust, always verify" - Chaque requête doit être authentifiée et autorisée.

## 2. Micro-Segmentation

Divisez votre réseau en zones isolées pour limiter la propagation des attaques.

## 3. Least Privilege Access

Accordez uniquement les permissions strictement nécessaires, jamais plus.

## 4. Monitoring Continu

Surveillez en temps réel tous les accès et comportements suspects.

Conclusion : Zero Trust n'est pas une technologie, c'est une philosophie de sécurité.
      `,
    },
    {
      id: 'password-security-2025',
      title: 'Sécurité des Mots de Passe : Au-delà des Exigences Basiques',
      excerpt:
        'Hashage, salage, pepper et authentification biométrique pour des comptes ultra-sécurisés.',
      category: 'Sécurité',
      date: '2024-12-31',
      readTime: '10 min',
      image:
        'https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg?auto=compress&cs=tinysrgb&w=800',
      content_blog: `
# Sécurité des Mots de Passe : Au-delà des Exigences Basiques

Les mots de passe restent la première ligne de défense. Sécurisez-les correctement.

## 1. Hashing Moderne

Utilisez Argon2, bcrypt ou scrypt. Jamais MD5 ou SHA1.

## 2. Salage Unique

Chaque mot de passe doit avoir un salt aléatoire unique pour prévenir les rainbow tables.

## 3. Pepper Secret

Ajoutez un pepper (clé secrète globale) pour une protection supplémentaire.

## 4. Passkeys et WebAuthn

L'avenir est sans mot de passe avec les passkeys FIDO2.

Conclusion : Un bon hashing de mot de passe peut faire la différence entre une brèche et une sécurité totale.
      `,
    },
    {
      id: 'api-security-best-practices',
      title: 'Sécuriser vos APIs : JWT, OAuth 2.0 et API Keys',
      excerpt: 'Protégez vos APIs contre les accès non autorisés et les abus.',
      category: 'Sécurité',
      date: '2024-12-27',
      readTime: '14 min',
      image:
        'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=800',
      content_blog: `
# Sécuriser vos APIs : JWT, OAuth 2.0 et API Keys

Les APIs sont des cibles privilégiées. Sécurisez-les avec les bonnes pratiques.

## 1. JSON Web Tokens (JWT)

Signez et vérifiez les tokens pour une authentification stateless sécurisée.

## 2. OAuth 2.0

Déléguez l'authentification aux providers de confiance (Google, GitHub, Microsoft).

## 3. Rate Limiting

Limitez le nombre de requêtes par IP/utilisateur pour prévenir les abus.

## 4. CORS et CSRF

Configurez correctement CORS et protégez contre les attaques CSRF.

Conclusion : Une API sécurisée est une API qui inspire confiance à vos utilisateurs.
      `,
    },

    // ========== CATÉGORIE : Design (5 articles) ==========
    {
      id: 'ux-design-trends',
      title: 'Tendances UX/UI 2025 : Design qui Convertit',
      excerpt:
        "Découvrez les tendances design qui maximisent l'engagement et les conversions.",
      category: 'Design',
      date: '2025-01-08',
      readTime: '9 min',
      image:
        'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
      content_blog: `
# Tendances UX/UI 2025 : Design qui Convertit

Le design UX/UI évolue constamment. Découvrez les tendances qui vont dominer 2025 et maximiser vos conversions.

## 1. Micro-Interactions Avancées

Des animations subtiles qui guident l'utilisateur et améliorent l'engagement.

## 2. Design System Modulaire

Cohérence et efficacité avec des systèmes de design évolutifs.

## 3. Accessibilité Inclusive

Design pour tous : couleurs, contrastes, navigation clavier optimisés.

Conclusion : Un bon design ne se voit pas, il se ressent dans l'expérience utilisateur.
      `,
    },
    {
      id: 'design-systems-guide',
      title: 'Design Systems : Créer une Cohérence Visuelle à Grande Échelle',
      excerpt:
        'Construisez un design system robuste avec Figma, Storybook et tokens de design.',
      category: 'Design',
      date: '2025-01-02',
      readTime: '15 min',
      image:
        'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800',
      content_blog: `
# Design Systems : Créer une Cohérence Visuelle à Grande Échelle

Les design systems sont essentiels pour les équipes qui grandissent. Découvrez comment en créer un efficace.

## 1. Tokens de Design

Définissez vos couleurs, espacements et typographie comme des variables réutilisables.

## 2. Bibliothèque de Composants

Créez des composants atomiques, molécules et organismes avec Storybook.

## 3. Documentation Vivante

Utilisez Storybook et Figma pour synchroniser design et développement.

## 4. Gouvernance du Design

Établissez des règles claires pour faire évoluer le système sans le fragmenter.

Conclusion : Un design system bien conçu accélère le développement et garantit la cohérence.
      `,
    },
    {
      id: 'figma-advanced-techniques',
      title: 'Figma Avancé : Auto-Layout, Variables et Prototypage Interactif',
      excerpt:
        'Maîtrisez les fonctionnalités avancées de Figma pour des designs professionnels.',
      category: 'Design',
      date: '2024-12-29',
      readTime: '11 min',
      image:
        'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
      content_blog: `
# Figma Avancé : Auto-Layout, Variables et Prototypage Interactif

Figma est devenu l'outil de design incontournable. Découvrez ses fonctionnalités avancées pour des workflows optimaux.

## 1. Auto-Layout Maîtrisé

Créez des composants responsives qui s'adaptent automatiquement au contenu.

## 2. Variables et Modes

Gérez les thèmes (dark/light) et les variations avec le système de variables.

## 3. Prototypage Interactif

Créez des prototypes réalistes avec animations et transitions fluides.

## 4. Dev Mode

Facilitez la collaboration avec les développeurs grâce au Dev Mode.

Conclusion : Figma n'est pas qu'un outil de design, c'est une plateforme de collaboration complète.
      `,
    },
    {
      id: 'accessibility-wcag-guide',
      title: 'Accessibilité Web (WCAG) : Design Inclusif pour Tous',
      excerpt: 'Créez des interfaces accessibles conformes WCAG 2.2 AA et AAA.',
      category: 'Design',
      date: '2024-12-26',
      readTime: '13 min',
      image:
        'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800',
      content_blog: `
# Accessibilité Web (WCAG) : Design Inclusif pour Tous

L'accessibilité n'est pas optionnelle. C'est un droit fondamental et une obligation légale dans de nombreux pays.

## 1. Contraste des Couleurs

Assurez un ratio de contraste minimum de 4.5:1 pour le texte normal, 3:1 pour le texte large.

## 2. Navigation au Clavier

Toutes les fonctionnalités doivent être accessibles sans souris.

## 3. ARIA Labels

Utilisez les attributs ARIA pour enrichir la sémantique HTML.

## 4. Tests d'Accessibilité

Axe DevTools, WAVE et les lecteurs d'écran sont vos meilleurs alliés.

Conclusion : Un design accessible est un design qui sert tout le monde, pas juste une minorité.
      `,
    },
    {
      id: 'animation-principles',
      title: "Principes d'Animation Web : De Disney au Web Moderne",
      excerpt:
        "Appliquez les 12 principes d'animation de Disney pour des interfaces vivantes.",
      category: 'Design',
      date: '2024-12-23',
      readTime: '10 min',
      image:
        'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
      content_blog: `
# Principes d'Animation Web : De Disney au Web Moderne

Les animations ne sont pas décoratives, elles guident l'utilisateur. Découvrez comment les utiliser efficacement.

## 1. Easing et Timing

Utilisez des courbes d'accélération naturelles pour des animations fluides.

## 2. Anticipation et Follow-Through

Préparez l'utilisateur avant une action et prolongez l'animation naturellement.

## 3. Micro-Interactions

Les petites animations renforcent le feedback et l'engagement.

## 4. Performance

Utilisez transform et opacity pour des animations 60fps garanties.

Conclusion : Une bonne animation améliore l'expérience, une mauvaise la détruit.
      `,
    },

    // ========== CATÉGORIE : Business (5 articles) ==========
    {
      id: 'mobile-first-strategy',
      title: 'Mobile-First : Stratégie Gagnante pour 2025',
      excerpt:
        'Pourquoi adopter une approche mobile-first est essentiel pour votre succès digital.',
      category: 'Business',
      date: '2025-01-03',
      readTime: '7 min',
      image:
        'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800',
      content_blog: `
# Mobile-First : Stratégie Gagnante pour 2025

L'approche mobile-first est devenue incontournable. Plus de 60% du trafic web provient des mobiles.

## 1. Performance Mobile Optimisée

Temps de chargement réduits et expérience fluide sur tous les appareils.

## 2. Design Responsive Avancé

Interfaces qui s'adaptent parfaitement à toutes les tailles d'écran.

## 3. PWA (Progressive Web Apps)

Combinez le meilleur du web et du mobile avec les PWA.

Conclusion : Pensez mobile d'abord, desktop ensuite. C'est la clé du succès en 2025.
      `,
    },
    {
      id: 'digital-transformation-pme',
      title: 'Transformation Digitale des PME : Guide Complet 2025',
      excerpt:
        'Accompagnez votre PME dans sa mutation numérique avec ce guide pratique.',
      category: 'Business',
      date: '2024-12-30',
      readTime: '14 min',
      image:
        'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      content_blog: `
# Transformation Digitale des PME : Guide Complet 2025

70% des PME qui n'ont pas digitalisé leurs processus disparaissent dans les 5 ans. Ne faites pas partie des statistiques.

## 1. Audit de Maturité Digitale

Évaluez où vous en êtes : présence web, outils digitaux, compétences équipes.

## 2. Feuille de Route Digitale

Priorisez les chantiers selon le ROI potentiel et les ressources disponibles.

## 3. Formation des Équipes

La technologie ne sert à rien sans adoption. Formez vos collaborateurs.

## 4. Choix des Outils

CRM, ERP, outils collaboratifs : sélectionnez des solutions adaptées à votre taille.

Conclusion : La transformation digitale n'est pas une option, c'est une question de survie.
      `,
    },
    {
      id: 'saas-business-model',
      title: 'Modèle SaaS : Lancer et Scaler votre Produit Web',
      excerpt:
        "De l'idée au million d'utilisateurs : comment construire un SaaS rentable.",
      category: 'Business',
      date: '2024-12-27',
      readTime: '16 min',
      image:
        'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800',
      content_blog: `
# Modèle SaaS : Lancer et Scaler votre Produit Web

Le SaaS offre un potentiel de croissance exponentielle. Découvrez comment créer un produit SaaS qui cartonne.

## 1. Product-Market Fit

Validez votre idée avant d'investir massivement. Parlez à vos utilisateurs.

## 2. Pricing Strategy

Freemium, trial, ou paywall direct ? Choisissez selon votre marché.

## 3. Métriques SaaS

MRR, ARR, Churn, LTV, CAC : maîtrisez les KPIs qui comptent.

## 4. Growth Hacking

Content marketing, SEO, partnerships : les leviers de croissance B2B SaaS.

Conclusion : Un SaaS réussi résout un vrai problème mieux que les alternatives.
      `,
    },
    {
      id: 'conversion-optimization',
      title: 'Optimisation du Taux de Conversion : +300% en 6 Mois',
      excerpt:
        'Techniques CRO éprouvées pour transformer vos visiteurs en clients.',
      category: 'Business',
      date: '2024-12-24',
      readTime: '12 min',
      image:
        'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
      content_blog: `
# Optimisation du Taux de Conversion : +300% en 6 Mois

Le trafic coûte cher. Maximisez la valeur de chaque visiteur avec le CRO (Conversion Rate Optimization).

## 1. A/B Testing Systématique

Testez tout : headlines, CTAs, couleurs, layouts. Les données ne mentent jamais.

## 2. Psychologie de la Persuasion
 
Scarcity, social proof, urgency : utilisez les biais cognitifs éthiquement.

## 3. Funnel Analysis

Identifiez où vos utilisateurs abandonnent et corrigez les frictions.

## 4. Personnalisation

Adaptez l'expérience selon la source, le device et le comportement utilisateur.

Conclusion : 1% d'amélioration du taux de conversion peut doubler votre chiffre d'affaires.
      `,
    },
    {
      id: 'content-marketing-strategy',
      title: 'Content Marketing : Attirer 100K Visiteurs par Mois',
      excerpt:
        'Stratégie complète de content marketing pour dominer votre niche.',
      category: 'Business',
      date: '2024-12-21',
      readTime: '15 min',
      image:
        'https://images.pexels.com/photos/3184431/pexels-photo-3184431.jpeg?auto=compress&cs=tinysrgb&w=800',
      content_blog: `
# Content Marketing : Attirer 100K Visiteurs par Mois

Le content marketing génère 3x plus de leads que le marketing traditionnel pour 62% moins cher.

## 1. Stratégie de Contenu

Identifiez les questions de votre audience et créez le meilleur contenu du web.

## 2. SEO On-Page

Optimisez titles, meta descriptions, structure HTML et maillage interne.

## 3. Link Building

Créez du contenu si bon que les autres sites voudront le linker naturellement.

## 4. Distribution Multicanal

Blog, newsletter, réseaux sociaux, guest posting : soyez partout où votre audience se trouve.

Conclusion : Le meilleur moment pour commencer était il y a 2 ans. Le deuxième meilleur moment, c'est maintenant.
      `,
    },
  ];

  return demoArticles;
};

// ✨ Modification ajoutée : Ajout du champ content_blog pour chaque article
export const blogPosts: BlogPostExtended[] = [
  {
    id: 'web-trends-2025',
    title: 'Tendances Web 2025 : Ce qui va changer',
    excerpt:
      'Découvrez les technologies et approches qui vont dominer le développement web en 2025',
    category: 'Développement',
    date: '2025-01-15',
    readTime: '8 min',
    image:
      'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=400',
    // ✨ Modification ajoutée : Contenu complet de l'article
    content_blog: `
# Tendances Web 2025 : Ce qui va changer

L'industrie du développement web évolue à un rythme remarquable. Alors que nous entrons dans 2025, plusieurs tendances majeures façonnent la manière dont nous construisons et concevons les applications web. Découvrez les innovations technologiques qui vont dominer cette année.

## 1. L'IA générative intégrée nativement

L'intelligence artificielle n'est plus une fonctionnalité de niche. En 2025, elle devient un composant fondamental des applications web. Les développeurs intègrent des modèles d'IA directement dans leurs applications pour :

- Améliorer la recherche et les recommandations
- Automatiser la génération de contenu
- Créer des chatbots conversationnels sophistiqués
- Optimiser l'expérience utilisateur en temps réel

Les frameworks modernes comme Next.js et React intègrent déjà des outils pour faciliter cette intégration.

## 2. Le Web 3 et les technologies blockchain

Malgré les critiques, la blockchain continue d'évoluer. Les applications web décentralisées (dApps) gagnent en maturité, avec des portefeuilles numériques et des systèmes de paiement plus accessibles. Les développeurs explorent les contrats intelligents pour créer des applications transparentes et sécurisées.

## 3. Performance et Core Web Vitals

Les métriques de performance web deviennent critiques pour le SEO. Les outils de mesure évoluent pour évaluer :

- La vitesse de chargement des images
- L'interactivité de l'interface
- La stabilité visuelle lors du chargement

Les frameworks modernes optimisent automatiquement ces métriques.

## 4. Les micro-frontends en production

Les architectures micro-frontends permettent aux grandes équipes de travailler indépendamment. Chaque équipe gère son propre front-end modulaire, synchronisé via APIs.

Conclusion : 2025 sera l'année où la technologie et l'expérience utilisateur convergeront davantage que jamais.
    `,
  },
  {
    id: 'performance-optimization',
    title: 'Optimisation Performance : Guide Complet',
    excerpt:
      "Techniques avancées pour accélérer vos applications web et améliorer l'expérience utilisateur",
    category: 'Performance',
    date: '2025-01-10',
    readTime: '12 min',
    image:
      'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=400',
    // ✨ Modification ajoutée : Contenu complet de l'article
    content_blog: `
# Optimisation Performance : Guide Complet

La performance d'une application web est cruciale pour l'expérience utilisateur et le SEO. Cet article explore les meilleures techniques pour optimiser vos applications.

## 1. Optimisation des images

Les images représentent souvent la majorité du contenu téléchargé. Quelques stratégies essentielles :

- Utiliser les formats modernes (WebP, AVIF)
- Mettre en place la lazy loading
- Implémenter le responsive images avec srcset
- Compresser les images sans perte de qualité

## 2. Code splitting et lazy loading

Diviser votre bundle JavaScript en chunks plus petits permet de charger uniquement le code nécessaire :

- Utilisez React.lazy() pour les composants
- Implémentez le route-based code splitting
- Chargez les dépendances lourdes à la demande

## 3. Mise en cache optimale

Une bonne stratégie de mise en cache peut réduire drastiquement les temps de chargement :

- Utilisez les Service Workers pour le caching offline
- Configurez les headers HTTP de caching
- Implémentez un système de versioning des assets

## 4. Monitoring et mesure

Mesurez régulièrement vos performances avec :

- Google Lighthouse
- WebPageTest
- Outils natifs du navigateur (DevTools)

## 5. Optimisation du rendu

Réduisez les reflows et repaints :

- Utilisez requestAnimationFrame
- Implémentez la virtualisation pour les longues listes
- Optimisez les animations avec GPU

Conclusion : L'optimisation est un processus continu qui requiert de la mesure, de l'itération et des ajustements constants.
    `,
  },
  {
    id: 'security-best-practices',
    title: 'Sécurité Web : Meilleures Pratiques 2025',
    excerpt:
      'Protégez vos applications contre les nouvelles menaces avec ces techniques éprouvées',
    category: 'Sécurité',
    date: '2025-01-05',
    readTime: '10 min',
    image:
      'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=400',
    // ✨ Modification ajoutée : Contenu complet de l'article
    content_blog: `
# Sécurité Web : Meilleures Pratiques 2025

La sécurité des applications web est plus importante que jamais. Avec l'augmentation des cyberattaques, voici les meilleures pratiques pour protéger vos applications.

## 1. Authentification multi-facteurs (MFA)

L'authentification à un seul facteur n'est plus suffisante. Implémentez :

- L'authentification à deux facteurs (2FA)
- L'authentification biométrique
- Les clés de sécurité physiques

## 2. Gestion des secrets

Jamais stocker les secrets dans le code source :

- Utilisez des variables d'environnement
- Implémentez un gestionnaire de secrets (Vault, AWS Secrets Manager)
- Rotez les credentials régulièrement

## 3. CORS et politique de sécurité

Configurez correctement les headers de sécurité :

- Content-Security-Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security

## 4. Protection contre les attaques courantes

Défendez-vous contre :

- Les injections SQL avec les requêtes paramétrées
- Les attaques XSS en échappant le contenu utilisateur
- Les attaques CSRF avec les tokens CSRF

## 5. Audit de sécurité

Réalisez des audits réguliers :

- Utilisez OWASP ZAP pour les tests de pénétration
- Vérifiez les dépendances avec npm audit
- Formez votre équipe aux meilleures pratiques

Conclusion : La sécurité n'est pas une fonctionnalité, c'est une responsabilité.
    `,
  },
  {
    id: 'react-18-features',
    title: 'React 18 : Nouvelles Fonctionnalités',
    excerpt:
      'Explorez les dernières fonctionnalités de React 18 et comment les utiliser dans vos projets',
    category: 'React',
    date: '2025-01-01',
    readTime: '6 min',
    image:
      'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
    // ✨ Modification ajoutée : Contenu complet de l'article
    content_blog: `
# React 18 : Nouvelles Fonctionnalités

React 18 a apporté plusieurs améliorations majeures pour les développeurs. Découvrez les fonctionnalités clés et comment les utiliser.

## 1. Concurrent Rendering

React 18 introduit le rendu concurrent, permettant à React d'interrompre le rendu pour se concentrer sur des tâches critiques :

- Améliore la responsivité de l'interface
- Permet un rendu interruptible
- Mieux adapté aux appareils bas de gamme

## 2. Automatique Batching

React groupe maintenant les mises à jour d'état pour un rendu plus efficace :

\`\`\`javascript
const handleClick = async () => {
  setCount(c => c + 1); // État en batch
  setTitle('Nouveau titre'); // État en batch
  const data = await fetchData();
  setData(data); // Aussi en batch en React 18
}
\`\`\`

## 3. useTransition Hook

Gérez les mises à jour non urgentes :

\`\`\`javascript
const [isPending, startTransition] = useTransition();

const handleChange = (e) => {
  startTransition(() => {
    setSearchTerm(e.target.value);
  });
}
\`\`\`

## 4. useDeferredValue Hook

Reportez la mise à jour d'une valeur :

\`\`\`javascript
const deferredValue = useDeferredValue(value);
\`\`\`

## 5. Suspense pour le Data Fetching

Suspense est maintenant stable pour le chargement de données :

\`\`\`javascript
<Suspense fallback={<Loading />}>
  <UserProfile />
</Suspense>
\`\`\`

Conclusion : React 18 rend les applications plus rapides et plus réactives pour l'utilisateur final.
    `,
  },
  {
    id: 'ai-web-development',
    title: 'IA et Développement Web : Révolution',
    excerpt:
      "Comment l'intelligence artificielle transforme la façon dont nous développons des applications",
    category: 'Innovation',
    date: '2024-12-28',
    readTime: '9 min',
    image:
      'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
    // ✨ Modification ajoutée : Contenu complet de l'article
    content_blog: `
# IA et Développement Web : Révolution

L'intelligence artificielle transforme rapidement le paysage du développement web. De la génération de code aux tests automatisés, découvrez comment l'IA accélère le développement.

## 1. Génération de code assistée par IA

Les outils comme GitHub Copilot et ChatGPT aident les développeurs à :

- Générer du code boilerplate rapidement
- Compléter le code en temps réel
- Fournir des suggestions intelligentes

## 2. Tests automatisés améliorés

L'IA aide à identifier les cas de test manquants et à générer des scénarios de test automatiquement.

## 3. Optimisation des performances

Les algorithmes d'IA peuvent analyser le code et suggérer des optimisations :

- Identification des goulets d'étranglement
- Suggestions d'optimisation
- Prédiction des problèmes de performance

## 4. Chatbots intelligents

Les interfaces conversationnelles alimentées par l'IA offrent :

- Support client 24/7
- Réponses personnalisées
- Compréhension du contexte

## 5. Accessibilité améliorée

L'IA aide à :

- Générer des descriptions alt pour les images
- Valider la conformité WCAG
- Créer des expériences adaptées aux utilisateurs handicapés

## 6. Prédiction des tendances

Les modèles d'IA analysent les tendances pour prédire :

- Les technologies émergentes
- Les besoins des utilisateurs
- Les patterns d'utilisation

Conclusion : L'IA n'est pas une menace pour les développeurs, c'est un outil puissant qui amplifie notre productivité.
    `,
  },
  {
    id: 'pme-digital-transformation',
    title: 'PME : Réussir sa Transformation Digitale',
    excerpt:
      'Guide pratique pour accompagner les PME dans leur transition numérique',
    category: 'Business',
    date: '2024-12-25',
    readTime: '11 min',
    image:
      'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
    // ✨ Modification ajoutée : Contenu complet de l'article
    content_blog: `
# PME : Réussir sa Transformation Digitale

La transformation digitale n'est plus optionnelle pour les PME. Cet article vous guide dans cette transition cruciale.

## 1. Évaluer votre maturité digitale

Avant toute chose, comprenez votre situation actuelle :

- Auditez vos processus actuels
- Identifiez les points d'inefficacité
- Définissez une baseline de performance

## 2. Définir une stratégie claire

Établissez des objectifs mesurables :

- Quels processus digitaliser en priorité ?
- Quel est votre budget ?
- Quelles compétences manquent en interne ?

## 3. Choisir les bonnes technologies

Sélectionnez des outils appropriés à votre taille :

- Solutions SaaS pour la flexibilité
- CRM pour mieux comprendre vos clients
- Outils collaboratifs pour la productivité
- Analytics pour la prise de décision basée sur les données

## 4. Former et impliquer votre équipe

La transformation échoue souvent à cause d'une mauvaise adoption :

- Formez votre équipe aux nouveaux outils
- Impliquez-les dans le processus de sélection
- Célébrez les succès
- Écoutez les retours

## 5. Mesurer le succès

Suivez les KPI appropriés :

- Augmentation de productivité
- Réduction des coûts opérationnels
- Amélioration de la satisfaction client
- Meilleure prise de décision

## 6. Accélérer progressivement

La transformation digitale est un parcours, pas une destination :

- Commencez par des projets pilotes
- Apprenez et itérez
- Progressez graduellement
- Célébrez chaque étape

Conclusion : Les PME qui embrassent la transformation digitale gagnent un avantage compétitif durable.
    `,
  },
];

// ========================================
// 🤖 CHATBOT KNOWLEDGE BASE
// ========================================

export interface ChatbotKnowledgeItem {
  id: string;
  title: string;
  content: string;
  tags?: string[];
}

export const chatbotKnowledgeBase: ChatbotKnowledgeItem[] = [
  {
    id: 'kb-001',
    title: "Présentation de l'agence Leonce Ouattara Studio",
    content:
      "Leonce Ouattara Studio est une agence digitale spécialisée dans le développement web, mobile et la transformation numérique des PME. Nous accompagnons nos clients depuis la conception jusqu'à la mise en production, en passant par le design UX/UI, l'architecture technique et la maintenance. Notre expertise couvre React, TypeScript, Node.js, Python, Vue.js, PHP/Laravel et les solutions cloud (AWS, Azure). Nous intervenons dans plusieurs secteurs : hôtellerie, immobilier, éducation, santé, finance, e-commerce et coaching.",
    tags: ['agence', 'présentation', 'expertise', 'secteurs'],
  },
  {
    id: 'kb-002',
    title: 'Services : Développement Web & CMS',
    content:
      'Nous créons des sites vitrines, des plateformes e-commerce et des CMS personnalisés avec les dernières technologies. Nos prestations incluent : React/Vue.js pour le frontend, WordPress/Headless CMS pour la gestion de contenu, solutions e-commerce Shopify/WooCommerce, et Progressive Web Apps (PWA) pour une expérience mobile optimale. Chaque projet est conçu pour être performant, sécurisé et scalable.',
    tags: ['services', 'web', 'cms', 'e-commerce', 'pwa'],
  },
  {
    id: 'kb-003',
    title: 'Services : Applications Métiers & Logiciels Personnalisés',
    content:
      "Nous développons des logiciels métiers sur mesure adaptés à votre secteur d'activité : gestion commerciale, CRM/ERP personnalisé, outils de productivité et intégrations API. Nos solutions automatisent vos processus, centralisent vos données et améliorent l'efficacité opérationnelle. Exemples : plateforme de réservation hôtelière, CRM immobilier, gestion de microcrédits bancaires, LMS e-learning.",
    tags: ['services', 'logiciels', 'crm', 'erp', 'métier'],
  },
  {
    id: 'kb-004',
    title: 'Services : UX/UI Design & Architecture Web',
    content:
      'Notre équipe design crée des interfaces utilisateur orientées conversion avec prototypage interactif, tests utilisateurs et design systems complets. Côté architecture, nous concevons des infrastructures cloud scalables et sécurisées (AWS, Azure, Docker, Kubernetes), avec monitoring avancé, optimisation des performances et conformité aux normes de sécurité (ISO 27001, RGPD).',
    tags: ['services', 'design', 'ux', 'ui', 'architecture', 'cloud'],
  },
  {
    id: 'kb-005',
    title: 'Processus de collaboration & méthodologie',
    content:
      'Nous travaillons en méthodologie Agile avec des sprints de 2 semaines. Le processus typique : 1) Audit & découverte (1 semaine), 2) Conception & maquettage UX/UI (2-3 semaines), 3) Développement itératif avec démos hebdomadaires, 4) Tests & recette utilisateur, 5) Déploiement & formation, 6) Maintenance & support continu. Vous êtes impliqué à chaque étape avec des points réguliers et un accès à nos outils de gestion de projet (Jira, Notion).',
    tags: ['processus', 'agile', 'méthodologie', 'collaboration'],
  },
  {
    id: 'kb-006',
    title: 'Délais de réalisation par type de projet',
    content:
      "Voici nos délais moyens : Site vitrine (2-4 semaines), Landing page premium (1-2 semaines), E-commerce Shopify/WooCommerce (4-8 semaines), Application métier (CRM/ERP) (6-12 semaines), Plateforme complexe (marketplace, LMS) (3-6 mois). Ces délais varient selon la complexité, le nombre de fonctionnalités et les intégrations tierces. Nous fournissons un planning détaillé après l'audit initial.",
    tags: ['délais', 'timing', 'planning', 'durée'],
  },
  {
    id: 'kb-007',
    title: 'Tarification & budgets approximatifs',
    content:
      'Nos tarifs sont adaptés aux PME/PMI : Site vitrine (1 500€ - 5 000€), E-commerce (3 000€ - 15 000€), Application métier CRM/ERP (10 000€ - 50 000€), Refonte complète avec CMS (5 000€ - 20 000€), Consulting & audit digital (500€/jour). Le forfait mensuel maintenance débute à 200€/mois. Nous proposons des facilités de paiement (3-6 mensualités) et adaptons nos offres à votre budget. Demandez un devis personnalisé gratuit pour votre projet.',
    tags: ['tarifs', 'prix', 'budget', 'devis', 'coût'],
  },
  {
    id: 'kb-008',
    title: 'RGPD, sécurité des données & conformité',
    content:
      "Nous garantissons la conformité RGPD de toutes nos solutions : chiffrement des données sensibles (SSL/TLS, encryption at rest), gestion des consentements utilisateurs, droit à l'oubli et portabilité des données, audit trails et logs sécurisés. Nos infrastructures respectent les normes ISO 27001 et PCI-DSS pour les paiements en ligne. Hébergement en Europe (France/UE) disponible pour les données critiques.",
    tags: ['rgpd', 'sécurité', 'conformité', 'données', 'iso'],
  },
  {
    id: 'kb-009',
    title: 'Contact, prise de rendez-vous & support',
    content:
      'Pour nous contacter : Email principal : contact@leonce-ouattara.com, Téléphone/WhatsApp : +225 XX XX XX XX XX. Planifiez un appel découverte gratuit de 30 min via notre calendrier en ligne (lien sur le site). Nous répondons sous 24h ouvrées. Support technique disponible du lundi au vendredi 9h-18h (GMT). Maintenance 24/7 disponible en option premium.',
    tags: ['contact', 'rdv', 'support', 'email', 'téléphone'],
  },
  {
    id: 'kb-010',
    title: 'Portfolio & cas clients (exemples)',
    content:
      'Découvrez nos réalisations : Plateforme E-commerce B2B (+150% conversion, 500K€ CA/mois), CRM Hôtelier avec réservations (+80% réservations directes), Site bancaire RGPD & ISO 27001 (+200% trafic web), CRM Immobilier (+300% leads qualifiés), Plateforme LMS e-learning. Consultez la section Portfolio pour voir les détails techniques, technologies utilisées et résultats chiffrés. Témoignages clients disponibles sur demande.',
    tags: ['portfolio', 'projets', 'réalisations', 'cas', 'clients'],
  },
  {
    id: 'kb-011',
    title: 'Intégration CMS & gestion de contenu',
    content:
      "Nous maîtrisons plusieurs CMS : WordPress (avec thèmes custom ou builders type Elementor/Oxygen), Headless CMS (Strapi, Contentful, Sanity) couplés à React/Next.js pour performance maximale, Shopify & WooCommerce pour l'e-commerce. Formation incluse pour que vous puissiez gérer vos contenus en autonomie (textes, images, produits, blog). Documentation et tutoriels vidéo fournis.",
    tags: ['cms', 'wordpress', 'strapi', 'gestion', 'contenu'],
  },
  {
    id: 'kb-012',
    title: 'Maintenance, hébergement & support continu',
    content:
      'Nos forfaits maintenance incluent : Mises à jour de sécurité (CMS, plugins, dépendances), Monitoring 24/7 avec alertes automatiques, Sauvegardes quotidiennes automatisées, Support technique (tickets, email, téléphone), Corrections de bugs et améliorations mineures. Hébergement cloud performant inclus (99.9% uptime garanti). Forfaits à partir de 200€/mois. SLA personnalisés disponibles pour les grandes structures.',
    tags: ['maintenance', 'hébergement', 'support', 'sauvegarde', 'monitoring'],
  },
];

export const skills = [
  { name: 'React/TypeScript', level: 95 },
  { name: 'Node.js/Express', level: 90 },
  { name: 'Python/Django', level: 85 },
  { name: 'Vue.js/Nuxt', level: 88 },
  { name: 'PHP/Laravel', level: 82 },
  { name: 'Database Design', level: 92 },
  { name: 'Cloud Architecture', level: 87 },
  { name: 'UX/UI Design', level: 80 },
];
