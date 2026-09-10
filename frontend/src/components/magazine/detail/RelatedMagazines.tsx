// src/components/magazine/detail/RelatedMagazines.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import MagazineImage from '@/components/shared/MagazineImage';
import { stripHtml } from './magazineUtils';

interface RelatedItem {
  id: number;
  slug: string;
  title: string;
  source: string;
  excerpt?: string;
  coverImage?: string | null;
}

function RelatedMagazineCard({ item, delay = 0 }: { item: RelatedItem; delay?: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className="transition-all duration-700"
      style={{ transitionDelay: `${delay}ms`, opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)" }}
    >
      <Link
        href={`/magazine/${item.slug}`}
        className="group block overflow-hidden rounded-2xl bg-white border border-gray-100 hover:border-[#1A5C43]/20 hover:shadow-xl transition-all duration-300"
      >
        <div className="aspect-[16/10] overflow-hidden bg-gray-100">
          <MagazineImage
            src={item.coverImage}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] mb-2" style={{ color: "#B85C38" }}>{item.source}</p>
          <h3
            className="line-clamp-2 font-bold text-[14px] leading-snug mb-2 transition-colors"
            style={{ color: "#0D1A10" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#1A5C43")}
            onMouseLeave={e => (e.currentTarget.style.color = "#0D1A10")}
          >
            {item.title}
          </h3>
          <p className="line-clamp-2 text-xs leading-relaxed text-gray-400">{stripHtml(item.excerpt)}</p>
        </div>
      </Link>
    </div>
  );
}

const RelatedMagazines = ({ items }: { items: RelatedItem[] }) => {
  const { ref, visible } = useReveal<HTMLDivElement>(0.15);
  if (!items.length) return null;

  return (
    <section className="mt-16">
      <div
        ref={ref}
        className="flex items-end justify-between mb-10 transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)" }}
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] mb-2" style={{ color: "#B85C38" }}>— À découvrir aussi</p>
          <h2 className="text-3xl font-black leading-none" style={{ color: "#0D1A10", letterSpacing: "-0.03em" }}>
            Autres <span style={{ color: "#1A5C43" }}>magazines</span>
          </h2>
        </div>
        <Link
          href="/actualites"
          className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all"
          style={{ background: "#1A5C43" }}
          onMouseEnter={e => (e.currentTarget.style.background = "#B85C38")}
          onMouseLeave={e => (e.currentTarget.style.background = "#1A5C43")}
        >
          Voir tout <ArrowRight size={13} />
        </Link>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item, i) => <RelatedMagazineCard key={item.id} item={item} delay={i * 100} />)}
      </div>
    </section>
  );
};

export default RelatedMagazines;