import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { getDB, logAudit } from '../services/db';
import { 
  User, 
  Mail, 
  KeyRound, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Heart,
  CreditCard
} from 'lucide-react';

export default function Signup() {
  const { t } = useTranslation();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromQuickScan = searchParams.get('from') === 'quick-scan';

  const [role, setRole] = useState('patient');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState(35);
  const [gender, setGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [phone, setPhone] = useState('+91 ');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [allergiesText, setAllergiesText] = useState('');
  const [conditionsText, setConditionsText] = useState('');

  // Doctor specific fields
  const [regNo, setRegNo] = useState('');
  const [specialty, setSpecialty] = useState('General Medicine');
  const [hospital, setHospital] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    try {
      const extraProfile = role === 'patient' ? {
        age: parseInt(age) || 30,
        gender,
        bloodGroup,
        phone,
        emergencyContact,
        allergies: allergiesText ? allergiesText.split(',').map(s => s.trim()) : [],
        chronicConditions: conditionsText ? conditionsText.split(',').map(s => s.trim()) : [],
        currentMedicines: []
      } : {
        regNo: regNo || `TNMC-${Math.floor(10000 + Math.random() * 90000)}`,
        specialty,
        hospital: hospital || 'Apollo Clinic'
      };

      const newUser = await signup({
        email,
        password,
        fullName,
        role,
        extraProfile
      });

      // If user came from Quick Scan, attach their pending scan into their new profile
      const pendingRecord = sessionStorage.getItem('ahc_pending_record');
      if (pendingRecord && role === 'patient') {
        try {
          const recObj = JSON.parse(pendingRecord);
          const db = await getDB();
          const recId = 'rec_' + Date.now();
          const recordToSave = {
            ...recObj,
            id: recId,
            patientId: newUser.id,
            title: recObj.recordType === 'prescription' ? 'First Prescription' : 'Initial Diagnostic Scan',
            date: recObj.recordDate || new Date().toISOString().split('T')[0]
          };
          await db.put('records', recordToSave);
          await db.put('timeline_events', {
            id: `evt_${recId}`,
            patientId: newUser.id,
            recordId: recId,
            date: recordToSave.date,
            title: recordToSave.title,
            recordType: recordToSave.recordType,
            doctorName: recordToSave.doctorName || 'Doctor',
            summaryEn: recordToSave.summaryEn,
            summaryTa: recordToSave.summaryTa,
            abnormalCount: (recordToSave.abnormalFlags || []).length,
            medCount: (recordToSave.medications || []).length
          });
          sessionStorage.removeItem('ahc_pending_record');
        } catch (e) {
          console.error('Failed to import pending quick scan to new profile', e);
        }
      }

      if (role === 'doctor') navigate('/doctor');
      else navigate('/timeline');

    } catch (err) {
      setError(err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900">
          {t('auth.signUpTitle')}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-700 underline">
            Sign In here
          </Link>
        </p>

        {fromQuickScan && (
          <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 inline-flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Your Quick Scan report is saved and will be automatically added to your new health timeline!</span>
          </div>
        )}
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xl">
        
        {/* Role toggle */}
        <div className="mb-6 flex rounded-xl border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => setRole('patient')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              role === 'patient' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('auth.rolePatient')} (Individual / Family)
          </button>
          <button
            type="button"
            onClick={() => setRole('doctor')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              role === 'doctor' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('auth.roleDoctor')} (Physician / Clinic)
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">{t('auth.fullName')} *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Kannan"
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">{t('auth.email')} *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. ramesh@example.com"
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">{t('auth.password')} *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>
          </div>

          {role === 'patient' && (
            <div className="pt-2 border-t border-slate-100 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800">
                Initial Health Profile (ABDM-Ready)
              </h3>
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="mt-1 w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="mt-1 w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="mt-1 w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  >
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>O+</option>
                    <option>O-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600">Known Drug/Food Allergies (comma-separated)</label>
                <input
                  type="text"
                  value={allergiesText}
                  onChange={(e) => setAllergiesText(e.target.value)}
                  placeholder="e.g. Penicillin, Peanuts, Sulfa drugs"
                  className="mt-1 w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600">Chronic Conditions (comma-separated)</label>
                <input
                  type="text"
                  value={conditionsText}
                  onChange={(e) => setConditionsText(e.target.value)}
                  placeholder="e.g. Type 2 Diabetes, Hypertension, Asthma"
                  className="mt-1 w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600">Emergency Contact</label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="e.g. Lakshmi (Spouse) - +91 98400 12345"
                  className="mt-1 w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          )}

          {role === 'doctor' && (
            <div className="pt-2 border-t border-slate-100 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-800">
                Medical Practitioner Credentials
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600">State Medical Council Reg. No</label>
                  <input
                    type="text"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    placeholder="e.g. TNMC-89214"
                    className="mt-1 w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600">Medical Specialty</label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="e.g. Cardiology, Diabetology"
                    className="mt-1 w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600">Hospital / Clinic Affiliation</label>
                <input
                  type="text"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  placeholder="e.g. Government General Hospital / Apollo Clinic"
                  className="mt-1 w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Setting up Profile...' : t('auth.submitSignUp')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
