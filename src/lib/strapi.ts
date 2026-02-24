import qs from 'qs';

interface Props {
  endpoint: string;
  query?: Record<string, any>;
  wrappedByKey?: string;
  wrappedByList?: boolean;
}

export default async function fetchApi<T>({
  endpoint,
  query,
  wrappedByKey,
  wrappedByList,
}: Props): Promise<T> {
  if (endpoint.startsWith('/')) {
    endpoint = endpoint.slice(1);
  }

  const baseUrl = import.meta.env.PUBLIC_STRAPI_URL || 'http://localhost:1337';
  const url = new URL(`${baseUrl}/api/${endpoint}`);

  if (query) {
    url.search = qs.stringify(query, { encodeValuesOnly: true });
  }

  // Konfiguracja odporności (Resilience)
  const MAX_RETRIES = 3;
  const TIMEOUT_MS = 10000; // 10 sekund na jedno zapytanie

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.STRAPI_TOKEN}`
        },
        signal: controller.signal // Podpinamy nasz licznik czasu
      });

      clearTimeout(timeoutId); // Zatrzymujemy stoper, jeśli odpowiedź przyszła

      if (!res.ok) {
        throw new Error(`Błąd API Strapi (${res.status}): ${res.statusText} dla endpointu ${endpoint}`);
      }

      let data = await res.json();

      if (wrappedByKey) {
        data = data[wrappedByKey];
      }

      if (wrappedByList) {
        data = data[0];
      }

      return data as T;
      
    } catch (error) {
      clearTimeout(timeoutId); // Sprzątamy stoper na wypadek błędu
      
      const isAbortError = error instanceof Error && error.name === 'AbortError';
      const errorMessage = isAbortError ? `Timeout (${TIMEOUT_MS}ms) przekroczony` : (error as Error).message;

      if (attempt === MAX_RETRIES) {
        // Jeśli to była ostatnia próba, rzucamy ostateczny błąd (to wywali build Netlify - i dobrze!)
        throw new Error(`❌ [Strapi API] Endpoint /${endpoint} padł po ${MAX_RETRIES} próbach. Błąd: ${errorMessage}`);
      }

      // Jeśli nie, logujemy ostrzeżenie (widoczne w logach Netlify) i czekamy przed ponowną próbą
      console.warn(`⚠️ [Strapi API] Próba ${attempt} dla /${endpoint} nieudana (${errorMessage}). Ponawiam...`);
      
      // Delikatne opóźnienie rosnące z każdą próbą (np. 1s, 2s) - tzw. Exponential Backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }

  throw new Error("Nigdy do tego nie dojdzie, ale TypeScript lubi to wiedzieć.");
}