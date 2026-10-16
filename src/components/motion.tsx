'use client';

import { useEffect } from 'react';

export function Motion() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>('.hero-photo');
    const photo = hero?.querySelector<HTMLElement>('.hero-image');
    const calendar = document.querySelector<HTMLElement>('.calendar-badge');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fine = window.matchMedia('(pointer: fine)');
    let frame = 0;
    function update() {
      frame = 0;
      if (!hero || !photo || reduced.matches || !fine.matches) { photo?.style.removeProperty('transform'); return; }
      const rect = hero.getBoundingClientRect();
      if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
        photo.style.transform = `translate3d(0, ${Math.min(window.scrollY * .055, 28)}px, 0) scale(1.07)`;
        if (window.scrollY > 100) calendar?.classList.add('is-friday');
      }
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    reduced.addEventListener('change', update);
    update();
    return () => { window.removeEventListener('scroll', onScroll); reduced.removeEventListener('change', update); if (frame) cancelAnimationFrame(frame); };
  }, []);
  return null;
}
