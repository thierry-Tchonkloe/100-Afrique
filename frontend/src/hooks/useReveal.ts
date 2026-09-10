// src/hooks/useReveal.ts
"use client";
import { useState, useEffect, useCallback } from 'react';

/** Hook générique de reveal-on-scroll (IntersectionObserver). */
export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.1) {
  const [el, setEl] = useState<T | null>(null);
  const [visible, setVisible] = useState(false);
  const ref = useCallback((node: T | null) => setEl(node), []);

  useEffect(() => {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [el, threshold]);

  return { ref, visible };
}