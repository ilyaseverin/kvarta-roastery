import { parsePhoneNumberFromString } from 'libphonenumber-js/max';

export const INTERESTS = ['subscription', 'order', 'question'] as const;
export type Interest = (typeof INTERESTS)[number];
export const INTEREST_LABELS: Record<Interest, string> = {
  subscription: 'Подписка', order: 'Разовый заказ', question: 'Вопрос',
};
export type Attribution = Record<string, string>;
export type LeadInput = { name: string; phone: string; interest: Interest; comment: string; attribution: Attribution };
export type FieldErrors = Partial<Record<'name' | 'phone' | 'interest' | 'comment', string>>;

export function normalizePhone(input: string): string | null {
  const phone = parsePhoneNumberFromString(input.trim(), { defaultCountry: 'BY', extract: false });
  return phone?.country === 'BY' && phone.isValid() ? phone.number : null;
}

export function validateLead(value: unknown): { data: LeadInput; errors?: never } | { errors: FieldErrors; data?: never } {
  const body = value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const phone = typeof body.phone === 'string' ? normalizePhone(body.phone) : null;
  const interest = body.interest as Interest;
  const comment = typeof body.comment === 'string' ? body.comment.trim() : '';
  const errors: FieldErrors = {};
  if (!name || name.length > 80) errors.name = 'Как к вам обращаться? Введите имя до 80 символов.';
  if (!phone) errors.phone = 'Введите белорусский номер, например +375 29 123-45-67.';
  if (!INTERESTS.includes(interest)) errors.interest = 'Выберите подписку, разовый заказ или вопрос.';
  if (comment.length > 1500) errors.comment = 'Сократите комментарий до 1500 символов.';
  if (Object.keys(errors).length) return { errors };
  const attribution: Attribution = {};
  const allowed = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id', 'yclid', 'fbclid', 'landing_url', 'submit_url', 'referrer'];
  if (body.attribution && typeof body.attribution === 'object' && !Array.isArray(body.attribution)) {
    for (const [key, item] of Object.entries(body.attribution)) {
      if (allowed.includes(key) && typeof item === 'string') attribution[key] = item.slice(0, key.endsWith('url') || key === 'referrer' ? 2000 : 300);
    }
  }
  return { data: { name, phone: phone!, interest, comment, attribution } };
}
