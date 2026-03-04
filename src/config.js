// Read from Vite environment variable
// @ts-ignore
const apiUrlFromEnv = import.meta.env.VITE_API_URL;

// Export as API_URL
export const API_URL = apiUrlFromEnv;

if (!API_URL) {
  // Warn in development if the environment variable is missing
  // This helps catch misconfiguration early
  // eslint-disable-next-line no-console
  console.warn('VITE_API_URL is not set! Please check your .env or deployment environment variables.');
}

