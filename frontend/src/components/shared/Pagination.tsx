// src/components/shared/Pagination.tsx
"use client";
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

function getPages(currentPage: number, totalPages: number): (number | '...')[] {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages: (number | '...')[] = [1];
  if (currentPage > 3) pages.push('...');
  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
  if (currentPage < totalPages - 2) pages.push('...');
  pages.push(totalPages);
  return pages;
}

const Pagination = ({ currentPage, totalPages, total, onPageChange }: PaginationProps) => (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-gray-100">
    <p className="text-xs text-gray-400 order-2 sm:order-1">
      Page {currentPage} sur {totalPages} — {total} résultat{total > 1 ? 's' : ''}
    </p>
    <div className="flex items-center gap-1.5 order-1 sm:order-2 flex-wrap justify-center">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={15} />
      </button>
      {getPages(currentPage, totalPages).map((page, idx) =>
        page === '...' ? (
          <span key={`dots-${idx}`} className="px-1 text-gray-400 text-sm select-none">…</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className="w-9 h-9 rounded-xl text-sm font-bold transition-all border"
            style={currentPage === page
              ? { background: '#1A5C43', color: '#fff', borderColor: '#1A5C43', boxShadow: '0 2px 8px rgba(26,92,67,0.3)' }
              : { background: '#fff', color: '#6B7280', borderColor: '#E5E7EB' }}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={15} />
      </button>
    </div>
  </div>
);

export default Pagination;