import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ScanLine, 
  Sparkles, 
  Activity, 
  Clock, 
  ShieldCheck, 
  HeartHandshake, 
  ArrowRight, 
  Stethoscope, 
  Languages, 
  CheckCircle2,
  FileText,
  Lock,
  ChevronRight
} from 'lucide-react';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

export default function Home() {
  const { t, i18n } = useTranslation();

  return (
    <div className="space-y-16 py-8">
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>{t('hero.badge')}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          {i18n.language === 'ta' ? (
            <>
              உங்கள் தனிப்பட்ட மற்றும் குடும்ப <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">AI சுகாதார கோபைலட்</span>
            </>
          ) : (
            <>
              Next-Gen Medical Records with <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">AI Clinical Intelligence</span>
            </>
          )}
        </h1>

        <p className="max-w-2xl mx-auto text-slate-600 text-base sm:text-lg leading-relaxed">
          {t('hero.subtitle')}
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/quick-scan"
            className="px-6 py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition transform flex items-center space-x-2"
          >
            <ScanLine className="w-5 h-5" />
            <span>{t('hero.quickScanCta')}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

          <Link
            to="/signup"
            className="px-6 py-3.5 bg-white text-slate-800 hover:bg-slate-50 font-bold text-sm sm:text-base rounded-2xl border border-slate-200 shadow-sm hover:shadow transition flex items-center space-x-2"
          >
            <span>{t('hero.signupCta')}</span>
          </Link>

          <Link
            to="/doctor"
            className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-2xl transition flex items-center space-x-2"
          >
            <Stethoscope className="w-4 h-4 text-cyan-700" />
            <span>{t('hero.doctorCta')}</span>
          </Link>
        </div>

        {/* Trust bullets */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>No Registration Needed for Quick Scan</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Languages className="w-4 h-4 text-teal-600" />
            <span>100% English & தமிழ் (Tamil) Bilingual</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Lock className="w-4 h-4 text-teal-600" />
            <span>Private In-Browser Offline Storage (IndexedDB)</span>
          </span>
        </div>
      </section>

      {/* 3 Real-World Use Cases Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Tailored for Three Real-World Healthcare Workflows
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Engineered to empower individuals, hospital staff, and consulting doctors alike.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mb-4">
                <ScanLine className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                Use Case #1
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2">
                Everyday Individuals: Instant Quick Scan
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Scan prescriptions, lab reports or discharge files without signing up. Get instant plain-language summaries in English and Tamil with abnormal indicators highlighted.
              </p>
            </div>
            <Link
              to="/quick-scan"
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center space-x-1 pt-4"
            >
              <span>Try Quick Scan Now</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 mb-4">
                <Stethoscope className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                Use Case #2
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2">
                Hospitals & Clinics: Doctor Portal
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Front-desk and doctors look up patients by Name, Phone, or 14-digit ABHA ID. Review extracted vitals, add clinical notes, and upload records directly on behalf of patients.
              </p>
            </div>
            <Link
              to="/doctor"
              className="text-xs font-bold text-cyan-700 hover:text-cyan-800 flex items-center space-x-1 pt-4"
            >
              <span>Access Doctor Portal</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                Use Case #3
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2">
                Registered Patients: Lifetime Timeline
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Maintain all medical documents in a single chronological FHIR timeline. Track active prescriptions and chat with an AI assistant grounded strictly in your personal records.
              </p>
            </div>
            <Link
              to="/timeline"
              className="text-xs font-bold text-indigo-700 hover:text-indigo-800 flex items-center space-x-1 pt-4"
            >
              <span>View Health Timeline</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ABDM & FHIR Standards Architecture Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300 bg-teal-900/50 px-3 py-1 rounded-full border border-teal-500/30">
              ABDM & HL7 FHIR R4 Ready
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              Standardized Interoperability with Single-Click FHIR Bundles
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every document is converted into standard FHIR resources: Patient, Observation, MedicationStatement, Condition, and DocumentReference with 14-digit ABHA identifier integration.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/timeline"
              className="px-5 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow transition text-center"
            >
              Export Sample FHIR Bundle
            </Link>
            <Link
              to="/quick-scan"
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition text-center"
            >
              Scan New Document
            </Link>
          </div>
        </div>
      </section>

      <MedicalDisclaimer />
    </div>
  );
}
