import React, { useState } from 'react';
import { 
  FileText, 
  AlertCircle, 
  Pill, 
  Calendar, 
  User, 
  Share2, 
  Printer, 
  Download, 
  Languages, 
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileSignature
} from 'lucide-react';
import MedicalDisclaimer from './MedicalDisclaimer';

export default function RecordDetailModal({ record, onClose, onShare }) {
  const [langTab, setLangTab] = useState('en'); // 'en' or 'ta'
  const [showRawOcr, setShowRawOcr] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!record) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const textToCopy = langTab === 'ta' ? (record.summaryTa || record.summaryEn) : record.summaryEn;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-teal-700 to-cyan-800 text-white flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white">
                {record.recordType?.replace('_', ' ')}
              </span>
              <span className="text-xs text-teal-100 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 inline mr-1" />
                {record.date}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {record.title || 'Medical Record Summary'}
            </h3>
            {record.doctorName && (
              <p className="text-xs text-teal-100 flex items-center space-x-1">
                <User className="w-3.5 h-3.5 inline mr-1" />
                {record.doctorName} {record.facility ? `• ${record.facility}` : ''}
              </p>
            )}
          </div>

          {/* Action buttons (Print, Close) */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition text-xs flex items-center space-x-1"
              title="Print / Save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-rose-500/80 text-white transition"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Language Toggle for Summary */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-sm font-semibold text-slate-800">
                <Languages className="w-4 h-4 text-teal-600" />
                <span>Plain-Language Clinical Explanation</span>
              </div>
              <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
                <button
                  onClick={() => setLangTab('en')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                    langTab === 'en' ? 'bg-teal-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLangTab('ta')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                    langTab === 'ta' ? 'bg-teal-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  தமிழ் (Tamil)
                </button>
              </div>
            </div>

            <div className="text-slate-700 text-sm leading-relaxed p-3.5 bg-white rounded-lg border border-slate-100 shadow-2xs whitespace-pre-line">
              {langTab === 'en' ? record.summaryEn : (record.summaryTa || record.summaryEn)}
            </div>

            <div className="mt-2.5 flex justify-end">
              <button
                onClick={handleCopySummary}
                className="text-xs text-teal-700 hover:text-teal-800 font-medium flex items-center space-x-1 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied to clipboard!' : 'Copy Explanation'}</span>
              </button>
            </div>
          </div>

          {/* Abnormal Parameters Alert (if any) */}
          {record.abnormalFlags && record.abnormalFlags.length > 0 && (
            <div className="border border-rose-200 bg-rose-50/70 rounded-xl p-4">
              <div className="flex items-center space-x-2 text-rose-800 font-semibold text-sm mb-3">
                <AlertCircle className="w-4.5 h-4.5 text-rose-600" />
                <span>Abnormal Values Detected ({record.abnormalFlags.length})</span>
              </div>
              <div className="grid gap-2.5">
                {record.abnormalFlags.map((flag, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-rose-100 shadow-2xs">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-800">
                        {langTab === 'ta' && flag.parameterTa ? flag.parameterTa : flag.parameter}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-700">
                        {flag.status}: {flag.value}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Expected range: {flag.normalRange}
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5 leading-snug">
                      {langTab === 'ta' && flag.explanationTa ? flag.explanationTa : flag.explanationEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medications Extracted */}
          {record.medications && record.medications.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 text-sm font-semibold text-slate-800 mb-3">
                <Pill className="w-4 h-4 text-teal-600" />
                <span>Prescribed Medications ({record.medications.length})</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {record.medications.map((med, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-xl shadow-2xs">
                    <div className="font-semibold text-sm text-slate-900">{med.name}</div>
                    <div className="text-xs font-medium text-teal-700 mt-0.5">
                      {med.dosage} • {med.frequency}
                    </div>
                    {med.instructions && (
                      <div className="text-[11px] text-slate-500 mt-1">
                        Instructions: {med.instructions}
                      </div>
                    )}
                    {(med.purposeEn || med.purposeTa) && (
                      <div className="text-xs text-slate-600 mt-1.5 italic bg-white p-1.5 rounded border border-slate-100">
                        Purpose: {langTab === 'ta' && med.purposeTa ? med.purposeTa : med.purposeEn}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Test results table if any */}
          {record.tests && record.tests.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-2">Test Parameters</h4>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-slate-600">Test</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-600">Result</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-600">Reference Range</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {record.tests.map((t, idx) => (
                      <tr key={idx} className={t.status === 'HIGH' || t.status === 'LOW' ? 'bg-rose-50/30' : ''}>
                        <td className="px-3 py-2 font-medium text-slate-800">{t.name}</td>
                        <td className="px-3 py-2 font-semibold text-slate-700">{t.value} {t.unit}</td>
                        <td className="px-3 py-2 text-slate-500">{t.range}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.status === 'HIGH' || t.status === 'LOW' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Collapsible Raw OCR text */}
          {record.ocrText && (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setShowRawOcr(!showRawOcr)}
                className="w-full px-4 py-2.5 bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                <span>Raw OCR Extracted Text</span>
                {showRawOcr ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showRawOcr && (
                <div className="p-3 bg-slate-900 text-slate-200 text-xs font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {record.ocrText}
                </div>
              )}
            </div>
          )}

          <MedicalDisclaimer compact={true} />
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          {onShare && (
            <button
              onClick={() => onShare(record)}
              className="px-3 py-1.5 text-xs font-semibold text-teal-700 border border-teal-300 bg-white hover:bg-teal-50 rounded-lg flex items-center space-x-1.5 transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share with Doctor</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-auto px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
