// src/lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.gcstudio.in/api';

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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);

  if (response.status === 401 && typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  }

  return response;
}
