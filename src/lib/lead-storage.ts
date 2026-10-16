import { createHmac, randomUUID } from 'node:crypto';
import type { LeadInput } from './lead';

export const DEDUP_MS = 10 * 60 * 1000;
export type SavedLead = LeadInput & { id: string; createdAt: string };
export type PhoneDocument = { version: 1; leads: SavedLead[] };
export interface AtomicStore {
  read(key: string): Promise<{ data: PhoneDocument; etag: string } | null>;
  write(key: string, data: PhoneDocument, etag: string | null): Promise<boolean>;
}

export function phoneKey(phone: string, secret: string) {
  return createHmac('sha256', secret).update(phone).digest('hex');
}

// One atomic document contains both the deduplication timestamp and the saved lead.
// A failed write cannot leave a lock without its corresponding application.
export async function saveLead(store: AtomicStore, input: LeadInput, secret: string, now = Date.now()) {
  const key = phoneKey(input.phone, secret);
  const lead: SavedLead = { ...input, id: randomUUID(), createdAt: new Date(now).toISOString() };
  for (let attempt = 0; attempt < 8; attempt++) {
    const current = await store.read(key);
    if (current && (current.data.version !== 1 || !Array.isArray(current.data.leads))) throw new Error('Invalid lead document');
    const existing = current?.data.leads.findLast(item => now - Date.parse(item.createdAt) < DEDUP_MS);
    if (existing) return { duplicate: true, id: existing.id };
    const data: PhoneDocument = { version: 1, leads: [...(current?.data.leads ?? []), lead] };
    if (await store.write(key, data, current?.etag ?? null)) return { duplicate: false, id: lead.id };
    // Another request won the conditional write. Read its result before retrying.
  }
  throw new Error('Concurrent write limit reached');
}

export async function createLeadStore(): Promise<AtomicStore> {
  if (process.env.LEAD_STORAGE === 'netlify') {
    const { getStore } = await import('@netlify/blobs');
    const blobs = getStore({ name: 'kvarta-leads-v1', consistency: 'strong' });
    return {
      async read(key) {
        const entry = await blobs.getWithMetadata(key, { type: 'json', consistency: 'strong' });
        if (!entry) return null;
        if (!entry.etag) throw new Error('Storage did not return a conditional-write token');
        return { data: entry.data as PhoneDocument, etag: entry.etag };
      },
      async write(key, data, etag) {
        const result = await blobs.setJSON(key, data, etag ? { onlyIfMatch: etag } : { onlyIfNew: true });
        return result.modified;
      },
    };
  }
  if (process.env.NETLIFY === 'true') throw new Error('LEAD_STORAGE must be configured for Netlify');
  const { createSqliteStore } = await import('./sqlite-store');
  return createSqliteStore();
}
