// src/lib/api.ts

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.gcstudio.in/api').replace(/\/+$/, '');

export async function fetchApi(endpoint: string, options: RequestInit = {}, role?: string) {
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  // Add cache: 'no-store' for GET requests to prevent aggressive Next.js caching
  const fetchOptions: RequestInit = {
    ...options,
    headers,
    ...( (!options.method || options.method === 'GET') ? { cache: 'no-store' as RequestCache } : {} )
  };

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = `${API_BASE_URL}${cleanEndpoint}`;

  try {
    const response = await fetch(fullUrl, fetchOptions);

    if (response.status === 401 && typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }

    return response;
  } catch (err: any) {
    console.error(`[fetchApi error on ${cleanEndpoint}] (Target: ${fullUrl}):`, err?.message || err);
    const errorMessage = err?.message === 'Failed to fetch'
      ? `Failed to connect to API server at ${fullUrl}. Please verify the server is running and CORS is enabled.`
      : (err?.message || 'Network request failed. Please check your connection or try again.');

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

