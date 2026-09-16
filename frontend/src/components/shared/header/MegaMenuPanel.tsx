// src/components/shared/header/MegaMenuPanel.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import type { MegaMenuItem } from './navItems';

interface MegaMenuPanelProps {
  items: MegaMenuItem[];
  visible: boolean;
}

const MegaMenuPanel = ({ items, visible }: MegaMenuPanelProps) => (
  <div
    className={`
      absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72
      bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden
      transition-all duration-200 origin-top z-50
      ${visible ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
    `}
  >
    <div className="p-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-start gap-3 px-4 py-3 rounded-xl group transition-colors"
          style={{ color: 'inherit' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#D4EDE5')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <span
            className="mt-0.5 w-8 h-8 flex items-center justify-center rounded-lg shrink-0 text-white"
            style={{ backgroundColor: '#1A5C43' }}
          >
            {item.icon}
          </span>
          <div>
            <p className="font-semibold text-sm transition-colors" style={{ color: '#001A4D' }}>
              {item.label}
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{item.description}</p>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default MegaMenuPanel;