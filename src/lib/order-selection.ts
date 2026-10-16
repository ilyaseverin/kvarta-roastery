'use client';

import type { Interest } from './lead';
export type OrderSelection = { interest: Interest; product?: string };
let current: OrderSelection | null = null;
const listeners = new Set<(selection: OrderSelection) => void>();
export function selectOrder(selection: OrderSelection) {
  current = selection;
  listeners.forEach(listener => listener(selection));
}
export function subscribeToOrder(listener: (selection: OrderSelection) => void) {
  listeners.add(listener);
  // A product can be selected before the below-the-fold form is hydrated.
  if (current) listener(current);
  return () => { listeners.delete(listener); };
}
