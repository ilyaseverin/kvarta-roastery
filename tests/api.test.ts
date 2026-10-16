import test from 'node:test';
import assert from 'node:assert/strict';
import { POST } from '../src/app/api/lead/route';

test('accepts a same-origin browser request behind a host-rewriting proxy', async () => {
  const response = await POST(new Request('http://localhost:3000/api/lead', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'http://127.0.0.1:3000', Host: '127.0.0.1:3000' },
    body: JSON.stringify({ name: 'QA', phone: 'invalid', interest: 'order' }),
  }));
  assert.equal(response.status, 422); // Validation reached; no origin rejection.
});
test('accepts the external forwarded host and rejects unrelated origins', async () => {
  for (const [origin, expected] of [['https://kvarta.example', 422], ['https://unrelated.example', 403], ['not-a-url', 403]] as const) {
    const response = await POST(new Request('http://internal/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin, 'X-Forwarded-Host': 'kvarta.example' }, body: '{}' }));
    assert.equal(response.status, expected);
  }
});
test('returns actionable errors for invalid JSON, media type and excessive payload', async () => {
  const malformed = await POST(new Request('http://localhost/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' }));
  assert.equal(malformed.status, 400);
  const media = await POST(new Request('http://localhost/api/lead', { method: 'POST', body: '{}' }));
  assert.equal(media.status, 415);
  const large = await POST(new Request('http://localhost/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: 'x'.repeat(17000) }));
  assert.equal(large.status, 413);
});
test('does not return success when hosted storage is unavailable', async () => {
  const previous = process.env.LEAD_STORAGE; const secret = process.env.LEAD_HASH_SECRET;
  process.env.LEAD_STORAGE = 'netlify'; delete process.env.LEAD_HASH_SECRET;
  try {
    const response = await POST(new Request('http://localhost/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'QA', phone: '+375291234567', interest: 'question', comment: '' }) }));
    assert.equal(response.status, 503); assert.match((await response.json()).message, /данные остались/);
  } finally {
    if (previous === undefined) delete process.env.LEAD_STORAGE; else process.env.LEAD_STORAGE = previous;
    if (secret === undefined) delete process.env.LEAD_HASH_SECRET; else process.env.LEAD_HASH_SECRET = secret;
  }
});
