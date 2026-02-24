<script>
  import { onMount } from 'svelte';
  import { fade, slide } from 'svelte/transition';

  // === KONFIG ===
  const COOKIE_NAME = 'b2b_sys_consent';
  const REVISION = 1; // Podbij, gdy zmieni się polityka prywatności

  // === STATE ===
  let isVisible = false;
  let showSettings = false;
  let cookiePreferences = {
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  };

  // === COOKIES (SSR-safe) ===
  function readCookie(name) {
    if (typeof document === 'undefined') return null;
    const all = document.cookie ? document.cookie.split('; ') : [];
    for (const pair of all) {
      const idx = pair.indexOf('=');
      const key = idx > -1 ? pair.slice(0, idx) : pair;
      if (key === name) return decodeURIComponent(idx > -1 ? pair.slice(idx + 1) : '');
    }
    return null;
  }

  function writeCookie(name, value, days = 180) {
    if (typeof document === 'undefined') return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    const serialized = encodeURIComponent(typeof value === 'string' ? value : JSON.stringify(value));
    let cookie = `${name}=${serialized}; Expires=${expires}; Path=/; SameSite=Lax`;
    if (location.protocol === 'https:') cookie += '; Secure';
    document.cookie = cookie;
  }

  function parseExisting() {
    try {
      const raw = readCookie(COOKIE_NAME);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  // === GTM / DATA LAYER HELPERS ===
  function ensureDataLayer() {
    if (typeof window === 'undefined') return [];
    window.dataLayer = window.dataLayer || [];
    return window.dataLayer;
  }

  function gtagSafe(...args) {
    if (typeof window === 'undefined') return;
    const dl = ensureDataLayer();
    const g = window.gtag || function() { dl.push(arguments); };
    g(...args);
  }

  function pushDL(obj) {
    if (typeof window === 'undefined') return;
    const dl = ensureDataLayer();
    dl.push(obj);
  }

  function pushConsentUpdate(analytics, marketing, functional = false) {
    // Consent Mode v2 standard
    gtagSafe('consent', 'update', {
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: marketing ? 'granted' : 'denied',
      ad_user_data: marketing ? 'granted' : 'denied',
      ad_personalization: marketing ? 'granted' : 'denied',
      functionality_storage: functional ? 'granted' : 'denied',
      personalization_storage: functional ? 'granted' : 'denied'
    });
    
    pushDL({
      event: 'consent_update',
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: marketing ? 'granted' : 'denied',
      ad_user_data: marketing ? 'granted' : 'denied',
      ad_personalization: marketing ? 'granted' : 'denied'
    });
  }

  function pushInitialSelection() {
    pushDL({ event: 'consent_initial_selection' });
  }

  function storeCookieFromPrefs() {
    const categories = [
      ...(cookiePreferences.analytics ? ['analytics'] : []),
      ...(cookiePreferences.marketing ? ['marketing'] : []),
      ...(cookiePreferences.functional ? ['functional'] : []),
    ];
    writeCookie(COOKIE_NAME, {
      stamp: 'b2b-system',
      necessary: true,
      categories,
      rev: REVISION
    });
  }

  // === HANDLERY ===
  function acceptAll() {
    cookiePreferences = { necessary: true, analytics: true, marketing: true, functional: true };
    storeCookieFromPrefs();
    pushConsentUpdate(true, true, true);
    pushInitialSelection();
    isVisible = false;
  }

  function acceptNecessaryOnly() {
    cookiePreferences = { necessary: true, analytics: false, marketing: false, functional: false };
    storeCookieFromPrefs();
    pushConsentUpdate(false, false, false);
    pushInitialSelection();
    isVisible = false;
  }

  function saveCustomSettings() {
    storeCookieFromPrefs();
    pushConsentUpdate(cookiePreferences.analytics, cookiePreferences.marketing, cookiePreferences.functional);
    pushInitialSelection();
    isVisible = false;
  }

  onMount(() => {
    const existing = parseExisting();
    if (!existing || existing.rev !== REVISION) {
      // USUŃ setTimeout! Zmień na natychmiastowe pokazanie:
      isVisible = true;
    } else {
      const cats = existing.categories || [];
      cookiePreferences = {
        necessary: true,
        analytics: cats.includes('analytics'),
        marketing: cats.includes('marketing'),
        functional: cats.includes('functional')
      };
      // Synchronizacja powracającego usera
      pushConsentUpdate(cookiePreferences.analytics, cookiePreferences.marketing, cookiePreferences.functional);
    }
  });

  // Export dla przycisku w stopce (opcjonalne)
  export function openPreferences() {
    isVisible = true;
    showSettings = true;
  }
</script>

{#if isVisible}
  <div class="fixed inset-0 z-[9999] pointer-events-none flex items-end sm:items-bottom sm:justify-start p-4 md:p-8">
    
    <div 
      transition:fade={{ duration: 300 }}
      class="w-full sm:w-[450px] bg-vantablack border border-border-tech shadow-2xl pointer-events-auto relative overflow-hidden flex flex-col"
    >
      <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAATCwzQ8oQKAAAACHRSTlMAMwBfCj/q2Z1h5wAAAI1JREFUOMutVUEOwyAMsyY/oN0+IH9Q37/L2k1I2kRppY4Dxg6yA01E0h+Kx3LwLp2F10h6j+Uj7oQ1r1HzHsvH3AlrXqPmPZaPuRPWvEbNeywfcyeseY2a91g+5k5Y8xo177F8zJ2w5jVq3mP5mDthzWvUvMfyMXfCmtcoeY/lY+6ENa9R8x7Lx9wJzX4B+D8v32k3vjQAAAAASUVORK5CYII='); background-repeat: repeat;"></div>

      <div class="p-6 md:p-8 relative z-10 flex flex-col h-full">
        
        <div class="mb-6">
          <div class="flex items-center gap-3 mb-3">
            <span class="w-2 h-2 bg-signal-orange animate-pulse"></span>
            <span class="text-[10px] font-mono font-bold tracking-widest text-cool-grey uppercase">Protokół Śledzenia</span>
          </div>
          <h3 class="text-xl font-black text-ghost-white uppercase tracking-tighter mb-2">
            Autoryzacja Cookies
          </h3>
          <p class="text-xs text-cool-grey leading-relaxed font-mono">
            System wykorzystuje pliki cookies do optymalizacji procesów analitycznych i marketingowych. Część z nich jest krytyczna dla funkcjonowania infrastruktury.
          </p>
        </div>

        {#if showSettings}
          <div transition:slide={{ duration: 300 }} class="mb-6 flex flex-col gap-4 border-t border-b border-border-tech/50 py-4">
            
            <div class="flex items-center justify-between">
              <div class="flex flex-col pr-4">
                <span class="text-sm font-bold text-ghost-white uppercase tracking-widest">Niezbędne</span>
                <span class="text-[10px] font-mono text-cool-grey uppercase">Krytyczne dla systemu</span>
              </div>
              <div class="w-12 h-6 border-2 border-cool-grey/50 bg-vantablack flex items-center p-0.5 opacity-50 cursor-not-allowed">
                <div class="h-4 w-4 bg-cool-grey translate-x-6"></div>
              </div>
            </div>

           <div class="flex items-center justify-between">
              <div class="flex flex-col pr-4">
                <span class="text-sm font-bold text-ghost-white uppercase tracking-widest">Analityczne</span>
                <span class="text-[10px] font-mono text-cool-grey uppercase">Statystyki i ruch</span>
              </div>
              <button 
                type="button" 
                on:click={() => cookiePreferences.analytics = !cookiePreferences.analytics} 
                aria-label="Przełącz ciasteczka analityczne"
                role="switch"
                aria-checked={cookiePreferences.analytics}
                class="w-12 h-6 border-2 flex items-center p-0.5 transition-colors duration-300 {cookiePreferences.analytics ? 'border-signal-orange bg-signal-orange/10' : 'border-cool-grey bg-vantablack'}"
              >
                <div class="h-4 w-4 transition-transform duration-300 {cookiePreferences.analytics ? 'translate-x-6 bg-signal-orange' : 'translate-x-0 bg-cool-grey'}"></div>
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex flex-col pr-4">
                <span class="text-sm font-bold text-ghost-white uppercase tracking-widest">Marketingowe</span>
                <span class="text-[10px] font-mono text-cool-grey uppercase">Identyfikacja i reklama</span>
              </div>
              <button 
                type="button" 
                on:click={() => cookiePreferences.marketing = !cookiePreferences.marketing} 
                aria-label="Przełącz ciasteczka marketingowe"
                role="switch"
                aria-checked={cookiePreferences.marketing}
                class="w-12 h-6 border-2 flex items-center p-0.5 transition-colors duration-300 {cookiePreferences.marketing ? 'border-signal-orange bg-signal-orange/10' : 'border-cool-grey bg-vantablack'}"
              >
                <div class="h-4 w-4 transition-transform duration-300 {cookiePreferences.marketing ? 'translate-x-6 bg-signal-orange' : 'translate-x-0 bg-cool-grey'}"></div>
              </button>
            </div>

          </div>
        {/if}

        <div class="mt-auto flex flex-col gap-3">
          {#if !showSettings}
            <button on:click={acceptAll} class="w-full bg-signal-orange text-white font-black uppercase tracking-widest text-xs py-4 hover:bg-white hover:text-signal-orange transition-colors duration-300 border border-transparent">
              Zatwierdź Wszystkie
            </button>
            <div class="grid grid-cols-2 gap-3">
              <button on:click={acceptNecessaryOnly} class="bg-surface/50 border border-border-tech text-ghost-white font-bold uppercase tracking-widest text-[10px] py-3 hover:border-signal-orange hover:text-signal-orange transition-colors">
                Tylko Niezbędne
              </button>
              <button on:click={() => showSettings = true} class="bg-transparent border border-border-tech text-cool-grey font-bold uppercase tracking-widest text-[10px] py-3 hover:text-ghost-white hover:border-ghost-white transition-colors">
                Dostosuj
              </button>
            </div>
          {:else}
            <button on:click={saveCustomSettings} class="w-full bg-signal-orange text-white font-black uppercase tracking-widest text-xs py-4 hover:bg-white hover:text-signal-orange transition-colors duration-300 border border-transparent">
              Zapisz Konfigurację
            </button>
            <button on:click={() => showSettings = false} class="bg-transparent border border-border-tech text-cool-grey font-bold uppercase tracking-widest text-[10px] py-3 hover:text-ghost-white hover:border-ghost-white transition-colors">
              Wróć
            </button>
          {/if}
        </div>

        <div class="mt-6 text-center">
          <a href="/polityka-prywatnosci" class="text-[10px] font-mono text-cool-grey hover:text-signal-orange uppercase tracking-widest transition-colors border-b border-transparent hover:border-signal-orange pb-0.5">
            Zobacz Politykę Prywatności
          </a>
        </div>

      </div>
    </div>
  </div>
{/if}