import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyRound, Shield, Check, Trash2, Cpu, Globe } from 'lucide-react';
import { getStoredApiKey, saveStoredApiKey } from '../services/ai';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e?.preventDefault();
    saveStoredApiKey(apiKey);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleClear = () => {
    setApiKey('');
    saveStoredApiKey('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Application Settings & AI Config</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure client-side LLM inference parameters and local data storage.
        </p>
      </div>

      {/* Google Gemini API Key Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-teal-800 font-bold text-sm">
          <Cpu className="w-5 h-5 text-teal-600" />
          <span>Google Gemini API Key (Direct Browser Inference)</span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Provide your personal Google Gemini API key to enable advanced generative clinical breakdowns.
          <strong className="text-slate-800 block mt-1">
            Privacy Assurance: Your key is stored ONLY in your browser's localStorage and is NEVER sent to any remote backend server.
          </strong>
        </p>

        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700">Gemini API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="mt-1 w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              Save Key to LocalStorage
            </button>

            {apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-semibold rounded-xl transition flex items-center space-x-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Key</span>
              </button>
            )}

            {savedSuccess && (
              <span className="text-xs text-emerald-600 font-bold flex items-center space-x-1">
                <Check className="w-4 h-4" />
                <span>Saved!</span>
              </span>
            )}
          </div>
        </form>

        <div className="p-3 bg-teal-50/70 border border-teal-100 rounded-xl text-xs text-teal-900 leading-relaxed">
          <strong>No API key? No problem!</strong> If you don't paste a key, the app automatically runs our built-in 
          <strong> rule-based medical extraction engine</strong> with regex test finders, reference range evaluators, and bilingual template summaries.
        </div>
      </div>

      {/* Language Preference */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
          <Globe className="w-5 h-5 text-teal-600" />
          <span>System Display Language</span>
        </div>
        <p className="text-xs text-slate-600">Choose between English and தமிழ் (Tamil) for all UI controls and clinical explanations.</p>
        <div className="flex gap-3">
          <button
            onClick={() => {
              i18n.changeLanguage('en');
              localStorage.setItem('ahc_lang', 'en');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl border transition ${
              i18n.language === 'en' ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            English
          </button>
          <button
            onClick={() => {
              i18n.changeLanguage('ta');
              localStorage.setItem('ahc_lang', 'ta');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl border transition ${
              i18n.language === 'ta' ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            தமிழ் (Tamil)
          </button>
        </div>
      </div>
    </div>
  );
}
