
import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const LoadingSpinner: React.FC<{ className?: string }> = ({ className = "h-16 w-16" }) => (
  <div className="flex justify-center items-center w-full py-16">
    <div className={`animate-spin rounded-full ${className} border-b-2 border-emerald-dark dark:border-emerald-light`}></div>
  </div>
);

export const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center text-center py-16 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg p-4">
    <AlertTriangle className="h-10 w-10 mb-4" />
    <p className="font-semibold">Terjadi Kesalahan</p>
    <p>{message}</p>
  </div>
);
