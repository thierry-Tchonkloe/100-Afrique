// src/components/shared/backoffice/CategoryBadge.tsx
"use client";
import React from 'react';

interface CategoryBadgeProps {
  category: { name: string; color?: string };
}

const CategoryBadge = ({ category }: CategoryBadgeProps) => (
  <span
    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
    style={{
      backgroundColor: `${category.color}15`,
      color: category.color,
      borderColor: `${category.color}40`,
    }}
  >
    {category.name}
  </span>
);

export default CategoryBadge;