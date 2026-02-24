<script>
  let status = 'idle'; // 'idle' | 'loading' | 'success' | 'error'
  let errorMessage = '';

  let formData = {
    name: '',
    company: '',
    nip: '',
    phone: '',
    email: '',
    message: '',
    bot_field: '' // HONEYPOT
  };

  async function handleSubmit() {
    status = 'loading';
    errorMessage = '';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        status = 'success';
        formData = { name: '', company: '', nip: '', phone: '', email: '', message: '', bot_field: '' };
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Błąd autoryzacji serwera.');
      }
    } catch (error) {
      status = 'error';
      errorMessage = error.message;
    }
  }
</script>

<div class="w-full max-w-4xl mx-auto flex flex-col">
  
  <div class="mb-12 flex flex-col items-center text-center">
    <div class="flex items-center gap-4 mb-6">
      <span class="w-3 h-3 bg-vantablack"></span>
      <span class="text-xs font-mono font-bold tracking-widest text-cool-grey uppercase">Jesteśmy do dyspozycji</span>
    </div>
    <h2 class="text-4xl md:text-5xl font-black uppercase tracking-tighter text-vantablack leading-none mb-6">
      Masz pytania? <br class="md:hidden"/><span class="text-cool-grey">Napisz do Nas</span>
    </h2>
    <p class="text-sm font-medium text-cool-grey leading-relaxed max-w-2xl border-t border-border-tech pt-6 px-4">
      Dział handlowy B2B jest do Twojej dyspozycji. Wypełnij poniższy formularz, aby zainicjować proces autoryzacji i ustalić warunki dostaw hurtowych.
    </p>
  </div>

  <div class="w-full flex flex-col border-t border-border-tech bg-white">
    
    {#if status === 'success'}
      <div class="border-b border-border-tech p-12 md:p-24 flex flex-col items-center justify-center text-center animate-fade-in bg-surface/30">
        <svg class="w-12 h-12 text-signal-orange mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        <p class="text-xl md:text-2xl font-black text-vantablack uppercase tracking-widest mb-4">Wiadomość Przekazana</p>
        <p class="text-sm font-medium text-cool-grey max-w-md mb-8">Dział handlowy przetwarza Twoje zapytanie. Skontaktujemy się wkrótce.</p>
        <button on:click={() => status = 'idle'} class="inline-flex items-center gap-3 bg-white border border-border-tech text-vantablack font-bold uppercase tracking-widest text-[10px] px-6 py-4 hover:border-signal-orange hover:text-signal-orange transition-colors">
          <svg class="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          <span>Zainicjuj nowy protokół</span>
        </button>
      </div>
    {:else}
      <form on:submit|preventDefault={handleSubmit} class="flex flex-col">
        
        <div class="hidden" aria-hidden="true">
          <input type="text" name="bot_field" tabindex="-1" bind:value={formData.bot_field} autocomplete="off" />
        </div>

        <div class="flex flex-col md:flex-row border-b border-border-tech">
          <div class="w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-border-tech py-6 px-4 md:px-8 group">
            <label for="name" class="text-[10px] font-mono font-bold text-cool-grey tracking-widest uppercase mb-2 group-focus-within:text-signal-orange transition-colors">Imię i Nazwisko *</label>
            <input type="text" id="name" required bind:value={formData.name} disabled={status === 'loading'} class="w-full bg-transparent border-none p-0 text-sm md:text-base font-bold text-vantablack focus:outline-none focus:ring-0 placeholder:text-cool-grey/30 placeholder:font-medium disabled:opacity-50" placeholder="Wprowadź dane" />
          </div>
          <div class="w-full md:w-1/2 flex flex-col py-6 px-4 md:px-8 group">
            <label for="company" class="text-[10px] font-mono font-bold text-cool-grey tracking-widest uppercase mb-2 group-focus-within:text-signal-orange transition-colors">Nazwa Firmy</label>
            <input type="text" id="company" bind:value={formData.company} disabled={status === 'loading'} class="w-full bg-transparent border-none p-0 text-sm md:text-base font-bold text-vantablack focus:outline-none focus:ring-0 placeholder:text-cool-grey/30 placeholder:font-medium disabled:opacity-50" placeholder="Opcjonalnie" />
          </div>
        </div>

        <div class="flex flex-col md:flex-row border-b border-border-tech">
          <div class="w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-border-tech py-6 px-4 md:px-8 group">
            <label for="email" class="text-[10px] font-mono font-bold text-cool-grey tracking-widest uppercase mb-2 group-focus-within:text-signal-orange transition-colors">Adres Email *</label>
            <input type="email" id="email" required bind:value={formData.email} disabled={status === 'loading'} class="w-full bg-transparent border-none p-0 text-sm md:text-base font-bold text-vantablack focus:outline-none focus:ring-0 placeholder:text-cool-grey/30 placeholder:font-medium disabled:opacity-50" placeholder="kontakt@domena.pl" />
          </div>
          <div class="w-full md:w-1/2 flex flex-col py-6 px-4 md:px-8 group">
            <label for="phone" class="text-[10px] font-mono font-bold text-cool-grey tracking-widest uppercase mb-2 group-focus-within:text-signal-orange transition-colors">Telefon Kontaktowy *</label>
            <input type="tel" id="phone" required bind:value={formData.phone} disabled={status === 'loading'} class="w-full bg-transparent border-none p-0 text-sm md:text-base font-bold text-vantablack focus:outline-none focus:ring-0 placeholder:text-cool-grey/30 placeholder:font-medium disabled:opacity-50" placeholder="+48 000 000 000" />
          </div>
        </div>

        <div class="flex flex-col border-b border-border-tech py-6 px-4 md:px-8 group">
          <label for="nip" class="text-[10px] font-mono font-bold text-cool-grey tracking-widest uppercase mb-2 group-focus-within:text-signal-orange transition-colors">NIP (Opcjonalnie)</label>
          <input type="text" id="nip" bind:value={formData.nip} disabled={status === 'loading'} class="w-full bg-transparent border-none p-0 text-sm md:text-base font-bold text-vantablack focus:outline-none focus:ring-0 placeholder:text-cool-grey/30 placeholder:font-medium disabled:opacity-50" placeholder="PL..." />
        </div>

        <div class="flex flex-col border-b border-border-tech py-6 px-4 md:px-8 group bg-surface/30">
          <label for="message" class="text-[10px] font-mono font-bold text-cool-grey tracking-widest uppercase mb-4 group-focus-within:text-signal-orange transition-colors">Treść Zapytania *</label>
          <textarea id="message" required bind:value={formData.message} disabled={status === 'loading'} rows="3" class="w-full bg-transparent border-none p-0 text-sm md:text-base font-bold text-vantablack focus:outline-none focus:ring-0 placeholder:text-cool-grey/30 placeholder:font-medium disabled:opacity-50 resize-none" placeholder="Wpisz treść protokołu..."></textarea>
        </div>

        {#if status === 'error'}
          <div class="border-b border-border-tech py-4 px-4 md:px-8 bg-red-50">
            <p class="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest">SYS_ERR: {errorMessage}</p>
          </div>
        {/if}

        <div class="py-8 px-4 md:px-8 flex items-center justify-center md:justify-end bg-ghost-white">
          <button 
            type="submit" 
            disabled={status === 'loading'}
            class="inline-flex items-center gap-3 bg-white border border-border-tech text-vantablack font-bold uppercase tracking-widest text-[10px] px-8 py-4 hover:border-signal-orange hover:text-signal-orange transition-colors disabled:opacity-50"
          >
            {#if status === 'loading'}
              <svg class="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span>Autoryzacja...</span>
            {:else}
              <span>Wyślij zapytanie</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M17 8l4 4m0 0l-7 7m7-7H3"></path></svg>
            {/if}
          </button>
        </div>

      </form>
    {/if}
  </div>
</div>