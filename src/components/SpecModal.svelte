<script>
  import { fade, fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  export let product = null;
  export let strapiUrl = "";
  export let phone = "+48 500 600 700";
  export let shippingPrepaid = 18;
  export let shippingCod = 26;

  $: itemType = product?.itemType || 'suitcase';

  let closeLink; 
  
  let activeImageIndex = 0;
  let activeVariantIndex = 0;
  let isDescriptionExpanded = false;

  onMount(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  });

  // --- INTELIGENTNE ZAMYKANIE MODALA ---
  function handleClose(e) {
    e.preventDefault(); // Zatrzymujemy domyślne przejście linku
    
    // Astro View Transitions dodaje właściwość "index" do historii przeglądarki.
    // Jeśli index > 0, wiemy na 100%, że użytkownik wędrował po naszej stronie.
    if (window.history.state && typeof window.history.state.index === 'number' && window.history.state.index > 0) {
      window.history.back(); // Cofa płynnie do idealnej pozycji scrolla w katalogu!
    } else {
      // Jeśli wszedł z bezpośredniego linku (index = 0 lub brak), wrzucamy go do katalogu
      window.location.href = '/#katalog';
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Escape' && closeLink) closeLink.click();
  }

  // Reszta kodu pozostaje bez zmian...
  $: images = product?.images || [];
  $: activeImageUrl = images.length > 0 ? `${strapiUrl}${images[activeImageIndex].url}` : null;
  $: colors = product?.colors || [];
  $: variants = product?.variants || [];
  $: activeVariant = variants[activeVariantIndex] || {};

  const animH = tweened(0, { duration: 600, easing: cubicOut });
  const animW = tweened(0, { duration: 600, easing: cubicOut });
  const animD = tweened(0, { duration: 600, easing: cubicOut });

  $: if (product) {
    if (itemType === 'suitcase' && activeVariant) {
      animH.set(activeVariant.height_cm || 0);
      animW.set(activeVariant.width_cm || 0);
      animD.set(activeVariant.depth_cm || 0);
    } else if (itemType === 'bag' || itemType === 'wallet') {
      animH.set(product.height_cm || 0);
      animW.set(product.width_cm || 0);
      animD.set(product.depth_cm || 0);
    }
  }

  $: dimensionsText = (itemType === 'suitcase' && activeVariant) 
    ? `${activeVariant.height_cm || 0} x ${activeVariant.width_cm || 0} x ${activeVariant.depth_cm || 0} cm` 
    : `${product?.height_cm || 0} x ${product?.width_cm || 0} x ${product?.depth_cm || 0} cm`;
</script>

<svelte:window on:keydown={handleKeydown} />

{#if product}
  <div class="fixed inset-x-0 bottom-0 top-20 z-[4900] flex items-center justify-center p-4 md:p-8">
    
    <a 
      href="/#katalog"
      on:click={handleClose}
      bind:this={closeLink}
      class="absolute inset-0 w-full h-full bg-vantablack/60 backdrop-blur-md cursor-default border-none block"
      transition:fade={{ duration: 300 }} aria-label="Zamknij tło" tabindex="-1"
    ></a>

    <div 
      role="dialog" aria-modal="true" aria-labelledby="modal-title"
      class="relative z-10 bg-ghost-white w-full max-w-6xl max-h-full flex flex-col md:flex-row border border-vantablack/20 shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden"
      transition:fly={{ y: 50, duration: 400, opacity: 0 }}
    >
      
      <a 
        href="/#katalog"
        on:click={handleClose}
        aria-label="Zamknij specyfikację"
        class="absolute top-0 right-0 z-50 w-12 h-12 bg-vantablack text-ghost-white flex items-center justify-center hover:bg-signal-orange transition-colors md:w-16 md:h-16"
      >
        <svg class="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </a>

      <div class="w-full md:w-1/2 bg-[#E8EAEF] flex flex-col relative border-b md:border-b-0 md:border-r border-border-tech h-64 md:h-auto shrink-0">
        <div class="relative flex-1 p-8 flex items-center justify-center">
          <span class="absolute top-4 left-4 text-[10px] font-mono text-cool-grey uppercase tracking-widest">
            {itemType === 'suitcase' ? 'Wizualizacja Wariantu' : 'Wizualizacja Produktu'}
          </span>
          {#if activeImageUrl}
            <img src={activeImageUrl} alt={product.name} class="w-full h-full object-contain mix-blend-multiply" />
          {:else}
            <div class="text-cool-grey font-mono text-xs tracking-widest opacity-50">BRAK DANYCH</div>
          {/if}
        </div>
        {#if images.length > 1}
          <div class="flex gap-2 p-4 bg-ghost-white/50 border-t border-border-tech overflow-x-auto">
            {#each images as img, i}
              <button 
                on:click={() => activeImageIndex = i}
                class="relative w-16 h-16 shrink-0 border-2 transition-colors {i === activeImageIndex ? 'border-signal-orange' : 'border-transparent hover:border-vantablack/30'} bg-white p-1"
                aria-label="Zmień zdjęcie"
              >
                <img src={`${strapiUrl}${img.url}`} alt="" class="w-full h-full object-contain mix-blend-multiply" />
              </button>
            {/each}
          </div>
        {/if}
      </div>

      <div class="w-full md:w-1/2 flex flex-col bg-ghost-white overflow-y-auto">
        <div class="p-6 md:p-10 flex-1 flex flex-col">
          
          <div class="mb-6">
            <div class="flex items-center gap-3 mb-2 flex-wrap">
              <span class="bg-vantablack text-white text-[10px] font-mono font-bold px-2 py-1 tracking-widest uppercase">SKU: {product.model_sku || 'BRAK'}</span>
              <span class="text-[10px] font-mono font-bold text-cool-grey tracking-widest uppercase">/ KAT: {product.category || product.gender || 'N/A'}</span>
            </div>
            <h2 id="modal-title" class="text-3xl md:text-5xl font-black uppercase tracking-tighter text-vantablack leading-none">
              {product.name}
            </h2>
          </div>

          {#if itemType === 'suitcase' && variants.length > 0}
            <div class="mb-8">
              <span class="text-[10px] font-mono text-cool-grey uppercase tracking-widest block mb-3">Dostępne Moduły (Rozmiary)</span>
              <div class="flex flex-wrap gap-2">
                {#each variants as variant, idx}
                  <button 
                    on:click={() => activeVariantIndex = idx}
                    class="px-4 py-2 text-[11px] font-bold uppercase tracking-widest border transition-all duration-300 {idx === activeVariantIndex ? 'bg-vantablack text-ghost-white border-vantablack shadow-md scale-105' : 'bg-white text-cool-grey border-border-tech hover:border-vantablack/50'}"
                  >
                    {variant.size_name}
                  </button>
                {/each}
              </div>
            </div>
          {/if}

          <div class="flex flex-col sm:flex-row gap-4 mb-8">
            <div class="bg-signal-orange/10 border border-signal-orange px-6 py-4 flex flex-col items-start justify-center flex-1">
              <span class="text-[10px] font-mono text-signal-orange uppercase tracking-widest">Cena Hurtowa Netto</span>
              <span class="text-3xl font-black text-signal-orange tracking-tighter">
                {#if itemType === 'wallet' || itemType === 'bag'}
                  {product.price_pln ? `${product.price_pln} PLN` : 'Zadzwoń'}
                {:else}
                  {activeVariant.price_pln ? `${activeVariant.price_pln} PLN` : 'Zadzwoń'}
                {/if}
              </span>
            </div>
            <div class="border border-border-tech bg-white px-6 py-4 flex flex-col items-start justify-center flex-1">
              <span class="text-[10px] font-mono text-cool-grey uppercase tracking-widest">Status Magazynu</span>
              <div class="flex items-center gap-2 mt-1">
                {#if itemType === 'wallet' || itemType === 'bag'}
                  <div class="w-3 h-3 rounded-full {product.stock_status === 'out_of_stock' ? 'bg-red-500' : 'bg-green-500 animate-pulse'}"></div>
                  <span class="font-bold text-sm tracking-widest uppercase {product.stock_status === 'out_of_stock' ? 'text-red-500' : 'text-vantablack'}">
                    {product.stock_status === 'out_of_stock' ? 'BRAK NA STANIE' : 'DOSTĘPNY'}
                  </span>
                {:else}
                  <div class="w-3 h-3 rounded-full {activeVariant.stock_status === 'out_of_stock' ? 'bg-red-500' : 'bg-green-500 animate-pulse'}"></div>
                  <span class="font-bold text-sm tracking-widest uppercase {activeVariant.stock_status === 'out_of_stock' ? 'text-red-500' : 'text-vantablack'}">
                    {activeVariant.stock_status === 'out_of_stock' ? 'BRAK NA STANIE' : 'DOSTĘPNY'}
                  </span>
                {/if}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-8">
            {#if itemType === 'suitcase'}
              <div class="border border-border-tech p-4 flex flex-col gap-1 bg-white">
                <span class="text-[10px] font-mono text-cool-grey uppercase tracking-widest">Waga</span>
                <span class="font-black text-lg text-vantablack">{activeVariant.weight_kg ? `${activeVariant.weight_kg} kg` : 'N/A'}</span>
              </div>
              <div class="border border-border-tech p-4 flex flex-col gap-1 bg-white">
                <span class="text-[10px] font-mono text-cool-grey uppercase tracking-widest">Pojemność</span>
                <span class="font-black text-lg text-vantablack">{activeVariant.capacity_liters ? `${activeVariant.capacity_liters} L` : 'N/A'}</span>
              </div>
              <div class="border border-border-tech p-4 flex flex-col gap-1 bg-white">
                <span class="text-[10px] font-mono text-cool-grey uppercase tracking-widest">System Jezdny</span>
                <span class="font-black text-xs text-vantablack uppercase flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full {product.feature_360_wheels ? 'bg-vantablack' : 'bg-cool-grey'}"></span> {product.feature_360_wheels ? '4 Kółka 360°' : 'Standard'}
                </span>
              </div>
              <div class="border border-border-tech p-4 flex flex-col gap-1 bg-white">
                <span class="text-[10px] font-mono text-cool-grey uppercase tracking-widest">Zabezpieczenie</span>
                <span class="font-black text-xs text-vantablack uppercase flex items-center gap-2">
                  <span class="w-2 h-2 rounded-sm {product.feature_tsa_lock ? 'bg-vantablack' : 'bg-cool-grey'}"></span> {product.feature_tsa_lock ? 'Zamek Szyfrowy' : 'Brak'}
                </span>
              </div>
            {/if}

            {#if itemType === 'bag'}
              <div class="border border-border-tech p-4 flex flex-col gap-1 bg-white col-span-2">
                <span class="text-[10px] font-mono text-cool-grey uppercase tracking-widest">Wymiary Gabarytowe</span>
                <span class="font-black text-sm text-vantablack uppercase">{dimensionsText}</span>
              </div>
              <div class="border border-border-tech p-4 flex flex-col gap-1 bg-white">
                <span class="text-[10px] font-mono text-cool-grey uppercase tracking-widest">Przegrody Wew.</span>
                <span class="font-black text-lg text-vantablack">{product.feature_compartments || 1}</span>
              </div>
              <div class="border border-border-tech p-4 flex flex-col gap-1 bg-white">
                <span class="text-[10px] font-mono text-cool-grey uppercase tracking-widest">Pasek (Regulowany)</span>
                <span class="font-black text-xs text-vantablack uppercase flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full {product.feature_adjustable_strap ? 'bg-vantablack' : 'bg-cool-grey'}"></span> {product.feature_adjustable_strap ? 'W Zestawie' : 'Brak'}
                </span>
              </div>
            {/if}
            
            {#if itemType === 'wallet'}
              <div class="border border-border-tech p-4 flex flex-col gap-1 bg-white col-span-2">
                <span class="text-[10px] font-mono text-cool-grey uppercase tracking-widest">Wymiary (Orientacja: {product.orientation})</span>
                <span class="font-black text-sm text-vantablack uppercase">{dimensionsText}</span>
              </div>
              <div class="border border-border-tech p-4 flex flex-col gap-1 bg-white">
                <span class="text-[10px] font-mono text-cool-grey uppercase tracking-widest">Karty / Banknoty</span>
                <span class="font-black text-lg text-vantablack">
                  {product.slots_cards || 0} / {product.slots_banknotes || 0}
                </span>
              </div>
              <div class="border border-border-tech p-4 flex flex-col gap-1 bg-white">
                <span class="text-[10px] font-mono text-cool-grey uppercase tracking-widest">Ochrona RFID</span>
                <span class="font-black text-xs text-vantablack uppercase flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full {product.feature_rfid_protection ? 'bg-signal-orange' : 'bg-cool-grey'}"></span> {product.feature_rfid_protection ? 'Zabezpieczony' : 'Brak'}
                </span>
              </div>
            {/if}

            {#if colors.length > 0}
              <div class="border border-border-tech p-4 flex flex-col gap-2 bg-white col-span-2">
                <span class="text-[10px] font-mono text-cool-grey uppercase tracking-widest">Dostępne Kolory</span>
                <div class="flex flex-wrap gap-3 mt-1">
                  {#each colors as color}
                    <div class="group/color relative flex items-center justify-center">
                      <div class="w-8 h-8 rounded-full border border-vantablack/20 shadow-inner" style="background-color: {color.hex_code};"></div>
                      <span class="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/color:opacity-100 transition-opacity bg-vantablack text-white text-[9px] px-2 py-1 rounded-sm pointer-events-none whitespace-nowrap z-10">
                        {color.name}
                      </span>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
          </div>

          <div class="border border-border-tech p-6 bg-white mb-8 flex flex-col items-center relative overflow-hidden">
            <span class="absolute top-4 left-4 text-[10px] font-mono text-cool-grey uppercase tracking-widest">
              Rzut Techniczny / Gabaryty
            </span>
            
            {#if activeVariant?.internal_dimensions && itemType === 'suitcase'}
              <span class="absolute top-4 right-4 text-[9px] font-mono text-vantablack bg-vantablack/5 px-2 py-1 uppercase tracking-widest">
                Wew: {activeVariant.internal_dimensions}
              </span>
            {/if}
            
            <div class="relative w-48 h-56 mt-8 mb-4 flex items-center justify-center">
              
              <div class="absolute -bottom-6 inset-x-0 flex items-center justify-center gap-2 text-[10px] font-mono font-bold text-signal-orange z-10">
                <div class="h-[1px] flex-1 bg-signal-orange/30"></div>
                <span class="bg-white px-1">{Math.round($animW)} cm</span>
                <div class="h-[1px] flex-1 bg-signal-orange/30"></div>
              </div>
              
              <div class="absolute -left-8 inset-y-0 flex flex-col items-center justify-center gap-2 text-[10px] font-mono font-bold text-signal-orange z-10">
                <div class="w-[1px] flex-1 bg-signal-orange/30"></div>
                <span class="rotate-[-90deg] whitespace-nowrap bg-white px-1">{Math.round($animH)} cm</span>
                <div class="w-[1px] flex-1 bg-signal-orange/30"></div>
              </div>
              
              <div class="absolute -right-8 top-8 flex items-center gap-1 text-[10px] font-mono font-bold text-signal-orange z-10">
                <div class="w-8 h-[1px] bg-signal-orange rotate-45 transform origin-left"></div>
                <span class="absolute right-[-20px] top-[-15px] bg-white px-1">{Math.round($animD)} cm</span>
              </div>

              {#if itemType === 'suitcase'}
                <svg viewBox="0 0 100 140" class="w-full h-full text-border-tech fill-ghost-white stroke-vantablack stroke-2" aria-hidden="true">
                  <path d="M 35 20 L 35 10 C 35 5 40 5 45 5 L 55 5 C 60 5 65 5 65 10 L 65 20" fill="none" />
                  <line x1="45" y1="5" x2="55" y2="5" stroke-width="4" />
                  <rect x="20" y="20" width="60" height="110" rx="10" />
                  <line x1="30" y1="20" x2="30" y2="130" stroke-width="1" stroke-dasharray="4 2" />
                  <line x1="50" y1="20" x2="50" y2="130" stroke-width="1" stroke-dasharray="4 2" />
                  <line x1="70" y1="20" x2="70" y2="130" stroke-width="1" stroke-dasharray="4 2" />
                  <rect x="25" y="130" width="10" height="8" rx="2" fill="currentColor" />
                  <rect x="65" y="130" width="10" height="8" rx="2" fill="currentColor" />
                </svg>
              {:else if itemType === 'bag'}
                <svg viewBox="0 0 100 140" class="w-full h-full text-border-tech fill-ghost-white stroke-vantablack stroke-2" aria-hidden="true">
                  <path d="M 30 50 C 30 10 70 10 70 50" fill="none" stroke-width="3" />
                  <path d="M 15 50 L 85 50 L 75 120 C 75 125 70 130 65 130 L 35 130 C 30 130 25 125 25 120 Z" fill="currentColor" stroke-linejoin="round" />
                  <circle cx="50" cy="70" r="4" fill="none" />
                  <line x1="50" y1="50" x2="50" y2="66" />
                </svg>
              {:else}
                 <svg viewBox="0 0 100 140" class="w-full h-full text-border-tech fill-ghost-white stroke-vantablack stroke-2" aria-hidden="true">
                  <rect x="15" y="30" width="70" height="80" rx="6" fill="currentColor" />
                  <rect x="20" y="35" width="60" height="70" rx="3" fill="none" stroke-dasharray="3 3" stroke-width="1.5" />
                  <rect x="40" y="30" width="20" height="40" rx="2" fill="none" />
                  <circle cx="50" cy="60" r="4" fill="none" />
                </svg>
              {/if}
            </div>

            {#if activeVariant?.additional_info && itemType === 'suitcase'}
              <div class="mt-4 text-[10px] font-bold text-vantablack bg-signal-orange/20 px-3 py-1 uppercase tracking-widest border border-signal-orange/30">
                INFO: {activeVariant.additional_info}
              </div>
            {/if}
          </div>

          {#if product.description_marketing}
            <div class="mb-8 border-t border-border-tech pt-8">
              <span class="text-[10px] font-mono text-cool-grey uppercase tracking-widest block mb-4">Opis Technologiczny</span>
              <div class="text-sm font-medium text-vantablack leading-relaxed prose prose-sm prose-p:mb-2 prose-strong:font-bold">
                {#if isDescriptionExpanded}
                  {@html product.description_marketing}
                {:else}
                  <div class="line-clamp-3 relative">
                    {@html product.description_marketing}
                    <div class="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-ghost-white to-transparent"></div>
                  </div>
                {/if}
              </div>
              <button 
                class="text-[10px] font-bold uppercase tracking-widest text-signal-orange mt-2 hover:underline focus:outline-none"
                on:click={() => isDescriptionExpanded = !isDescriptionExpanded}
              >
                {isDescriptionExpanded ? 'Zwiń Opis' : 'Rozwiń Pełne Informacje'}
              </button>
            </div>
          {/if}

        </div>

        <div class="bg-vantablack p-4 md:p-6 mt-auto sticky bottom-0 z-10">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 text-ghost-white/70 text-[10px] font-mono uppercase tracking-widest border-b border-ghost-white/10 pb-4">
            <span>Dostawa: Przedpłata {shippingPrepaid} PLN</span>
            <span class="hidden sm:block">|</span>
            <span>Dostawa: Pobranie {shippingCod} PLN</span>
          </div>
          <a 
            href={`tel:${phone.replace(/\s/g, '')}`} 
            class="flex items-center justify-center w-full bg-signal-orange text-white font-black uppercase tracking-widest py-5 px-6 hover:bg-white hover:text-signal-orange transition-colors duration-300 text-center"
          >
            Zamów (Infolinia B2B)
          </a>
        </div>

      </div>
    </div>
  </div>
{/if}