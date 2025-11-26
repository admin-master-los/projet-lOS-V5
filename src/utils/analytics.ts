/**
 * Utilitaires Google Analytics
 * Fonctions pour tracker les événements personnalisés
 */

export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
  } else {
    console.warn('GA4 not loaded, event not tracked:', eventName);
  }
};

// Événements prédéfinis
export const analytics = {
  /**
   * Soumission du formulaire de contact
   */
  contactFormSubmit: (method: string) => {
    trackEvent('contact_form_submit', {
      method: method, // 'email', 'phone', 'contact_form', etc.
    });
  },

  /**
   * Vue d'un article de blog
   */
  blogArticleView: (articleTitle: string, articleId: string) => {
    trackEvent('blog_article_view', {
      article_title: articleTitle,
      article_id: articleId,
    });
  },

  /**
   * Vue d'une section de la page
   */
  sectionView: (sectionName: string) => {
    trackEvent('section_view', {
      section_name: sectionName,
    });
  },

  /**
   * Clic sur un CTA (Call To Action)
   */
  ctaClick: (ctaName: string, ctaLocation: string) => {
    trackEvent('cta_click', {
      cta_name: ctaName,
      cta_location: ctaLocation,
    });
  },

  /**
   * Téléchargement d'un fichier
   */
  downloadFile: (fileName: string, fileType: string) => {
    trackEvent('file_download', {
      file_name: fileName,
      file_type: fileType,
    });
  },

  /**
   * Clic sur un lien externe
   */
  externalLinkClick: (url: string, linkText: string) => {
    trackEvent('external_link_click', {
      url: url,
      link_text: linkText,
    });
  },

  /**
   * Demande de devis
   */
  quoteRequest: (service: string) => {
    trackEvent('quote_request', {
      service: service,
    });
  },

  /**
   * Scroll jusqu'à une section
   */
  scrollToSection: (sectionName: string) => {
    trackEvent('scroll_to_section', {
      section_name: sectionName,
    });
  },

  /**
   * Erreur sur la page
   */
  pageError: (errorMessage: string, errorPage: string) => {
    trackEvent('page_error', {
      error_message: errorMessage,
      error_page: errorPage,
    });
  },

  /**
   * Recherche sur le site
   */
  siteSearch: (searchTerm: string) => {
    trackEvent('site_search', {
      search_term: searchTerm,
    });
  },
};

/**
 * Exemple d'utilisation :
 * 
 * import { analytics } from '@/utils/analytics';
 * 
 * // Dans un composant
 * const handleSubmit = () => {
 *   // Votre logique...
 *   analytics.contactFormSubmit('contact_form');
 * };
 * 
 * // Dans un bouton CTA
 * <button onClick={() => analytics.ctaClick('Demander un devis', 'Hero section')}>
 *   Demander un devis
 * </button>
 */
