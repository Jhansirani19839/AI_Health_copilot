import { openDB } from 'idb';

const DB_NAME = 'ai_health_copilot_db';
const DB_VERSION = 1;

export async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('users')) {
        const userStore = db.createObjectStore('users', { keyPath: 'id' });
        userStore.createIndex('by_email', 'email', { unique: true });
        userStore.createIndex('by_role', 'role');
      }

      if (!db.objectStoreNames.contains('patient_profiles')) {
        const pStore = db.createObjectStore('patient_profiles', { keyPath: 'userId' });
        pStore.createIndex('by_abha', 'abhaId', { unique: false });
        pStore.createIndex('by_phone', 'phone');
      }

      if (!db.objectStoreNames.contains('doctor_profiles')) {
        const dStore = db.createObjectStore('doctor_profiles', { keyPath: 'userId' });
        dStore.createIndex('by_regNo', 'regNo');
      }

      if (!db.objectStoreNames.contains('records')) {
        const rStore = db.createObjectStore('records', { keyPath: 'id' });
        rStore.createIndex('by_patient', 'patientId');
        rStore.createIndex('by_date', 'date');
        rStore.createIndex('by_type', 'recordType');
      }

      if (!db.objectStoreNames.contains('extracted_items')) {
        const eStore = db.createObjectStore('extracted_items', { keyPath: 'id' });
        eStore.createIndex('by_record', 'recordId');
      }

      if (!db.objectStoreNames.contains('timeline_events')) {
        const tStore = db.createObjectStore('timeline_events', { keyPath: 'id' });
        tStore.createIndex('by_patient', 'patientId');
        tStore.createIndex('by_date', 'date');
      }

      if (!db.objectStoreNames.contains('doctor_notes')) {
        const nStore = db.createObjectStore('doctor_notes', { keyPath: 'id' });
        nStore.createIndex('by_patient', 'patientId');
        nStore.createIndex('by_doctor', 'doctorId');
      }

      if (!db.objectStoreNames.contains('access_grants')) {
        const aStore = db.createObjectStore('access_grants', { keyPath: 'id' });
        aStore.createIndex('by_patient', 'patientId');
        aStore.createIndex('by_doctor', 'doctorId');
      }

      if (!db.objectStoreNames.contains('chat_messages')) {
        const cStore = db.createObjectStore('chat_messages', { keyPath: 'id' });
        cStore.createIndex('by_patient', 'patientId');
      }

      if (!db.objectStoreNames.contains('audit_logs')) {
        const logStore = db.createObjectStore('audit_logs', { keyPath: 'id' });
        logStore.createIndex('by_timestamp', 'timestamp');
        logStore.createIndex('by_user', 'userId');
      }
    },
  });
}

// Password hashing utility using Web Crypto API SHA-256
export async function hashPassword(plainText) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Audit logger helper
export async function logAudit({ userId, userName, action, details, patientId }) {
  try {
    const db = await getDB();
    await db.add('audit_logs', {
      id: 'audit_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
      userId: userId || 'anonymous',
      userName: userName || 'Anonymous User',
      action,
      details: details || '',
      patientId: patientId || null
    });
  } catch (err) {
    console.error('Audit log failed', err);
  }
}
