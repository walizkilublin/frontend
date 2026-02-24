<script>
  export let phone = "+48 500 600 700";
  export let email = "b2b@hurtownia-b2b.pl";
  export let companyName = "HURTOWNIA BAGAŻU SP. Z O.O.";
  export let nip = "1234567890";
  export let address = "ul. Logistyczna 1, 20-000 Lublin";
  export let workingHours = "Pon - Pt: 08:00 - 16:00";

  // Generujemy czysty link do trasy w Google Maps bazując na adresie
  $: mapsRouteUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
</script>

<footer id="kontakt" class="relative bg-vantablack text-ghost-white border-t-4 border-signal-orange overflow-hidden z-20">
  
  <div class="absolute inset-0 opacity-[0.02] pointer-events-none" style="background-image: linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px); background-size: 40px 40px;"></div>

  <div class="max-w-[1920px] mx-auto px-4 md:px-8 pt-20 pb-12 relative z-10">
    
    <div class="mb-16">
      <div class="flex items-center gap-4 mb-4">
        <span class="w-3 h-3 bg-signal-orange animate-pulse"></span>
        <span class="text-xs font-mono font-bold tracking-widest text-signal-orange uppercase">Zapraszamy do Kontaktu</span>
      </div>
      <h2 class="text-5xl md:text-8xl font-black uppercase tracking-tighter text-ghost-white leading-none">
        Walizki<br/><span class="text-cool-grey hover:text-signal-orange transition-colors duration-500">Lublin</span>
      </h2>
      <p class="text-sm font-medium text-cool-grey leading-relaxed mt-8 mb-8 border-l-2 border-border-tech pl-4">
        Zadzwoń do nas! Chętnie doradzimy w wyborze idealnego bagażu na jedne wakacje, jak i na lata udanego handlu w Twoim sklepie.        </p>
    </div>

    <div class="flex flex-col lg:flex-row gap-12 border-t border-ghost-white/10 pt-12">
      
      <div class="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-12">
        <div class="flex flex-col">
          <span class="text-[10px] font-mono font-bold tracking-widest text-cool-grey uppercase mb-6">Autoryzacja / Kontakt</span>
          <a href={`tel:${phone.replace(/\s/g, '')}`} class="text-3xl font-black text-signal-orange uppercase tracking-tight hover:text-ghost-white transition-colors mb-2">
            {phone}
          </a>
          <a href={`mailto:${email}`} class="text-sm font-bold text-ghost-white hover:text-signal-orange transition-colors mb-8">
            {email}
          </a>
          
          <span class="text-[10px] font-mono font-bold tracking-widest text-cool-grey uppercase mb-4">Nawigacja Systemowa</span>
          <nav class="flex flex-col gap-3 mb-8">
            <a href="#katalog" class="text-xs font-bold uppercase tracking-widest text-ghost-white hover:text-signal-orange transition-colors w-max">/ Katalog Zasobów</a>
            <a href="#logistyka" class="text-xs font-bold uppercase tracking-widest text-ghost-white hover:text-signal-orange transition-colors w-max">/ Logistyka</a>
            <a href="#faq" class="text-xs font-bold uppercase tracking-widest text-ghost-white hover:text-signal-orange transition-colors w-max">/ Baza Wiedzy</a>
          </nav>
        </div>

        <div class="flex flex-col">
          <span class="text-[10px] font-mono font-bold tracking-widest text-cool-grey uppercase mb-6">Dane Firmy</span>
          <p class="text-sm font-bold uppercase tracking-widest text-ghost-white mb-2">{companyName}</p>
          <p class="text-xs font-mono text-cool-grey mb-1">NIP: {nip}</p>
          <p class="text-xs font-mono text-cool-grey mb-6">{address}</p>
          
          <div class="border-l-2 border-signal-orange pl-4 mb-8">
            <p class="text-[10px] font-mono text-cool-grey uppercase tracking-widest mb-1">Godziny Magazynu</p>
            <p class="text-sm font-bold text-ghost-white uppercase">{workingHours}</p>
          </div>

          <!-- <div class="border border-ghost-white/10 p-4 bg-white/5 backdrop-blur-sm mt-auto">
            <p class="text-[10px] font-mono text-cool-grey uppercase tracking-widest mb-2">Status Architektury PIM</p>
            <div class="w-full bg-vantablack h-1 mb-2 overflow-hidden">
              <div class="bg-signal-orange h-full w-[100%]"></div>
            </div>
            <p class="text-[9px] font-mono text-signal-orange uppercase tracking-widest">Poziom 10 / Stabilny</p>
          </div> -->
        </div>
      </div>

      <div class="w-full lg:w-1/2 flex flex-col">
        <span class="text-[10px] font-mono font-bold tracking-widest text-cool-grey uppercase mb-6">Lokalizacja Magazynu</span>
        
        <div class="flex flex-col relative border border-ghost-white/10 p-2 bg-white/5 h-full">
          <div class="w-full h-64 md:h-full min-h-[250px] bg-vantablack relative overflow-hidden group">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d159938.8358210359!2d22.428456!3d51.2185295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x472257141e154061%3A0x5528ee7daf6e30cf!2sLublin!5e0!3m2!1spl!2spl!4v1700000000000!5m2!1spl!2spl" 
              title="Mapa dojazdu do hurtowni"
              class="absolute inset-0 w-full h-full border-0 filter grayscale invert-[90%] contrast-[1.2] opacity-70 group-hover:opacity-100 transition-opacity duration-500" 
              allowfullscreen="" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
            
            <div class="absolute inset-0 pointer-events-none flex items-center justify-center mix-blend-difference opacity-50">
              <div class="w-8 h-8 border border-signal-orange rounded-full flex items-center justify-center">
                <div class="w-1 h-1 bg-signal-orange rounded-full"></div>
              </div>
            </div>
          </div>

          <a 
            href={mapsRouteUrl}
            target="_blank" 
            rel="noopener noreferrer"
            class="mt-2 w-full bg-signal-orange text-white py-5 flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs hover:bg-white hover:text-signal-orange transition-colors duration-300"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            Nawiguj do Magazynu
          </a>
        </div>
      </div>

    </div>

    <div class="mt-20 pt-8 border-t border-ghost-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
      <p class="text-[10px] font-mono text-cool-grey uppercase tracking-widest">
        © {new Date().getFullYear()} {companyName}. Wszelkie prawa zastrzeżone.
      </p>
      
      <div class="flex items-center gap-6">
        <a href="/regulamin-b2b" class="text-[10px] font-mono text-cool-grey uppercase tracking-widest hover:text-signal-orange transition-colors">
          Regulamin B2B
        </a>
        <a href="/polityka-prywatnosci" class="text-[10px] font-mono text-cool-grey uppercase tracking-widest hover:text-signal-orange transition-colors">
          Polityka Prywatności
        </a>
        <div class="hidden md:flex items-center gap-2 ml-4">
          <span class="w-2 h-2 bg-vantablack border border-cool-grey"></span>
          <p class="text-[10px] font-mono text-cool-grey uppercase tracking-widest">
            Zaprojektowano z bezwzględną precyzją.
          </p>
        </div>
      </div>
    </div>

  </div>
</footer>