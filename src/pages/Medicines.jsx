import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { getDB } from '../services/db';
import { Pill, Clock, AlertCircle, CheckCircle, Plus, Calendar, ShieldCheck } from 'lucide-react';

export default function Medicines() {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const [medList, setMedList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMeds() {
      if (!currentUser) return;
      try {
        const db = await getDB();
        const records = await db.getAllFromIndex('records', 'by_patient', currentUser.id);
        
        // Aggregate medications across records
        const map = new Map();
        records.forEach(r => {
          (r.medications || []).forEach(m => {
            const key = m.name?.trim().toLowerCase();
            if (key && !map.has(key)) {
              map.set(key, {
                ...m,
                prescribedDate: r.date,
                prescribedBy: r.doctorName || 'Consulting Physician'
              });
            }
          });
        });

        setMedList(Array.from(map.values()));
      } catch (err) {
        console.error('Failed to load medications', err);
      } finally {
        setLoading(false);
      }
    }
    loadMeds();
  }, [currentUser]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <Pill className="w-6 h-6 text-teal-600" />
            <span>Active Medications & Regimen Tracker</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Aggregated prescription schedule extracted from your uploaded medical documents.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading medicines...</div>
      ) : medList.length === 0 ? (
        <div className="bg-white p-10 text-center rounded-2xl border border-dashed border-slate-300">
          <Pill className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-700">No active medications detected</h3>
          <p className="text-xs text-slate-500 mt-1">
            Upload an outpatient prescription in Quick Scan or Timeline to track your drug schedules.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {medList.map((m, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                    Active Prescription
                  </span>
                  <h3 className="font-bold text-base text-slate-900 mt-1">{m.name}</h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-teal-100/60 flex items-center justify-center text-teal-700">
                  <Pill className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Dosage:</span>
                  <span className="font-semibold text-slate-800">{m.dosage || 'Standard'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Timing:</span>
                  <span className="font-semibold text-teal-700">{m.frequency}</span>
                </div>
                {m.instructions && (
                  <div className="pt-1 text-[11px] text-slate-600 border-t border-slate-200/60">
                    <span className="font-medium">Instructions:</span> {m.instructions}
                  </div>
                )}
              </div>

              {(m.purposeEn || m.purposeTa) && (
                <div className="text-xs text-slate-600 bg-teal-50/40 p-2 rounded-lg border border-teal-100">
                  <span className="font-semibold text-teal-900">Purpose: </span>
                  <span>{i18n.language === 'ta' && m.purposeTa ? m.purposeTa : m.purposeEn}</span>
                </div>
              )}

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>Prescribed: {m.prescribedDate}</span>
                <span>{m.prescribedBy}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
