// src/components/shared/backoffice/RichTextToolbar.tsx
"use client";
import React from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Link } from 'lucide-react';

const RichTextToolbar = () => (
  <div className="flex items-center gap-0.5 border-b border-slate-100 bg-slate-50/80 px-3 py-2 rounded-t-xl">
    {[Bold, Italic, Underline].map((Icon, i) => (
      <button key={i} className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white hover:text-slate-800 hover:shadow-sm">
        <Icon size={13} />
      </button>
    ))}
    <div className="mx-1.5 h-4 w-px bg-slate-200" />
    {[List, ListOrdered].map((Icon, i) => (
      <button key={i} className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white hover:text-slate-800 hover:shadow-sm">
        <Icon size={13} />
      </button>
    ))}
    <div className="mx-1.5 h-4 w-px bg-slate-200" />
    <button className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white hover:text-slate-800 hover:shadow-sm">
      <Link size={13} />
    </button>
  </div>
);

export default RichTextToolbar;