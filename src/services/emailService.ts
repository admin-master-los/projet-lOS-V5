/**
 * Service: Email avec Brevo
 * Gestion envoi emails automatiques
 */

interface SendEmailParams {
  to: {
    email: string;
    name: string;
  };
  subject: string;
  htmlContent: string;
  textContent?: string;
}

interface MeetingEmailData {
  clientName: string;
  clientEmail: string;
  serviceName: string;
  meetingDate: string;
  meetingTime: string;
  duration: number;
  channel: string;
  channelLink?: string;
}

/**
 * Envoyer un email via Brevo
 */
export const sendEmail = async (params: SendEmailParams): Promise<boolean> => {
  const apiKey = import.meta.env.VITE_BREVO_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Clé API Brevo manquante');
    return false;
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: import.meta.env.VITE_SENDER_NAME || 'Votre Entreprise',
          email: import.meta.env.VITE_SENDER_EMAIL || 'noreply@votredomaine.com',
        },
        to: [params.to],
        subject: params.subject,
        htmlContent: params.htmlContent,
        textContent: params.textContent,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Erreur Brevo:', error);
      return false;
    }

    console.log('✅ Email envoyé:', params.to.email);
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    return false;
  }
};

/**
 * Obtenir le nom du canal
 */
const getChannelLabel = (channel: string): string => {
  const labels: Record<string, string> = {
    zoom: 'Zoom',
    google_meet: 'Google Meet',
    microsoft_teams: 'Microsoft Teams',
    whatsapp_video: 'WhatsApp Video',
    phone: 'Téléphone',
  };
  return labels[channel] || 'Non défini';
};

/**
 * Email de confirmation au client
 */
export const sendClientConfirmation = async (data: MeetingEmailData): Promise<boolean> => {
  const dateFormatted = new Date(data.meetingDate).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de rendez-vous</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Container principal -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
          
          <!-- Header avec gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #06b6d4 0%, #a855f7 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                ✅ Rendez-vous confirmé !
              </h1>
              <p style="margin: 10px 0 0 0; color: #e0f2fe; font-size: 16px;">
                Votre demande a bien été enregistrée
              </p>
            </td>
          </tr>

          <!-- Corps du message -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Bonjour <strong style="color: #ffffff;">${data.clientName}</strong>,
              </p>
              
              <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Nous avons bien reçu votre demande de rendez-vous. Voici les détails :
              </p>

              <!-- Détails du RDV -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; border-radius: 12px; overflow: hidden; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <!-- Service -->
                    <div style="margin-bottom: 20px;">
                      <div style="color: #94a3b8; font-size: 13px; margin-bottom: 5px;">Service</div>
                      <div style="color: #ffffff; font-size: 18px; font-weight: 600;">${data.serviceName}</div>
                      <div style="color: #64748b; font-size: 14px; margin-top: 3px;">Durée : ${data.duration} minutes</div>
                    </div>

                    <!-- Date & Heure -->
                    <div style="margin-bottom: 20px;">
                      <div style="color: #94a3b8; font-size: 13px; margin-bottom: 5px;">📅 Date & Heure</div>
                      <div style="color: #ffffff; font-size: 16px; font-weight: 600;">${dateFormatted}</div>
                      <div style="color: #06b6d4; font-size: 18px; font-weight: bold; margin-top: 3px;">${data.meetingTime}</div>
                    </div>

                    <!-- Canal -->
                    <div>
                      <div style="color: #94a3b8; font-size: 13px; margin-bottom: 5px;">🎥 Canal de communication</div>
                      <div style="color: #ffffff; font-size: 16px; font-weight: 600;">${getChannelLabel(data.channel)}</div>
                      ${data.channelLink ? `
                        <div style="margin-top: 10px;">
                          <a href="${data.channelLink}" style="display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #a855f7 100%); color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                            Rejoindre la réunion
                          </a>
                        </div>
                      ` : ''}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Note importante -->
              <div style="background-color: rgba(6, 182, 212, 0.1); border-left: 4px solid #06b6d4; border-radius: 8px; padding: 15px; margin-bottom: 30px;">
                <p style="color: #06b6d4; font-size: 14px; margin: 0; font-weight: 600;">
                  ℹ️ Que se passe-t-il ensuite ?
                </p>
                <p style="color: #cbd5e1; font-size: 14px; margin: 10px 0 0 0; line-height: 1.5;">
                  Notre équipe va examiner votre demande et vous contactera sous 24h pour confirmer le rendez-vous ou proposer des ajustements si nécessaire.
                </p>
              </div>

              <!-- Actions -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                <tr>
                  <td align="center">
                    <a href="${import.meta.env.VITE_APP_URL || 'http://localhost:5173'}/reserver" style="display: inline-block; background: linear-gradient(135deg, #a855f7 0%, #06b6d4 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 16px; margin: 0 5px;">
                      📅 Ajouter au calendrier
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 30px; text-align: center; border-top: 1px solid #334155;">
              <p style="color: #64748b; font-size: 14px; margin: 0 0 10px 0;">
                Besoin d'aide ? Contactez-nous à
              </p>
              <p style="margin: 0;">
                <a href="mailto:${import.meta.env.VITE_ADMIN_EMAIL || 'contact@votredomaine.com'}" style="color: #06b6d4; text-decoration: none; font-weight: 600;">
                  ${import.meta.env.VITE_ADMIN_EMAIL || 'contact@votredomaine.com'}
                </a>
              </p>
              <p style="color: #475569; font-size: 12px; margin: 20px 0 0 0;">
                © ${new Date().getFullYear()} ${import.meta.env.VITE_SENDER_NAME || 'Votre Entreprise'}. Tous droits réservés.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const textContent = `
Bonjour ${data.clientName},

Votre rendez-vous a été confirmé !

Détails :
- Service : ${data.serviceName}
- Date : ${dateFormatted}
- Heure : ${data.meetingTime}
- Durée : ${data.duration} minutes
- Canal : ${getChannelLabel(data.channel)}

Notre équipe vous contactera sous 24h pour confirmer.

Cordialement,
${import.meta.env.VITE_SENDER_NAME || 'Votre Entreprise'}
  `;

  return sendEmail({
    to: {
      email: data.clientEmail,
      name: data.clientName,
    },
    subject: `✅ Rendez-vous confirmé - ${data.serviceName}`,
    htmlContent,
    textContent,
  });
};

/**
 * Email de notification à l'admin
 */
export const sendAdminNotification = async (data: MeetingEmailData): Promise<boolean> => {
  const dateFormatted = new Date(data.meetingDate).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Nouveau rendez-vous</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #f59e0b; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px;">
                🔔 Nouveau rendez-vous
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
                Un nouveau rendez-vous vient d'être réservé.
              </p>
              
              <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f9fafb; border-radius: 6px;">
                <tr>
                  <td style="font-weight: bold; color: #6b7280;">Client :</td>
                  <td style="color: #111827;">${data.clientName}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; color: #6b7280;">Email :</td>
                  <td><a href="mailto:${data.clientEmail}" style="color: #3b82f6;">${data.clientEmail}</a></td>
                </tr>
                <tr>
                  <td style="font-weight: bold; color: #6b7280;">Service :</td>
                  <td style="color: #111827;">${data.serviceName}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; color: #6b7280;">Date :</td>
                  <td style="color: #111827;">${dateFormatted}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; color: #6b7280;">Heure :</td>
                  <td style="color: #111827; font-weight: bold; font-size: 18px;">${data.meetingTime}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; color: #6b7280;">Durée :</td>
                  <td style="color: #111827;">${data.duration} minutes</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; color: #6b7280;">Canal :</td>
                  <td style="color: #111827;">${getChannelLabel(data.channel)}</td>
                </tr>
              </table>

              <div style="margin-top: 30px; text-align: center;">
                <a href="${import.meta.env.VITE_APP_URL || 'http://localhost:5173'}/admin/meetings" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600;">
                  Voir dans l'admin
                </a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@votredomaine.com';

  return sendEmail({
    to: {
      email: adminEmail,
      name: 'Admin',
    },
    subject: `🔔 Nouveau RDV : ${data.serviceName} - ${data.clientName}`,
    htmlContent,
    textContent: `Nouveau rendez-vous réservé par ${data.clientName} le ${dateFormatted} à ${data.meetingTime}`,
  });
};

/**
 * Envoyer les 2 emails (client + admin)
 */
export const sendMeetingEmails = async (data: MeetingEmailData): Promise<{
  clientSent: boolean;
  adminSent: boolean;
}> => {
  const [clientSent, adminSent] = await Promise.all([
    sendClientConfirmation(data),
    sendAdminNotification(data),
  ]);

  return { clientSent, adminSent };
};

// ========================================
// EMAILS CONTACT
// ========================================

interface ContactEmailData {
  name: string;
  email: string;
  company?: string;
  budget: string;
  project: string;
}

/**
 * Template email admin pour nouveau contact
 */
const getAdminContactEmailTemplate = (data: ContactEmailData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content {
          padding: 30px;
        }
        .field {
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e0e0e0;
        }
        .field:last-child {
          border-bottom: none;
        }
        .label {
          font-weight: 600;
          color: #667eea;
          margin-bottom: 8px;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .value {
          color: #333;
          font-size: 16px;
          word-wrap: break-word;
        }
        .message-box {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #667eea;
          white-space: pre-wrap;
        }
        .footer {
          text-align: center;
          padding: 20px;
          background: #f9f9f9;
          color: #666;
          font-size: 14px;
        }
        .reply-button {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 6px;
          margin-top: 20px;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📧 Nouveau Message de Contact</h1>
        </div>
        
        <div class="content">
          <div class="field">
            <div class="label">De</div>
            <div class="value">${data.name}</div>
          </div>
          
          <div class="field">
            <div class="label">Email</div>
            <div class="value">
              <a href="mailto:${data.email}" style="color: #667eea; text-decoration: none;">
                ${data.email}
              </a>
            </div>
          </div>
          
          ${data.company ? `
          <div class="field">
            <div class="label">Entreprise</div>
            <div class="value">${data.company}</div>
          </div>
          ` : ''}
          
          <div class="field">
            <div class="label">Budget</div>
            <div class="value">${data.budget}</div>
          </div>
          
          <div class="field">
            <div class="label">Description du Projet</div>
            <div class="message-box">${data.project}</div>
          </div>
          
          <div style="text-align: center;">
            <a href="mailto:${data.email}" class="reply-button">
              Répondre à ${data.name}
            </a>
          </div>
        </div>
        
        <div class="footer">
          <p>Message reçu via le formulaire de contact</p>
          <p style="color: #999; font-size: 12px; margin-top: 10px;">
            Répondez directement à ${data.email}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Template email confirmation client
 */
const getClientContactEmailTemplate = (data: ContactEmailData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .checkmark {
          width: 60px;
          height: 60px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 20px auto 0;
          font-size: 30px;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 18px;
          margin-bottom: 20px;
        }
        .message-recap {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #667eea;
          margin: 25px 0;
        }
        .message-recap h3 {
          margin-top: 0;
          color: #667eea;
          font-size: 16px;
        }
        .message-text {
          white-space: pre-wrap;
          color: #555;
        }
        .footer {
          text-align: center;
          padding: 30px;
          background: #f9f9f9;
          color: #666;
          font-size: 14px;
        }
        .info-box {
          background: #e8f4f8;
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Message bien reçu !</h1>
          <div class="checkmark">✓</div>
        </div>
        
        <div class="content">
          <p class="greeting">Bonjour ${data.name},</p>
          
          <p>
            Merci de nous avoir contacté ! Nous avons bien reçu votre message 
            et nous vous répondrons dans les plus brefs délais.
          </p>
          
          <div class="message-recap">
            <h3>Récapitulatif de votre message :</h3>
            ${data.company ? `<p><strong>Entreprise :</strong> ${data.company}</p>` : ''}
            <p><strong>Budget :</strong> ${data.budget}</p>
            <p><strong>Votre projet :</strong></p>
            <div class="message-text">${data.project}</div>
          </div>
          
          <div class="info-box">
            <p style="margin: 0; font-weight: 600; color: #667eea;">
              ⏱️ Délai de réponse : 24-48 heures
            </p>
          </div>
          
          <p>
            Notre équipe étudiera votre demande avec attention et reviendra 
            vers vous rapidement avec une réponse personnalisée.
          </p>
          
          <p style="margin-top: 30px;">
            Cordialement,<br>
            <strong>L'équipe</strong>
          </p>
        </div>
        
        <div class="footer">
          <p>
            Cet email a été envoyé automatiquement suite à votre demande de contact.
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 10px;">
            Merci de ne pas répondre à cet email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Envoyer email à l'admin pour nouveau contact
 */
export const sendContactAdminNotification = async (data: ContactEmailData): Promise<boolean> => {
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@example.com';
  
  return await sendEmail({
    to: {
      email: adminEmail,
      name: 'Admin',
    },
    subject: `Nouveau message de contact : ${data.name}`,
    htmlContent: getAdminContactEmailTemplate(data),
  });
};

/**
 * Envoyer email de confirmation au client
 */
export const sendContactClientConfirmation = async (data: ContactEmailData): Promise<boolean> => {
  return await sendEmail({
    to: {
      email: data.email,
      name: data.name,
    },
    subject: 'Message bien reçu !',
    htmlContent: getClientContactEmailTemplate(data),
  });
};

/**
 * Envoyer les 2 emails de contact (client + admin)
 */
export const sendContactEmails = async (data: ContactEmailData): Promise<{
  clientSent: boolean;
  adminSent: boolean;
}> => {
  const [clientSent, adminSent] = await Promise.all([
    sendContactClientConfirmation(data),
    sendContactAdminNotification(data),
  ]);

  return { clientSent, adminSent };
};

/**
 * Interface pour email approbation commentaire
 */
interface CommentApprovalEmailData {
  authorName: string;
  authorEmail: string;
  postTitle: string;
  commentContent: string;
  postUrl: string;
}

/**
 * Template email approbation commentaire
 */
const getCommentApprovalEmailTemplate = (data: CommentApprovalEmailData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .comment-box { background: white; padding: 20px; border-left: 4px solid #06b6d4; margin: 20px 0; border-radius: 5px; }
        .button { display: inline-block; padding: 12px 30px; background: #06b6d4; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Commentaire approuvé !</h1>
        </div>
        <div class="content">
          <p>Bonjour <strong>${data.authorName}</strong>,</p>
          
          <p>Bonne nouvelle ! Votre commentaire sur l'article "<strong>${data.postTitle}</strong>" a été approuvé et est maintenant visible publiquement.</p>
          
          <div class="comment-box">
            <p><strong>Votre commentaire :</strong></p>
            <p>${data.commentContent}</p>
          </div>
          
          <p>Vous pouvez voir votre commentaire publié en visitant l'article :</p>
          
          <center>
            <a href="${data.postUrl}" class="button">Voir l'article</a>
          </center>
          
          <p>Merci d'avoir participé à la discussion !</p>
          
          <div class="footer">
            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Envoyer email d'approbation de commentaire à l'auteur
 */
export const sendCommentApprovalEmail = async (data: CommentApprovalEmailData): Promise<boolean> => {
  console.log('📧 Envoi email approbation commentaire à:', data.authorEmail);
  
  return await sendEmail({
    to: {
      email: data.authorEmail,
      name: data.authorName,
    },
    subject: `Votre commentaire sur "${data.postTitle}" a été approuvé !`,
    htmlContent: getCommentApprovalEmailTemplate(data),
  });
};

