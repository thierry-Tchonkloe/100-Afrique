// src/components/shared/DateRange.tsx
"use client";
import React from 'react';

interface DateRangeProps {
  startDate?: string;
  endDate?: string;
}

const DateRange = ({ startDate, endDate }: DateRangeProps) => {
  if (!startDate) return null;
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  const fmt = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  if (!end || start.toDateString() === end.toDateString()) return <span>{fmt(start)}</span>;
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear())
    return <span>{start.getDate()} – {fmt(end)}</span>;
  return <span>{fmt(start)} – {fmt(end)}</span>;
};

export default DateRange;