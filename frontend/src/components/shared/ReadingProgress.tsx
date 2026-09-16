// src/components/shared/ReadingProgress.tsx
"use client";
import React, { useEffect, useState } from 'react';

const ReadingProgress = () => {
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      setP(el.scrollHeight > el.clientHeight ? (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100 : 0);
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[3px]" style={{ background: 'rgba(0,0,0,0.07)' }}>
      <div
        className="h-full rounded-full"
        style={{ width: `${p}%`, background: 'linear-gradient(to right, #1A5C43, #C8A84B)' }}
      />
    </div>
  );
};

export default ReadingProgress;