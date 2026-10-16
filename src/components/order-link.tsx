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
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#request`);
    document.getElementById('request')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    document.getElementById('request-name')?.focus({ preventScroll: true });
  }}>{children}</a>;
}
