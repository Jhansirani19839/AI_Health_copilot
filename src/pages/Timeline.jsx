import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { getDB, logAudit } from '../services/db';
import { convertToFHIRBundle, downloadFHIRJson } from '../services/fhir';
import { 
  Clock, 
  Calendar, 
  Filter, 
  FileText, 
  Plus, 
  Download, 
  AlertCircle, 
  Pill, 
  User, 
  CheckCircle2, 
  Search,
  Eye,
  Share2,
  Sparkles
} from 'lucide-react';
import RecordDetailModal from '../components/RecordDetailModal';
import QuickScan from './QuickScan';

export default function Timeline() {
  const { t, i18n } = useTranslation();
  const { currentUser, currentProfile, updatePatientProfile } = useAuth();
  
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [shareDoctorModal, setShareDoctorModal] = useState(false);
  const [doctorsList, setDoctorsList] = useState([]);
  const [shareSuccess, setShareSuccess] = useState('');

  // Load records and doctors
  useEffect(() => {
    async function loadData() {
      if (!currentUser) return;
      try {
        const db = await getDB();
        const recs = await db.getAllFromIndex('records', 'by_patient', currentUser.id);
        // Sort descending by date
        recs.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
        setRecords(recs);

        const docs = await db.getAllFromIndex('users', 'by_role', 'doctor');
        setDoctorsList(docs);
      } catch (err) {
        console.error('Failed to load timeline records', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentUser]);

  // Export FHIR Bundle
  const handleExportFHIR = () => {
    if (!records || records.length === 0) {
      alert('No health records to export.');
      return;
    }
    const bundle = convertToFHIRBundle({
      patientProfile: currentProfile,
      records
    });
    downloadFHIRJson(bundle, `FHIR_${currentProfile?.fullName || 'Patient'}_Records.json`);
    logAudit({
      userId: currentUser.id,
      userName: currentUser.name,
      action: 'FHIR_BUNDLE_EXPORTED',
      details: `Exported ${records.length} records as HL7 FHIR R4 Bundle`
    });
  };

  // Mock Link ABHA ID action
  const handleLinkAbha = async () => {
    const randomAbha = `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    await updatePatientProfile({ abhaId: randomAbha });
    alert(`ABHA ID successfully linked: ${randomAbha}`);
  };

  // Grant doctor access
  const handleShareWithDoctor = async (doctorId) => {
    try {
      const db = await getDB();
      const grantId = 'grant_' + Date.now();
      await db.put('access_grants', {
        id: grantId,
        patientId: currentUser.id,
        doctorId,
        grantedAt: new Date().toISOString(),
        scope: 'ALL_RECORDS',
        status: 'active'
      });
      setShareSuccess('Access successfully shared with doctor!');
      setTimeout(() => {
        setShareSuccess('');
        setShareDoctorModal(false);
      }, 1500);
    } catch (e) {
      console.error('Share grant failed', e);
    }
  };

  // Filter records
  const filteredRecords = records.filter(r => {
    const matchesType = filterType === 'ALL' || r.recordType === filterType;
    const matchesSearch = !searchQuery || 
      (r.title && r.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.doctorName && r.doctorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.ocrText && r.ocrText.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  // Calculate profile completeness
  const completeness = currentProfile ? [
    currentProfile.fullName,
    currentProfile.phone,
    currentProfile.bloodGroup,
    currentProfile.emergencyContact,
    currentProfile.allergies?.length > 0,
    currentProfile.chronicConditions?.length > 0
  ].filter(Boolean).length : 0;
  const completenessPercent = Math.round((completeness / 6) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner & ABHA Bar */}
      <div className="bg-gradient-to-r from-teal-800 to-cyan-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 text-teal-100 px-3 py-1 rounded-full">
              ABDM Verified Patient
            </span>
            <span className="text-xs text-teal-200">
              {currentProfile?.bloodGroup && `Blood Group: ${currentProfile.bloodGroup}`}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {currentProfile?.fullName || currentUser?.name}'s Health Hub
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-teal-100 pt-1">
            <div className="bg-black/20 px-3 py-1.5 rounded-lg border border-white/10 flex items-center space-x-2">
              <span className="font-semibold text-slate-200">ABHA ID:</span>
              <span className="font-mono font-bold text-teal-300">
                {currentProfile?.abhaId || 'Not linked'}
              </span>
            </div>
            {!currentProfile?.abhaId && (
              <button
                onClick={handleLinkAbha}
                className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg shadow transition cursor-pointer"
              >
                + Link Mock 14-Digit ABHA
              </button>
            )}
          </div>
        </div>

        {/* Profile Completeness & Quick Actions */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex flex-col justify-between space-y-3 min-w-[240px]">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Profile Completeness</span>
              <span>{completenessPercent}%</span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-400 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${completenessPercent}%` }}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleExportFHIR}
              className="flex-1 px-3 py-2 bg-white text-teal-900 hover:bg-teal-50 text-xs font-bold rounded-xl shadow transition flex items-center justify-center space-x-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('timeline.exportFhir')}</span>
            </button>
            <button
              onClick={() => setShareDoctorModal(true)}
              className="px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow transition flex items-center justify-center space-x-1 cursor-pointer"
              title="Share records with a doctor"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-4 gap-8">
        
        {/* Left Side: Summary Cards & Filters */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick upload trigger */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-sm rounded-2xl shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>{t('timeline.addRecord')}</span>
          </button>

          {/* Type Filter Pills */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center space-x-1.5">
              <Filter className="w-3.5 h-3.5 text-teal-600" />
              <span>Filter by Record Type</span>
            </h3>

            {[
              { id: 'ALL', label: t('timeline.filterAll') },
              { id: 'prescription', label: t('timeline.filterPrescription') },
              { id: 'lab_report', label: t('timeline.filterLab') },
              { id: 'discharge_summary', label: t('timeline.filterDischarge') }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer flex items-center justify-between ${
                  filterType === f.id
                    ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{f.label}</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  {f.id === 'ALL' ? records.length : records.filter(r => r.recordType === f.id).length}
                </span>
              </button>
            ))}
          </div>

          {/* Quick Health Vitals / Chronic Conditions */}
          {currentProfile?.chronicConditions && currentProfile.chronicConditions.length > 0 && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Health Conditions
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {currentProfile.chronicConditions.map((cond, idx) => (
                  <span key={idx} className="px-2.5 py-1 text-xs bg-cyan-50 text-cyan-800 rounded-lg border border-cyan-100 font-medium">
                    {cond}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Chronological Timeline Feed */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search timeline by doctor, clinic, test name or keyword..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden shadow-2xs"
            />
          </div>

          {/* Timeline Feed */}
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Loading timeline records...
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-700">No medical records found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Upload your first prescription, lab report, or diagnostic file to begin your lifetime timeline.
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="mt-4 px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-xl hover:bg-teal-700 transition"
              >
                Upload Record
              </button>
            </div>
          ) : (
            <div className="relative border-l-2 border-teal-200 ml-4 sm:ml-6 space-y-8 pb-4">
              {filteredRecords.map((rec) => (
                <div key={rec.id} className="relative pl-6 sm:pl-8 group">
                  {/* Timeline bullet dot */}
                  <div className="absolute -left-[9px] top-4 w-4 h-4 rounded-full bg-white border-4 border-teal-600 shadow-sm group-hover:scale-125 transition transform" />

                  {/* Record Card */}
                  <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                            {rec.recordType?.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center space-x-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{rec.date}</span>
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mt-1">
                          {rec.title}
                        </h3>
                      </div>

                      {rec.doctorName && (
                        <div className="text-xs text-slate-600 flex items-center space-x-1.5">
                          <User className="w-3.5 h-3.5 text-teal-600" />
                          <span>{rec.doctorName}</span>
                        </div>
                      )}
                    </div>

                    {/* Bilingual summary snippet */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {i18n.language === 'ta' && rec.summaryTa ? rec.summaryTa : rec.summaryEn}
                    </p>

                    {/* Abnormal values badges if present */}
                    {rec.abnormalFlags && rec.abnormalFlags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {rec.abnormalFlags.map((flag, fIdx) => (
                          <span key={fIdx} className="inline-flex items-center space-x-1 px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-md text-[10px] font-bold">
                            <AlertCircle className="w-3 h-3 text-rose-500" />
                            <span>{flag.parameter}: {flag.value}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Bottom actions */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-slate-400">
                        {rec.medications?.length > 0 && (
                          <span className="flex items-center space-x-1">
                            <Pill className="w-3.5 h-3.5 text-teal-500" />
                            <span>{rec.medications.length} medicines</span>
                          </span>
                        )}
                        {rec.tests?.length > 0 && (
                          <span>{rec.tests.length} tests</span>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedRecord(rec)}
                        className="px-3.5 py-1.5 bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-800 text-xs font-semibold rounded-lg border border-slate-200 flex items-center space-x-1.5 transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-teal-600" />
                        <span>View Details</span>
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Record Details Modal */}
      {selectedRecord && (
        <RecordDetailModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onShare={() => setShareDoctorModal(true)}
        />
      )}

      {/* Upload Modal (Embeds QuickScan inside) */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowUploadModal(false);
                // Reload timeline
                window.location.reload();
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800"
            >
              ✕
            </button>
            <QuickScan />
          </div>
        </div>
      )}

      {/* Share Doctor Modal */}
      {shareDoctorModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Share Medical History with Doctor
            </h3>
            <p className="text-xs text-slate-600">
              Select an affiliated doctor to grant read access to your health timeline and test records:
            </p>

            {shareSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold">
                {shareSuccess}
              </div>
            )}

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {doctorsList.map((doc) => (
                <div key={doc.id} className="p-3 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-slate-50 transition">
                  <div>
                    <div className="font-bold text-xs text-slate-900">{doc.name}</div>
                    <div className="text-[11px] text-cyan-700">{doc.specialty || 'General Practitioner'}</div>
                  </div>
                  <button
                    onClick={() => handleShareWithDoctor(doc.id)}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                  >
                    Authorize Access
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShareDoctorModal(false)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
