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

  // Używamy zmiennej z .env lub fallbacku
  const baseUrl = import.meta.env.PUBLIC_STRAPI_URL || 'http://localhost:1337';
  const url = new URL(`${baseUrl}/api/${endpoint}`);

  if (query) {
    url.search = qs.stringify(query, { encodeValuesOnly: true });
  }

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Wstrzykujemy token autoryzacyjny z .env
      'Authorization': `Bearer ${import.meta.env.STRAPI_TOKEN}`
    },
  });

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
}