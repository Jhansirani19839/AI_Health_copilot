import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { getDB, logAudit } from '../services/db';
import { 
  Stethoscope, 
  Search, 
  User, 
  FileText, 
  Plus, 
  AlertTriangle, 
  Clock, 
  UploadCloud, 
  Printer, 
  Send,
  Eye,
  Languages,
  CheckCircle,
  FileSignature
} from 'lucide-react';
import RecordDetailModal from '../components/RecordDetailModal';
import QuickScan from './QuickScan';

export default function DoctorPortal() {
  const { t, i18n } = useTranslation();
  const { currentUser, currentProfile } = useAuth();

  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);
  const [patientNotes, setPatientNotes] = useState([]);
  const [activeModalRecord, setActiveModalRecord] = useState(null);
  
  // Note creation
  const [noteTitle, setNoteTitle] = useState('');
  const [noteText, setNoteText] = useState('');
  const [showUploadOnBehalf, setShowUploadOnBehalf] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load patients that granted access or were assigned to this doctor
  useEffect(() => {
    async function loadDoctorData() {
      if (!currentUser) return;
      try {
        const db = await getDB();
        
        // Find grants for this doctor
        const grants = await db.getAllFromIndex('access_grants', 'by_doctor', currentUser.id);
        const patientIds = grants.map(g => g.patientId);

        // Fetch patient profiles
        const allPatients = [];
        for (const pId of patientIds) {
          const profile = await db.get('patient_profiles', pId);
          const userRec = await db.get('users', pId);
          if (profile && userRec) {
            allPatients.push({ ...profile, email: userRec.email });
          }
        }

        // If no grants, also allow doctor to see the seeded demo patients for hospital workflow demo
        if (allPatients.length === 0) {
          const demoProfiles = await db.getAll('patient_profiles');
          setPatients(demoProfiles);
          if (demoProfiles.length > 0) selectPatient(demoProfiles[0]);
        } else {
          setPatients(allPatients);
          if (allPatients.length > 0) selectPatient(allPatients[0]);
        }

      } catch (err) {
        console.error('Doctor data loading error', err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctorData();
  }, [currentUser]);

  // Select patient and load their records and notes
  const selectPatient = async (patient) => {
    setSelectedPatient(patient);
    try {
      const db = await getDB();
      const recs = await db.getAllFromIndex('records', 'by_patient', patient.userId);
      recs.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      setPatientRecords(recs);

      const notes = await db.getAllFromIndex('doctor_notes', 'by_patient', patient.userId);
      notes.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setPatientNotes(notes);

      await logAudit({
        userId: currentUser.id,
        userName: currentUser.name,
        action: 'DOCTOR_VIEW_PATIENT',
        details: `Doctor viewed medical records of patient: ${patient.fullName}`,
        patientId: patient.userId
      });
    } catch (e) {
      console.error('Failed to load patient records', e);
    }
  };

  // Add doctor clinical note
  const handleAddNote = async (e) => {
    e?.preventDefault();
    if (!noteText.trim() || !selectedPatient) return;

    try {
      const db = await getDB();
      const noteId = 'note_' + Date.now();
      const newNote = {
        id: noteId,
        patientId: selectedPatient.userId,
        doctorId: currentUser.id,
        doctorName: currentProfile?.fullName || currentUser.name,
        date: new Date().toISOString().split('T')[0],
        title: noteTitle.trim() || 'Clinical Follow-up Note',
        note: noteText.trim(),
        createdAt: new Date().toISOString()
      };

      await db.put('doctor_notes', newNote);
      setPatientNotes(prev => [newNote, ...prev]);

      // Mirror as timeline event for patient
      await db.put('timeline_events', {
        id: `evt_${noteId}`,
        patientId: selectedPatient.userId,
        recordId: noteId,
        date: newNote.date,
        title: `Dr. Note: ${newNote.title}`,
        recordType: 'consultation_note',
        doctorName: newNote.doctorName,
        summaryEn: newNote.note,
        summaryTa: `மருத்துவர் குறிப்பு: ${newNote.note}`,
        abnormalCount: 0,
        medCount: 0
      });

      setNoteTitle('');
      setNoteText('');

      await logAudit({
        userId: currentUser.id,
        userName: currentUser.name,
        action: 'DOCTOR_ADDED_NOTE',
        details: `Doctor added clinical note for ${selectedPatient.fullName}`,
        patientId: selectedPatient.userId
      });
    } catch (err) {
      console.error('Error saving doctor note', err);
    }
  };

  // Filter patient list by name, phone, or ABHA
  const filteredPatients = patients.filter(p => {
    const q = searchTerm.toLowerCase();
    return (
      (p.fullName && p.fullName.toLowerCase().includes(q)) ||
      (p.phone && p.phone.toLowerCase().includes(q)) ||
      (p.abhaId && p.abhaId.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full border border-cyan-400/30">
            Real-World Use Case #2: Hospital & Clinic Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 flex items-center space-x-2">
            <Stethoscope className="w-7 h-7 text-teal-400" />
            <span>Doctor Practice Workspace</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Logged in as {currentProfile?.fullName || currentUser?.name} ({currentProfile?.specialty || 'Physician'})
          </p>
        </div>

        {selectedPatient && (
          <button
            onClick={() => setShowUploadOnBehalf(true)}
            className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5 cursor-pointer shrink-0"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Record for Patient</span>
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left Col: Patient Search & Directory */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Assigned Patients & Search
            </h3>

            {/* Search Input (Name, Phone, ABHA) */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('doctor.searchPatient')}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>

            {/* Patient Cards List */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredPatients.map((p) => {
                const isSelected = selectedPatient?.userId === p.userId;
                return (
                  <button
                    key={p.userId}
                    onClick={() => selectPatient(p)}
                    className={`w-full text-left p-3 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50 border-teal-400 text-teal-950 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-sm">{p.fullName}</div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {p.bloodGroup || 'AB+'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {p.age} yrs • {p.gender} • {p.phone}
                    </div>
                    {p.abhaId && (
                      <div className="text-[11px] font-mono text-teal-700 mt-1">
                        ABHA: {p.abhaId}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Selected Patient Health File & Action Center */}
        <div className="lg:col-span-8 space-y-6">
          {selectedPatient ? (
            <>
              {/* Patient Banner */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
                      Patient Medical Record
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900 mt-1">
                      {selectedPatient.fullName}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Age: {selectedPatient.age} | Gender: {selectedPatient.gender} | Blood: {selectedPatient.bloodGroup} | Emergency: {selectedPatient.emergencyContact}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{t('doctor.shareStatus')}</span>
                    </span>
                  </div>
                </div>

                {/* Chronic conditions & Allergies tags */}
                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-1">Known Allergies:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedPatient.allergies?.length > 0 ? (
                        selectedPatient.allergies.map((a, i) => (
                          <span key={i} className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-medium text-[11px]">
                            {a}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400">No known allergies</span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-1">Chronic Conditions:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedPatient.chronicConditions?.length > 0 ? (
                        selectedPatient.chronicConditions.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 bg-cyan-100 text-cyan-800 rounded font-medium text-[11px]">
                            {c}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400">None recorded</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Records Timeline in Doctor View */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-teal-600" />
                  <span>Clinical Records & Lab History ({patientRecords.length})</span>
                </h3>

                {patientRecords.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No records uploaded for this patient yet.</p>
                ) : (
                  <div className="space-y-3">
                    {patientRecords.map((r) => (
                      <div key={r.id} className="p-4 rounded-xl border border-slate-200 hover:border-teal-300 transition bg-slate-50/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                              {r.recordType?.replace('_', ' ')}
                            </span>
                            <h4 className="font-bold text-sm text-slate-900 mt-1">{r.title}</h4>
                            <div className="text-xs text-slate-500 mt-0.5">{r.date} • {r.doctorName}</div>
                          </div>
                          
                          <button
                            onClick={() => setActiveModalRecord(r)}
                            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-teal-50 text-teal-700 text-xs font-semibold rounded-lg flex items-center space-x-1 shadow-2xs transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Review Full Report</span>
                          </button>
                        </div>

                        {/* Abnormal alert strip if any */}
                        {r.abnormalFlags && r.abnormalFlags.length > 0 && (
                          <div className="mt-2.5 p-2 bg-rose-50 border border-rose-200 rounded-lg text-xs flex items-center space-x-2 text-rose-800">
                            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                            <span className="font-semibold">Abnormal flags:</span>
                            <span className="truncate">
                              {r.abnormalFlags.map(f => `${f.parameter} (${f.value})`).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Clinical Notes & Prescriptions Section */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                  <FileSignature className="w-5 h-5 text-teal-600" />
                  <span>{t('doctor.addNote')}</span>
                </h3>

                <form onSubmit={handleAddNote} className="space-y-3">
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="Note / Care Plan Title (e.g. Follow-up Diabetes Review)"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    rows={3}
                    placeholder="Enter clinical assessment, prescription modifications, diet recommendations, and follow-up timeline..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!noteText.trim()}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Note to Patient Timeline</span>
                    </button>
                  </div>
                </form>

                {/* Previous Doctor Notes */}
                {patientNotes.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Existing Doctor Notes
                    </h4>
                    {patientNotes.map((n) => (
                      <div key={n.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                        <div className="flex justify-between items-center font-bold text-slate-800">
                          <span>{n.title}</span>
                          <span className="text-slate-400 font-normal">{n.date}</span>
                        </div>
                        <p className="text-slate-600">{n.note}</p>
                        <div className="text-[11px] text-teal-700 font-semibold">— {n.doctorName}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
              Select a patient from the left column to view their medical chart.
            </div>
          )}
        </div>

      </div>

      {/* Record details modal */}
      {activeModalRecord && (
        <RecordDetailModal
          record={activeModalRecord}
          onClose={() => setActiveModalRecord(null)}
        />
      )}

      {/* Upload on behalf modal */}
      {showUploadOnBehalf && selectedPatient && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Upload Record for {selectedPatient.fullName}
                </h3>
                <p className="text-xs text-slate-500">ABHA: {selectedPatient.abhaId}</p>
              </div>
              <button
                onClick={() => {
                  setShowUploadOnBehalf(false);
                  selectPatient(selectedPatient);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-800"
              >
                ✕
              </button>
            </div>
            <QuickScan />
          </div>
        </div>
      )}

    </div>
  );
}
