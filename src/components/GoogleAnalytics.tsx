import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Google Analytics 4 Integration
 * 
 * SETUP:
 * 1. Créer compte GA4: https://analytics.google.com
 * 2. Copier Measurement ID (G-XXXXXXXXXX)
 * 3. Ajouter dans .env: VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
 * 4. Importer ce composant dans App.tsx
 */

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Récupérer l'ID depuis .env
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

/**
 * Installer le script Google Analytics
 */
export const installGoogleAnalytics = () => {
  if (!GA_MEASUREMENT_ID) {
    console.warn('GA_MEASUREMENT_ID not found in environment variables');
    return;
  }

  // Vérifier si déjà installé
  if (document.querySelector(`script[src*="googletagmanager.com/gtag"]`)) {
    return;
  }

  // Ajouter script GA
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialiser gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: any[]) {
    window.dataLayer.push(args);
  };
  
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false, // On gère manuellement les page views
  });
};

/**
 * Hook pour tracker les page views
 */
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !window.gtag) return;

    // Track page view
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: location.pathname + location.search,
    });
  }, [location]);
};

/**
 * Tracking Events Helpers
 */

// Event: Partage social
export const trackShare = (platform: string, itemId: string) => {
  if (!window.gtag) return;
  
  window.gtag('event', 'share', {
    method: platform,
    content_type: 'article',
    item_id: itemId,
  });
};

// Event: Commentaire
export const trackComment = (itemId: string) => {
  if (!window.gtag) return;
  
  window.gtag('event', 'comment', {
    content_type: 'article',
    item_id: itemId,
  });
};

// Event: Newsletter signup
export const trackNewsletterSignup = (source: string = 'article') => {
  if (!window.gtag) return;
  
  window.gtag('event', 'sign_up', {
    method: 'newsletter',
    source,
  });
};

// Event: Contact form
export const trackContactSubmit = (budget: string) => {
  if (!window.gtag) return;
  
  window.gtag('event', 'generate_lead', {
    value: budget,
    currency: 'EUR',
  });
};

// Event: Article read (temps passé)
export const trackArticleRead = (itemId: string, readingTime: number) => {
  if (!window.gtag) return;
  
  window.gtag('event', 'article_read', {
    item_id: itemId,
    reading_time: readingTime,
  });
};

// Event: Scroll depth
export const trackScrollDepth = (depth: number) => {
  if (!window.gtag) return;
  
  window.gtag('event', 'scroll', {
    percent_scrolled: depth,
  });
};

/**
 * Composant GoogleAnalytics
 * À utiliser dans App.tsx
 */
const GoogleAnalytics = () => {
  useEffect(() => {
    installGoogleAnalytics();
  }, []);

  usePageTracking();

  return null;
};

export default GoogleAnalytics;
