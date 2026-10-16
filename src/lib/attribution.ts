import type { Attribution } from './lead';

const KEY = 'kvarta-attribution-v1';
export function captureAttribution(): Attribution {
  const current = new URL(window.location.href);
  let stored: Attribution | null = null;
  try { stored = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch { /* Storage can be unavailable in private browsing. */ }
  const data: Attribution = stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : { landing_url: current.href.slice(0, 2000), referrer: document.referrer.slice(0, 2000) };
  if (!stored) {
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id', 'yclid', 'fbclid']) {
      const value = current.searchParams.get(key);
      if (value) data[key] = value.slice(0, 300);
    }
    try { sessionStorage.setItem(KEY, JSON.stringify(data)); } catch { /* The in-memory result is still submitted. */ }
  }
  return { ...data, submit_url: current.href.slice(0, 2000) };
}
