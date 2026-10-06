import { getDB, hashPassword, logAudit } from './db';

export async function initSeedData() {
  const db = await getDB();
  const existingUsers = await db.getAll('users');
  if (existingUsers.length > 0) {
    return; // Already initialized
  }

  console.log('Seeding initial clinical demo database...');

  // 1. Password hashes (Password: 'demo123' for all demo accounts)
  const defaultPasswordHash = await hashPassword('demo123');

  // 2. Users (1 Admin, 2 Doctors, 3 Patients)
  const users = [
    {
      id: 'usr_admin_1',
      name: 'Dr. Rajesh Sundaram',
      email: 'admin@hospital.org',
      passwordHash: defaultPasswordHash,
      role: 'admin',
      status: 'active',
      createdAt: '2026-09-01T10:00:00Z'
    },
    {
      id: 'usr_doc_1',
      name: 'Dr. Meenakshi Ramanathan',
      email: 'doctor1@hospital.org',
      passwordHash: defaultPasswordHash,
      role: 'doctor',
      specialty: 'Endocrinology & Internal Medicine',
      status: 'active',
      createdAt: '2026-09-02T10:00:00Z'
    },
    {
      id: 'usr_doc_2',
      name: 'Dr. Karthik Senthilvel',
      email: 'doctor2@hospital.org',
      passwordHash: defaultPasswordHash,
      role: 'doctor',
      specialty: 'Cardiology & Preventive Health',
      status: 'active',
      createdAt: '2026-09-03T10:00:00Z'
    },
    {
      id: 'usr_pat_1',
      name: 'Suresh Kumar',
      email: 'patient1@health.io',
      passwordHash: defaultPasswordHash,
      role: 'patient',
      status: 'active',
      createdAt: '2026-09-10T11:00:00Z'
    },
    {
      id: 'usr_pat_2',
      name: 'Ananya Jayaraman',
      email: 'patient2@health.io',
      passwordHash: defaultPasswordHash,
      role: 'patient',
      status: 'active',
      createdAt: '2026-09-12T12:00:00Z'
    },
    {
      id: 'usr_pat_3',
      name: 'Murugan Thangavel',
      email: 'patient3@health.io',
      passwordHash: defaultPasswordHash,
      role: 'patient',
      status: 'active',
      createdAt: '2026-09-15T09:30:00Z'
    }
  ];

  for (const u of users) {
    await db.put('users', u);
  }

  // 3. Profiles
  const doctorProfiles = [
    {
      userId: 'usr_doc_1',
      fullName: 'Dr. Meenakshi Ramanathan, MD',
      phone: '+91 98401 23456',
      regNo: 'TNMC-74892',
      specialty: 'Endocrinology & Diabetology',
      hospital: 'Apollo Specialty Hospitals, Chennai',
      experienceYears: 14
    },
    {
      userId: 'usr_doc_2',
      fullName: 'Dr. Karthik Senthilvel, MD, DM',
      phone: '+91 98402 34567',
      regNo: 'TNMC-81203',
      specialty: 'Consultant Interventional Cardiologist',
      hospital: 'Madras Medical Mission, Chennai',
      experienceYears: 11
    }
  ];
  for (const dp of doctorProfiles) {
    await db.put('doctor_profiles', dp);
  }

  const patientProfiles = [
    {
      userId: 'usr_pat_1',
      fullName: 'Suresh Kumar',
      age: 48,
      dob: '1978-04-14',
      gender: 'Male',
      phone: '+91 98765 43210',
      bloodGroup: 'B+',
      abhaId: '91-4562-7890-1234',
      allergies: ['Penicillin', 'Sulfa drugs'],
      chronicConditions: ['Type 2 Diabetes Mellitus', 'Essential Hypertension'],
      currentMedicines: ['Metformin 500mg (1-0-1)', 'Telmisartan 40mg (1-0-0)'],
      emergencyContact: 'Priya Kumar (Wife) - +91 98765 11111',
      preferredLanguage: 'ta'
    },
    {
      userId: 'usr_pat_2',
      fullName: 'Ananya Jayaraman',
      age: 34,
      dob: '1992-08-22',
      gender: 'Female',
      phone: '+91 94440 88776',
      bloodGroup: 'O+',
      abhaId: '91-8899-2233-4455',
      allergies: ['Dust mites', 'Aspirin'],
      chronicConditions: ['Hypothyroidism', 'Mild Iron Deficiency Anemia'],
      currentMedicines: ['Thyronorm 50mcg (1-0-0)', 'Autrin Iron Supplement (0-1-0)'],
      emergencyContact: 'R. Jayaraman (Father) - +91 94440 22334',
      preferredLanguage: 'en'
    },
    {
      userId: 'usr_pat_3',
      fullName: 'Murugan Thangavel',
      age: 62,
      dob: '1964-11-05',
      gender: 'Male',
      phone: '+91 98840 55667',
      bloodGroup: 'A+',
      abhaId: '91-3344-5566-7788',
      allergies: ['None known'],
      chronicConditions: ['Dyslipidemia', 'Mild Osteoarthritis'],
      currentMedicines: ['Atorvastatin 10mg (0-0-1)', 'Calcium + Vit D3 (1-0-0)'],
      emergencyContact: 'Selvi Murugan (Wife) - +91 98840 99887',
      preferredLanguage: 'ta'
    }
  ];
  for (const pp of patientProfiles) {
    await db.put('patient_profiles', pp);
  }

  // 4. Sample Medical Records (5 pre-generated rich records with EN + TA summaries)
  const sampleRecords = [
    {
      id: 'rec_suresh_lab_1',
      patientId: 'usr_pat_1',
      title: 'Quarterly Glycemic & Lipid Evaluation',
      recordType: 'lab_report',
      date: '2026-09-18',
      doctorName: 'Dr. Meenakshi Ramanathan',
      facility: 'Thyrocare / Apollo Diagnostics',
      ocrText: `APOLLO DIAGNOSTICS - CLINICAL BIOCHEMISTRY REPORT
Patient: Suresh Kumar | Age: 48 | Sex: M | Ref: Dr. Meenakshi Ramanathan
Date: 18-09-2026

TEST DESCRIPTION                    RESULT       REF RANGE     UNITS
-----------------------------------------------------------------------
HbA1c (Glycosylated Hemoglobin)     7.8 [HIGH]   4.0 - 5.7     %
Estimated Average Glucose (eAG)     177          70 - 126      mg/dL
Fasting Blood Sugar (FBS)           148 [HIGH]   70 - 100      mg/dL
Total Cholesterol                   215 [HIGH]   120 - 200     mg/dL
Serum Triglycerides                 190 [HIGH]   50 - 150      mg/dL
Serum Creatinine                    0.9          0.6 - 1.2     mg/dL
Blood Urea                          24           15 - 40       mg/dL`,
      medications: [],
      tests: [
        { name: 'HbA1c (Glycosylated Hemoglobin)', value: '7.8', unit: '%', range: '4.0 - 5.7 %', status: 'HIGH' },
        { name: 'Fasting Blood Sugar', value: '148', unit: 'mg/dL', range: '70 - 100 mg/dL', status: 'HIGH' },
        { name: 'Total Cholesterol', value: '215', unit: 'mg/dL', range: '120 - 200 mg/dL', status: 'HIGH' },
        { name: 'Serum Triglycerides', value: '190', unit: 'mg/dL', range: '50 - 150 mg/dL', status: 'HIGH' },
        { name: 'Serum Creatinine', value: '0.9', unit: 'mg/dL', range: '0.6 - 1.2 mg/dL', status: 'NORMAL' }
      ],
      abnormalFlags: [
        {
          parameter: 'HbA1c (Glycated Hemoglobin)',
          parameterTa: 'எச்பிஏ1சி (சர்க்கரை சராசரி)',
          value: '7.8 %',
          normalRange: '4.0 - 5.7 %',
          status: 'HIGH',
          severity: 'Moderate',
          explanationEn: 'HbA1c is 7.8%, indicating moderately uncontrolled 3-month blood sugar. Ideal target for diabetes management is below 7.0%.',
          explanationTa: 'எச்பிஏ1சி அளவு 7.8% ஆக உள்ளது. கடந்த 3 மாதங்களில் சர்க்கரை அளவு சற்று அதிகமாக இருந்துள்ளது. இலக்கு 7.0% க்கும் குறைவாக இருக்க வேண்டும்.'
        },
        {
          parameter: 'Fasting Blood Sugar',
          parameterTa: 'உணவுக்கு முன் இரத்த சர்க்கரை',
          value: '148 mg/dL',
          normalRange: '70 - 100 mg/dL',
          status: 'HIGH',
          severity: 'Moderate',
          explanationEn: 'Fasting sugar is 148 mg/dL (Normal is 70-100 mg/dL). Morning glucose levels are running high.',
          explanationTa: 'உணவுக்கு முந்தைய இரத்த சர்க்கரை 148 mg/dL (இயல்பு: 70-100 mg/dL). காலை நேர சர்க்கரை அளவு அதிகமாக உள்ளது.'
        },
        {
          parameter: 'Total Cholesterol & Triglycerides',
          parameterTa: 'கொலஸ்ட்ரால் & டிரைகிளிசரைடுகள்',
          value: '215 / 190 mg/dL',
          normalRange: '< 200 / < 150 mg/dL',
          status: 'HIGH',
          severity: 'Mild',
          explanationEn: 'Lipid panel shows mild elevation in total cholesterol and triglycerides.',
          explanationTa: 'மொத்த கொலஸ்ட்ரால் மற்றும் டிரைகிளிசரைடுகள் சற்று உயர்ந்துள்ளன. குறைந்த கொழுப்புள்ள உணவுகள் தேவை.'
        }
      ],
      diagnoses: ['Type 2 Diabetes Mellitus - Inadequate Control', 'Dyslipidemia'],
      summaryEn: 'Lab report from Dr. Meenakshi Ramanathan shows elevated HbA1c (7.8%) and elevated fasting glucose (148 mg/dL), alongside borderline high cholesterol (215 mg/dL). Kidney function (Creatinine 0.9) remains healthy and normal.',
      summaryTa: 'டாக்டர் மீனாட்சி ராமநாதனின் ஆய்வக அறிக்கை: எச்பிஏ1சி (7.8%) மற்றும் காலை சர்க்கரை (148 mg/dL) அதிகமாக உள்ளன. கொலஸ்ட்ரால் அளவும் சற்றே கூடியுள்ளது. சிறுநீரக செயல்பாடு (கிரியேட்டினின் 0.9) மிகவும் ஆரோக்கியமாக உள்ளது.',
      extractedVia: 'verified_dataset'
    },
    {
      id: 'rec_suresh_rx_1',
      patientId: 'usr_pat_1',
      title: 'Endocrinology Prescription & Care Plan',
      recordType: 'prescription',
      date: '2026-09-20',
      doctorName: 'Dr. Meenakshi Ramanathan',
      facility: 'Apollo Specialty Hospitals',
      ocrText: `APOLLO SPECIALTY HOSPITALS - OUTPATIENT PRESCRIPTION
Dr. Meenakshi Ramanathan, MD (Endocrinology)
Patient: Suresh Kumar | 48 M | Date: 20-09-2026
Diagnosis: T2DM uncontrolled, Dyslipidemia, Mild HTN

Rx:
1. Tab Metformin 1000mg ER - 1-0-1 after food (twice daily) x 90 days
2. Tab Telmisartan 40mg - 1-0-0 morning after breakfast x 90 days
3. Tab Atorvastatin 10mg - 0-0-1 bedtime after dinner x 90 days
4. Tab Pantoprazole 40mg - 1-0-0 empty stomach in morning x 14 days

Advice:
- 30 mins brisk walking daily
- Low glycemic index diet, avoid direct sweets and bakery items
- Repeat HbA1c & Fasting Sugars after 3 months`,
      medications: [
        { name: 'Metformin 1000mg ER', dosage: '1000 mg', frequency: '1-0-1 (Twice daily after food)', instructions: 'Take with or immediately after meals', purposeEn: 'Controls blood glucose release', purposeTa: 'இரத்த சர்க்கரை அளவை கட்டுப்படுத்துகிறது' },
        { name: 'Telmisartan 40mg', dosage: '40 mg', frequency: '1-0-0 (Morning)', instructions: 'Take every morning after breakfast', purposeEn: 'Blood pressure regulation', purposeTa: 'இரத்த அழுத்தத்தை சீராக்குகிறது' },
        { name: 'Atorvastatin 10mg', dosage: '10 mg', frequency: '0-0-1 (Night bedtime)', instructions: 'Take at night after food', purposeEn: 'Lowers bad cholesterol & protects heart', purposeTa: 'கெட்ட கொழுப்பைக் குறைத்து இதயத்தை பாதுகாக்கிறது' },
        { name: 'Pantoprazole 40mg', dosage: '40 mg', frequency: '1-0-0 (Before food)', instructions: 'Take 30 mins before breakfast for 14 days', purposeEn: 'Prevents stomach irritation/gastritis', purposeTa: 'அசிடிட்டி மற்றும் நெஞ்செரிச்சலை தடுக்கிறது' }
      ],
      tests: [],
      abnormalFlags: [],
      diagnoses: ['Type 2 Diabetes Mellitus', 'Essential Hypertension', 'Mild Dyslipidemia'],
      summaryEn: 'Prescription updated following high sugar values: Metformin stepped up to 1000mg ER twice daily, Telmisartan 40mg continued for BP, and Atorvastatin 10mg started for cholesterol management. Advised 30 minutes daily walking.',
      summaryTa: 'சர்க்கரை அளவு கூடியதால் மருத்துவர் மருந்து அளவை உயர்த்தியுள்ளார்: மெட்பார்மின் 1000mg தினமும் இருவேளை, இரத்த அழுத்தத்திற்கு டெல்மிசார்டன் 40mg மற்றும் கொலஸ்ட்ராலுக்கு அட்டோர்வாஸ்டேடின் 10mg பரிந்துரைக்கப்பட்டுள்ளது.',
      extractedVia: 'verified_dataset'
    },
    {
      id: 'rec_ananya_lab_1',
      patientId: 'usr_pat_2',
      title: 'Complete Blood Count & Thyroid Panel',
      recordType: 'lab_report',
      date: '2026-09-14',
      doctorName: 'Dr. Meenakshi Ramanathan',
      facility: 'Lal PathLabs',
      ocrText: `DR LAL PATHLABS - LABORATORY REPORT
Patient: Ananya Jayaraman | Age: 34 | Gender: F
Date: 14-09-2026

TEST NAME                           VALUE       UNITS     NORMAL RANGE
Hemoglobin (Hb)                     10.2 [LOW]  g/dL      12.0 - 15.5
Packed Cell Volume (PCV)            32.4 [LOW]  %         36 - 46
RBC Count                           3.8         mil/uL    3.8 - 5.2
Platelet Count                      220000      /mcL      150000 - 450000
TSH (Ultrasensitive)                3.1         uIU/mL    0.4 - 4.2
Free T4                             1.12        ng/dL     0.8 - 1.8`,
      medications: [],
      tests: [
        { name: 'Hemoglobin (Hb)', value: '10.2', unit: 'g/dL', range: '12.0 - 15.5 g/dL', status: 'LOW' },
        { name: 'Packed Cell Volume', value: '32.4', unit: '%', range: '36 - 46 %', status: 'LOW' },
        { name: 'Thyroid Stimulating Hormone (TSH)', value: '3.1', unit: 'uIU/mL', range: '0.4 - 4.2 uIU/mL', status: 'NORMAL' },
        { name: 'Platelet Count', value: '220000', unit: '/mcL', range: '150000 - 450000 /mcL', status: 'NORMAL' }
      ],
      abnormalFlags: [
        {
          parameter: 'Hemoglobin',
          parameterTa: 'ஹீமோகுளோபின்',
          value: '10.2 g/dL',
          normalRange: '12.0 - 15.5 g/dL',
          status: 'LOW',
          severity: 'Mild',
          explanationEn: 'Hemoglobin is mildly low at 10.2 g/dL, indicating mild iron deficiency anemia. Common symptoms include mild fatigue.',
          explanationTa: 'ஹீமோகுளோபின் அளவு 10.2 g/dL ஆக சற்று குறைவாக உள்ளது (லேசான இரத்த சோகை). இரும்புச்சத்து உணவுகள் மற்றும் சப்ளிமெண்ட்ஸ் தேவை.'
        }
      ],
      diagnoses: ['Mild Iron Deficiency Anemia', 'Euthyroid State on Levothyroxine'],
      summaryEn: 'Blood tests show stable thyroid control (TSH 3.1 within normal limits) but mild anemia with Hemoglobin at 10.2 g/dL. Iron supplementation recommended.',
      summaryTa: 'ஆய்வக முடிவுகள்: தைராய்டு அளவுகள் (TSH 3.1) சீராக உள்ளன. எனினும் ஹீமோகுளோபின் 10.2 g/dL ஆக சற்று குறைவாக உள்ளதால் இரும்புச்சத்து சப்ளிமெண்ட்ஸ் பரிந்துரைக்கப்படுகின்றன.',
      extractedVia: 'verified_dataset'
    },
    {
      id: 'rec_ananya_rx_1',
      patientId: 'usr_pat_2',
      title: 'Thyroid & Iron Supplementation Prescription',
      recordType: 'prescription',
      date: '2026-09-16',
      doctorName: 'Dr. Meenakshi Ramanathan',
      facility: 'Apollo Specialty Hospitals',
      ocrText: `APOLLO CLINIC - PRESCRIPTION
Patient: Ananya Jayaraman | 34 F | Date: 16-09-2026
Diagnosis: Primary Hypothyroidism (controlled), Mild Anemia

1. Tab Thyronorm 50mcg - 1-0-0 early morning on empty stomach with water
2. Tab Autrin (Ferrous Fumarate + Folic acid) - 0-1-0 after lunch x 60 days
3. Tab Limcee (Vitamin C 500mg) - chewable once daily to assist iron absorption`,
      medications: [
        { name: 'Thyronorm 50mcg', dosage: '50 mcg', frequency: '1-0-0 (Early Morning)', instructions: 'Empty stomach with plain water, wait 45 mins before tea/coffee', purposeEn: 'Thyroid hormone replacement', purposeTa: 'தைராய்டு ஹார்மோன் சமநிலை' },
        { name: 'Autrin Iron & Folic Acid', dosage: 'Standard', frequency: '0-1-0 (After Lunch)', instructions: 'Take with food or citrus juice', purposeEn: 'Treats mild anemia and rebuilds hemoglobin', purposeTa: 'இரத்த சோகையை போக்கி ஹீமோகுளோபினை அதிகரிக்கிறது' },
        { name: 'Limcee 500mg', dosage: '500 mg', frequency: '1 chewable tablet daily', instructions: 'Chewable after meals', purposeEn: 'Aids iron absorption and immune support', purposeTa: 'இரும்புச்சத்து உறிஞ்சுதலுக்கு உதவுகிறது' }
      ],
      tests: [],
      abnormalFlags: [],
      diagnoses: ['Primary Hypothyroidism', 'Mild Iron Deficiency Anemia'],
      summaryEn: 'Continuation of Thyronorm 50mcg taken 45 minutes prior to breakfast. Added Autrin iron supplement and Vitamin C after lunch for 60 days to treat anemia.',
      summaryTa: 'தைரோநார்ம் 50mcg காலையில் வெறும் வயிற்றில் தொடர்ந்து எடுக்கவும். இரத்த சோகையை போக்க ஆட்ரின் இரும்புச்சத்து மாத்திரை மதிய உணவுக்குப் பின் 60 நாட்களுக்கு வழங்கப்பட்டுள்ளது.',
      extractedVia: 'verified_dataset'
    },
    {
      id: 'rec_murugan_discharge_1',
      patientId: 'usr_pat_3',
      title: 'Cardiovascular Evaluation & Discharge Summary',
      recordType: 'discharge_summary',
      date: '2026-08-30',
      doctorName: 'Dr. Karthik Senthilvel',
      facility: 'Madras Medical Mission, Chennai',
      ocrText: `MADRAS MEDICAL MISSION - DISCHARGE SUMMARY
Patient: Murugan Thangavel | 62 M | IP No: MMM-26-88192
Admission: 28-08-2026 | Discharge: 30-08-2026
Consultant: Dr. Karthik Senthilvel, DM (Cardiology)

Diagnosis: Stable Angina / Coronary Artery Disease - Evaluated
Echocardiogram: Normal LV function, LVEF 60%, No regional wall motion abnormalities.
TMT: Indeterminate at stage 2 due to knee discomfort.

Discharge Medications:
1. Tab Atorvastatin 20mg - 0-0-1 bedtime
2. Tab Aspirin 75mg - 0-1-0 after lunch
3. Tab Metoprolol Succinate 25mg - 1-0-0 morning after breakfast`,
      medications: [
        { name: 'Atorvastatin 20mg', dosage: '20 mg', frequency: '0-0-1 (Bedtime)', instructions: 'Daily at night', purposeEn: 'Cardiovascular plaque stabilization & lipid reduction', purposeTa: 'இதய நாளங்களில் கொழுப்பு படிவதைத் தடுக்கிறது' },
        { name: 'Aspirin 75mg', dosage: '75 mg', frequency: '0-1-0 (After Lunch)', instructions: 'Take strictly after meals', purposeEn: 'Blood thinner preventing clot formation', purposeTa: 'இரத்தம் உறைவதைத் தடுக்கும் மருந்து' },
        { name: 'Metoprolol Succinate 25mg', dosage: '25 mg', frequency: '1-0-0 (Morning)', instructions: 'Daily morning with water', purposeEn: 'Maintains steady heart rate and BP', purposeTa: 'இதயத் துடிப்பை சீராக வைக்கிறது' }
      ],
      tests: [
        { name: 'Left Ventricular Ejection Fraction (LVEF)', value: '60', unit: '%', range: '55 - 70 %', status: 'NORMAL' }
      ],
      abnormalFlags: [],
      diagnoses: ['Stable Coronary Artery Disease', 'Dyslipidemia'],
      summaryEn: 'Discharge summary following cardiac evaluation by Dr. Karthik Senthilvel. Heart pumping function is good (LVEF 60%). Initiated on protective cardio medications including Aspirin 75mg, Atorvastatin 20mg, and Metoprolol 25mg.',
      summaryTa: 'டாக்டர் கார்த்திக் செந்தில்வேலின் இதய பரிசோதனை டிஸ்சார்ஜ் அறிக்கை: இதயத்தின் பம்பிங் செயல்பாடு இயல்பாக உள்ளது (LVEF 60%). இதயத்தைப் பாதுகாக்க ஆஸ்பிரின் 75mg, அட்டோர்வாஸ்டேடின் 20mg மற்றும் மெட்டோப்ரோலோல் 25mg வழங்கப்பட்டுள்ளது.',
      extractedVia: 'verified_dataset'
    }
  ];

  for (const r of sampleRecords) {
    await db.put('records', r);
    // Also mirror to timeline_events
    await db.put('timeline_events', {
      id: `evt_${r.id}`,
      patientId: r.patientId,
      recordId: r.id,
      date: r.date,
      title: r.title,
      recordType: r.recordType,
      doctorName: r.doctorName,
      summaryEn: r.summaryEn,
      summaryTa: r.summaryTa,
      abnormalCount: r.abnormalFlags.length,
      medCount: r.medications.length
    });
  }

  // 5. Access Grants (Patient Suresh grants access to Dr. Meenakshi Ramanathan)
  const accessGrants = [
    {
      id: 'grant_1',
      patientId: 'usr_pat_1',
      doctorId: 'usr_doc_1',
      grantedAt: '2026-09-10T12:00:00Z',
      scope: 'ALL_RECORDS',
      status: 'active'
    },
    {
      id: 'grant_2',
      patientId: 'usr_pat_2',
      doctorId: 'usr_doc_1',
      grantedAt: '2026-09-12T14:00:00Z',
      scope: 'ALL_RECORDS',
      status: 'active'
    },
    {
      id: 'grant_3',
      patientId: 'usr_pat_3',
      doctorId: 'usr_doc_2',
      grantedAt: '2026-09-15T10:00:00Z',
      scope: 'ALL_RECORDS',
      status: 'active'
    }
  ];
  for (const ag of accessGrants) {
    await db.put('access_grants', ag);
  }

  // 6. Doctor clinical notes
  const doctorNotes = [
    {
      id: 'note_1',
      patientId: 'usr_pat_1',
      doctorId: 'usr_doc_1',
      doctorName: 'Dr. Meenakshi Ramanathan',
      date: '2026-09-20',
      title: 'Consultation Note: Diabetes Review',
      note: 'Patient advised on dietary carbohydrate control. Metformin dose escalated to 1000mg. Review blood sugars with log in 4 weeks. Exercise 30 min daily.',
      createdAt: '2026-09-20T11:45:00Z'
    }
  ];
  for (const dn of doctorNotes) {
    await db.put('doctor_notes', dn);
  }

  // 7. Initial Audit logs
  await logAudit({
    userId: 'system',
    userName: 'System Bootstrapper',
    action: 'SYSTEM_SEED',
    details: 'Initial clinical demo dataset loaded successfully with ABDM mock profiles'
  });

  console.log('Seed database ready!');
}
