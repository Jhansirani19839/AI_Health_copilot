import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDB, hashPassword, logAudit } from '../services/db';
import { initSeedData } from '../services/seedData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        await initSeedData();
        const storedUser = localStorage.getItem('ahc_session_user');
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          setCurrentUser(userObj);
          await loadUserProfile(userObj);
        }
      } catch (err) {
        console.error('Auth initialization failed', err);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  async function loadUserProfile(user) {
    if (!user) return;
    const db = await getDB();
    if (user.role === 'patient') {
      const p = await db.get('patient_profiles', user.id);
      setCurrentProfile(p || null);
    } else if (user.role === 'doctor') {
      const d = await db.get('doctor_profiles', user.id);
      setCurrentProfile(d || null);
    } else {
      setCurrentProfile({ role: 'admin', fullName: user.name });
    }
  }

  async function login(email, password) {
    const db = await getDB();
    const user = await db.getFromIndex('users', 'by_email', email.trim().toLowerCase());
    if (!user) {
      throw new Error('User not found with this email address.');
    }

    if (user.status === 'deactivated') {
      throw new Error('This account has been deactivated by hospital administrator.');
    }

    const hashedInput = await hashPassword(password);
    if (user.passwordHash !== hashedInput) {
      throw new Error('Invalid password. Please check your credentials.');
    }

    const sessionData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    localStorage.setItem('ahc_session_user', JSON.stringify(sessionData));
    setCurrentUser(sessionData);
    await loadUserProfile(sessionData);

    await logAudit({
      userId: user.id,
      userName: user.name,
      action: 'LOGIN_SUCCESS',
      details: `User logged in with role ${user.role}`
    });

    return sessionData;
  }

  async function signup({ email, password, fullName, role = 'patient', extraProfile = {} }) {
    const db = await getDB();
    const existing = await db.getFromIndex('users', 'by_email', email.trim().toLowerCase());
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const userId = (role === 'doctor' ? 'usr_doc_' : 'usr_pat_') + Date.now();
    const passwordHash = await hashPassword(password);

    const newUser = {
      id: userId,
      name: fullName,
      email: email.trim().toLowerCase(),
      passwordHash,
      role,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    await db.put('users', newUser);

    if (role === 'patient') {
      const patientProfile = {
        userId,
        fullName,
        age: extraProfile.age || 30,
        gender: extraProfile.gender || 'Not specified',
        bloodGroup: extraProfile.bloodGroup || 'Unknown',
        phone: extraProfile.phone || '',
        abhaId: extraProfile.abhaId || `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        allergies: extraProfile.allergies || [],
        chronicConditions: extraProfile.chronicConditions || [],
        currentMedicines: extraProfile.currentMedicines || [],
        emergencyContact: extraProfile.emergencyContact || '',
        preferredLanguage: extraProfile.preferredLanguage || 'en'
      };
      await db.put('patient_profiles', patientProfile);
      setCurrentProfile(patientProfile);
    } else if (role === 'doctor') {
      const docProfile = {
        userId,
        fullName,
        phone: extraProfile.phone || '',
        regNo: extraProfile.regNo || `MC-${Math.floor(10000 + Math.random() * 90000)}`,
        specialty: extraProfile.specialty || 'General Medicine',
        hospital: extraProfile.hospital || 'General Clinic',
        experienceYears: extraProfile.experienceYears || 5
      };
      await db.put('doctor_profiles', docProfile);
      setCurrentProfile(docProfile);
    }

    const sessionData = {
      id: userId,
      name: fullName,
      email: newUser.email,
      role
    };

    localStorage.setItem('ahc_session_user', JSON.stringify(sessionData));
    setCurrentUser(sessionData);

    await logAudit({
      userId,
      userName: fullName,
      action: 'USER_REGISTERED',
      details: `New account created as ${role}`
    });

    return sessionData;
  }

  async function updatePatientProfile(updatedFields) {
    if (!currentUser || currentUser.role !== 'patient') return;
    const db = await getDB();
    const current = await db.get('patient_profiles', currentUser.id) || { userId: currentUser.id };
    const merged = { ...current, ...updatedFields };
    await db.put('patient_profiles', merged);
    setCurrentProfile(merged);

    await logAudit({
      userId: currentUser.id,
      userName: currentUser.name,
      action: 'PROFILE_UPDATED',
      details: 'Patient updated their clinical profile details'
    });
  }

  async function logout() {
    if (currentUser) {
      await logAudit({
        userId: currentUser.id,
        userName: currentUser.name,
        action: 'LOGOUT',
        details: 'User logged out session'
      });
    }
    localStorage.removeItem('ahc_session_user');
    setCurrentUser(null);
    setCurrentProfile(null);
  }

  return (
    <AuthContext.Provider value={{
      currentUser,
      currentProfile,
      loading,
      login,
      signup,
      logout,
      updatePatientProfile,
      reloadProfile: () => loadUserProfile(currentUser)
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
