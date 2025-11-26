// Supabase Edge Function: send-comment-email
// Fichier: supabase/functions/send-comment-email/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

interface EmailRequest {
  type: 'approval' | 'reply'
  to: string
  data: {
    authorName: string
    postTitle: string
    postUrl: string
    commentContent: string
    commentId: string
    // Pour réponse admin
    adminName?: string
    adminReplyContent?: string
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, to, data }: EmailRequest = await req.json()

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured')
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Générer le HTML selon le type
    const html = type === 'approval' 
      ? getApprovalEmailHTML(data)
      : getReplyEmailHTML(data)

    const subject = type === 'approval'
      ? `✅ Votre commentaire a été approuvé sur "${data.postTitle}"`
      : `💬 ${data.adminName} a répondu à votre commentaire sur "${data.postTitle}"`

    // Envoyer via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Blog <onboarding@resend.dev>',
        to: [to],
        subject,
        html,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Resend error:', error)
      throw new Error(`Resend API error: ${error}`)
    }

    const result = await response.json()
    
    return new Response(
      JSON.stringify({ success: true, id: result.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Template HTML approbation (simplifié pour Edge Function)
function getApprovalEmailHTML(data: any): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#0f172a;color:#e2e8f0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#1e293b;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg,#06b6d4 0%,#8b5cf6 100%);padding:40px 30px;text-align:center;">
              <h1 style="margin:0;color:white;font-size:28px;">✅ Commentaire Approuvé !</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 30px;">
              <p style="margin:0 0 20px 0;font-size:16px;color:#cbd5e1;">
                Bonjour <strong style="color:#06b6d4;">${data.authorName}</strong>,
              </p>
              <p style="margin:0 0 20px 0;font-size:16px;color:#cbd5e1;">
                Bonne nouvelle ! Votre commentaire sur l'article <strong style="color:#8b5cf6;">"${data.postTitle}"</strong> a été approuvé.
              </p>
              <div style="background-color:#0f172a;border-left:4px solid #06b6d4;padding:20px;margin:30px 0;border-radius:8px;">
                <p style="margin:0;font-size:14px;color:#94a3b8;font-style:italic;">
                  "${data.commentContent.substring(0, 150)}${data.commentContent.length > 150 ? '...' : ''}"
                </p>
              </div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:20px 0;">
                    <a href="${data.postUrl}#comment-${data.commentId}" style="display:inline-block;padding:16px 32px;background:linear-gradient(135deg,#06b6d4 0%,#8b5cf6 100%);color:white;text-decoration:none;border-radius:12px;font-weight:600;font-size:16px;">
                      Voir mon commentaire
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#0f172a;padding:30px;text-align:center;border-top:1px solid #334155;">
              <p style="margin:0;font-size:12px;color:#475569;">
                © ${new Date().getFullYear()} Blog. Tous droits réservés.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

// Template HTML réponse (simplifié)
function getReplyEmailHTML(data: any): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#0f172a;color:#e2e8f0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#1e293b;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg,#8b5cf6 0%,#ec4899 100%);padding:40px 30px;text-align:center;">
              <h1 style="margin:0;color:white;font-size:28px;">💬 Nouvelle Réponse !</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 30px;">
              <p style="margin:0 0 20px 0;font-size:16px;color:#cbd5e1;">
                Bonjour <strong style="color:#8b5cf6;">${data.authorName}</strong>,
              </p>
              <p style="margin:0 0 20px 0;font-size:16px;color:#cbd5e1;">
                <strong style="color:#ec4899;">${data.adminName}</strong> a répondu à votre commentaire !
              </p>
              <div style="margin:30px 0;">
                <p style="margin:0 0 10px 0;font-size:12px;color:#64748b;text-transform:uppercase;">Votre commentaire</p>
                <div style="background-color:#0f172a;border-left:4px solid #64748b;padding:15px;border-radius:8px;">
                  <p style="margin:0;font-size:14px;color:#94a3b8;">
                    "${data.commentContent.substring(0, 120)}..."
                  </p>
                </div>
              </div>
              <div style="margin:30px 0;">
                <p style="margin:0 0 10px 0;font-size:12px;color:#8b5cf6;text-transform:uppercase;">↳ Réponse de ${data.adminName}</p>
                <div style="background:rgba(139,92,246,0.1);border-left:4px solid #8b5cf6;padding:20px;border-radius:8px;">
                  <p style="margin:0;font-size:15px;color:#e2e8f0;">
                    ${data.adminReplyContent}
                  </p>
                </div>
              </div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:20px 0;">
                    <a href="${data.postUrl}#comment-${data.commentId}" style="display:inline-block;padding:16px 32px;background:linear-gradient(135deg,#8b5cf6 0%,#ec4899 100%);color:white;text-decoration:none;border-radius:12px;font-weight:600;font-size:16px;">
                      Répondre à ${data.adminName}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#0f172a;padding:30px;text-align:center;border-top:1px solid #334155;">
              <p style="margin:0;font-size:12px;color:#475569;">
                © ${new Date().getFullYear()} Blog. Tous droits réservés.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
