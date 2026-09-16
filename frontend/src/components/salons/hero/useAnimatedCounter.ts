// src/components/salons/hero/useAnimatedCounter.ts
"use client";
import { useEffect, useRef, useState } from 'react';

/**
 * Anime un compteur de 0 à `target` une fois que `visible` passe à true.
 * Ne redémarre jamais (via `started` ref) — même comportement que l'original.
 */
export function useAnimatedCounter(target: number, visible: boolean, duration = 1600) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!visible || started.current) return;
    started.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, target, duration]);

  return count;
}