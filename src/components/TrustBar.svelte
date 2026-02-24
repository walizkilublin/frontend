<script>
  import { onMount } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  // Referencja do sekcji dla IntersectionObservera
  let sectionRef;
  let isVisible = false;

  // Tweened stores dla płynnego odliczania
  const years = tweened(0, { duration: 1500, easing: cubicOut });
  const sold = tweened(0, { duration: 2000, easing: cubicOut });
  const shipping = tweened(0, { duration: 1000, easing: cubicOut });

  onMount(() => {
    // Odpalamy animację dopiero, gdy 50% sekcji wejdzie w kadr
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isVisible) {
        isVisible = true;
        // Odpalamy liczniki do wartości docelowych
        years.set(20);
        sold.set(50);
        shipping.set(24);
        
        // Odpinamy obserwator - animacja ma zajść tylko raz
        observer.disconnect();
      }
    }, { threshold: 0.5 });

    if (sectionRef) observer.observe(sectionRef);

    return () => observer.disconnect();
  });
</script>

<section 
  bind:this={sectionRef}
  id="trust-bar" 
  class="relative w-full bg-ghost-white border-y-2 border-vantablack overflow-hidden z-20"
>
  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-signal-orange/5 to-transparent -translate-x-full transition-transform duration-[2000ms] ease-out" class:translate-x-[200%]={isVisible}></div>

  <div class="max-w-[1920px] mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-vantablack">
      
      <div class="flex flex-col items-center justify-center py-12 md:py-16 relative group">
        <span class="absolute top-4 left-4 text-[10px] font-mono text-cool-grey uppercase tracking-widest">DT-01</span>
        <div class="text-6xl lg:text-8xl font-black text-vantablack tabular-nums tracking-tighter flex items-end leading-none">
          {Math.floor($years)}<span class="text-3xl lg:text-5xl mb-1 lg:mb-2 text-signal-orange">+</span>
        </div>
        <div class="mt-4 text-xs lg:text-sm font-bold uppercase tracking-[0.2em] text-cool-grey">
          Lat Doświadczenia
        </div>
      </div>

      <div class="flex flex-col items-center justify-center py-12 md:py-16 relative group bg-vantablack text-ghost-white transition-colors">
        <span class="absolute top-4 left-4 text-[10px] font-mono text-cool-grey uppercase tracking-widest">DT-02 / CORE</span>
        <div class="absolute top-4 right-4 w-2 h-2 bg-signal-orange rounded-full" class:animate-pulse={isVisible}></div>
        
        <div class="text-6xl lg:text-8xl font-black tabular-nums tracking-tighter flex items-end leading-none">
          {Math.floor($sold)}<span class="text-3xl lg:text-5xl mb-1 lg:mb-2 text-signal-orange">k</span>
        </div>
        <div class="mt-4 text-xs lg:text-sm font-bold uppercase tracking-[0.2em] text-cool-grey">
          Sprzedanych Sztuk
        </div>
      </div>

      <div class="flex flex-col items-center justify-center py-12 md:py-16 relative group">
        <span class="absolute top-4 left-4 text-[10px] font-mono text-cool-grey uppercase tracking-widest">DT-03</span>
        <div class="text-6xl lg:text-8xl font-black text-vantablack tabular-nums tracking-tighter flex items-end leading-none">
          {Math.floor($shipping)}<span class="text-3xl lg:text-5xl mb-1 lg:mb-2 text-signal-orange">H</span>
        </div>
        <div class="mt-4 text-xs lg:text-sm font-bold uppercase tracking-[0.2em] text-cool-grey">
          Czas Wysyłki
        </div>
      </div>

    </div>
  </div>
</section>