import { validateLead } from '@/lib/lead';
import { createLeadStore, saveLead } from '@/lib/lead-storage';

export const runtime = 'nodejs';
const headers = { 'Cache-Control': 'no-store' };

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host')?.split(',')[0].trim() || request.headers.get('host') || new URL(request.url).host;
  let allowedOrigin = !origin;
  try { if (origin) { const url = new URL(origin); allowedOrigin = ['http:', 'https:'].includes(url.protocol) && url.host === host; } } catch { allowedOrigin = false; }
  if (!allowedOrigin) return Response.json({ message: 'Откройте форму на сайте «Кварты» и попробуйте ещё раз.' }, { status: 403, headers });
  if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({ message: 'Не удалось прочитать заявку. Обновите страницу.' }, { status: 415, headers });
  let body: unknown;
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw, 'utf8') > 16_384) return Response.json({ message: 'Заявка слишком большая. Сократите комментарий.' }, { status: 413, headers });
    body = JSON.parse(raw);
  } catch {
    return Response.json({ message: 'Не удалось прочитать заявку. Попробуйте ещё раз.' }, { status: 400, headers });
  }
  if (body && typeof body === 'object' && 'website' in body && body.website) return Response.json({ ok: true }, { headers });
  const validated = validateLead(body);
  if (validated.errors) return Response.json({ message: 'Проверьте поля формы.', errors: validated.errors }, { status: 422, headers });
  try {
    const secret = process.env.LEAD_HASH_SECRET || (process.env.LEAD_STORAGE !== 'netlify' ? 'local-development-only' : '');
    if (!secret) throw new Error('Storage secret is not configured');
    const store = await createLeadStore();
    try {
      const result = await saveLead(store, validated.data, secret);
      return Response.json({ ok: true, duplicate: result.duplicate }, { status: result.duplicate ? 200 : 201, headers });
    } finally {
      if ('close' in store && typeof store.close === 'function') store.close();
    }
  } catch (error) {
    console.error('Lead persistence failed:', error instanceof Error ? error.name : 'UnknownError');
    return Response.json({ message: 'Не удалось отправить заявку. Ваши данные остались в форме — попробуйте ещё раз чуть позже.' }, { status: 503, headers });
  }
}
