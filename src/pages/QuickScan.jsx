import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ScanLine, 
  UploadCloud, 
  Camera, 
  FileText, 
  Sparkles, 
  Languages, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Copy,
  Printer,
  ChevronRight
} from 'lucide-react';
import { performOCR } from '../services/ocr';
import { analyzeMedicalTextWithAI } from '../services/ai';
import { getDB, logAudit } from '../services/db';
import { useAuth } from '../context/AuthContext';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

export default function QuickScan() {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState('');
  const [ocrProgress, setOcrProgress] = useState(0);

  // Analysis result
  const [rawOcrText, setRawOcrText] = useState('');
  const [isEditingOcr, setIsEditingOcr] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [langTab, setLangTab] = useState('en'); // 'en' or 'ta'
  const [saveSuccess, setSaveSuccess] = useState(false);

  // File selection
  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 10 * 1024 * 1024) {
      alert('Please upload files under 10MB.');
      return;
    }

    setFile(selected);
    setAnalysisResult(null);
    setSaveSuccess(false);

    if (selected.type.startsWith('image/')) {
      const url = URL.createObjectURL(selected);
      setFilePreview(url);
    } else {
      setFilePreview(null);
    }
  };

  // Run OCR & Analysis
  const runScanProcess = async (textToAnalyze = null) => {
    setIsProcessing(true);
    setSaveSuccess(false);

    try {
      let ocrOutput = textToAnalyze;

      if (!ocrOutput) {
        if (!file) return;
        setProcessStatus('Scanning document with Tesseract OCR (eng + tam)...');
        ocrOutput = await performOCR(file, ({ status, progress }) => {
          setProcessStatus(status);
          setOcrProgress(progress);
        });
        setRawOcrText(ocrOutput);
      }

      setProcessStatus('Analyzing clinical entities, abnormal flags & creating bilingual summaries...');
      const clinicalData = await analyzeMedicalTextWithAI(ocrOutput);
      setAnalysisResult(clinicalData);

      await logAudit({
        userId: currentUser?.id || 'anonymous',
        userName: currentUser?.name || 'Quick Scan Guest',
        action: 'QUICK_SCAN_PERFORMED',
        details: `Processed document of type: ${clinicalData.recordType || 'unknown'}`
      });
    } catch (err) {
      console.error('Scan processing error:', err);
      alert('Failed to process document. Please ensure the file is an image or valid PDF.');
    } finally {
      setIsProcessing(false);
      setProcessStatus('');
    }
  };

  // Save to logged-in user's timeline
  const handleSaveToTimeline = async () => {
    if (!currentUser) {
      // Prompt user to signup with state preserved
      sessionStorage.setItem('ahc_pending_record', JSON.stringify({
        ...analysisResult,
        ocrText: rawOcrText,
        fileName: file?.name || 'QuickScan_Document.jpg'
      }));
      navigate('/signup?from=quick-scan');
      return;
    }

    try {
      const db = await getDB();
      const recId = 'rec_' + Date.now();
      const newRec = {
        id: recId,
        patientId: currentUser.id,
        title: analysisResult.recordType === 'prescription' ? 'Outpatient Prescription' : 'Clinical Diagnostic Report',
        recordType: analysisResult.recordType || 'lab_report',
        date: analysisResult.recordDate || new Date().toISOString().split('T')[0],
        doctorName: analysisResult.doctorName || 'Consulting Physician',
        fileName: file?.name || 'Uploaded_Document',
        ocrText: rawOcrText,
        medications: analysisResult.medications || [],
        tests: analysisResult.tests || [],
        abnormalFlags: analysisResult.abnormalFlags || [],
        diagnoses: analysisResult.diagnoses || [],
        summaryEn: analysisResult.summaryEn,
        summaryTa: analysisResult.summaryTa,
        extractedVia: analysisResult.extractedVia || 'quick_scan'
      };

      await db.put('records', newRec);
      await db.put('timeline_events', {
        id: `evt_${recId}`,
        patientId: currentUser.id,
        recordId: recId,
        date: newRec.date,
        title: newRec.title,
        recordType: newRec.recordType,
        doctorName: newRec.doctorName,
        summaryEn: newRec.summaryEn,
        summaryTa: newRec.summaryTa,
        abnormalCount: (newRec.abnormalFlags || []).length,
        medCount: (newRec.medications || []).length
      });

      setSaveSuccess(true);
      await logAudit({
        userId: currentUser.id,
        userName: currentUser.name,
        action: 'RECORD_SAVED',
        details: `Quick Scan result saved to patient timeline: ${recId}`
      });
    } catch (e) {
      console.error('Failed to save record:', e);
      alert('Could not save record to database.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Real-World Use Case #1: Instant Scan Without Login</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          {t('quickScan.title')}
        </h1>
        <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          {t('quickScan.subtitle')}
        </p>
      </div>

      {/* Upload Zone */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-teal-200/80 p-6 sm:p-10 shadow-sm text-center hover:border-teal-400 transition-all">
        <input
          type="file"
          id="fileUpload"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <label htmlFor="fileUpload" className="cursor-pointer block">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 shadow-inner">
            <UploadCloud className="w-8 h-8" />
          </div>
          <span className="text-base font-semibold text-slate-800 block">
            {file ? file.name : t('quickScan.uploadPrompt')}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            {t('quickScan.supportedFormats')}
          </span>
        </label>

        {file && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => runScanProcess()}
              disabled={isProcessing}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold text-sm rounded-xl shadow-md transition disabled:opacity-50 flex items-center space-x-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Document...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run OCR & Explain Now</span>
                </>
              )}
            </button>
            <label
              htmlFor="fileUpload"
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer"
            >
              Change File
            </label>
          </div>
        )}

        {/* Processing State Bar */}
        {isProcessing && (
          <div className="mt-6 max-w-md mx-auto space-y-2">
            <div className="flex justify-between text-xs text-slate-600 font-medium">
              <span>{processStatus}</span>
              <span>{Math.round(ocrProgress * 100)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 transition-all duration-300"
                style={{ width: `${Math.max(10, Math.round(ocrProgress * 100))}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Analysis Results View */}
      {analysisResult && (
        <div className="mt-10 space-y-6 animate-in fade-in duration-300">
          
          {/* Top Banner & Language Selector */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
                  Analysis Complete • {analysisResult.recordType}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Document Clinical Breakdown
                </h2>
                <p className="text-xs text-slate-500">
                  Doctor: {analysisResult.doctorName || 'Identified Clinic'} • Date: {analysisResult.recordDate}
                </p>
              </div>

              {/* Language Switch Pills */}
              <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100/70 p-1">
                <button
                  onClick={() => setLangTab('en')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
                    langTab === 'en'
                      ? 'bg-white text-teal-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  English Explanation
                </button>
                <button
                  onClick={() => setLangTab('ta')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
                    langTab === 'ta'
                      ? 'bg-white text-teal-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  தமிழில் விளக்கம் (Tamil)
                </button>
              </div>
            </div>

            {/* Plain-Language Explanation */}
            <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 mb-2 flex items-center space-x-1.5">
                <Languages className="w-4 h-4 text-teal-600" />
                <span>{langTab === 'ta' ? 'தமிழில் எளிய விளக்கம்' : 'Plain-Language Medical Explanation'}</span>
              </h3>
              <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line font-normal">
                {langTab === 'ta'
                  ? (analysisResult.summaryTa || analysisResult.summaryEn)
                  : analysisResult.summaryEn}
              </p>
            </div>

            {/* Abnormal Values Flag Card */}
            {analysisResult.abnormalFlags && analysisResult.abnormalFlags.length > 0 && (
              <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl">
                <div className="flex items-center space-x-2 text-rose-800 font-bold text-sm mb-3">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>{t('quickScan.abnormalFlags')} ({analysisResult.abnormalFlags.length})</span>
                </div>
                <div className="space-y-2">
                  {analysisResult.abnormalFlags.map((flag, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-rose-100 text-xs">
                      <div className="flex justify-between items-center font-semibold text-slate-800">
                        <span>{langTab === 'ta' && flag.parameterTa ? flag.parameterTa : flag.parameter}</span>
                        <span className="text-rose-700 bg-rose-100 px-2 py-0.5 rounded text-[11px] font-bold">
                          {flag.status}: {flag.value}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs mt-1">
                        {langTab === 'ta' && flag.explanationTa ? flag.explanationTa : flag.explanationEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Medications Detected */}
            {analysisResult.medications && analysisResult.medications.length > 0 && (
              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase text-slate-600 tracking-wider mb-2">
                  {t('quickScan.medications')}
                </h4>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {analysisResult.medications.map((m, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                      <div className="font-bold text-slate-900">{m.name}</div>
                      <div className="text-teal-700 font-semibold mt-0.5">{m.dosage} • {m.frequency}</div>
                      {(m.purposeEn || m.purposeTa) && (
                        <div className="text-slate-500 mt-1 italic">
                          {langTab === 'ta' && m.purposeTa ? m.purposeTa : m.purposeEn}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Raw OCR Text with Edit & Re-Analyze Option */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>{t('quickScan.ocrRaw')}</span>
              </h3>
              <button
                onClick={() => setIsEditingOcr(!isEditingOcr)}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 underline cursor-pointer"
              >
                {isEditingOcr ? 'Cancel Editing' : t('quickScan.editOcr')}
              </button>
            </div>

            {isEditingOcr ? (
              <div className="space-y-3">
                <textarea
                  value={rawOcrText}
                  onChange={(e) => setRawOcrText(e.target.value)}
                  rows={8}
                  className="w-full text-xs font-mono p-3 border border-teal-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
                <button
                  onClick={() => runScanProcess(rawOcrText)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
                >
                  Re-Analyze Corrected Text
                </button>
              </div>
            ) : (
              <div className="max-h-40 overflow-y-auto bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-wrap">
                {rawOcrText}
              </div>
            )}
          </div>

          {/* Call to Action: Save and Build Timeline */}
          <div className="bg-gradient-to-r from-teal-900 to-cyan-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-xl font-bold">
                {currentUser ? 'Save this report to your profile' : 'Sign up to build your lifetime health timeline'}
              </h3>
              <p className="text-xs sm:text-sm text-teal-200 max-w-xl">
                Track prescriptions, get reminders, view blood sugar trends, and chat with your AI records assistant anytime.
              </p>
            </div>

            {saveSuccess ? (
              <div className="flex items-center space-x-2 px-5 py-3 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-400/40 text-sm font-semibold">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Saved to Timeline!</span>
              </div>
            ) : (
              <button
                onClick={handleSaveToTimeline}
                className="px-6 py-3 bg-white text-teal-900 hover:bg-teal-50 font-bold text-sm rounded-xl shadow-lg transition flex items-center space-x-2 cursor-pointer shrink-0"
              >
                <span>{currentUser ? 'Save to My Records' : 'Sign Up & Save'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      )}

      <MedicalDisclaimer />
    </div>
  );
}
