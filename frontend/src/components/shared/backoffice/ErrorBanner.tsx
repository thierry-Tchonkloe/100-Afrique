// src/components/shared/backoffice/ErrorBanner.tsx
"use client";
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

const ErrorBanner = ({ message, onRetry, onDismiss }: ErrorBannerProps) => (
  <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
    <AlertCircle size={16} className="shrink-0" />
    {message}
    {onRetry && (
      <button onClick={onRetry} className="ml-auto underline text-red-600 hover:text-red-800">
        Réessayer
      </button>
    )}
    {onDismiss && !onRetry && (
      <button onClick={onDismiss} className="ml-auto text-red-400 hover:text-red-600">✕</button>
    )}
  </div>
);

export default ErrorBanner;