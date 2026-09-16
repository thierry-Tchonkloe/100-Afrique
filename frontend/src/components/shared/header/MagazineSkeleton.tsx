// src/components/shared/header/MagazineSkeleton.tsx
"use client";
import React from 'react';

const MagazineSkeleton = () => (
  <div className="flex flex-col rounded-xl overflow-hidden border border-gray-100">
    <div className="w-full aspect-video bg-gray-100 animate-pulse" />
    <div className="p-2.5 space-y-1.5">
      <div className="h-2.5 bg-gray-100 rounded animate-pulse" />
      <div className="h-2.5 bg-gray-100 rounded animate-pulse w-2/3" />
    </div>
  </div>
);

export default MagazineSkeleton;