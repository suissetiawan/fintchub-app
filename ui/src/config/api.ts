/**
 * API Configuration
 * 
 * Konfigurasi untuk koneksi ke backend API.
 * Base URL diambil dari environment variable VITE_API_BASE_URL.
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/',
  TIMEOUT: 10000,
};

// Logging untuk development
if (import.meta.env.DEV) {
  console.log(`[API Config] Base URL: ${API_CONFIG.BASE_URL}`);
}

