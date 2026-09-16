// src/components/partners/contact/PartnersDirectContact.tsx
"use client";
import React from 'react';
import { WaveMark, MissiveMark, RingMark } from '@/components/icons/CustomIcons';

const PartnersDirectContact = () => (
  <div className="group w-full lg:w-1/3 relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-10px_rgba(0,0,0,0.5)]">
    <div className="absolute inset-0 bg-white/10 backdrop-blur-xl group-hover:bg-white/15 transition-all duration-500" />
    <div className="relative z-10 p-8 md:p-10 space-y-10 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-2xl font-bold text-white mb-8">Contact Direct</h3>
        <div className="space-y-6">
          <a href="tel:+33774454001" className="flex items-center gap-4 group/link">
            <div className="p-4 bg-white/10 rounded-full group-hover/link:bg-it-gold/20 transition-colors">
              <RingMark size={26} className="shrink-0" style={{ color: '#C8A84B' }} />
            </div>
            <span className="font-semibold text-white group-hover/link:text-it-gold transition-colors">
              +33 774 454 001
            </span>
          </a>
          <a href="mailto:regie@waxeho.com" className="flex items-center gap-4 group/link">
            <div className="p-4 bg-white/10 rounded-full group-hover/link:bg-it-gold/20 transition-colors">
              <MissiveMark size={26} className="shrink-0" style={{ color: '#C8A84B' }} />
            </div>
            <span className="font-semibold text-white group-hover/link:text-it-gold transition-colors">
              regie@waxeho.com
            </span>
          </a>
        </div>
      </div>

      <a
        href="https://wa.me/33774454001"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 bg-[#25D366] text-white font-bold py-5 rounded-xl shadow-lg hover:scale-[1.03] hover:shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition-all duration-300 active:scale-95"
      >
        <WaveMark size={24} />
        WhatsApp Business
      </a>
    </div>
  </div>
);

export default PartnersDirectContact;