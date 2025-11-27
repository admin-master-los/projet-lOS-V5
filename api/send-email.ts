// API Route pour envoi sécurisé d'emails
// Compatible avec Vercel sans dépendance @vercel/node

// Types simples pour Request/Response
interface VercelRequest {
  method?: string
  body: any
}

interface VercelResponse {
  status: (code: number) => VercelResponse
  json: (data: any) => void
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

// ==================== INTERFACES ====================

interface ContactEmailData {
  type: 'contact'
  name: string
  email: string
  company: string
  budget: string
  project: string
}

interface MeetingEmailData {
  type: 'meeting'
  clientName: string
  clientEmail: string
  serviceName: string
  meetingDate: string
  meetingTime: string
  duration: number
  channel: string
  channelLink?: string
}

interface CommentApprovalEmailData {
  type: 'comment-approval'
  authorName: string
  authorEmail: string
  postTitle: string
  commentContent: string
  postUrl: string
}

type EmailData = ContactEmailData | MeetingEmailData | CommentApprovalEmailData

interface EmailResponse {
  success: boolean
  clientSent?: boolean
  adminSent?: boolean
  sent?: boolean
  error?: string
}

// ==================== HELPERS ====================

/**
 * Obtenir le nom du canal de communication
 */
const getChannelLabel = (channel: string): string => {
  const labels: Record<string, string> = {
    zoom: 'Zoom',
    google_meet: 'Google Meet',
    microsoft_teams: 'Microsoft Teams',
    whatsapp_video: 'WhatsApp Video',
    phone: 'Téléphone',
  }
  return labels[channel] || 'Non défini'
}

/**
 * Envoyer un email via Brevo
 */
const sendEmailViaBrevo = async (
  to: { email: string; name: string },
  subject: string,
  htmlContent: string
): Promise<boolean> => {
  const BREVO_API_KEY = process.env.BREVO_API_KEY
  const SENDER_EMAIL = process.env.SENDER_EMAIL || 'noreply@leonceouattara.com'
  const SENDER_NAME = process.env.SENDER_NAME || 'Leonce Ouattara Studio'

  if (!BREVO_API_KEY) {
    console.error('❌ BREVO_API_KEY is not configured')
    return false
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [to],
        subject,
        htmlContent,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('❌ Erreur Brevo:', error)
      return false
    }

    console.log('✅ Email envoyé via Brevo:', to.email)
    return true
  } catch (error) {
    console.error('❌ Erreur envoi email Brevo:', error)
    return false
  }
}

/**
 * Envoyer un email via Resend
 */
const sendEmailViaResend = async (
  to: { email: string; name: string },
  subject: string,
  htmlContent: string
): Promise<boolean> => {
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  const SENDER_EMAIL = 'noreply@notifications.leonceouattarastudiogroup.site'

  if (!RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY is not configured')
    return false
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Leonce Ouattara Studio <${SENDER_EMAIL}>`,
        to: [to.email],
        subject,
        html: htmlContent,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('❌ Erreur Resend:', error)
      return false
    }

    console.log('✅ Email envoyé via Resend:', to.email)
    return true
  } catch (error) {
    console.error('❌ Erreur envoi email Resend:', error)
    return false
  }
}

// ==================== TEMPLATES ====================

/**
 * Template email confirmation client (formulaire contact)
 */
const getClientContactEmailTemplate = (data: ContactEmailData): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Message bien reçu</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">Message bien reçu !</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">✓</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <p style="font-size: 18px; margin: 0 0 20px 0;">Bonjour <strong>${data.name}</strong>,</p>
              <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
                Merci de nous avoir contacté ! Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.
              </p>
              <div style="background: #f9f9f9; padding: 20px; border-radius: 6px; border-left: 4px solid #667eea; margin: 25px 0;">
                <h3 style="margin-top: 0; color: #667eea; font-size: 16px;">Récapitulatif de votre message :</h3>
                ${data.company ? `<p style="margin: 10px 0;"><strong>Entreprise :</strong> ${data.company}</p>` : ''}
                <p style="margin: 10px 0;"><strong>Budget :</strong> ${data.budget}</p>
                <p style="margin: 10px 0;"><strong>Projet :</strong></p>
                <p style="color: #555; white-space: pre-wrap; margin: 10px 0;">${data.project}</p>
              </div>
              <div style="background: #e8f4f8; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center;">
                <p style="margin: 0; font-weight: 600; color: #667eea;">⏱️ Délai de réponse : 24-48 heures</p>
              </div>
              <p style="color: #666; line-height: 1.6; margin: 20px 0 0 0;">
                Cordialement,<br>
                <strong>L'équipe Leonce Ouattara Studio</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background: #f9f9f9; text-align: center; padding: 20px; color: #999; font-size: 12px;">
              <p style="margin: 0;">Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

/**
 * Template email notification admin (formulaire contact)
 */
const getAdminContactEmailTemplate = (data: ContactEmailData): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Nouveau message de contact</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #06b6d4 0%, #a855f7 100%); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">📨 Nouveau message de contact</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin-top: 0; color: #333;">Détails du contact :</h2>
              <table width="100%" cellpadding="8" cellspacing="0" style="margin: 20px 0;">
                <tr>
                  <td style="background: #f9f9f9; padding: 10px; font-weight: bold; width: 30%;">Nom</td>
                  <td style="background: #fff; padding: 10px;">${data.name}</td>
                </tr>
                <tr>
                  <td style="background: #f9f9f9; padding: 10px; font-weight: bold;">Email</td>
                  <td style="background: #fff; padding: 10px;"><a href="mailto:${data.email}" style="color: #667eea;">${data.email}</a></td>
                </tr>
                <tr>
                  <td style="background: #f9f9f9; padding: 10px; font-weight: bold;">Entreprise</td>
                  <td style="background: #fff; padding: 10px;">${data.company}</td>
                </tr>
                <tr>
                  <td style="background: #f9f9f9; padding: 10px; font-weight: bold;">Budget</td>
                  <td style="background: #fff; padding: 10px;">${data.budget}</td>
                </tr>
              </table>
              <h3 style="color: #333; margin-top: 30px;">Description du projet :</h3>
              <div style="background: #f9f9f9; padding: 20px; border-radius: 6px; white-space: pre-wrap; line-height: 1.6; color: #555;">
${data.project}
              </div>
              <div style="margin-top: 30px; padding: 20px; background: #e8f4f8; border-radius: 6px; text-align: center;">
                <p style="margin: 0; color: #06b6d4; font-weight: bold;">⏰ Répondre sous 24-48h</p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

/**
 * Template email confirmation client (prise de rendez-vous)
 */
const getClientMeetingEmailTemplate = (data: MeetingEmailData): string => {
  const dateFormatted = new Date(data.meetingDate).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return `
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
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
          <tr>
            <td style="background: linear-gradient(135deg, #06b6d4 0%, #a855f7 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">✅ Rendez-vous confirmé !</h1>
              <p style="margin: 10px 0 0 0; color: #e0f2fe; font-size: 16px;">Votre demande a bien été enregistrée</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Bonjour <strong style="color: #ffffff;">${data.clientName}</strong>,
              </p>
              <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Nous avons bien reçu votre demande de rendez-vous. Voici les détails :
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; border-radius: 12px; overflow: hidden; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <div style="margin-bottom: 20px;">
                      <div style="color: #94a3b8; font-size: 13px; margin-bottom: 5px;">Service</div>
                      <div style="color: #ffffff; font-size: 18px; font-weight: 600;">${data.serviceName}</div>
                      <div style="color: #64748b; font-size: 14px; margin-top: 3px;">Durée : ${data.duration} minutes</div>
                    </div>
                    <div style="margin-bottom: 20px;">
                      <div style="color: #94a3b8; font-size: 13px; margin-bottom: 5px;">📅 Date & Heure</div>
                      <div style="color: #ffffff; font-size: 16px; font-weight: 600;">${dateFormatted}</div>
                      <div style="color: #06b6d4; font-size: 18px; font-weight: bold; margin-top: 3px;">${data.meetingTime}</div>
                    </div>
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
              <div style="background-color: rgba(6, 182, 212, 0.1); border-left: 4px solid #06b6d4; border-radius: 8px; padding: 15px; margin-bottom: 30px;">
                <p style="color: #06b6d4; font-size: 14px; margin: 0; font-weight: 600;">ℹ️ Que se passe-t-il ensuite ?</p>
                <p style="color: #cbd5e1; font-size: 14px; margin: 10px 0 0 0; line-height: 1.5;">
                  Notre équipe va examiner votre demande et vous contactera sous 24h pour confirmer le rendez-vous ou proposer des ajustements si nécessaire.
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #0f172a; padding: 30px; text-align: center; border-top: 1px solid #334155;">
              <p style="color: #64748b; font-size: 14px; margin: 0 0 10px 0;">Besoin d'aide ? Contactez-nous</p>
              <p style="color: #475569; font-size: 12px; margin: 20px 0 0 0;">© ${new Date().getFullYear()} Leonce Ouattara Studio. Tous droits réservés.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

/**
 * Template email notification admin (prise de rendez-vous)
 */
const getAdminMeetingEmailTemplate = (data: MeetingEmailData): string => {
  const dateFormatted = new Date(data.meetingDate).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Nouveau rendez-vous</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1e293b; border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px;">🗓️ Nouvelle demande de rendez-vous</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin-top: 0; color: #ffffff;">Détails du rendez-vous :</h2>
              <table width="100%" cellpadding="8" cellspacing="0" style="margin: 20px 0;">
                <tr>
                  <td style="background: #0f172a; color: #94a3b8; padding: 10px; font-weight: bold; width: 30%;">Client</td>
                  <td style="background: #1e293b; color: #ffffff; padding: 10px;">${data.clientName}</td>
                </tr>
                <tr>
                  <td style="background: #0f172a; color: #94a3b8; padding: 10px; font-weight: bold;">Email</td>
                  <td style="background: #1e293b; padding: 10px;"><a href="mailto:${data.clientEmail}" style="color: #06b6d4;">${data.clientEmail}</a></td>
                </tr>
                <tr>
                  <td style="background: #0f172a; color: #94a3b8; padding: 10px; font-weight: bold;">Service</td>
                  <td style="background: #1e293b; color: #ffffff; padding: 10px;">${data.serviceName}</td>
                </tr>
                <tr>
                  <td style="background: #0f172a; color: #94a3b8; padding: 10px; font-weight: bold;">Date</td>
                  <td style="background: #1e293b; color: #ffffff; padding: 10px;">${dateFormatted}</td>
                </tr>
                <tr>
                  <td style="background: #0f172a; color: #94a3b8; padding: 10px; font-weight: bold;">Heure</td>
                  <td style="background: #1e293b; color: #06b6d4; padding: 10px; font-weight: bold;">${data.meetingTime}</td>
                </tr>
                <tr>
                  <td style="background: #0f172a; color: #94a3b8; padding: 10px; font-weight: bold;">Durée</td>
                  <td style="background: #1e293b; color: #ffffff; padding: 10px;">${data.duration} minutes</td>
                </tr>
                <tr>
                  <td style="background: #0f172a; color: #94a3b8; padding: 10px; font-weight: bold;">Canal</td>
                  <td style="background: #1e293b; color: #ffffff; padding: 10px;">${getChannelLabel(data.channel)}</td>
                </tr>
              </table>
              ${data.channelLink ? `
                <div style="margin: 20px 0; padding: 15px; background: #0f172a; border-radius: 8px;">
                  <p style="color: #94a3b8; margin: 0 0 10px 0; font-size: 13px;">Lien de réunion :</p>
                  <a href="${data.channelLink}" style="color: #06b6d4; word-break: break-all;">${data.channelLink}</a>
                </div>
              ` : ''}
              <div style="margin-top: 30px; padding: 20px; background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; border-radius: 6px;">
                <p style="margin: 0; color: #ef4444; font-weight: bold;">⚠️ Action requise : Confirmer ou ajuster le rendez-vous sous 24h</p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
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
  `
}

// ==================== MAIN HANDLER ====================

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Gérer CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({})
  }

  // Autoriser seulement POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const data = req.body as EmailData

    // Validation du type
    if (!data || typeof data !== 'object' || !('type' in data)) {
      return res.status(400).json({ error: 'Missing or invalid type field' })
    }

    console.log(`📧 Processing ${data.type} email request...`)

    // ========== CAS 1: FORMULAIRE DE CONTACT (Brevo) ==========
    if (data.type === 'contact') {
      const { name, email, company, budget, project } = data

      // Validation
      if (!name || !email || !company || !budget || !project) {
        return res.status(400).json({ error: 'Missing required fields for contact' })
      }

      // Email client
      const clientSent = await sendEmailViaBrevo(
        { email, name },
        'Message bien reçu !',
        getClientContactEmailTemplate(data)
      )

      // Email admin
      const adminEmail = process.env.ADMIN_EMAIL || 'contact@leonceouattara.com'
      const adminSent = await sendEmailViaBrevo(
        { email: adminEmail, name: 'Admin' },
        `Nouveau message de contact : ${name}`,
        getAdminContactEmailTemplate(data)
      )

      return res.status(200).json({
        success: true,
        clientSent,
        adminSent,
      })
    }

    // ========== CAS 2: PRISE DE RENDEZ-VOUS (Brevo) ==========
    if (data.type === 'meeting') {
      const { clientName, clientEmail, serviceName, meetingDate, meetingTime, duration, channel } = data

      // Validation
      if (!clientName || !clientEmail || !serviceName || !meetingDate || !meetingTime || !duration || !channel) {
        return res.status(400).json({ error: 'Missing required fields for meeting' })
      }

      // Email client
      const clientSent = await sendEmailViaBrevo(
        { email: clientEmail, name: clientName },
        'Rendez-vous confirmé !',
        getClientMeetingEmailTemplate(data)
      )

      // Email admin
      const adminEmail = process.env.ADMIN_EMAIL || 'contact@leonceouattara.com'
      const adminSent = await sendEmailViaBrevo(
        { email: adminEmail, name: 'Admin' },
        `Nouveau rendez-vous : ${clientName} - ${serviceName}`,
        getAdminMeetingEmailTemplate(data)
      )

      return res.status(200).json({
        success: true,
        clientSent,
        adminSent,
      })
    }

    // ========== CAS 3: APPROBATION COMMENTAIRE (Resend) ==========
    if (data.type === 'comment-approval') {
      const { authorName, authorEmail, postTitle, commentContent, postUrl } = data

      // Validation
      if (!authorName || !authorEmail || !postTitle || !commentContent || !postUrl) {
        return res.status(400).json({ error: 'Missing required fields for comment approval' })
      }

      // Email auteur du commentaire via Resend
      const sent = await sendEmailViaResend(
        { email: authorEmail, name: authorName },
        `Votre commentaire sur "${postTitle}" a été approuvé !`,
        getCommentApprovalEmailTemplate(data)
      )

      return res.status(200).json({
        success: sent,
        sent,
      })
    }

    // Type non reconnu
    return res.status(400).json({ error: `Unknown type: ${(data as any).type}` })
  } catch (error: any) {
    console.error('❌ Erreur globale:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    })
  }
}
