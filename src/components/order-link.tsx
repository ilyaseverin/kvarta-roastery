'use client';

import type { ReactNode } from 'react';
import type { Interest } from '@/lib/lead';
import { selectOrder } from '@/lib/order-selection';

export function OrderLink({ interest, product, children, className = 'button' }: { interest: Interest; product?: string; children: ReactNode; className?: string }) {
  const query = new URLSearchParams({ interest });
  if (product) query.set('product', product);
  return <a href={`?${query.toString()}#request`} className={className} onClick={event => {
    event.preventDefault();
    selectOrder({ interest, product });
    const target = new URL(window.location.href);
    target.searchParams.set('interest', interest);
    if (product) target.searchParams.set('product', product); else target.searchParams.delete('product');
    target.hash = 'request';
    window.history.replaceState(null, '', target);
    document.getElementById('request')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    document.getElementById('request-name')?.focus({ preventScroll: true });
  }}>{children}</a>;
}
