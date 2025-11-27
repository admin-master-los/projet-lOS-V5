/**
 * Service: Email sécurisé via API Route Vercel
 * Gestion envoi emails sans exposer les clés API au navigateur
 * 
 * Ce service gère 3 cas d'usage :
 * 1. Formulaire de contact (Brevo)
 * 2. Prise de rendez-vous (Brevo)
 * 3. Approbation de commentaire blog (Resend)
 */

// ==================== INTERFACES ====================

interface ContactEmailData {
  name: string
  email: string
  company: string
  budget: string
  project: string
}

interface MeetingEmailData {
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
  authorName: string
  authorEmail: string
  postTitle: string
  commentContent: string
  postUrl: string
}

interface EmailResponse {
  success: boolean
  clientSent?: boolean
  adminSent?: boolean
  sent?: boolean
  error?: string
}

// ==================== FONCTIONS D'ENVOI ====================

/**
 * Envoyer un email générique via l'API route
 */
const callEmailAPI = async (endpoint: string, data: any): Promise<EmailResponse> => {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP ${response.status}`)
    }

    return await response.json()
  } catch (error: any) {
    console.error('❌ Erreur API:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// ==================== CAS 1: FORMULAIRE DE CONTACT ====================

/**
 * Envoyer les emails de contact (client + admin) via Brevo
 */
export const sendContactEmails = async (
  data: ContactEmailData
): Promise<{ clientSent: boolean; adminSent: boolean }> => {
  console.log('📤 Envoi emails de contact via API route sécurisée...')

  const result = await callEmailAPI('/api/send-email', {
    type: 'contact',
    ...data,
  })

  console.log('✅ Réponse API contact:', result)

  return {
    clientSent: result.clientSent || false,
    adminSent: result.adminSent || false,
  }
}

/**
 * Envoyer email de confirmation au client (formulaire contact)
 */
export const sendContactClientConfirmation = async (
  data: ContactEmailData
): Promise<boolean> => {
  const result = await sendContactEmails(data)
  return result.clientSent
}

/**
 * Envoyer email de notification à l'admin (formulaire contact)
 */
export const sendContactAdminNotification = async (
  data: ContactEmailData
): Promise<boolean> => {
  const result = await sendContactEmails(data)
  return result.adminSent
}

// ==================== CAS 2: PRISE DE RENDEZ-VOUS ====================

/**
 * Envoyer email de confirmation au client (prise de rendez-vous) via Brevo
 */
export const sendClientConfirmation = async (
  data: MeetingEmailData
): Promise<boolean> => {
  console.log('📤 Envoi email confirmation rendez-vous client...')

  const result = await callEmailAPI('/api/send-email', {
    type: 'meeting',
    ...data,
  })

  console.log('✅ Réponse API meeting client:', result)

  return result.clientSent || false
}

/**
 * Envoyer email de notification à l'admin (prise de rendez-vous) via Brevo
 */
export const sendAdminNotification = async (
  data: MeetingEmailData
): Promise<boolean> => {
  console.log('📤 Envoi email notification rendez-vous admin...')

  const result = await callEmailAPI('/api/send-email', {
    type: 'meeting',
    ...data,
  })

  console.log('✅ Réponse API meeting admin:', result)

  return result.adminSent || false
}

/**
 * Envoyer les 2 emails de rendez-vous (client + admin) via Brevo
 */
export const sendMeetingEmails = async (
  data: MeetingEmailData
): Promise<{ clientSent: boolean; adminSent: boolean }> => {
  console.log('📤 Envoi emails de rendez-vous via API route sécurisée...')

  const result = await callEmailAPI('/api/send-email', {
    type: 'meeting',
    ...data,
  })

  console.log('✅ Réponse API meeting:', result)

  return {
    clientSent: result.clientSent || false,
    adminSent: result.adminSent || false,
  }
}

// ==================== CAS 3: APPROBATION COMMENTAIRE BLOG ====================

/**
 * Envoyer email d'approbation de commentaire à l'auteur via Resend
 */
export const sendCommentApprovalEmail = async (
  data: CommentApprovalEmailData
): Promise<boolean> => {
  console.log('📤 Envoi email approbation commentaire via Resend...')

  const result = await callEmailAPI('/api/send-email', {
    type: 'comment-approval',
    ...data,
  })

  console.log('✅ Réponse API comment approval:', result)

  return result.sent || false
}

// ==================== EXPORTS ====================

export default {
  // Contact
  sendContactEmails,
  sendContactClientConfirmation,
  sendContactAdminNotification,
  
  // Rendez-vous
  sendClientConfirmation,
  sendAdminNotification,
  sendMeetingEmails,
  
  // Commentaires
  sendCommentApprovalEmail,
}
