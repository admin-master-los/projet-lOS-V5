/**
 * Supabase Edge Function - Mailchimp Subscribe
 * 
 * SETUP:
 * 1. Dans Supabase Dashboard > Edge Functions
 * 2. Create new function: "mailchimp-subscribe"
 * 3. Copier ce code
 * 4. Ajouter secrets:
 *    - MAILCHIMP_API_KEY
 *    - MAILCHIMP_SERVER_PREFIX
 *    - MAILCHIMP_AUDIENCE_ID
 * 
 * Deploy avec:
 * supabase functions deploy mailchimp-subscribe
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const MAILCHIMP_API_KEY = Deno.env.get('MAILCHIMP_API_KEY')
const MAILCHIMP_SERVER_PREFIX = Deno.env.get('MAILCHIMP_SERVER_PREFIX')
const MAILCHIMP_AUDIENCE_ID = Deno.env.get('MAILCHIMP_AUDIENCE_ID')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SubscribeRequest {
  email: string
  firstName?: string
  lastName?: string
  tags?: string[]
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, firstName, lastName, tags }: SubscribeRequest = await req.json()

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Vérifier configuration
    if (!MAILCHIMP_API_KEY || !MAILCHIMP_SERVER_PREFIX || !MAILCHIMP_AUDIENCE_ID) {
      console.error('Mailchimp not configured')
      return new Response(
        JSON.stringify({ error: 'Mailchimp not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Construire l'URL Mailchimp API
    const url = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`

    // Données pour Mailchimp
    const mailchimpData = {
      email_address: email,
      status: 'subscribed', // ou 'pending' pour double opt-in
      merge_fields: {
        FNAME: firstName || '',
        LNAME: lastName || '',
      },
      tags: tags || [],
    }

    console.log('Sending to Mailchimp:', { email, tags })

    // Appel API Mailchimp
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`anystring:${MAILCHIMP_API_KEY}`)}`,
      },
      body: JSON.stringify(mailchimpData),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('Mailchimp error:', result)
      
      // Si membre déjà existant
      if (result.title === 'Member Exists') {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'already_subscribed',
            message: 'Cet email est déjà inscrit à notre newsletter.' 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ 
          success: false,
          error: result.title || 'Mailchimp error',
          message: result.detail || 'Erreur lors de l\'inscription à Mailchimp' 
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Mailchimp success:', result)

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: {
          id: result.id,
          email: result.email_address,
          status: result.status,
        },
        message: 'Inscription réussie à notre newsletter !'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'server_error',
        message: 'Erreur serveur lors de l\'inscription' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
