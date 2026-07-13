export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.CF_PAGES_URL) {
    return process.env.CF_PAGES_URL;
  }

  return 'http://localhost:3000';
};
