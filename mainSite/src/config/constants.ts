// API Base URLs
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export const FALLBACK_API_BASE_URL = import.meta.env.VITE_VERCEL_URL 
  ? `https://${import.meta.env.VITE_VERCEL_URL}` 
  : 'http://localhost:3001';
