// API Configuration v3.0
// Automatically uses correct backend URL based on environment
// Updated: 2025-10-06 - Fixed HTTPS mixed content issue with protocol detection

const getApiBaseUrl = (): string => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  // If accessed via HTTPS (Cloudflare) or domain, use relative URL (Nginx will proxy)
  if (protocol === 'https:' || hostname === 'gdggug.com' || hostname === 'www.gdggug.com') {
    return '/api';
  }

  // If localhost in dev mode
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3001/api';
  }

  // If accessing via server IP (HTTP), use direct backend
  return `http://${hostname}:3001/api`;
};

export const API_BASE_URL = getApiBaseUrl();

// Legacy support for old admin pages
export const API_ENDPOINTS = {
  events: `${API_BASE_URL}/events`,
  news: `${API_BASE_URL}/news`,
  team: `${API_BASE_URL}/team`,
} as const;

console.log('🔧 API Base URL:', API_BASE_URL, '| Protocol:', window.location.protocol, '| Host:', window.location.hostname);
