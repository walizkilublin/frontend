import type { APIRoute } from 'astro';
import { Resend } from 'resend';

// Wyłączamy prerendering dla tego konkretnego pliku (wymagane w trybie hybrid!)
export const prerender = false; 

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, company, nip, phone, email, message, bot_field } = body;

    // 1. OCHRONA ANTYBOTOWA (Honeypot)
    // Jeśli ukryte pole zostało wypełnione, to na 100% był to bot. Odrzucamy po cichu (zwracamy sukces, żeby bot myślał, że mu się udało).
    if (bot_field) {
      return new Response(JSON.stringify({ success: true, message: 'Spam rejected' }), { status: 200 });
    }

    // 2. Podstawowa walidacja
    if (!name || !email || !message || !phone) {
      return new Response(JSON.stringify({ error: 'Brakuje wymaganych pól.' }), { status: 400 });
    }

    // 3. Wysłanie maila przez Resend
    const data = await resend.emails.send({
      from: 'System B2B <b2b@hurtownia-b2b.pl>', // UWAGA: Musisz tu podać domenę zweryfikowaną w Resend! (lub zostawić onboarding@resend.dev do testów)
      to: [import.meta.env.CONTACT_EMAIL || 'twoj@email.com'], // Gdzie ma przyjść mail z leada
      replyTo: email,
      subject: `Nowy Lead B2B: ${company || name}`,
      html: `
        <div style="font-family: monospace; background-color: #f4f4f5; padding: 20px;">
          <h2 style="color: #FF4500;">NOWY PROTOKÓŁ B2B</h2>
          <hr/>
          <p><strong>Zgłaszający:</strong> ${name}</p>
          <p><strong>Firma:</strong> ${company || 'Brak'}</p>
          <p><strong>NIP:</strong> ${nip || 'Brak'}</p>
          <p><strong>Telefon:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr/>
          <h3>Wiadomość:</h3>
          <p style="background: white; padding: 15px; border-left: 4px solid #111827;">${message}</p>
        </div>
      `
    });

    if (data.error) {
      return new Response(JSON.stringify({ error: data.error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Wewnętrzny błąd serwera API.' }), { status: 500 });
  }
};