<script>
  import { flip } from 'svelte/animate';
  import { fade, scale } from 'svelte/transition';

  export let products = [];
  export let strapiUrl = "http://localhost:1337";

  let activeCategory = 'ALL';

  // Filtr łączy typ produktu z wariantami twardości walizek
  const categories = [
    { id: 'ALL', label: 'WSZYSTKIE' },
    { id: 'Hard', label: 'WALIZKI TWARDE' },
    { id: 'Soft', label: 'WALIZKI MIĘKKIE' },
    { id: 'bag', label: 'TOREBKI' },
    { id: 'wallet', label: 'PORTFELE' }
  ];

  // INTELIGENTNE FILTROWANIE - Prawidłowa logika dla 3 kolekcji
  $: filteredProducts = products.filter(p => {
    if (activeCategory === 'ALL') return true;
    
    // Dla walizek sprawdzamy itemType ORAZ to czy są twarde/miękkie
    if (activeCategory === 'Hard' || activeCategory === 'Soft') {
      return p.itemType === 'suitcase' && p.category === activeCategory;
    }
    
    // Dla torebek pokazujemy wszystko z kolekcji torebek
    if (activeCategory === 'bag') {
      return p.itemType === 'bag';
    }

    // Dla portfeli pokazujemy wszystko z kolekcji portfeli
    if (activeCategory === 'wallet') {
      return p.itemType === 'wallet';
    }

    return false;
  });

  // Torebki i Portfele mają status bezpośrednio w sobie. Walizki w wariantach.
  function getOverallStock(product) {
    if (product.itemType === 'wallet' || product.itemType === 'bag') {
      return product.stock_status || 'in_stock';
    }
    if (!product.variants || product.variants.length === 0) return 'in_stock';
    const hasStock = product.variants.some(v => v.stock_status === 'in_stock');
    return hasStock ? 'in_stock' : 'out_of_stock';
  }

  function getStockColor(status) {
    return status === 'out_of_stock' 
      ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' 
      : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]';
  }

  // Cena bezpośrednia (Torebki/Portfele) VS Cena minimalna (Walizki)
  function getStartingPrice(product) {
    if (product.itemType === 'wallet' || product.itemType === 'bag') {
      return product.price_pln ? `${product.price_pln} PLN` : 'B2B / HURT';
    }
    if (!product.variants || product.variants.length === 0) return 'B2B / HURT';
    const prices = product.variants.map(v => v.price_pln).filter(p => p != null);
    if (prices.length === 0) return 'B2B / HURT';
    const minPrice = Math.min(...prices);
    return `OD ${minPrice} PLN`;
  }

  // Funkcja generująca w 100% unikalny klucz dla bloku {#each}
  function getUniqueId(product, index) {
    return `${product.itemType}-${product.documentId || product.id || index}-${product.model_sku || 'no-sku'}`;
  }
</script>

<section id="katalog" class="relative w-full bg-ghost-white py-24 min-h-screen z-30">
  <div class="max-w-[1920px] mx-auto px-4 md:px-8">
    
   <div class="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-6 border-b border-border-tech/50 pb-8">
      
      <div class="w-full md:w-1/2">
        <div class="flex items-center gap-4 mb-4">
          <span class="w-3 h-3 bg-vantablack"></span>
          <span class="text-xs font-mono font-bold tracking-widest text-cool-grey uppercase">Pełna Oferta</span>
        </div>
        
        <h2 class="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-vantablack leading-none mb-6">
          Znajdź Model <br/><span class="text-cool-grey">Dla Siebie</span>
        </h2>
        
        <p class="text-sm font-medium text-cool-grey leading-relaxed border-l-2 border-border-tech pl-4 max-w-lg">
          Przeglądasz realne stany magazynowe. Oferujemy tylko bezawaryjne modele, które przetrwały tysiące podróży. Wybierz walizkę, torebkę lub portfel i skontaktuj się z nami, aby poznać najlepszą cenę dla Twojego zamówienia.
        </p>
      </div>

      <div class="sticky top-24 z-40 bg-ghost-white/90 backdrop-blur-md p-1 border border-border-tech flex gap-1 self-start md:self-end flex-wrap shadow-sm">
        {#each categories as cat}
          <button 
            type="button"
            on:click={() => activeCategory = cat.id}
            class="px-4 md:px-6 py-2 text-xs font-bold uppercase tracking-widest transition-colors duration-200 
                   {activeCategory === cat.id ? 'bg-vantablack text-ghost-white' : 'text-cool-grey hover:text-vantablack hover:bg-vantablack/5'}"
          >
            {cat.label}
          </button>
        {/each}
      </div>

    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {#each filteredProducts as product, index (getUniqueId(product, index))}
        <a 
          href={`/produkt/${product.slug || product.documentId}#katalog`}
          data-astro-prefetch="hover"
          animate:flip={{ duration: 400 }}
          in:scale={{ duration: 300, start: 0.95 }}
          out:fade={{ duration: 200 }}
          class="group relative bg-surface border border-border-tech hover:border-vantablack transition-colors duration-300 overflow-hidden flex flex-col cursor-pointer block"
        >
          <div class="absolute top-4 inset-x-4 flex justify-between items-start z-10 pointer-events-none">
            <div class="flex flex-col gap-1">
              {#if product.is_bestseller}
                <span class="bg-signal-orange text-white text-[9px] font-mono font-bold px-2 py-1 tracking-widest uppercase">HIT</span>
              {/if}
              <span class="bg-vantablack text-white text-[9px] font-mono font-bold px-2 py-1 tracking-widest uppercase line-clamp-1 max-w-[120px]">
                {product.material || 'N/A'}
              </span>
            </div>
            <div class="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-2 py-1 border border-border-tech shadow-sm">
              <div class="w-2 h-2 rounded-full {getStockColor(getOverallStock(product))} animate-pulse"></div>
              <span class="text-[9px] font-mono font-bold text-vantablack tracking-widest uppercase">
                {getOverallStock(product) === 'out_of_stock' ? 'BRAK' : 'DOSTĘPNY'}
              </span>
            </div>
          </div>

          <div class="relative w-full aspect-[4/3] bg-[#E8EAEF] overflow-hidden flex items-center justify-center p-8">
            {#if product.images && product.images.length > 0 && product.images[0]?.url}
              <img 
                src="{strapiUrl}{product.images[0].url}" 
                alt={product.name} 
                class="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-110"
              />
            {:else}
              <div class="text-cool-grey font-mono text-xs tracking-widest opacity-50">BRAK ZDJĘCIA</div>
            {/if}
            
            <div class="absolute inset-0 bg-vantablack/0 group-hover:bg-vantablack/5 transition-colors duration-300 flex items-center justify-center pointer-events-none">
              <div 
                class="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-vantablack text-ghost-white px-8 py-4 font-bold text-xs uppercase tracking-widest border border-ghost-white/20 group-hover:bg-signal-orange group-hover:border-signal-orange"
              >
                Zobacz Specyfikację
              </div>
            </div>
          </div>

          <div class="p-4 border-t border-border-tech bg-white flex justify-between items-end gap-4 mt-auto">
            <div class="flex flex-col">
              <span class="text-[10px] font-mono font-bold text-cool-grey tracking-widest mb-1">SKU: {product.model_sku || 'BRAK'}</span>
              <h3 class="font-bold text-sm text-vantablack uppercase tracking-tight leading-tight line-clamp-2">
                {product.name}
              </h3>
            </div>
            <div class="text-[10px] font-bold text-signal-orange uppercase tracking-widest whitespace-nowrap border border-signal-orange/30 px-2 py-1 bg-signal-orange/5">
              {getStartingPrice(product)}
            </div>
          </div>

        </a>
      {/each}
    </div>

    {#if filteredProducts.length === 0}
      <div class="w-full py-24 flex flex-col items-center justify-center text-cool-grey font-mono">
        <svg class="w-12 h-12 mb-4 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
        <p class="tracking-widest uppercase">Brak asortymentu w tym sektorze.</p>
      </div>
    {/if}

  </div>
</section>