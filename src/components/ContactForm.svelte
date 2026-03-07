<script>
  let status = "idle"; // 'idle' | 'loading' | 'success' | 'error'
  let errorMessage = "";

  let formData = {
    name: "",
    company: "",
    nip: "",
    phone: "",
    email: "",
    message: "",
    bot_field: "", // HONEYPOT
    privacyConsent: false, // Privacy policy acceptance
  };

  // World-Class Real-Time Validation: Reaktywne blokowanie błędnych znaków podczas pisania
  $: {
    if (formData.name) {
      // Wyrzuca cyfry i znaki specjalne (zostawia tylko litery, spacje i myślniki)
      formData.name = formData.name.replace(
        /[^a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s\-]/g,
        "",
      );
    }
    if (formData.nip) {
      // NIP tylko wielkie litery i cyfry lub myślniki
      formData.nip = formData.nip.replace(/[^a-zA-Z0-9\-]/g, "").toUpperCase();
    }
    if (formData.phone) {
      // Telefon tylko plus, nawiasy, cyfry, spacje i myślniki
      formData.phone = formData.phone.replace(/[^\d\s+()\-]/g, "");
    }
  }

  // Flagowanie dotkniętych pól
  let isNameTouched = false;
  let isEmailTouched = false;
  let isPhoneTouched = false;
  let isMessageTouched = false;

  // Live Error States (Wizualny Feedback na żywo)
  $: isEmailValid =
    !formData.email || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email);

  // Bardzo ogólny dający luz regex, sprawdzany tylko gdy ma minimum 9 znaków ciągiem
  $: isPhoneValid =
    !formData.phone || formData.phone.replace(/\D/g, "").length >= 9;
  
  // Tablica aktywnych komunikatów błędów
  $: validationErrors = [
    (!formData.name && isNameTouched) ? "Brakuje: Imię i Nazwisko" : null,
    (!formData.email && isEmailTouched) ? "Brakuje: Adres Email" : (!isEmailValid ? "Błąd: Nieprawidłowy format Email" : null),
    (!formData.phone && isPhoneTouched) ? "Brakuje: Telefon Kontaktowy" : (!isPhoneValid ? "Błąd: Telefon musi mieć min. 9 cyfr" : null),
    (!formData.message && isMessageTouched) ? "Brakuje: Treść Zapytania" : (isMessageTouched && formData.message.length < 10 ? "Błąd: Treść zapytania za krótka (min. 10 znaków)" : null),
    (!formData.privacyConsent) ? "Wymagane: Akceptacja Polityki Prywatności" : null
  ].filter(Boolean); // Usuwa wartości null

  // Ogólna weryfikacja czy można wysłać
  $: canSubmit = 
    formData.name !== "" &&
    formData.email !== "" &&
    isEmailValid &&
    formData.phone !== "" &&
    isPhoneValid &&
    formData.message.length >= 10 &&
    formData.privacyConsent;
  function sanitizeInput(str) {
    if (!str) return "";
    return str.replace(/[<>]/g, "").trim();
  }

  async function handleSubmit() {
    status = "loading";
    errorMessage = "";

    try {
      // Oczyszczanie przed wysyłką (Data Sanitization)
      const sanitizedData = {
        name: sanitizeInput(formData.name),
        company: sanitizeInput(formData.company),
        nip: sanitizeInput(formData.nip),
        phone: sanitizeInput(formData.phone),
        email: sanitizeInput(formData.email),
        message: sanitizeInput(formData.message),
        privacyConsent: formData.privacyConsent,
        bot_field: formData.bot_field, // Honeypot musi pozostać nienaruszony (jeśli wypełniony to serwer i tak odrzuci)
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedData),
      });

      if (response.ok) {
        status = "success";
        formData = {
          name: "",
          company: "",
          nip: "",
          phone: "",
          email: "",
          message: "",
          bot_field: "",
        };
      } else {
        const data = await response.json();
        throw new Error(data.error || "Błąd autoryzacji serwera.");
      }
    } catch (error) {
      status = "error";
      errorMessage = error.message;
    }
  }
</script>

<div class="w-full max-w-4xl mx-auto flex flex-col">
  <div class="mb-12 flex flex-col items-center text-center">
    <div class="flex items-center gap-4 mb-6">
      <span class="w-3 h-3 bg-vantablack"></span>
      <span
        class="text-xs font-mono font-bold tracking-widest text-cool-grey uppercase"
        >Jesteśmy do dyspozycji</span
      >
    </div>
    <h2
      class="text-4xl md:text-5xl font-black uppercase tracking-tighter text-vantablack leading-none mb-6"
    >
      Masz pytania? <br class="md:hidden" /><span class="text-cool-grey"
        >Napisz do Nas</span
      >
    </h2>
    <p
      class="text-sm font-medium text-cool-grey leading-relaxed max-w-2xl border-t border-border-tech pt-6 px-4"
    >
      Dział handlowy B2B jest do Twojej dyspozycji. Wypełnij poniższy formularz,
      aby zainicjować proces autoryzacji i ustalić warunki dostaw hurtowych.
    </p>
  </div>

  <div class="w-full flex flex-col border-t border-border-tech bg-white">
    {#if status === "success"}
      <div
        class="border-b border-border-tech p-12 md:p-24 flex flex-col items-center justify-center text-center animate-fade-in bg-surface/30"
      >
        <svg
          class="w-12 h-12 text-signal-orange mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="square"
            stroke-linejoin="miter"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          ></path></svg
        >
        <p
          class="text-xl md:text-2xl font-black text-vantablack uppercase tracking-widest mb-4"
        >
          Wiadomość Przekazana
        </p>
        <p class="text-sm font-medium text-cool-grey max-w-md mb-8">
          Dział handlowy przetwarza Twoje zapytanie. Skontaktujemy się wkrótce.
        </p>
        <button
          on:click={() => (status = "idle")}
          class="inline-flex items-center gap-3 bg-white border border-border-tech text-vantablack font-bold uppercase tracking-widest text-[10px] px-6 py-4 hover:border-signal-orange hover:text-signal-orange transition-colors"
        >
          <svg
            class="w-4 h-4 rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            ><path
              stroke-linecap="square"
              stroke-linejoin="miter"
              stroke-width="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            ></path></svg
          >
          <span>Wyślij kolejną wiadomość</span>
        </button>
      </div>
    {:else}
      <form on:submit|preventDefault={handleSubmit} class="flex flex-col" autocomplete="off">
        <div class="hidden" aria-hidden="true">
          <input
            type="text"
            name="bot_field"
            tabindex="-1"
            bind:value={formData.bot_field}
            autocomplete="off"
          />
        </div>

        <div class="flex flex-col md:flex-row border-b border-border-tech">
          <div
            class="w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-border-tech py-6 px-4 md:px-8 group"
          >
            <label
              for="name"
              class="text-[10px] font-mono font-bold text-cool-grey tracking-widest uppercase mb-2 group-focus-within:text-signal-orange transition-colors"
              >Imię i Nazwisko *</label
            >
            <!-- Svelte zajmuje się filtrowaniem przez block regexa w bloku $: -->
            <input
              type="text"
              id="name"
              required
              minlength="3"
              maxlength="100"
              title="Imię i nazwisko może zawierać tylko litery i myślniki"
              bind:value={formData.name}
              on:blur={() => isNameTouched = true}
              disabled={status === "loading"}
              class="w-full bg-transparent border-none p-0 text-sm md:text-base font-bold text-vantablack focus:outline-none focus:ring-0 placeholder:text-cool-grey/30 placeholder:font-medium disabled:opacity-50"
              placeholder="Wprowadź dane"
            />
          </div>
          <div class="w-full md:w-1/2 flex flex-col py-6 px-4 md:px-8 group">
            <label
              for="company"
              class="text-[10px] font-mono font-bold text-cool-grey tracking-widest uppercase mb-2 group-focus-within:text-signal-orange transition-colors"
              >Nazwa Firmy</label
            >
            <!-- Max znaków: 150 -->
            <input
              type="text"
              id="company"
              maxlength="150"
              bind:value={formData.company}
              disabled={status === "loading"}
              class="w-full bg-transparent border-none p-0 text-sm md:text-base font-bold text-vantablack focus:outline-none focus:ring-0 placeholder:text-cool-grey/30 placeholder:font-medium disabled:opacity-50"
              placeholder="Opcjonalnie"
            />
          </div>
        </div>

        <div class="flex flex-col md:flex-row border-b border-border-tech">
          <div
            class="w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-border-tech py-6 px-4 md:px-8 group"
          >
            <label
              for="email"
              class="text-[10px] font-mono font-bold {isEmailValid
                ? 'text-cool-grey'
                : 'text-red-500'} tracking-widest uppercase mb-2 group-focus-within:{isEmailValid
                ? 'text-signal-orange'
                : 'text-red-500'} transition-colors flex justify-between"
            >
              <span>Adres Email *</span>
              {#if !isEmailValid}
                <span class="text-red-500 font-bold hidden sm:inline"
                  >Nieprawidłowy Format</span
                >
              {/if}
            </label>
            <!-- Wymuszenie poprawnego formatu adresu email, max 100 znaków -->
            <input
              type="email"
              id="email"
              required
              maxlength="100"
              title="Wprowadź poprawny adres email"
              bind:value={formData.email}
              on:blur={() => isEmailTouched = true}
              disabled={status === "loading"}
              class="w-full bg-transparent border-none p-0 text-sm md:text-base font-bold {isEmailValid
                ? 'text-vantablack'
                : 'text-red-600'} focus:outline-none focus:ring-0 placeholder:text-cool-grey/30 placeholder:font-medium disabled:opacity-50"
              placeholder="kontakt@domena.pl"
            />
          </div>
          <div class="w-full md:w-1/2 flex flex-col py-6 px-4 md:px-8 group">
            <label
              for="phone"
              class="text-[10px] font-mono font-bold {isPhoneValid
                ? 'text-cool-grey'
                : 'text-red-500'} tracking-widest uppercase mb-2 group-focus-within:{isPhoneValid
                ? 'text-signal-orange'
                : 'text-red-500'} transition-colors flex justify-between"
            >
              <span>Telefon Kontaktowy *</span>
              {#if !isPhoneValid}
                <span class="text-red-500 font-bold hidden sm:inline"
                  >Min. 9 cyfr</span
                >
              {/if}
            </label>
            <!-- Real time phone limit/validation through svelte -->
            <input
              type="tel"
              id="phone"
              required
              minlength="9"
              maxlength="20"
              title="Wprowadź prawidłowy numer telefonu z użyciem cyfr"
              bind:value={formData.phone}
              on:blur={() => isPhoneTouched = true}
              disabled={status === "loading"}
              class="w-full bg-transparent border-none p-0 text-sm md:text-base font-bold {isPhoneValid
                ? 'text-vantablack'
                : 'text-red-600'} focus:outline-none focus:ring-0 placeholder:text-cool-grey/30 placeholder:font-medium disabled:opacity-50"
              placeholder="+48 000 000 000"
            />
          </div>
        </div>

        <div
          class="flex flex-col border-b border-border-tech py-6 px-4 md:px-8 group"
        >
          <label
            for="nip"
            class="text-[10px] font-mono font-bold text-cool-grey tracking-widest uppercase mb-2 group-focus-within:text-signal-orange transition-colors"
            >NIP (Opcjonalnie)</label
          >
          <!-- Numery NIP i litery kraju, max 20, by uniknąć overflowów, dopuszczalne myślniki -->
          <input
            type="text"
            id="nip"
            maxlength="20"
            title="Wprowadź prawidłowy NIP firmy"
            bind:value={formData.nip}
            disabled={status === "loading"}
            class="w-full bg-transparent border-none p-0 text-sm md:text-base font-bold text-vantablack focus:outline-none focus:ring-0 placeholder:text-cool-grey/30 placeholder:font-medium disabled:opacity-50"
            placeholder="PL..."
          />
        </div>

        <div
          class="flex flex-col border-b border-border-tech py-6 px-4 md:px-8 group bg-surface/30"
        >
          <label
            for="message"
            class="text-[10px] font-mono font-bold text-cool-grey tracking-widest uppercase mb-4 group-focus-within:text-signal-orange transition-colors"
            >Treść Zapytania *</label
          >
          <!-- Limit znaków zapytania zabezpieczający przed zalaniem bazy (Max 2000 znaków) -->
          <textarea
            id="message"
            required
            minlength="10"
            maxlength="2000"
            bind:value={formData.message}
            on:blur={() => isMessageTouched = true}
            disabled={status === "loading"}
            rows="3"
            class="w-full bg-transparent border-none p-0 text-sm md:text-base font-bold text-vantablack focus:outline-none focus:ring-0 placeholder:text-cool-grey/30 placeholder:font-medium disabled:opacity-50 resize-none"
            placeholder="Wpisz treść wiadomości..."
          ></textarea>
        </div>

        {#if status === "error"}
          <div class="border-b border-border-tech py-4 px-4 md:px-8 bg-red-50">
            <p
              class="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest"
            >
              SYS_ERR: {errorMessage}
            </p>
          </div>
        {/if}

        <div
          class="flex flex-col md:flex-row items-center justify-between border-t border-border-tech bg-ghost-white py-6 px-4 md:px-8 gap-6"
        >
          <div class="flex items-start gap-3 w-full md:w-auto">
            <button
              type="button"
              id="privacyBtn"
              role="checkbox"
              aria-checked={formData.privacyConsent}
              class="relative flex items-center justify-center mt-1 cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-orange"
              on:click={() => formData.privacyConsent = !formData.privacyConsent}
              on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && (formData.privacyConsent = !formData.privacyConsent)}
              disabled={status === "loading"}
            >
              <div
                class="w-5 h-5 flex items-center justify-center border-2 transition-colors {formData.privacyConsent
                  ? 'bg-signal-orange border-signal-orange'
                  : 'bg-white border-border-tech'}"
              >
                {#if formData.privacyConsent}
                  <svg
                    class="w-3 h-3 text-white transition-opacity duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    ><path
                      stroke-linecap="square"
                      stroke-linejoin="miter"
                      stroke-width="3"
                      d="M5 13l4 4L19 7"
                    ></path></svg
                  >
                {/if}
              </div>
            </button>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <div
              role="button"
              tabindex="0"
              class="text-[10px] font-medium text-cool-grey leading-tight max-w-[400px] cursor-pointer inline-block"
              on:click={() => formData.privacyConsent = !formData.privacyConsent}
            >
              Akceptuję <a
                href="https://walizkilublin.pl/polityka-prywatnosci/"
                target="_blank"
                rel="noopener noreferrer"
                class="font-bold text-vantablack hover:text-signal-orange transition-colors"
                on:click|stopPropagation>Politykę Prywatności</a
              > oraz wyrażam zgodę na przetwarzanie podanych danych w celu obsługi
              zapytania. *
            </div>
          </div>

          <div class="flex flex-col md:items-end w-full md:w-auto gap-4 mt-8 md:mt-0">
            {#if !canSubmit}
              <div class="flex flex-col gap-1 items-start md:items-end text-right">
                <span class="text-[10px] font-mono font-bold text-signal-orange uppercase tracking-widest bg-signal-orange/10 px-2 py-1 mb-1">
                  Do Uzupełnienia:
                </span>
                {#each validationErrors as error}
                  <span class="text-[10px] font-bold text-cool-grey leading-none">
                    • {error}
                  </span>
                {/each}
              </div>
            {:else}
              <div class="flex flex-col gap-1 items-start md:items-end text-right">
                <span class="text-[10px] font-mono font-bold text-[#00A550] uppercase tracking-widest bg-[#00A550]/10 px-2 py-1 mb-1">
                  Gotowe do wysyłki
                </span>
                <span class="text-[10px] font-bold text-cool-grey leading-none">
                  Wszystkie warunki formularza spełnione.
                </span>
              </div>
            {/if}

            <button
            type="submit"
            disabled={status === "loading" || !canSubmit}
            class="inline-flex w-full md:w-auto items-center justify-center gap-3 bg-white border border-border-tech text-vantablack font-bold uppercase tracking-widest text-[10px] px-8 py-4 hover:border-signal-orange hover:text-signal-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            {#if status === "loading"}
              <svg
                class="animate-spin h-4 w-4 text-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                ><circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle><path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path></svg
              >
              <span>Autoryzacja...</span>
            {:else}
              <span>Wyślij zapytanie</span>
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                ><path
                  stroke-linecap="square"
                  stroke-linejoin="miter"
                  stroke-width="2"
                  d="M17 8l4 4m0 0l-7 7m7-7H3"
                ></path></svg
              >
            {/if}
            </button>
          </div>
        </div>
      </form>
    {/if}
  </div>
</div>
