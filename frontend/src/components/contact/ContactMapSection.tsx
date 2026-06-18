// src/components/contact/ContactMapSection.tsx
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';

const COTONOU_LAT = 6.3654;
const COTONOU_LNG = 2.4183;

const MAP_SRC = `https://www.openstreetmap.org/export/embed.html?bbox=${COTONOU_LNG - 0.04}%2C${COTONOU_LAT - 0.03}%2C${COTONOU_LNG + 0.04}%2C${COTONOU_LAT + 0.03}&layer=mapnik&marker=${COTONOU_LAT}%2C${COTONOU_LNG}`;

const ContactMapSection = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-0 bg-white">
      <div
        className="w-full relative"
        style={{
          height: '420px',
          background: '#E8EFF4',
          transition: 'opacity 0.8s 0.1s, transform 0.8s 0.1s',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
        }}
      >
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-100 animate-pulse">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full mx-auto mb-3 animate-spin border-4 border-slate-200" style={{ borderTopColor: '#1A5C43' }} />
              <p className="text-slate-400 text-sm font-medium">Chargement de la carte…</p>
            </div>
          </div>
        )}

        <iframe
          title="Localisation iTourisme — Cotonou, Bénin"
          src={MAP_SRC}
          width="100%"
          height="100%"
          style={{ border: 0, display: 'block' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setMapLoaded(true)}
          className="w-full h-full"
        />

        <div
          className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg"
          style={{ background: 'rgba(26,92,67,0.95)', backdropFilter: 'blur(4px)' }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white text-xs font-bold">iTourisme — Cotonou, Bénin</span>
        </div>

        <a
          href={`https://www.openstreetmap.org/?mlat=${COTONOU_LAT}&mlon=${COTONOU_LNG}#map=15/${COTONOU_LAT}/${COTONOU_LNG}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold shadow-md transition-all hover:shadow-lg"
          style={{ background: 'white', color: '#1A5C43' }}
        >
          <ExternalLink size={12} />
          Agrandir la carte
        </a>
      </div>
    </section>
  );
};

export default ContactMapSection;