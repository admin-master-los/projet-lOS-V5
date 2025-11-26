/**
 * Service Mailchimp pour Newsletter
 * 
 * SETUP:
 * 1. Créer compte Mailchimp: https://mailchimp.com
 * 2. Créer une Audience
 * 3. Générer API Key (Account > Extras > API keys)
 * 4. Récupérer Server Prefix (ex: us1, us2, etc)
 * 5. Récupérer Audience ID (Settings > Audience name and defaults)
 * 
 * Variables d'environnement (.env):
 * VITE_MAILCHIMP_API_KEY=your_api_key
 * VITE_MAILCHIMP_SERVER_PREFIX=us1
 * VITE_MAILCHIMP_AUDIENCE_ID=your_audience_id
 */

interface MailchimpSubscriber {
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
  source?: string; // 'article', 'homepage', etc.
}

interface MailchimpResponse {
  success: boolean;
  message: string;
  data?: any;
}

class MailchimpService {
  private apiKey: string;
  private serverPrefix: string;
  private audienceId: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_MAILCHIMP_API_KEY || '';
    this.serverPrefix = import.meta.env.VITE_MAILCHIMP_SERVER_PREFIX || '';
    this.audienceId = import.meta.env.VITE_MAILCHIMP_AUDIENCE_ID || '';
    this.baseUrl = `https://${this.serverPrefix}.api.mailchimp.com/3.0`;
  }

  /**
   * Vérifier si Mailchimp est configuré
   */
  isConfigured(): boolean {
    return !!(this.apiKey && this.serverPrefix && this.audienceId);
  }

  /**
   * Ajouter un abonné à la liste
   */
  async subscribe(subscriber: MailchimpSubscriber): Promise<MailchimpResponse> {
    if (!this.isConfigured()) {
      console.warn('Mailchimp not configured. Check environment variables.');
      
      // Fallback: Sauvegarder dans Supabase
      return this.saveToSupabase(subscriber);
    }

    try {
      // Note: Pour raisons de sécurité, l'appel API direct depuis le frontend
      // n'est PAS recommandé car ça expose l'API key.
      // 
      // SOLUTION RECOMMANDÉE: Créer une Cloud Function ou API endpoint
      // qui gère l'appel à Mailchimp côté serveur.
      //
      // Pour l'instant, on sauvegarde dans Supabase.
      
      return this.saveToSupabase(subscriber);
      
    } catch (error) {
      console.error('Mailchimp error:', error);
      return {
        success: false,
        message: 'Erreur lors de l\'inscription',
      };
    }
  }

  /**
   * Sauvegarder dans Supabase (Fallback & Data Collection)
   */
  private async saveToSupabase(subscriber: MailchimpSubscriber): Promise<MailchimpResponse> {
    try {
      const { supabase } = await import('../lib/supabaseClient');
      
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email: subscriber.email,
          first_name: subscriber.firstName || null,
          last_name: subscriber.lastName || null,
          source: subscriber.source || 'website',
          tags: subscriber.tags || [],
          status: 'pending', // En attente de confirmation
        })
        .select()
        .single();

      if (error) {
        // Si email déjà existant
        if (error.code === '23505') {
          return {
            success: false,
            message: 'Cet email est déjà inscrit à notre newsletter.',
          };
        }
        throw error;
      }

      return {
        success: true,
        message: 'Inscription réussie ! Vous allez recevoir un email de confirmation.',
        data,
      };
    } catch (error) {
      console.error('Supabase newsletter error:', error);
      return {
        success: false,
        message: 'Erreur lors de l\'inscription. Veuillez réessayer.',
      };
    }
  }

  /**
   * Vérifier si un email est déjà abonné
   */
  async isSubscribed(email: string): Promise<boolean> {
    try {
      const { supabase } = await import('../lib/supabaseClient');
      
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('id')
        .eq('email', email)
        .eq('status', 'subscribed')
        .single();

      return !error && !!data;
    } catch {
      return false;
    }
  }

  /**
   * Se désabonner
   */
  async unsubscribe(email: string): Promise<MailchimpResponse> {
    try {
      const { supabase } = await import('../lib/supabaseClient');
      
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
        .eq('email', email);

      if (error) throw error;

      return {
        success: true,
        message: 'Vous êtes bien désabonné de notre newsletter.',
      };
    } catch (error) {
      console.error('Unsubscribe error:', error);
      return {
        success: false,
        message: 'Erreur lors de la désinscription.',
      };
    }
  }
}

// Export instance singleton
export const mailchimpService = new MailchimpService();

export default mailchimpService;
