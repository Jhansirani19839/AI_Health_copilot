import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, Lock, HeartHandshake } from 'lucide-react';

export default function MedicalDisclaimer({ compact = false }) {
  const { t } = useTranslation();

  if (compact) {
    return (
      <div className="bg-amber-50/90 border border-amber-200/80 rounded-lg p-3 text-xs text-amber-900 flex items-start space-x-2 my-2">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-semibold">Informational only:</span> {t('disclaimer.text')}
        </p>
      </div>
    );
  }

  return (
    <footer className="mt-12 border-t border-slate-200 bg-slate-50/80 py-8 px-4 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-amber-50/70 border border-amber-200/70 text-amber-900">
          <div className="flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-semibold text-amber-950 text-sm">Clinical Safety & Non-Diagnostic Notice</h5>
              <p className="mt-0.5 text-xs text-amber-800 leading-relaxed">
                {t('disclaimer.text')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-slate-500 text-xs gap-3">
          <div className="flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-teal-600" />
            <span>{t('disclaimer.privacy')}</span>
          </div>
          <div className="flex items-center space-x-1 text-slate-400">
            <span>Built with care for Altrix Labs Hackathon</span>
            <HeartHandshake className="w-3.5 h-3.5 text-rose-500 inline ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
}
