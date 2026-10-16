'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { captureAttribution } from '@/lib/attribution';
import { INTEREST_LABELS, validateLead, type Attribution, type FieldErrors, type Interest } from '@/lib/lead';
import { subscribeToOrder } from '@/lib/order-selection';

export function LeadForm() {
  const [interest, setInterest] = useState<Interest>('subscription');
  const [product, setProduct] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const form = useRef<HTMLFormElement>(null);
  const pending = useRef(false);
  const attribution = useRef<Attribution>({});
  useEffect(() => {
    attribution.current = captureAttribution();
    const query = new URLSearchParams(window.location.search);
    const initialInterest = query.get('interest') as Interest;
    if (Object.hasOwn(INTEREST_LABELS, initialInterest)) {
      setInterest(initialInterest);
      if (initialInterest === 'order') setProduct((query.get('product') || '').slice(0, 150));
    }
    return subscribeToOrder(detail => {
      setInterest(detail.interest); setProduct(detail.product || ''); setStatus('idle'); setMessage('');
    });
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const fields = new FormData(event.currentTarget);
    const comment = String(fields.get('comment') || '');
    const payload = {
      name: fields.get('name'), phone: fields.get('phone'), interest,
      comment: product ? `Выбранный кофе: ${product}.\n${comment}` : comment,
      attribution: { ...attribution.current, submit_url: window.location.href.slice(0, 2000) },
      website: fields.get('website'),
    };
    const validated = validateLead(payload);
    if (validated.errors) {
      setErrors(validated.errors); setStatus('idle');
      const field = Object.keys(validated.errors)[0];
      form.current?.querySelector<HTMLElement>(`[name="${field}"]`)?.focus();
      return;
    }
    setErrors({}); setStatus('sending'); setMessage(''); pending.current = true;
    try {
      const response = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(15_000) });
      const result = await response.json();
      if (!response.ok) {
        if (result.errors) setErrors(result.errors);
        throw new Error(result.message || 'Не удалось отправить заявку. Попробуйте ещё раз.');
      }
      setStatus('success');
      setMessage(result.duplicate ? 'Ваша заявка уже у нас. Вторую создавать не будем — менеджер вам перезвонит.' : 'Заявка у нас. Менеджер перезвонит, поможет с выбором и уточнит доставку.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error && !['TimeoutError', 'AbortError', 'TypeError'].includes(error.name) ? error.message : 'Связь прервалась. Данные остались в форме — попробуйте отправить ещё раз.');
    } finally { pending.current = false; }
  }

  return <form ref={form} onSubmit={submit} noValidate className="lead-form" aria-label="Заявка на обратный звонок" aria-busy={status === 'sending'}>
    <div className="form-row">
      <div className="field"><label htmlFor="request-name">Как вас зовут</label><input id="request-name" name="name" autoComplete="given-name" placeholder="Ваше имя" maxLength={80} required aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} onChange={() => errors.name && setErrors({ ...errors, name: undefined })} />{errors.name && <p className="field-error" id="name-error">{errors.name}</p>}</div>
      <div className="field"><label htmlFor="request-phone">Телефон</label><input id="request-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+375 29 123-45-67" maxLength={30} required aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'phone-error' : 'phone-hint'} onChange={() => errors.phone && setErrors({ ...errors, phone: undefined })} />{errors.phone ? <p className="field-error" id="phone-error">{errors.phone}</p> : <span className="field-hint" id="phone-hint">Белорусский номер для обратного звонка</span>}</div>
    </div>
    <fieldset className="interest-field"><legend>Что вас интересует?</legend><div className="interest-options">{(Object.keys(INTEREST_LABELS) as Interest[]).map(item => <label className={`interest-option ${interest === item ? 'selected' : ''}`} key={item}><input type="radio" name="interest" value={item} checked={interest === item} onChange={() => { setInterest(item); if (item !== 'order') setProduct(''); }} /><span>{INTEREST_LABELS[item]}</span></label>)}</div></fieldset>
    {product && <div className="selected-product"><span>Вы выбрали: {product}</span><button type="button" onClick={() => setProduct('')} aria-label="Убрать выбранный кофе">×</button></div>}
    <div className="field"><label htmlFor="request-comment">Комментарий <span>если хочется что-то уточнить</span></label><textarea id="request-comment" name="comment" rows={3} maxLength={product ? 1470 - product.length : 1500} placeholder="Например, какой кофе любите и как его готовите" aria-invalid={!!errors.comment} aria-describedby={errors.comment ? 'comment-error' : undefined} />{errors.comment && <p id="comment-error" className="field-error">{errors.comment}</p>}</div>
    <div className="honeypot" aria-hidden="true"><label htmlFor="request-website">Сайт</label><input id="request-website" name="website" tabIndex={-1} autoComplete="off" /></div>
    <button className="button submit-button" type="submit" disabled={status === 'sending' || status === 'success'}>{status === 'sending' ? 'Отправляем…' : status === 'success' ? 'Заявка отправлена' : status === 'error' ? 'Попробовать ещё раз' : 'Жду звонка'}<span aria-hidden="true">↗</span></button>
    <p className="form-note">Используем имя и телефон, чтобы связаться по вашей заявке.</p>
    <div className={`form-feedback ${status === 'error' ? 'feedback-error' : ''}`} role={status === 'error' ? 'alert' : 'status'} aria-live="polite">{message && <><strong>{status === 'success' ? 'Спасибо, познакомимся по телефону.' : 'Не получилось отправить.'}</strong><p>{message}</p>{status === 'success' && <button type="button" className="text-button" onClick={() => { setStatus('idle'); setMessage(''); }}>Вернуться к форме</button>}</>}</div>
  </form>;
}
