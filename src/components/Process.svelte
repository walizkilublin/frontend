<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { draw } from 'svelte/transition';
  import { cubicInOut, backOut } from 'svelte/easing';

  let visible = false;
  let sectionRef;

  // Odpalamy animację dopiero, gdy klient doskroluje do tej sekcji (Intersection Observer)
  onMount(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        visible = true;
        observer.disconnect(); // Animujemy tylko raz
      }
    }, { threshold: 0.3 }); // Odpali się, gdy 30% sekcji będzie widoczne

    if (sectionRef) {
      observer.observe(sectionRef);
    }

    return () => observer.disconnect();
  });

  const steps = [
    {
      id: '01',
      title: 'WYBIERZ PRODUKT',
      desc: 'Przejrzyj nasz katalog online i znajdź model, który Cię interesuje. Sprawdź wymiary, kolory i parametry na karcie produktu.',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
    },
    {
      id: '02',
      title: 'ZADZWOŃ DO NAS',
      desc: 'Preferujemy szybki i bezpośredni kontakt. Zadzwoń, podaj numer modelu (SKU) i powiedz, ile sztuk potrzebujesz. Doradzimy i potwierdzimy dostępność od ręki.',
      icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'

    },
    {
      id: '03',
      title: 'SZYBKA WYCENA',
      desc: 'Kupujesz jedną sztukę na wakacje? Dostaniesz świetną cenę detaliczną. Prowadzisz sklep? Zaproponujemy Ci atrakcyjny rabat hurtowy, na którym dobrze zarobisz.',
      icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
    },
    {
      id: '04',
      title: 'BŁYSKAWICZNA WYSYŁKA',
      desc: 'Pakujemy i zabezpieczamy towar. Paczka kurierska lub paleta wyjeżdża z naszego magazynu w Lublinie najczęściej jeszcze tego samego dnia.',
      icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4'
    }
  ];
</script>

<section bind:this={sectionRef} id="logistyka" class="relative w-full bg-vantablack text-ghost-white py-24 md:py-32 overflow-hidden z-20 border-t border-border-tech/30">
  
  <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px); background-size: 40px 40px;"></div>

  <div class="max-w-[1920px] mx-auto px-4 md:px-8 relative z-10">
    
    <div class="mb-20">
      <div class="flex items-center gap-4 mb-4">
        <span class="w-3 h-3 bg-signal-orange animate-pulse"></span>
        <span class="text-xs font-mono font-bold tracking-widest text-signal-orange uppercase">Jak to działa?</span>
      </div>
      <h2 class="text-4xl md:text-6xl font-black uppercase tracking-tighter text-ghost-white leading-none">
        Proste Zakupy<br/><span class="text-cool-grey">Krok po Kroku</span>
      </h2>
    </div>

    <div class="relative w-full max-w-5xl mx-auto flex flex-col gap-12 md:gap-24">
      
      <div class="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 hidden md:block z-0">
        <svg class="w-full h-full" preserveAspectRatio="none">
          {#if visible}
            <line 
              x1="50%" y1="0" x2="50%" y2="100%" 
              stroke="#FF5722" stroke-width="2" stroke-dasharray="8 8" 
              in:draw={{ duration: 2000, easing: cubicInOut }} 
            />
          {/if}
        </svg>
      </div>

      {#each steps as step, index}
        <div class="relative flex flex-col md:flex-row items-start md:items-center justify-between group z-10">
          
          <div 
            class="w-full md:w-[45%] {index % 2 === 0 ? 'md:order-1 md:text-right md:pr-12' : 'md:order-3 md:pl-12'} pl-16 md:pl-0 mt-2 md:mt-0"
          >
            {#if visible}
              <div 
                in:fly={{ x: index % 2 === 0 ? -50 : 50, duration: 800, delay: index * 400 + 400, easing: backOut }}
                class="bg-surface/5 border border-ghost-white/10 p-6 backdrop-blur-sm group-hover:border-signal-orange/50 transition-colors duration-500"
              >
                <div class="text-[10px] font-mono text-signal-orange tracking-widest uppercase mb-2">Etap {step.id}</div>
                <h3 class="text-xl md:text-2xl font-black tracking-tight uppercase mb-3 text-ghost-white group-hover:text-signal-orange transition-colors duration-300">{step.title}</h3>
                <p class="text-sm font-medium text-cool-grey leading-relaxed">{step.desc}</p>
              </div>
            {/if}
          </div>

          <div class="absolute left-0 top-0 md:relative md:order-2 md:w-[10%] flex justify-center items-center shrink-0">
            {#if visible}
              <div 
                in:scale={{ duration: 500, delay: index * 400, easing: backOut }}
                class="w-12 h-12 bg-vantablack border-2 border-signal-orange flex items-center justify-center relative z-10 group-hover:bg-signal-orange transition-colors duration-500"
              >
                <svg class="w-5 h-5 text-signal-orange group-hover:text-vantablack transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d={step.icon}></path>
                </svg>
                
                <div class="absolute inset-0 border border-signal-orange opacity-0 group-hover:animate-ping"></div>
              </div>
            {/if}
            
            <div class="absolute left-1/2 top-12 bottom-[-48px] w-[2px] -translate-x-1/2 bg-signal-orange/20 md:hidden z-0"></div>
          </div>

          <div class="hidden md:block md:w-[45%] {index % 2 === 0 ? 'md:order-3' : 'md:order-1'}"></div>

        </div>
      {/each}

    </div>

  </div>
</section>