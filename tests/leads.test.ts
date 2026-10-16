import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, unlinkSync, rmdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { normalizePhone, validateLead, type LeadInput } from '../src/lib/lead';
import { DEDUP_MS, phoneKey, saveLead, type AtomicStore, type PhoneDocument } from '../src/lib/lead-storage';
import { createSqliteStore } from '../src/lib/sqlite-store';

const lead: LeadInput = { name: 'Тест', phone: '+375291234567', interest: 'subscription', comment: 'Проверка', attribution: { utm_source: 'test', utm_campaign: 'coffee', utm_content: 'ad-3', landing_url: 'https://example.com/?utm_source=test' } };
function memoryStore() {
  const records = new Map<string, { data: PhoneDocument; etag: string }>();
  let revision = 0;
  const store: AtomicStore = {
    async read(key) { await new Promise(resolve => setImmediate(resolve)); return structuredClone(records.get(key) || null); },
    async write(key, data, etag) {
      const current = records.get(key);
      if ((current?.etag ?? null) !== etag) return false;
      records.set(key, { data: structuredClone(data), etag: String(++revision) }); return true;
    },
  };
  return { store, records };
}

test('normalizes Belarusian mobile and fixed-line numbers, rejects foreign and invalid numbers', () => {
  assert.equal(normalizePhone('+375 (29) 123-45-67'), '+375291234567');
  assert.equal(normalizePhone('8 029 123 45 67'), '+375291234567');
  assert.equal(normalizePhone('+375 17 222-33-44'), '+375172223344');
  for (const phone of ['+7 999 123 45 67', '+375 99 123 45 67', '+375 29 123', 'номер +375291234567', '']) assert.equal(normalizePhone(phone), null);
});
test('validates required fields and does not accept arbitrary interest values', () => {
  const result = validateLead({ name: ' ', phone: '123', interest: 'anything' });
  assert.ok(result.errors?.name); assert.ok(result.errors?.phone); assert.ok(result.errors?.interest);
  assert.ok(validateLead({ ...lead, comment: 'x'.repeat(1501) }).errors?.comment);
});
test('normalizes before deduplication and allows an empty optional comment', () => {
  const result = validateLead({ ...lead, name: '  Аня  ', phone: '+375 (29) 123-45-67', comment: '' });
  assert.equal(result.data?.name, 'Аня'); assert.equal(result.data?.phone, lead.phone); assert.equal(result.data?.comment, '');
});
test('keeps attribution, filters unknown keys, and bounds values', () => {
  const result = validateLead({ ...lead, attribution: { ...lead.attribution, unknown: 'bad', utm_term: 'x'.repeat(500) } });
  assert.equal(result.data?.attribution.utm_content, 'ad-3'); assert.equal(result.data?.attribution.unknown, undefined); assert.equal(result.data?.attribution.utm_term.length, 300);
});
test('thirty concurrent submissions create exactly one lead', async () => {
  const { store, records } = memoryStore();
  const results = await Promise.all(Array.from({ length: 30 }, () => saveLead(store, lead, 'test', 1_000_000)));
  assert.equal(results.filter(r => !r.duplicate).length, 1);
  assert.equal(new Set(results.map(r => r.id)).size, 1);
  assert.equal([...records.values()][0].data.leads.length, 1);
});
test('duplicates do not extend the sliding ten-minute window; exact boundary accepts a new lead', async () => {
  const { store, records } = memoryStore(); const start = 1_000_000;
  assert.equal((await saveLead(store, lead, 'test', start)).duplicate, false);
  assert.equal((await saveLead(store, lead, 'test', start + DEDUP_MS - 1)).duplicate, true);
  assert.equal((await saveLead(store, lead, 'test', start + DEDUP_MS)).duplicate, false);
  assert.equal([...records.values()][0].data.leads.length, 2);
});
test('different numbers are independent and HMAC keys do not expose the number', async () => {
  const { store, records } = memoryStore();
  await saveLead(store, lead, 'test', 1_000_000);
  const other = await saveLead(store, { ...lead, phone: '+375331234567' }, 'test', 1_000_000);
  assert.equal(other.duplicate, false); assert.equal(records.size, 2);
  assert.ok(!phoneKey(lead.phone, 'test').includes('375')); assert.notEqual(phoneKey(lead.phone, 'a'), phoneKey(lead.phone, 'b'));
});
test('a storage error is propagated instead of claiming a successful save', async () => {
  const store: AtomicStore = { read: async () => null, write: async () => { throw new Error('storage unavailable'); } };
  await assert.rejects(() => saveLead(store, lead, 'test'), /storage unavailable/);
});
test('a conflicting conditional write is retried without losing history', async () => {
  const { store, records } = memoryStore(); const original = store.write; let calls = 0;
  store.write = async (...args) => ++calls === 1 ? false : original(...args);
  assert.equal((await saveLead(store, lead, 'test')).duplicate, false); assert.equal(calls, 2); assert.equal([...records.values()][0].data.leads.length, 1);
});
test('SQLite persists across connections and uses atomic compare-and-swap', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'kvarta-test-')); const file = join(directory, 'leads.sqlite');
  const first = createSqliteStore(file); const second = createSqliteStore(file);
  try {
    const results = await Promise.all([saveLead(first, lead, 'test', 1_000_000), saveLead(second, lead, 'test', 1_000_000)]);
    assert.equal(results.filter(r => !r.duplicate).length, 1);
    first.close(); second.close();
    const reopened = createSqliteStore(file);
    try { const saved = await reopened.read(phoneKey(lead.phone, 'test')); assert.equal(saved?.data.leads.length, 1); assert.equal(saved?.data.leads[0].attribution.utm_campaign, 'coffee'); } finally { reopened.close(); }
  } finally { unlinkSync(file); rmdirSync(directory); }
});
