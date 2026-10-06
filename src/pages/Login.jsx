import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { 
  Lock, 
  Mail, 
  User, 
  KeyRound, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Stethoscope,
  Sparkles
} from 'lucide-react';

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/timeline';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'doctor') navigate('/doctor');
      else navigate('/timeline');
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('demo123');
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('auth.signInTitle')}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Or{' '}
          <Link to="/signup" className="font-semibold text-teal-600 hover:text-teal-700 underline">
            create a new patient account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl border border-slate-200/80 rounded-2xl sm:px-10">
          
          {/* Demo Credentials Quick-Fill Cards */}
          <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
            <div className="font-semibold text-slate-700 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>{t('auth.demoCredentials')}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('patient1@health.io', 'patient')}
                className="p-2 text-left rounded-lg bg-white border border-slate-200 hover:border-teal-500 hover:bg-teal-50 transition cursor-pointer"
              >
                <div className="font-bold text-slate-800">Suresh K.</div>
                <div className="text-[10px] text-teal-600">Patient (T2D)</div>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('doctor1@hospital.org', 'doctor')}
                className="p-2 text-left rounded-lg bg-white border border-slate-200 hover:border-teal-500 hover:bg-teal-50 transition cursor-pointer"
              >
                <div className="font-bold text-slate-800">Dr. Meenakshi</div>
                <div className="text-[10px] text-cyan-600">Doctor (MD)</div>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin@hospital.org', 'admin')}
                className="p-2 text-left rounded-lg bg-white border border-slate-200 hover:border-teal-500 hover:bg-teal-50 transition cursor-pointer"
              >
                <div className="font-bold text-slate-800">Admin</div>
                <div className="text-[10px] text-emerald-600">Hospital Admin</div>
              </button>
            </div>
            <div className="text-[10px] text-slate-400 text-center">
              Password for all demo accounts: <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-700">demo123</code>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                {t('auth.email')}
              </label>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  placeholder="e.g. patient1@health.io"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                {t('auth.password')}
              </label>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Authenticating...' : t('auth.submitSignIn')}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
