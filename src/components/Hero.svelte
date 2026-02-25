<script>
  import { onMount } from 'svelte';
  import { spring } from 'svelte/motion';

  export let line1 = "HURTOWNIA BAGAŻU";
  export let line2 = "OD 2003";
  export let subheadline = "Zaopatrujemy liderów rynku detalicznego. Bezpieczeństwo. Terminowość. Marża.";

  const mouse = spring({ x: 0, y: 0 }, { stiffness: 0.03, damping: 0.3 });
  
  let innerWidth = 1920;
  let innerHeight = 1080;

  function handleMouseMove(e) {
    const x = (e.clientX / innerWidth - 0.5) * 2;
    const y = (e.clientY / innerHeight - 0.5) * 2;
    mouse.set({ x, y });
  }

  onMount(() => {
    innerWidth = window.innerWidth;
    innerHeight = window.innerHeight;
  });

  // Ciężka bryła - mikro rotacja
  $: rotateY = $mouse.x * 3; 
  $: rotateX = $mouse.y * -3;
  $: translateX = $mouse.x * 10;
  $: translateY = $mouse.y * 10;
  
  // Ujarzmiona paralaksa tekstu - oddycha, ale nie wyjeżdża z ekranu
  $: textTranslateX = $mouse.x * -5;
  $: textTranslateY = $mouse.y * -5;

  // Auto-skalowanie na wysokość
  $: modelScale = innerHeight < 900 ? Math.max(0.6, innerHeight / 1000) : 1;
</script>

<svelte:window 
  on:mousemove={handleMouseMove} 
  on:resize={() => { innerWidth = window.innerWidth; innerHeight = window.innerHeight; }} 
/>

<section class="relative w-full h-screen min-h-[700px] overflow-hidden bg-ghost-white cursor-crosshair">
  
  <div class="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
    <div class="absolute inset-0 bg-[linear-gradient(rgba(17,24,39,1)_1px,transparent_1px),linear-gradient(90deg,rgba(17,24,39,1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
  </div>

  <div class="absolute top-[10vh] inset-x-0 flex justify-center z-10 pointer-events-none animate-fade-in-up" style="--anim-delay: 0s;">
   <div style="transform: translate({textTranslateX}px, {textTranslateY}px);">
      <h1 class="font-black uppercase tracking-tighter text-vantablack leading-[0.85] opacity-90 text-center px-4 flex flex-col md:flex-row md:gap-4 whitespace-nowrap"
          style="font-size: clamp(3rem, 9vw, 11rem);">
        {#each line1.split(' ') as word}
          <span>{word}</span>
        {/each}
      </h1>
    </div>
  </div>

  <div class="absolute inset-0 z-20 flex items-center justify-center pointer-events-none mt-10" style="perspective: 1200px;">
    <div class="relative flex flex-col items-center justify-center animate-fade-in-up will-change-transform"
         style="--anim-delay: 0.2s; transform-style: preserve-3d; transform: scale({modelScale}) translate3d({translateX}px, {translateY}px, 0px) rotateX({rotateX}deg) rotateY({rotateY}deg);">
      
      <div class="absolute -bottom-16 w-[300px] h-10 bg-black/30 blur-2xl rounded-full backface-hidden" style="transform: translateZ(-50px);"></div>

      <div class="absolute -top-16 w-32 h-20 flex justify-between backface-hidden" style="transform: translateZ(-20px);">
        <div class="w-3 h-full bg-gradient-to-r from-gray-400 via-gray-200 to-gray-500"></div>
        <div class="w-3 h-full bg-gradient-to-r from-gray-400 via-gray-200 to-gray-500"></div>
        <div class="absolute top-0 left-0 w-full h-6 bg-vantablack rounded-t-lg shadow-md border-t border-gray-600"></div>
      </div>

      <div class="relative w-[280px] h-[440px] md:w-[320px] md:h-[500px] bg-[#D1D5DB] rounded-[2rem] border-[3px] border-vantablack overflow-hidden shadow-[20px_20px_60px_rgba(0,0,0,0.2)] backface-hidden"
           style="transform-style: preserve-3d;">
        
        <div class="absolute inset-x-6 inset-y-4 flex justify-between z-10 pointer-events-none">
          {#each Array(7) as _}
            <div class="w-6 h-full bg-black/5 rounded-full border-l border-white/50 border-r border-black/10"></div>
          {/each}
        </div>

        <div class="absolute top-8 right-8 bg-vantablack text-signal-orange text-[9px] font-mono p-2 z-20 shadow-md border border-signal-orange/30 backface-hidden">
          ID: W-204<br/>CLR
        </div>

        <div class="absolute inset-0 z-40 pointer-events-none opacity-0 animate-glare-sweep mix-blend-overlay">
          <div class="w-[200%] h-full bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 blur-sm"></div>
        </div>

      </div>

      <div class="absolute -top-1 -left-1 w-10 h-10 bg-vantablack rounded-tl-[2rem] rounded-br-xl z-30 backface-hidden"></div>
      <div class="absolute -top-1 -right-1 w-10 h-10 bg-vantablack rounded-tr-[2rem] rounded-bl-xl z-30 backface-hidden"></div>
      <div class="absolute -bottom-1 -left-1 w-10 h-10 bg-vantablack rounded-bl-[2rem] rounded-tr-xl z-30 backface-hidden"></div>
      <div class="absolute -bottom-1 -right-1 w-10 h-10 bg-vantablack rounded-br-[2rem] rounded-tl-xl z-30 backface-hidden"></div>

      <div class="absolute -bottom-8 left-8 w-6 h-10 flex flex-col items-center z-10 backface-hidden" style="transform: translateZ(-10px);">
        <div class="w-3 h-4 bg-gray-400"></div>
        <div class="w-6 h-6 bg-vantablack rounded-full"></div>
      </div>
      <div class="absolute -bottom-8 right-8 w-6 h-10 flex flex-col items-center z-10 backface-hidden" style="transform: translateZ(-10px);">
        <div class="w-3 h-4 bg-gray-400"></div>
        <div class="w-6 h-6 bg-vantablack rounded-full"></div>
      </div>

    </div>
  </div>

  <div class="absolute bottom-[20vh] inset-x-0 flex flex-col items-center z-30 pointer-events-none animate-fade-in-up" style="--anim-delay: 0.3s;">
    <div style="transform: translate({textTranslateX}px, {textTranslateY}px);">
      <h2 class="font-black uppercase tracking-tighter leading-none text-outline px-8"
          style="font-size: clamp(3.5rem, 10vw, 11rem);">
        {line2}
      </h2>
    </div>
  </div>

  <div class="absolute bottom-10 inset-x-0 z-40 px-4 flex justify-center pointer-events-none animate-fade-in-up" style="--anim-delay: 0.5s;">
    <p class="text-xs md:text-sm lg:text-base font-medium text-cool-grey max-w-xl text-center tracking-wide bg-ghost-white/90 py-3 px-8 backdrop-blur-md rounded-full border border-vantablack/10 shadow-sm pointer-events-auto">
      {subheadline}
    </p>
  </div>

</section>

<style>
  .text-outline {
    color: transparent;
    -webkit-text-stroke: 3px #111827; 
  }
  @media (max-width: 768px) {
    .text-outline { -webkit-text-stroke: 2px #111827; }
  }
  .backface-hidden {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }

  /* KRYTYCZNA ZMIANA: Czysty CSS dla wjazdu (błyskawiczny na smartfonach) */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(2rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in-up {
    opacity: 0; /* Zapewnia, że jest ukryte przed startem animacji */
    animation: fadeInUp 1s ease-out forwards;
    animation-delay: var(--anim-delay, 0s);
  }

  @keyframes glareSweep {
    0% { transform: translateX(-150%); opacity: 0; }
    20% { opacity: 0.8; }
    80% { transform: translateX(50%); opacity: 0; }
    100% { transform: translateX(50%); opacity: 0; }
  }
  
  .animate-glare-sweep {
    animation: glareSweep 1.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
    animation-delay: 1.5s; 
  }
</style>