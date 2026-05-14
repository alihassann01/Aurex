'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

interface EmergencyBannerProps {
  message: string;
}

export function EmergencyBanner({ message }: EmergencyBannerProps) {
  const { emergencyDismissed, dismissEmergency } = useUIStore();

  if (emergencyDismissed) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-red-600 flex items-center justify-center p-6 animate-fade-in" role="alert" aria-live="assertive">
      <button
        onClick={dismissEmergency}
        className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
        aria-label="Dismiss emergency alert"
      >
        <X className="h-6 w-6" />
      </button>
      <div className="text-center max-w-2xl">
        <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-8 w-8 text-white animate-pulse" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Emergency Alert</h2>
        <p className="text-xl text-red-100 leading-relaxed">{message}</p>
        <button
          onClick={dismissEmergency}
          className="mt-8 px-8 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors"
        >
          Acknowledge & Dismiss
        </button>
      </div>
    </div>
  );
}
