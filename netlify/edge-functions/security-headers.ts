import type { Context } from '@netlify/edge-functions';

export default async (request: Request, context: Context) => {
    const response = await context.next();
    const headers = new Headers(response.headers);

    const nonce = headers.get('X-Page-Nonce');

    // Astro i Svelte do poprawnej hydracji często wymagają unsafe-inline, unless używamy strict nonce.
    const scriptSrc = nonce
        ? `'self' 'nonce-${nonce}' 'unsafe-inline' 'wasm-unsafe-eval' 'unsafe-eval'`
        : `'self' 'unsafe-inline' 'wasm-unsafe-eval' 'unsafe-eval'`;

    // Czy jesteśmy w trybie GTM Preview/Debug?
    const url = new URL(request.url);
    const isGtmPreview =
        url.searchParams.has('gtm_debug') ||
        url.searchParams.has('gtm_auth') ||
        url.searchParams.has('gtm_preview');

    // Zaufane domeny dla skryptów (GTM, GA4)
    const trustedScriptDomains = [
        'https://www.googletagmanager.com',
        'https://www.google-analytics.com',
        'https://analytics.google.com'
    ].join(' ');

    // GA4 & Ads endpointy + Twoje API backendowe
    const connectSrc = [
        "'self'",
        'https://www.googletagmanager.com',
        'https://www.google-analytics.com',
        'https://*.google-analytics.com',
        'https://stats.g.doubleclick.net',
        'https://backend-production-9cf7.up.railway.app', // <-- DODANE: Twoja domena API na Railway
        'http://localhost:*' // Zostawiamy do testów lokalnych
    ].join(' ');

    // style-src – GTM debug badge.css wymaga dopuszczenia domeny GTM
    const styleSrc = [
        "'self'",
        "'unsafe-inline'",
        'https://fonts.googleapis.com',
        ...(isGtmPreview ? ['https://www.googletagmanager.com'] : []),
    ].join(' ');

    // img-src – Dodajemy Cloudinary i domeny Google do analityki/map
    const imgSrc = [
        "'self'",
        'data:',
        'blob:',
        'https://res.cloudinary.com', // Twój CDN dla zdjęć Cloudinary
        'https://backend-production-9cf7.up.railway.app', // <-- DODANE: Aby nie blokowało ewentualnych ścieżek z backendu
        'https://www.google-analytics.com',
        'https://analytics.google.com',
        'https://www.googletagmanager.com',
        'https://fonts.gstatic.com',
        'https://www.gstatic.com',
        'http://localhost:*'
    ].join(' ');

    // frame-src – noscript GTM oraz iFrame z Google Maps w Footerze
    const frameSrc = [
        "'self'",
        'https://www.google.com',
        'https://maps.google.com',
        'https://www.googletagmanager.com',
        'http://googleusercontent.com',
        'https://googleusercontent.com'
    ].join(' ');

    // Złożenie wszystkich reguł Content-Security-Policy (Odkomentowane i aktywne)
    const csp = [
        "default-src 'self'",
        `script-src ${scriptSrc} ${trustedScriptDomains}`,
        `style-src ${styleSrc}`,
        `img-src ${imgSrc}`,
        "font-src 'self' data: https://fonts.gstatic.com",
        `connect-src ${connectSrc}`,
        `frame-src ${frameSrc}`,
        "worker-src 'self' blob: data:",
        "child-src 'self' blob: data:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "manifest-src 'self'",
        "media-src 'self'",
        'upgrade-insecure-requests', // Wymusza ładowanie wszystkiego po HTTPS
    ].join('; ');

    // Aplikowanie potężnych nagłówków bezpieczeństwa
    headers.set('Content-Security-Policy', csp);
    headers.set('X-Frame-Options', 'DENY'); // Ochrona przed clickjackingiem
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-XSS-Protection', '1; mode=block');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set(
        'Strict-Transport-Security',
        'max-age=63072000; includeSubDomains; preload' // Wymusza HTTPS przez 2 lata
    );

    // Wyłączenie dostępu do niepotrzebnych urządzeń (kamery, mikrofony)
    headers.set(
        'Permissions-Policy',
        [
            'geolocation=()',
            'microphone=()',
            'camera=()',
            'payment=()',
            'usb=()',
            'magnetometer=()',
            'accelerometer=()',
            'gyroscope=()',
            'fullscreen=(self)',
            'display-capture=()',
            'clipboard-read=()',
            'clipboard-write=(self)',
        ].join(', ')
    );

    // Zabezpieczenia Cross-Origin
    headers.set('Cross-Origin-Embedder-Policy', 'unsafe-none');
    headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    headers.set('Cross-Origin-Resource-Policy', 'cross-origin');

    headers.delete('X-Page-Nonce');

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
    });
};