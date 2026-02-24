// src/pages/api/smart-webhook.ts
import type { APIRoute } from 'astro';

export const prerender = false;

// Configuration
const NETLIFY_BUILD_HOOK = import.meta.env.NETLIFY_BUILD_HOOK_URL;
const ADMIN_EMAIL = import.meta.env.ADMIN_EMAIL || 'admin@lublin-psychoterapia.com/';
const WEBHOOK_SECRET = import.meta.env.STRAPI_WEBHOOK_SECRET; // Optional security

// Content types that SHOULD trigger rebuild
const REBUILD_TRIGGERS = [
  'artykul',        // Articles
  'artykuly',       // Articles (plural)
  'terapeuta',      // Therapists  
  'terapeuci',      // Therapists (plural)
  'obszar-pomocy',  // Help areas
  'obszary-pomocy', // Help areas (plural) 
  'nurt-terapii',   // Therapy approaches
  'nurty-terapii',  // Therapy approaches (plural)
  'strona-glowna',  // Homepage
  'sekcja-seo',     // SEO sections
  'sekcja-seos',    // SEO sections (plural)
  'logo',           // Logo changes
  'strona-kontakt', // Contact page
  'wazny-dokument', // Important documents
  'wazne-dokumenty' // Important documents (plural)
];

// Content types that should NOT trigger rebuild  
const NO_REBUILD_TYPES = [
  'wiadomosc-kontaktowa',   // Contact messages
  'wiadomosc-kontaktowas',  // Contact messages (plural)
  'konfiguracja-my-dr',     // API configuration
  'konfiguracja-my-drs',     // API configuration (plural)
  'prosby-kontaktu' ,
  'prosby-kontaktus' 
];

interface StrapiWebhookPayload {
  event: string;
  createdAt: string;
  model: string;
  entry: {
    id: number;
    [key: string]: any;
  };
}

function getClientIP(request: Request): string {
  return request.headers.get('cf-connecting-ip') ||
         request.headers.get('x-forwarded-for')?.split(',')[0] ||
         request.headers.get('x-real-ip') ||
         'unknown';
}

async function triggerNetlifyBuild(): Promise<boolean> {
  if (!NETLIFY_BUILD_HOOK) {
    console.error('[SMART WEBHOOK] NETLIFY_BUILD_HOOK_URL not configured');
    return false;
  }

  try {
    const response = await fetch(NETLIFY_BUILD_HOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      console.log('[SMART WEBHOOK] ✅ Netlify build triggered successfully');
      return true;
    } else {
      console.error('[SMART WEBHOOK] ❌ Failed to trigger Netlify build:', response.status);
      return false;
    }
  } catch (error) {
    console.error('[SMART WEBHOOK] ❌ Error triggering Netlify build:', error);
    return false;
  }
}

async function sendContactNotification(entry: any): Promise<void> {
  // Log new contact message
  console.log('[SMART WEBHOOK] 📧 New contact message received:', {
    id: entry.id,
    timestamp: new Date().toISOString()
  });

  // Here you can add email notification logic
  // Example: send to your email service (SendGrid, Mailgun, etc.)
  
  try {
    // If you want email notifications, uncomment and configure:
    /*
    await fetch('https://api.sendgrid.v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: ADMIN_EMAIL }] }],
        from: { email: 'noreply@centrum-zdrowia.pl' },
        subject: '📧 Nowa wiadomość kontaktowa',
        content: [{
          type: 'text/plain',
          value: `Otrzymano nową wiadomość kontaktową.\n\nID: ${entry.id}\nCzas: ${new Date().toLocaleString('pl-PL')}\n\nSprawdź panel administracyjny Strapi.`
        }]
      })
    });
    */
    
    // Simple console notification for now
    console.log(`[SMART WEBHOOK] 📧 Contact message notification would be sent to: ${ADMIN_EMAIL}`);
    
  } catch (error) {
    console.error('[SMART WEBHOOK] Failed to send notification:', error);
  }
}

export const POST: APIRoute = async ({ request }) => {
  const ip = getClientIP(request);
  const timestamp = new Date().toISOString();
  
  try {
    // Parse webhook payload
    const payload: StrapiWebhookPayload = await request.json();
    
    console.log('[SMART WEBHOOK] Received webhook:', {
      event: payload.event,
      model: payload.model,
      entryId: payload.entry?.id,
      timestamp,
      ip
    });

    // Security: Basic webhook secret validation (optional)
    if (WEBHOOK_SECRET) {
      const receivedSecret = request.headers.get('x-strapi-signature');
      if (receivedSecret !== WEBHOOK_SECRET) {
        console.warn('[SMART WEBHOOK] ❌ Invalid webhook secret from IP:', ip);
        return new Response('Unauthorized', { status: 401 });
      }
    }

    const { event, model, entry } = payload;

    // DECISION LOGIC
    
    // 1. Handle contact messages - NO REBUILD
    if (NO_REBUILD_TYPES.includes(model)) {
      console.log(`[SMART WEBHOOK] 📧 Contact message received - NO REBUILD`);
      
      // Send notification for contact messages
      if (model.includes('wiadomosc-kontaktowa')) {
        await sendContactNotification(entry);
      }
      
      return new Response(JSON.stringify({
        status: 'processed',
        action: 'notification_sent',
        rebuild: false,
        message: 'Contact message processed, no rebuild triggered'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Handle content changes - TRIGGER REBUILD
    if (REBUILD_TRIGGERS.includes(model)) {
      console.log(`[SMART WEBHOOK] 🚀 Content change detected - TRIGGERING REBUILD`);
      
      const rebuildSuccess = await triggerNetlifyBuild();
      
      return new Response(JSON.stringify({
        status: 'processed',
        action: 'rebuild_triggered',
        rebuild: true,
        rebuildSuccess,
        message: `Content change in ${model} - rebuild ${rebuildSuccess ? 'triggered' : 'failed'}`
      }), {
        status: rebuildSuccess ? 200 : 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. Unknown content type - LOG AND DECIDE
    console.warn(`[SMART WEBHOOK] ⚠️ Unknown content type: ${model}`);
    console.log(`[SMART WEBHOOK] Available rebuild triggers:`, REBUILD_TRIGGERS);
    console.log(`[SMART WEBHOOK] No-rebuild types:`, NO_REBUILD_TYPES);
    
    // For safety, trigger rebuild for unknown types (you can change this)
    const rebuildSuccess = await triggerNetlifyBuild();
    
    return new Response(JSON.stringify({
      status: 'processed',
      action: 'unknown_type_rebuild',
      rebuild: true,
      rebuildSuccess,
      warning: `Unknown content type: ${model}`,
      message: 'Unknown content type - triggered rebuild for safety'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[SMART WEBHOOK] ❌ Error processing webhook:', error);
    
    return new Response(JSON.stringify({
      status: 'error',
      message: 'Failed to process webhook',
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Health check endpoint
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    service: 'Smart Webhook System',
    status: 'active',
    timestamp: new Date().toISOString(),
    config: {
      netlifyHookConfigured: !!NETLIFY_BUILD_HOOK,
      webhookSecretConfigured: !!WEBHOOK_SECRET,
      adminEmail: ADMIN_EMAIL,
      rebuildTriggers: REBUILD_TRIGGERS.length,
      noRebuildTypes: NO_REBUILD_TYPES.length
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};