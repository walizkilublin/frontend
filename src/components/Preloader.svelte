<script>
  import { onMount } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { expoInOut } from 'svelte/easing';

  let isVisible = true;
  let isUnlocked = false; 
  let hideHud = false;    

  // Agresywne tempo: 600ms zamiast 1.2s
  const progress = tweened(0, { 
    duration: 600, 
    easing: expoInOut 
  });

  onMount(() => {
    progress.set(100);

    setTimeout(() => {
      hideHud = true;
    }, 700);

    setTimeout(() => {
      isUnlocked = true;
    }, 800);

    // Błyskawiczne usunięcie z DOM po animacji
    setTimeout(() => {
      isVisible = false;
    }, 1500);
  });
</script>

{#if isVisible}
  <div class="wl-preloader-wrapper fixed inset-0 z-[9999] flex overflow-hidden pointer-events-auto">    
    <div 
      class="w-1/2 h-full bg-ghost-white transition-transform duration-[600ms] ease-[cubic-bezier(0.85,0,0.15,1)] relative flex items-center justify-end overflow-hidden"
      class:-translate-x-full={isUnlocked}
    >
      <div class="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(17,24,39,1)_1px,transparent_1px),linear-gradient(90deg,rgba(17,24,39,1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div class="absolute right-0 top-0 bottom-0 w-[2px] bg-vantablack z-10"></div>
      <div class="w-8 h-16 bg-vantablack translate-x-[1px] z-20 flex items-center justify-end pr-2 border-y-2 border-l-2 border-white/10">
        <div class="w-1 h-8 bg-signal-orange animate-pulse"></div>
      </div>
    </div>

    <div 
      class="w-1/2 h-full bg-ghost-white transition-transform duration-[600ms] ease-[cubic-bezier(0.85,0,0.15,1)] relative flex items-center justify-start overflow-hidden"
      class:translate-x-full={isUnlocked}
    >
      <div class="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(17,24,39,1)_1px,transparent_1px),linear-gradient(90deg,rgba(17,24,39,1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div class="absolute left-0 top-0 bottom-0 w-[2px] bg-vantablack z-10"></div>
      <div class="w-8 h-16 bg-vantablack -translate-x-[1px] z-20 flex items-center justify-start pl-2 border-y-2 border-r-2 border-white/10">
        <div class="w-1 h-8 bg-signal-orange animate-pulse delay-75"></div>
      </div>
    </div>

    <div 
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center transition-all duration-300 z-50 w-full max-w-xs"
      class:opacity-0={hideHud}
      class:scale-95={hideHud}
    >
      <div class="bg-vantablack text-ghost-white p-6 w-full shadow-2xl border border-cool-grey/20 relative overflow-hidden">
        
        <div class="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-signal-orange/10 to-transparent -translate-y-full animate-scan"></div>

        <div class="flex justify-between items-end mb-4 font-mono">
          <div class="flex flex-col">
            <span class="text-[10px] text-cool-grey tracking-widest uppercase">Wczytuję magazyn</span>
            <span class="text-xl font-bold tracking-tight">WL-SYS.01</span>
          </div>
          <div class="text-4xl font-black text-signal-orange tabular-nums tracking-tighter">
            {$progress.toFixed(0)}<span class="text-lg opacity-50">%</span>
          </div>
        </div>

        <div class="w-full h-2 bg-ghost-white/10 relative overflow-hidden">
          <div 
            class="absolute top-0 left-0 h-full bg-signal-orange"
            style="width: {$progress}%;"
          ></div>
        </div>

        <div class="mt-4 flex justify-between items-center text-[9px] font-mono text-cool-grey uppercase tracking-widest">
          <span class="flex items-center gap-2">
            <span class="animate-spin inline-block">/</span>
            Ustalanie połączenia
          </span>
          <span class:text-signal-orange={$progress === 100}>
            {$progress === 100 ? 'GOTOWE' : 'CZEKAM'}
          </span>
        </div>

      </div>
    </div>

  </div>
{/if}

<style>
  @keyframes scan {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
  .animate-scan {
    animation: scan 1s linear infinite; /* Szybszy skaner */
  }
</style>