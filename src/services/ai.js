/**
 * AI & Rule-Based Clinical Extraction Engine
 * Integrates Google Gemini API with robust client-side rule-based fallback
 */

const GEMINI_API_KEY_STORAGE = 'ahc_gemini_api_key';

export function getStoredApiKey() {
  return localStorage.getItem(GEMINI_API_KEY_STORAGE) || '';
}

export function saveStoredApiKey(key) {
  if (key) {
    localStorage.setItem(GEMINI_API_KEY_STORAGE, key.trim());
  } else {
    localStorage.removeItem(GEMINI_API_KEY_STORAGE);
  }
}

// Medical Reference Ranges for abnormal detection
const LAB_REFERENCE_RANGES = {
  hba1c: { min: 4.0, max: 5.7, unit: '%', nameEn: 'HbA1c (Glycated Hemoglobin)', nameTa: 'எச்பிஏ1சி (சர்க்கரை அளவு)' },
  fasting_glucose: { min: 70, max: 100, unit: 'mg/dL', nameEn: 'Fasting Blood Sugar', nameTa: 'உணவுக்கு முன் இரத்த சர்க்கரை' },
  postprandial_glucose: { min: 70, max: 140, unit: 'mg/dL', nameEn: 'Postprandial Blood Sugar', nameTa: 'உணவுக்குப் பின் சர்க்கரை' },
  total_cholesterol: { min: 120, max: 200, unit: 'mg/dL', nameEn: 'Total Cholesterol', nameTa: 'மொத்த கொலஸ்ட்ரால்' },
  ldl: { min: 50, max: 100, unit: 'mg/dL', nameEn: 'LDL Bad Cholesterol', nameTa: 'எல்டிஎல் கெட்ட கொழுப்பு' },
  hdl: { min: 40, max: 80, unit: 'mg/dL', nameEn: 'HDL Good Cholesterol', nameTa: 'எச்டிஎல் நல்ல கொழுப்பு' },
  triglycerides: { min: 50, max: 150, unit: 'mg/dL', nameEn: 'Triglycerides', nameTa: 'டிரைகிளிசரைடுகள்' },
  hemoglobin: { min: 12.0, max: 17.0, unit: 'g/dL', nameEn: 'Hemoglobin', nameTa: 'ஹீமோகுளோபின்' },
  platelets: { min: 150000, max: 450000, unit: '/mcL', nameEn: 'Platelet Count', nameTa: 'தட்டணுக்கள் எண்ணிக்கை' },
  wbc: { min: 4000, max: 11000, unit: '/mcL', nameEn: 'WBC (Total Leucocyte Count)', nameTa: 'வெள்ளை இரத்த அணுக்கள்' },
  creatinine: { min: 0.6, max: 1.2, unit: 'mg/dL', nameEn: 'Serum Creatinine', nameTa: 'சீரம் கிரியேட்டினின் (சிறுநீரக செயல்பாடு)' },
  blood_urea: { min: 15, max: 40, unit: 'mg/dL', nameEn: 'Blood Urea', nameTa: 'இரத்த யூரியா' },
  systolic_bp: { min: 90, max: 120, unit: 'mmHg', nameEn: 'Systolic Blood Pressure', nameTa: 'சிஸ்டாலிக் இரத்த அழுத்தம்' },
  diastolic_bp: { min: 60, max: 80, unit: 'mmHg', nameEn: 'Diastolic Blood Pressure', nameTa: 'டயஸ்டாலிக் இரத்த அழுத்தம்' },
  tsh: { min: 0.4, max: 4.5, unit: 'mIU/L', nameEn: 'Thyroid Stimulating Hormone (TSH)', nameTa: 'தைராய்டு ஹார்மோன் (TSH)' }
};

/**
 * Rule-based clinical extraction fallback when no API key or network is present
 */
export function extractClinicalDataRuleBased(text) {
  const lower = text.toLowerCase();
  
  // Extract medications
  const medicineRegex = /(?:tab|cap|syrup|inj|tablet|capsule)?\.?\s*([A-Za-z0-9\-]+(?:\s+[A-Za-z0-9\-]+)?)\s+(\d+(?:\.\d+)?\s*(?:mg|mcg|ml|g))\s*(?:(?:1-0-1|1-0-0|0-0-1|0-1-0|1-1-1|once daily|twice daily|bd|od|tid|sos|after food|before food))?/gi;
  const commonMeds = [
    { pattern: /metformin\s*(\d+\s*mg)?/i, name: 'Metformin', dosage: '500 mg', freq: 'Twice daily after food', descEn: 'Used for controlling blood glucose in Type 2 Diabetes.', descTa: 'இரண்டாம் வகை நீரிழிவு நோயில் இரத்த சர்க்கரையைக் கட்டுப்படுத்த பயன்படுகிறது.' },
    { pattern: /telmisartan\s*(\d+\s*mg)?/i, name: 'Telmisartan', dosage: '40 mg', freq: 'Once daily morning', descEn: 'Blood pressure medication.', descTa: 'இரத்த அழுத்தத்தைக் கட்டுப்படுத்தும் மருந்து.' },
    { pattern: /atorvastatin\s*(\d+\s*mg)?/i, name: 'Atorvastatin', dosage: '10 mg', freq: 'Once daily bedtime', descEn: 'Cholesterol-lowering medication (statin).', descTa: 'கொழுப்பைக் குறைக்கும் மருந்து.' },
    { pattern: /pantoprazole\s*(\d+\s*mg)?/i, name: 'Pantoprazole', dosage: '40 mg', freq: 'Once daily before breakfast', descEn: 'Reduces stomach acid, protects stomach lining.', descTa: 'அசிடிட்டி மற்றும் வயிற்று அமிலத்தைக் குறைக்கும் மருந்து.' },
    { pattern: /paracetamol|crocin|dolo\s*(\d+\s*mg)?/i, name: 'Paracetamol', dosage: '650 mg', freq: 'As needed (SOS) for fever/pain', descEn: 'Analgesic and antipyretic for fever or pain.', descTa: 'காய்ச்சல் அல்லது வலி நிவாரணி.' },
    { pattern: /amoxicillin\s*(\d+\s*mg)?/i, name: 'Amoxicillin', dosage: '500 mg', freq: 'Three times daily', descEn: 'Antibiotic for bacterial infections.', descTa: 'பாக்டீரியா தொற்றுக்கான நுண்ணுயிர் எதிர்ப்பி மருந்து.' }
  ];

  const medications = [];
  commonMeds.forEach(m => {
    if (m.pattern.test(text)) {
      medications.push({
        name: m.name,
        dosage: m.dosage,
        frequency: m.freq,
        instructions: 'Take with water',
        purposeEn: m.descEn,
        purposeTa: m.descTa
      });
    }
  });

  // Extract lab tests & detect abnormalities
  const tests = [];
  const abnormalFlags = [];

  // HbA1c
  const hba1cMatch = text.match(/hba1c[^\d]*(\d+(?:\.\d+)?)\s*%?/i);
  if (hba1cMatch) {
    const val = parseFloat(hba1cMatch[1]);
    const ref = LAB_REFERENCE_RANGES.hba1c;
    const isAbnormal = val > ref.max || val < ref.min;
    const status = val > ref.max ? 'HIGH' : (val < ref.min ? 'LOW' : 'NORMAL');
    tests.push({ name: ref.nameEn, value: val, unit: '%', range: `${ref.min} - ${ref.max} %`, status });
    if (isAbnormal) {
      abnormalFlags.push({
        parameter: ref.nameEn,
        parameterTa: ref.nameTa,
        value: `${val} %`,
        normalRange: `${ref.min} - ${ref.max} %`,
        status,
        severity: val > 8.0 ? 'Critical' : 'Moderate',
        explanationEn: `HbA1c level of ${val}% indicates ${val > 6.5 ? 'elevated long-term blood glucose (Diabetes)' : 'pre-diabetes range'}. Target is below 5.7%.`,
        explanationTa: `எச்பிஏ1சி அளவு ${val}% என்பது நீண்டகால இரத்த சர்க்கரை அளவு இயல்பை விட அதிகமாக உள்ளதைக் குறிக்கிறது. இலக்கு 5.7% க்கும் குறைவாக இருக்க வேண்டும்.`
      });
    }
  }

  // Fasting glucose
  const fbsMatch = text.match(/(?:fasting\s*(?:blood)?\s*sugar|fbs|fasting\s*glucose)[^\d]*(\d+(?:\.\d+)?)/i);
  if (fbsMatch) {
    const val = parseFloat(fbsMatch[1]);
    const ref = LAB_REFERENCE_RANGES.fasting_glucose;
    const isAbnormal = val > ref.max || val < ref.min;
    const status = val > ref.max ? 'HIGH' : (val < ref.min ? 'LOW' : 'NORMAL');
    tests.push({ name: ref.nameEn, value: val, unit: 'mg/dL', range: '70 - 100 mg/dL', status });
    if (isAbnormal) {
      abnormalFlags.push({
        parameter: ref.nameEn,
        parameterTa: ref.nameTa,
        value: `${val} mg/dL`,
        normalRange: '70 - 100 mg/dL',
        status,
        severity: val > 180 ? 'Critical' : 'Moderate',
        explanationEn: `Fasting blood glucose is ${val} mg/dL (Normal: 70-100 mg/dL). High readings require dietary review or medical consultation.`,
        explanationTa: `உணவுக்கு முன் இரத்த சர்க்கரை ${val} mg/dL ஆக உயர்ந்துள்ளது (இயல்பு: 70-100 mg/dL). உணவுமுறை கட்டுப்பாடு மற்றும் மருத்துவ ஆலோசனை தேவை.`
      });
    }
  }

  // Cholesterol
  const cholMatch = text.match(/(?:total\s*cholesterol|cholesterol)[^\d]*(\d+(?:\.\d+)?)/i);
  if (cholMatch) {
    const val = parseFloat(cholMatch[1]);
    const ref = LAB_REFERENCE_RANGES.total_cholesterol;
    const isAbnormal = val > ref.max;
    const status = isAbnormal ? 'HIGH' : 'NORMAL';
    tests.push({ name: ref.nameEn, value: val, unit: 'mg/dL', range: '120 - 200 mg/dL', status });
    if (isAbnormal) {
      abnormalFlags.push({
        parameter: ref.nameEn,
        parameterTa: ref.nameTa,
        value: `${val} mg/dL`,
        normalRange: '< 200 mg/dL',
        status,
        severity: val > 240 ? 'High' : 'Moderate',
        explanationEn: `Total cholesterol is elevated at ${val} mg/dL (Desirable: <200 mg/dL). Lifestyle modifications and dietary review recommended.`,
        explanationTa: `மொத்த கொலஸ்ட்ரால் ${val} mg/dL ஆக அதிகரித்துள்ளது (விரும்பத்தக்கது: <200 mg/dL). கொழுப்பு குறைந்த உணவு மற்றும் உடற்பயிற்சி தேவை.`
      });
    }
  }

  // Creatinine
  const creatMatch = text.match(/(?:creatinine|serum\s*creatinine)[^\d]*(\d+(?:\.\d+)?)/i);
  if (creatMatch) {
    const val = parseFloat(creatMatch[1]);
    const ref = LAB_REFERENCE_RANGES.creatinine;
    const isAbnormal = val > ref.max;
    const status = isAbnormal ? 'HIGH' : 'NORMAL';
    tests.push({ name: ref.nameEn, value: val, unit: 'mg/dL', range: '0.6 - 1.2 mg/dL', status });
    if (isAbnormal) {
      abnormalFlags.push({
        parameter: ref.nameEn,
        parameterTa: ref.nameTa,
        value: `${val} mg/dL`,
        normalRange: '0.6 - 1.2 mg/dL',
        status,
        severity: 'Moderate',
        explanationEn: `Serum creatinine is slightly high at ${val} mg/dL. Monitors kidney filtration capacity.`,
        explanationTa: `சீரம் கிரியேட்டினின் ${val} mg/dL ஆக சற்று உயர்ந்துள்ளது. இது சிறுநீரக செயல்பாட்டுடன் தொடர்புடையது.`
      });
    }
  }

  // Hemoglobin
  const hbMatch = text.match(/(?:hemoglobin|hb)[^\d]*(\d+(?:\.\d+)?)/i);
  if (hbMatch) {
    const val = parseFloat(hbMatch[1]);
    const ref = LAB_REFERENCE_RANGES.hemoglobin;
    const isAbnormal = val < ref.min;
    const status = val < ref.min ? 'LOW' : (val > ref.max ? 'HIGH' : 'NORMAL');
    tests.push({ name: ref.nameEn, value: val, unit: 'g/dL', range: '12.0 - 17.0 g/dL', status });
    if (isAbnormal) {
      abnormalFlags.push({
        parameter: ref.nameEn,
        parameterTa: ref.nameTa,
        value: `${val} g/dL`,
        normalRange: '12.0 - 17.0 g/dL',
        status,
        severity: val < 10 ? 'High' : 'Mild',
        explanationEn: `Hemoglobin is low at ${val} g/dL, indicating mild or moderate anemia. Iron-rich foods or supplements may be needed.`,
        explanationTa: `ஹீமோகுளோபின் ${val} g/dL ஆக குறைவாக உள்ளது (இரத்த சோகை அறிகுறி). இரும்புச்சத்து நிறைந்த உணவுகள் தேவைப்படலாம்.`
      });
    }
  }

  // Diagnoses detection
  const diagnoses = [];
  if (/type\s*2\s*diabetes|diabetes\s*mellitus|dm2|t2dm/i.test(text)) diagnoses.push('Type 2 Diabetes Mellitus');
  if (/hypertension|htn|high\s*bp/i.test(text)) diagnoses.push('Essential Hypertension');
  if (/dyslipidemia|hypercholesterolemia/i.test(text)) diagnoses.push('Dyslipidemia');
  if (/anemia|anaemia/i.test(text)) diagnoses.push('Anemia');
  if (/fever|pyrexia|viral\s*fever/i.test(text)) diagnoses.push('Acute Febrile Illness / Viral Fever');
  if (diagnoses.length === 0) diagnoses.push('General Health Checkup & Clinical Evaluation');

  // Doctor & Date
  const doctorMatch = text.match(/(?:dr\.|doctor)\s*([A-Za-z\s.]+)/i);
  const doctorName = doctorMatch ? `Dr. ${doctorMatch[1].trim().split('\n')[0].substring(0, 30)}` : 'Attending Physician';

  const dateMatch = text.match(/(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/);
  const recordDate = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];

  // Document Type
  let recordType = 'lab_report';
  if (/prescription|rx|tab\.|cap\.|dosage/i.test(text)) recordType = 'prescription';
  else if (/discharge\s*summary|admission\s*date|discharge\s*date/i.test(text)) recordType = 'discharge_summary';
  else if (/radiology|x-ray|ultrasound|mri|ct\s*scan/i.test(text)) recordType = 'diagnostic_report';

  // Synthesize Plain-Language Summaries
  const summaryEn = `This medical document dated ${recordDate} contains records from ${doctorName}. ` +
    (medications.length > 0 ? `It includes prescriptions for ${medications.map(m => m.name).join(', ')}. ` : '') +
    (abnormalFlags.length > 0 ? `There are ${abnormalFlags.length} flagged abnormal parameters: ${abnormalFlags.map(f => `${f.parameter} (${f.value})`).join(', ')}. ` : 'All analyzed parameters are within standard acceptable limits. ') +
    `Key identified conditions include: ${diagnoses.join(', ')}. Continue regular follow-ups with your consulting doctor.`;

  const summaryTa = `இந்த மருத்துவ ஆவணம் ${recordDate} தேதியிட்டது (${doctorName}). ` +
    (medications.length > 0 ? `இதில் ${medications.map(m => m.name).join(', ')} போன்ற மருந்துகள் பரிந்துரைக்கப்பட்டுள்ளன. ` : '') +
    (abnormalFlags.length > 0 ? `இதில் ${abnormalFlags.length} அசாதாரண அளவுகள் கவனிக்கப்பட்டுள்ளன: ${abnormalFlags.map(f => `${f.parameterTa || f.parameter} (${f.value})`).join(', ')}. ` : 'பகுப்பாய்வு செய்யப்பட்ட அனைத்து அளவுகளும் இயல்பான வரம்பிற்குள் உள்ளன. ') +
    `முக்கிய நோயறிதல்: ${diagnoses.join(', ')}. உங்கள் மருத்துவரிடம் முறையான ஆலோசனையைப் பெறவும்.`;

  return {
    recordType,
    doctorName,
    recordDate,
    medications,
    tests,
    abnormalFlags,
    diagnoses,
    summaryEn,
    summaryTa,
    extractedVia: 'rule_based_engine'
  };
}

/**
 * Calls Gemini API if an API key is available, returning strict clinical JSON
 */
export async function analyzeMedicalTextWithAI(ocrText) {
  const apiKey = getStoredApiKey();

  if (!apiKey) {
    // Graceful fallback to rule-based engine
    return extractClinicalDataRuleBased(ocrText);
  }

  const prompt = `You are a clinical document analysis assistant for a bilingual medical platform. 
Analyze the following OCR document text extracted from a medical record (prescription, lab report, discharge summary).
Return ONLY a valid, parseable JSON object without markdown formatting, code fences or extra text.

JSON Structure:
{
  "recordType": "prescription" | "lab_report" | "discharge_summary" | "diagnostic_report",
  "doctorName": "Name of doctor or healthcare clinic",
  "recordDate": "YYYY-MM-DD or document date",
  "medications": [
    {
      "name": "Medication name",
      "dosage": "e.g. 500mg",
      "frequency": "e.g. 1-0-1 after food or Twice daily",
      "instructions": "Directions",
      "purposeEn": "Plain language purpose in English",
      "purposeTa": "Plain language purpose in Tamil"
    }
  ],
  "tests": [
    {
      "name": "Test name",
      "value": "Numeric value or text",
      "unit": "Unit of measure",
      "range": "Normal reference range",
      "status": "NORMAL" | "HIGH" | "LOW"
    }
  ],
  "abnormalFlags": [
    {
      "parameter": "Parameter name in English",
      "parameterTa": "Parameter name in Tamil",
      "value": "Value with unit",
      "normalRange": "Expected range",
      "status": "HIGH" | "LOW",
      "severity": "Mild" | "Moderate" | "Critical",
      "explanationEn": "Clear, reassuring patient-friendly English explanation of what this abnormal level implies.",
      "explanationTa": "Clear, reassuring patient-friendly Tamil explanation of what this abnormal level implies."
    }
  ],
  "diagnoses": ["List of diagnosed conditions or reasons for visit"],
  "summaryEn": "Complete, empathetic, plain-language patient summary in English explaining the visit, medications, and any watchouts. Do not provide diagnosis.",
  "summaryTa": "Complete, empathetic, plain-language patient summary in Tamil (எளிய தமிழில் மருத்துவர் ஆவண விளக்கம்) explaining visit, medicines, watchouts."
}

Document OCR Text:
"""
${ocrText}
"""`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: "application/json",
          temperature: 0.2
        }
      })
    });

    if (!response.ok) {
      console.warn('Gemini API call failed, falling back to rule-based engine', response.statusText);
      return extractClinicalDataRuleBased(ocrText);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (candidateText) {
      const cleanJson = candidateText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      const parsed = JSON.parse(cleanJson);
      parsed.extractedVia = 'gemini_ai';
      return parsed;
    }

    return extractClinicalDataRuleBased(ocrText);
  } catch (error) {
    console.warn('Gemini parsing or network error, using fallback:', error);
    return extractClinicalDataRuleBased(ocrText);
  }
}

/**
 * Medical Records Q&A Chatbot Engine
 * Answering ONLY from the patient's own records, safely in English or Tamil
 */
export async function askRecordsAssistant({ question, patientRecords, patientProfile, language = 'en' }) {
  const apiKey = getStoredApiKey();

  // Prepare context from all patient records
  const recordsSummary = patientRecords.map((r, i) => {
    return `Record #${i + 1} (${r.recordType}, Date: ${r.date}, Doctor: ${r.doctorName || 'N/A'}):
- Diagnoses: ${(r.diagnoses || []).join(', ')}
- Medications: ${(r.medications || []).map(m => `${m.name} (${m.dosage}, ${m.frequency})`).join('; ')}
- Abnormal findings: ${(r.abnormalFlags || []).map(a => `${a.parameter}: ${a.value} [${a.status}]`).join('; ')}
- Clinical Notes/Summary: ${r.summaryEn || ''}`;
  }).join('\n\n');

  const profileSummary = `Patient Name: ${patientProfile?.fullName || 'Patient'}, Age: ${patientProfile?.age || 'N/A'}, Allergies: ${(patientProfile?.allergies || ['None known']).join(', ')}, Chronic Conditions: ${(patientProfile?.chronicConditions || []).join(', ')}, Current Medications: ${(patientProfile?.currentMedicines || []).join(', ')}`;

  const isEmergencyQuery = /chest pain|heart attack|can't breathe|difficulty breathing|unconscious|heavy bleeding|stroke|poison|paralysis|நெஞ்சு வலி|மூச்சுத் திணறல்|இரத்தப்போக்கு/i.test(question);

  if (isEmergencyQuery) {
    if (language === 'ta') {
      return "⚠️ **அவசர எச்சரிக்கை**: நீங்கள் தீவிர அறிகுறிகளை (மார்பு வலி, மூச்சுத்திணறல், அதிக இரத்தப்போக்கு போன்றவை) உணர்ந்தால், தாமதிக்காமல் உடனடியாக அவசர மருத்துவ சேவையை (108 அல்லது 112) அல்லது அருகிலுள்ள அவசர சிகிச்சை பிரிவை அணுகவும். இந்த AI உதவியாளர் அவசர கால மருத்துவ சிகிச்சை வழங்க இயலாது.";
    }
    return "⚠️ **EMERGENCY WARNING**: If you or someone with you is experiencing acute chest pain, severe shortness of breath, sudden numbness, or heavy bleeding, please immediately call Emergency Services (108 or 112 in India, or your local emergency number) or visit the nearest emergency room. This assistant cannot provide emergency medical care.";
  }

  if (apiKey) {
    const chatPrompt = `You are the "Health Copilot Assistant", an empathetic, clinical records-grounded assistant for a patient.
CRITICAL SAFETY RULES:
1. Answer strictly using ONLY the provided patient records and medical profile below.
2. If the question asks about something not mentioned in their records, politely explain that you do not have that information in their uploaded history.
3. NEVER make a new diagnosis or prescribe new treatments. Always include a short friendly reminder to consult their doctor.
4. If symptoms sound urgent, advise immediate emergency care (108 / 112).
5. Respond in ${language === 'ta' ? 'TAMIL (தமிழ்)' : 'ENGLISH'}. Keep the response clear, caring, and easy to understand for an everyday person.

PATIENT PROFILE:
${profileSummary}

PATIENT MEDICAL RECORDS:
${recordsSummary || 'No medical records uploaded yet.'}

PATIENT QUESTION:
"${question}"`;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: chatPrompt }] }],
          generationConfig: { temperature: 0.3 }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch (e) {
      console.warn('Chatbot Gemini API error, falling back to rule-based matcher:', e);
    }
  }

  // Rule-based conversational records matcher
  const qLower = question.toLowerCase();

  // 1. Medications / Prescriptions query
  if (qLower.includes('medicine') || qLower.includes('medication') || qLower.includes('drug') || qLower.includes('tablet') || qLower.includes('dose') || qLower.includes('prescription') || qLower.includes('மருந்து') || qLower.includes('மாத்திரை')) {
    const allMeds = [];
    patientRecords.forEach(r => {
      (r.medications || []).forEach(m => allMeds.push(`${m.name} (${m.dosage || ''} • ${m.frequency || ''})`));
    });
    // Also include profile current medicines if not in records
    if (patientProfile?.currentMedicines && Array.isArray(patientProfile.currentMedicines)) {
      patientProfile.currentMedicines.forEach(m => allMeds.push(m));
    }

    if (allMeds.length > 0) {
      const uniqueMeds = [...new Set(allMeds)];
      if (language === 'ta') {
        return `உங்கள் மருத்துவ பதிவுகளின்படி, நீங்கள் எடுக்கும் மருந்துகள்:\n• ${uniqueMeds.join('\n• ')}\n\n⚠️ நினைவூட்டல்: மருத்துவரின் ஆலோசனை இல்லாமல் மருந்து அளவை மாற்றவோ நிறுத்தவோ வேண்டாம்.`;
      }
      return `According to your health records, your active recorded medications are:\n• ${uniqueMeds.join('\n• ')}\n\n⚠️ Always adhere to the specific instructions provided by your prescribing doctor.`;
    } else {
      return language === 'ta' 
        ? "உங்கள் பதிவுகளில் மருந்துகள் எதுவும் இன்னும் பதிவு செய்யப்படவில்லை. புதிய மருந்துச் சீட்டை பதிவேற்றவும்."
        : "No active medications found in your uploaded records yet. Upload a prescription to track your medicines!";
    }
  }

  // 2. Blood Sugar / HbA1c / Diabetes
  if (qLower.includes('sugar') || qLower.includes('diabetes') || qLower.includes('hba1c') || qLower.includes('glucose') || qLower.includes('fbs') || qLower.includes('ppbs') || qLower.includes('சர்க்கரை') || qLower.includes('நீரிழிவு')) {
    const sugarTests = [];
    patientRecords.forEach(r => {
      (r.tests || []).forEach(t => {
        if (/glucose|sugar|hba1c|fbs|ppbs/i.test(t.name)) {
          sugarTests.push(`${t.name}: ${t.value} ${t.unit || ''} (Date: ${r.date}) [Status: ${t.status || 'NORMAL'}]`);
        }
      });
      // also check abnormalFlags
      (r.abnormalFlags || []).forEach(f => {
        if (/glucose|sugar|hba1c/i.test(f.parameter || '')) {
          sugarTests.push(`${f.parameter}: ${f.value} [${f.status}] - ${f.explanationEn}`);
        }
      });
    });

    if (sugarTests.length > 0) {
      const uniqueSugars = [...new Set(sugarTests)];
      if (language === 'ta') {
        return `உங்கள் இரத்த சர்க்கரை மற்றும் HbA1c பரிசோதனை விவரங்கள்:\n• ${uniqueSugars.join('\n• ')}\n\nநீரிழிவு மேலாண்மைக்கு உணவு கட்டுப்பாடு மற்றும் உங்கள் மருத்துவ ஆலோசனையைத் தொடரவும்.`;
      }
      return `Here are your recent blood sugar and HbA1c readings from your records:\n• ${uniqueSugars.join('\n• ')}\n\nTarget HbA1c is generally below 5.7% for non-diabetic and below 7.0% for managed diabetes. Consult your endocrinologist for titration.`;
    }
  }

  // 3. Cholesterol / Lipid / Heart
  if (qLower.includes('cholesterol') || qLower.includes('lipid') || qLower.includes('triglyceride') || qLower.includes('ldl') || qLower.includes('hdl') || qLower.includes('கொழுப்பு') || qLower.includes('கொலஸ்ட்ரால்')) {
    const lipidTests = [];
    patientRecords.forEach(r => {
      (r.tests || []).forEach(t => {
        if (/cholesterol|triglyceride|lipid|ldl|hdl/i.test(t.name)) {
          lipidTests.push(`${t.name}: ${t.value} ${t.unit || ''} (Date: ${r.date}) [${t.status || 'NORMAL'}]`);
        }
      });
    });

    if (lipidTests.length > 0) {
      if (language === 'ta') {
        return `உங்கள் கொலஸ்ட்ரால் மற்றும் லிப்பிட் விவரங்கள்:\n• ${lipidTests.join('\n• ')}\n\nஇதய ஆரோக்கியத்திற்காக கொழுப்பு குறைந்த உணவுகளை உட்கொள்ளவும்.`;
      }
      return `Here are your lipid panel test findings:\n• ${lipidTests.join('\n• ')}\n\nLifestyle modification, physical activity, and prescribed statins help manage elevated lipids.`;
    }
  }

  // 4. Abnormal results / Issues / Red flags
  if (qLower.includes('abnormal') || qLower.includes('warning') || qLower.includes('high') || qLower.includes('low') || qLower.includes('problem') || qLower.includes('அசாதாரண') || qLower.includes('எச்சரிக்கை')) {
    const flags = [];
    patientRecords.forEach(r => {
      (r.abnormalFlags || []).forEach(f => {
        const desc = language === 'ta' && f.explanationTa ? f.explanationTa : f.explanationEn;
        flags.push(`${f.parameter} (${f.value}) [${f.status}] - ${desc}`);
      });
    });

    if (flags.length > 0) {
      if (language === 'ta') {
        return `உங்கள் பதிவுகளில் கண்டறியப்பட்ட அசாதாரண அளவுகள் (${flags.length}):\n• ${flags.join('\n• ')}\n\nஇந்த அளவுகளை உங்கள் அடுத்த மருத்துவ சந்திப்பில் மறுஆய்வு செய்யவும்.`;
      }
      return `Key flagged abnormal observations across your records (${flags.length}):\n• ${flags.join('\n• ')}\n\nPlease review these values with your healthcare provider during your next consultation.`;
    } else {
      return language === 'ta'
        ? "நல்ல செய்தி! உங்கள் தற்போதைய பதிவுகளில் அசாதாரண அளவுகள் எதுவும் கொடியிடப்படவில்லை. அனைத்து அளவுகளும் இயல்பான வரம்பில் உள்ளன."
        : "Good news! No abnormal flags were found in your currently uploaded medical records. All analyzed parameters are within standard acceptable limits.";
    }
  }

  // 5. Allergies / Conditions query
  if (qLower.includes('allergy') || qLower.includes('allergies') || qLower.includes('condition') || qLower.includes('ஒவ்வாமை') || qLower.includes('நோய்')) {
    const allergies = patientProfile?.allergies || [];
    const conditions = patientProfile?.chronicConditions || [];
    
    if (language === 'ta') {
      return `உங்கள் மருத்துவ சுயவிவரத்தின்படி:\n• அறியப்பட்ட ஒவ்வாமைகள் (Allergies): ${allergies.length > 0 ? allergies.join(', ') : 'குறிப்பிடப்படவில்லை'}\n• நாள்பட்ட நோய்கள் (Chronic Conditions): ${conditions.length > 0 ? conditions.join(', ') : 'குறிப்பிடப்படவில்லை'}`;
    }
    return `According to your medical profile:\n• Known Allergies: ${allergies.length > 0 ? allergies.join(', ') : 'None recorded'}\n• Chronic Conditions: ${conditions.length > 0 ? conditions.join(', ') : 'None recorded'}`;
  }

  // 6. Doctor / Hospital query
  if (qLower.includes('doctor') || qLower.includes('clinic') || qLower.includes('hospital') || qLower.includes('மருத்துவர்')) {
    const doctors = patientRecords.map(r => r.doctorName).filter(Boolean);
    const uniqueDocs = [...new Set(doctors)];
    if (uniqueDocs.length > 0) {
      if (language === 'ta') {
        return `உங்கள் பதிவுகளில் பதிவு செய்யப்பட்டுள்ள மருத்துவர்கள்:\n• ${uniqueDocs.join('\n• ')}`;
      }
      return `Physicians and specialists associated with your medical records:\n• ${uniqueDocs.join('\n• ')}`;
    }
  }

  // Generic grounded fallback with smart summary
  if (language === 'ta') {
    return `நான் உங்கள் ${patientRecords.length} மருத்துவ பதிவுகளையும் (${patientProfile?.fullName || 'நோயாளி'} - ABHA: ${patientProfile?.abhaId || 'Linked'}) ஆய்வு செய்துள்ளேன்.

நீங்கள் என்னிடம் கேட்கக்கூடிய விவரங்கள்:
1. "என் தற்போதைய மருந்துகள் என்னென்ன?"
2. "கடைசி சர்க்கரை / HbA1c அளவு எவ்வளவு?"
3. "எனக்கு என்னென்ன ஒவ்வாமைகள் உள்ளன?"
4. "ஏதேனும் அசாதாரண முடிவுகள் உள்ளனவா?"

மருத்துவ அவசரங்களுக்கு உடனடியாக 108 அல்லது 112 அழைக்கவும்.`;
  }

  return `I have reviewed your ${patientRecords.length} health record(s) for ${patientProfile?.fullName || 'Patient'} (ABHA: ${patientProfile?.abhaId || 'Active'}).

You can ask me questions such as:
1. "What are my active medications?"
2. "What was my last blood sugar or HbA1c reading?"
3. "Are there any abnormal lab results?"
4. "What are my documented allergies and conditions?"

Important: I am an AI assistant grounded in your uploaded records and cannot replace consultations with your doctor. For urgent chest pain or emergency symptoms, call 108 / 112 immediately.`;
}
