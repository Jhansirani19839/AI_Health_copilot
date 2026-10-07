# Demo Clinical Documents & Test Samples
## AI-Powered Personal Health Copilot (Altrix Labs Hackathon)

This document contains **ready-to-use sample medical reports, prescriptions, and discharge summaries** designed specifically for testing and presenting the **Health Copilot AI** application.

You can:
1. **Copy & Paste** any text sample directly into the **Quick Scan** editor or test scripts.
2. **Download or screenshot** the formatted cards in the app or print them to test the bilingual OCR scanner.
3. Test with both **English and Tamil (தமிழ்)** clinical phrases.

---

## 📋 Document Catalog for Demo

| # | Document Title | Document Type | Patient Profile | Key Abnormal / Test Indicators |
|---|---|---|---|---|
| **Doc 1** | Comprehensive Glycemic & Lipid Lab Report | **Lab Report** | Suresh Kumar (48 M, T2D) | HbA1c 7.8% (High), FBS 148 mg/dL, Chol 215 mg/dL |
| **Doc 2** | Outpatient Diabetology & Cardiology Prescription | **Prescription (Rx)** | Suresh Kumar (48 M) | Metformin 1000mg ER, Telmisartan 40mg, Atorvastatin 10mg |
| **Doc 3** | Complete Blood Count & Thyroid Panel | **Lab Report** | Ananya Jayaraman (34 F) | Hemoglobin 10.2 g/dL (Low Anemia), TSH 3.1 uIU/mL |
| **Doc 4** | Thyroid & Iron Deficiency Prescription | **Prescription (Rx)** | Ananya Jayaraman (34 F) | Thyronorm 50mcg, Autrin Iron + Folic Acid, Limcee 500mg |
| **Doc 5** | Inpatient Cardiology Discharge Summary | **Discharge Summary** | Murugan Thangavel (62 M) | LVEF 60%, Aspirin 75mg, Metoprolol 25mg, Atorvastatin 20mg |
| **Doc 6** | Bilingual Tamil / English Outpatient Prescription | **Bilingual Rx (தமிழ்)** | K. Meenakshisundaram (54 M) | Amoxicillin 500mg, Paracetamol 650mg, Pantoprazole 40mg |

---

## 🔬 DOCUMENT 1: Comprehensive Glycemic & Lipid Lab Report

```text
================================================================================
APOLLO DIAGNOSTICS & REFERENCE LABORATORIES
Greams Road, Chennai - 600006 | Ph: +91 44 2829 0200
NABL Accredited Laboratory | ISO 15189:2012 Certified
================================================================================
PATIENT NAME   : Suresh Kumar                     AGE / SEX   : 48 Yrs / Male
PATIENT ID     : AP-CHN-2026-9812                 DATE        : 18-Sep-2026
ABHA NUMBER    : 91-4562-7890-1234                SAMPLE TYPE : Whole Blood & Serum
REF. PHYSICIAN : Dr. Meenakshi Ramanathan, MD     STATUS      : Final Verified
================================================================================
CLINICAL BIOCHEMISTRY & ENDOCRINOLOGY REPORT

TEST NAME                              OBSERVED VALUE   REFERENCE RANGE   UNITS    FLAG
-----------------------------------------------------------------------------------------
HbA1c (Glycosylated Hemoglobin)        7.8              4.0 - 5.7         %        HIGH
Estimated Average Glucose (eAG)        177              70 - 126          mg/dL    HIGH
Fasting Blood Sugar (FBS)              148              70 - 100          mg/dL    HIGH
Postprandial Blood Sugar (PPBS)        210              70 - 140          mg/dL    HIGH

LIPID PANEL
Total Cholesterol                      215              120 - 200         mg/dL    HIGH
Serum Triglycerides                    190              50 - 150          mg/dL    HIGH
HDL Cholesterol (Good)                 42               40 - 60           mg/dL    NORMAL
LDL Cholesterol (Calculated)           135              < 100             mg/dL    HIGH

RENAL FUNCTION PANEL
Serum Creatinine                       0.9              0.6 - 1.2         mg/dL    NORMAL
Blood Urea Nitrogen (BUN)              14               7 - 20            mg/dL    NORMAL
Serum Uric Acid                        5.4              3.5 - 7.2         mg/dL    NORMAL
-----------------------------------------------------------------------------------------

CLINICAL IMPRESSION / NOTES:
- Glycemic control is suboptimal (HbA1c > 7.0%). Advise pharmacological titration.
- Mild mixed dyslipidemia with elevated LDL and Triglycerides.
- Renal parameters (Creatinine 0.9 mg/dL) are intact and within normal physiological limits.

Verified By:
Dr. K. Swaminathan, MD (Biochem)
Chief Clinical Pathologist
================================================================================
```

### 🎯 Demo Testing Prompts for Doc 1:
- **Quick Scan**: Upload this document to verify that **HbA1c (7.8%)**, **Fasting Blood Sugar (148 mg/dL)**, and **Total Cholesterol (215 mg/dL)** are detected and flagged under **Abnormal Values**.
- **Tamil Explanation Toggle**: Verify that the translation accurately explains:
  > *"எச்பிஏ1சி அளவு 7.8% ஆக உள்ளது. கடந்த 3 மாதங்களில் இரத்த சர்க்கரை அளவு இயல்பை விட அதிகமாக இருந்துள்ளது..."*

---

## 💊 DOCUMENT 2: Outpatient Diabetology & Cardiology Prescription

```text
================================================================================
APOLLO SPECIALTY HOSPITALS
Centre of Excellence in Endocrinology & Diabetes
21 Greams Lane, Thousand Lights, Chennai - 600006
================================================================================
DOCTOR: Dr. Meenakshi Ramanathan, MD, DM (Endocrinology)
REG NO: TNMC-74892 | CONSULTATION DATE: 20-Sep-2026

PATIENT DETAILS:
Name           : Suresh Kumar                     Age / Gender : 48 Y / Male
ABHA ID        : 91-4562-7890-1234                Phone        : +91 98765 43210
Vitals         : BP: 134/86 mmHg | Pulse: 76 bpm | Weight: 74 kg | BMI: 26.2

DIAGNOSIS / CLINICAL ASSESSMENT:
1. Type 2 Diabetes Mellitus - Uncontrolled on Monotherapy
2. Essential Hypertension (Grade 1)
3. Primary Dyslipidemia

Rx (PRESCRIPTION):
--------------------------------------------------------------------------------
1. Tab. METFORMIN HYDROCHLORIDE 1000 mg (Extended Release)
   Dosage: 1 tablet - Twice Daily (1 - 0 - 1)
   Timing: Immediately after breakfast & dinner
   Duration: 90 Days

2. Tab. TELMISARTAN 40 mg
   Dosage: 1 tablet - Once Daily (1 - 0 - 0)
   Timing: Morning after breakfast
   Duration: 90 Days

3. Tab. ATORVASTATIN 10 mg
   Dosage: 1 tablet - Once Daily at Bedtime (0 - 0 - 1)
   Timing: Night after dinner
   Duration: 90 Days

4. Tab. PANTOPRAZOLE 40 mg
   Dosage: 1 tablet - Once Daily (1 - 0 - 0)
   Timing: 30 minutes before breakfast on empty stomach
   Duration: 14 Days
--------------------------------------------------------------------------------

LIFESTYLE & DIETARY ADVICE:
- Engage in brisk walking for minimum 30-40 minutes at least 5 days a week.
- Restrict polished white rice, direct sucrose, sweets, and high-fat fried items.
- Maintain daily hydration of 2.5 - 3 liters of water.

FOLLOW-UP INSTRUCTIONS:
- Review in Outpatient Clinic with repeat HbA1c, FBS, and PPBS after 12 weeks.

Signature:
Dr. Meenakshi Ramanathan, MD
================================================================================
```

### 🎯 Demo Testing Prompts for Doc 2:
- **Medicines Tracker**: Save this prescription into the patient timeline, then navigate to **Medicines** tab to see all 4 drugs categorized with dosages (`1000 mg`, `40 mg`, `10 mg`, `40 mg`) and timing intervals (`1-0-1`, `1-0-0`, `0-0-1`).
- **Chatbot Test**: Ask the chatbot: *"What are my current medications and when should I take them?"*

---

## 🩸 DOCUMENT 3: Complete Blood Count & Thyroid Panel

```text
================================================================================
DR LAL PATHLABS LTD.
Regional Reference Laboratory, Nungambakkam, Chennai
================================================================================
PATIENT NAME   : Ananya Jayaraman                 AGE / SEX   : 34 Yrs / Female
PATIENT ID     : LP-9923841                       DATE        : 14-Sep-2026
ABHA NUMBER    : 91-8899-2233-4455                REF BY      : Dr. Meenakshi Ramanathan
================================================================================
HEMATOLOGY & SEROLOGY REPORT

TEST DESCRIPTION                       RESULT       BIOLOGICAL REF INTERVAL    UNITS
--------------------------------------------------------------------------------------
HEMOGLOBIN (Hb)                        10.2 [LOW]   12.0 - 15.5                g/dL
Packed Cell Volume (PCV / Hematocrit)  32.4 [LOW]   36.0 - 46.0                %
Red Blood Cell (RBC) Count             3.8          3.8 - 5.2                  mil/uL
Mean Corpuscular Volume (MCV)          76.2 [LOW]   80.0 - 100.0               fL
Total Leukocyte Count (WBC)            6,800        4,000 - 11,000             /mcL
Platelet Count                         220,000      150,000 - 450,000          /mcL

THYROID PANEL
TSH (Thyroid Stimulating Hormone)      3.10         0.40 - 4.20                uIU/mL
Free Thyroxine (FT4)                   1.12         0.80 - 1.80                ng/dL
Free Triiodothyronine (FT3)            2.90         2.00 - 4.40                pg/mL
--------------------------------------------------------------------------------------

INTERPRETATION:
- Microcytic hypochromic red blood cell picture consistent with Mild Iron Deficiency Anemia.
- Euthyroid status maintained under current levothyroxine dosage (TSH: 3.10 uIU/mL).

Pathologist In-Charge:
Dr. R. Nandakumar, MD (Path)
================================================================================
```

### 🎯 Demo Testing Prompts for Doc 3:
- **Abnormal Alert**: Hemoglobin `10.2 g/dL` detected as **LOW / Anemia**.
- **Chatbot Test**: Ask the chatbot: *"Is my thyroid level normal?"*  
  -> AI response confirms: *"Yes, your TSH is 3.10 uIU/mL, which is well within normal range (0.40 - 4.20 uIU/mL)."*

---

## 💊 DOCUMENT 4: Thyroid & Iron Supplementation Prescription

```text
================================================================================
APOLLO CLINIC - WOMEN'S HEALTH & INTERNAL MEDICINE
Anna Nagar, Chennai - 600040
================================================================================
CONSULTANT: Dr. Meenakshi Ramanathan, MD
DATE      : 16-Sep-2026 | PATIENT: Ananya Jayaraman (34 F)
ABHA ID   : 91-8899-2233-4455

DIAGNOSIS:
1. Primary Hypothyroidism (Well Compensated)
2. Mild Iron Deficiency Anemia (Hb 10.2 g/dL)

PRESCRIPTION (Rx):
1. Tab. THYRONORM 50 mcg (Levothyroxine Sodium)
   Dose: 1 tablet daily (1 - 0 - 0)
   Directions: Take early morning on an empty stomach with plain water. Wait 45 minutes before tea or breakfast.
   Duration: 60 Days

2. Cap. AUTRIN (Ferrous Fumarate + Folic Acid + Vit B12)
   Dose: 1 capsule daily (0 - 1 - 0)
   Directions: Take immediately after lunch.
   Duration: 60 Days

3. Tab. LIMCEE 500 mg (Vitamin C Chewable)
   Dose: 1 tablet daily (0 - 1 - 0)
   Directions: Chew after lunch to facilitate intestinal iron absorption.
   Duration: 60 Days

Advice:
- Incorporate green leafy vegetables, pomegranate, dates, and beetroot into daily diet.
- Repeat CBC in 2 months.
================================================================================
```

---

## 🏥 DOCUMENT 5: Inpatient Cardiology Discharge Summary

```text
================================================================================
MADRAS MEDICAL MISSION (MMM) - INSTITUTE OF CARDIOVASCULAR DISEASES
4-A, Dr. J. Jayalalithaa Nagar, Mogappair, Chennai - 600037
================================================================================
DISCHARGE SUMMARY (INPATIENT CLINICAL SUMMARY)
PATIENT NAME    : Murugan Thangavel               AGE / SEX      : 62 Y / Male
IP NO.          : MMM-IP-2026-88192               ADMISSION DATE : 28-Aug-2026
ABHA NUMBER     : 91-3344-5566-7788               DISCHARGE DATE : 30-Aug-2026
ATTENDING DOCTOR: Dr. Karthik Senthilvel, MD, DM (Cardiology) | Reg: TNMC-81203
================================================================================

PRIMARY DIAGNOSIS:
- Coronary Artery Disease (CAD) - Chronic Stable Angina Evaluated
- Mixed Dyslipidemia
- Mild Bilateral Knee Osteoarthritis

HOSPITAL COURSE & INVESTIGATIONS:
- Patient was admitted with complaints of exertional retrosternal heaviness.
- 12-Lead Electrocardiogram (ECG): Normal sinus rhythm, nonspecific ST-T changes in inferior leads.
- 2D Transthoracic Echocardiogram:
  * Left Ventricular Ejection Fraction (LVEF): 60% (Preserved Global LV Function)
  * No regional wall motion abnormalities at rest.
  * Normal valvular morphology, Grade 1 LV diastolic dysfunction.
- Renal and liver functional biochemistries were stable throughout stay.

DISCHARGE MEDICATIONS:
1. Tab. ATORVASTATIN 20 mg - 1 tablet at night bedtime (0 - 0 - 1)
2. Tab. ASPIRIN 75 mg (Enteric Coated) - 1 tablet after lunch (0 - 1 - 0)
3. Tab. METOPROLOL SUCCINATE 25 mg (Extended Release) - 1 tablet morning (1 - 0 - 0)
4. Tab. PARACETAMOL 650 mg - As needed (SOS) for joint pain

EMERGENCY WARNING INSTRUCTIONS:
- If experiencing acute retrosternal chest pain radiating to left arm, excessive diaphoresis, or sudden breathlessness, report immediately to nearest Emergency Cardiac Centre or dial 108 / 112.

Consultant Cardiologist:
Dr. Karthik Senthilvel, MD, DM
================================================================================
```

---

## 🇮🇳 DOCUMENT 6: Bilingual Tamil & English Outpatient Prescription

```text
================================================================================
ஸ்ரீ பாலாஜி மருத்துவமனை மற்றும் கிளினிக் (SRI BALAJI CLINIC)
Main Road, Madurai - 625001 | Phone: 0452-2531000
================================================================================
மருத்துவர் / DOCTOR: Dr. S. Balasubramanian, MBBS, MD
தேதி / DATE        : 22-Sep-2026
நோயாளி / PATIENT   : K. Meenakshisundaram (மீனாட்சிசுந்தரம்) | 54 M
நோயறிதல் / DIAGNOSIS: காய்ச்சல் மற்றும் தொண்டை வலி (Acute Pharyngitis & Viral Fever)

மருத்துவ பரிந்துரை / RX:
--------------------------------------------------------------------------------
1. Tab. AMOXICILLIN 500 mg
   அளவு (Dose): 1-0-1 (காலை 1, இரவு 1 - உணவுக்குப் பின் / After food)
   கால அளவு (Days): 5 நாட்கள் (5 Days)
   நோக்கம்: பாக்டீரியா தொற்று எதிர்ப்பு மாத்திரை (Antibiotic)

2. Tab. PARACETAMOL 650 mg (Dolo / Calpol)
   அளவு (Dose): 1-0-1 (காலை 1, இரவு 1 அல்லது காய்ச்சல் இருக்கும் போது SOS)
   நோக்கம்: காய்ச்சல் மற்றும் உடல் வலி நிவாரணி (Fever & Pain Relief)

3. Tab. PANTOPRAZOLE 40 mg
   அளவு (Dose): 1-0-0 (காலை வெறும் வயிற்றில் / Empty stomach)
   கால அளவு (Days): 5 நாட்கள்
   நோக்கம்: அசிடிட்டி மற்றும் நெஞ்செரிச்சல் தடுப்பு

மருத்துவ ஆலோசனை / ADVICE:
- வெதுவெதுப்பான உப்பு நீரில் தொண்டை கொப்பளிக்கவும் (Warm salt water gargle).
- அதிக ஓய்வு மற்றும் போதுமான அளவு திரவ உணவுகள் உட்கொள்ளவும்.
================================================================================
```

---

## 🚀 Step-by-Step Demo Walkthrough Guide

Use this script during your hackathon presentation or evaluator walkthrough:

### Step 1: Use Case #1 — Instant "Quick Scan" (No Sign Up)
1. Navigate to the live app: **[https://jhansirani19839.github.io/AI_Health_copilot/](https://jhansirani19839.github.io/AI_Health_copilot/)**.
2. Click **"Try Quick Scan (No Login)"**.
3. Choose **Document 1 (Apollo Lab Report)** or **Document 6 (Tamil Prescription)**.
4. Watch Tesseract OCR process the text.
5. Highlight the **Plain-Language Summary**, toggle to **"தமிழில் விளக்கம் (Tamil Explanation)"**, and show how **HbA1c 7.8%** and **Fasting Sugar 148 mg/dL** are clearly flagged.
6. Click **"Edit OCR & Re-Analyze"** to demonstrate OCR error correction.
7. Click **"Sign Up & Save"** to demonstrate automated transfer into the patient timeline.

### Step 2: Use Case #2 — Hospital / Doctor Practice Portal
1. Click **Sign In** and tap the **"Dr. Meenakshi"** autofill demo button.
2. Search for patient **"Suresh Kumar"** or ABHA **`91-4562-7890-1234`**.
3. Review the patient's vitals, lab trends, and previous prescriptions.
4. Type a new clinical note: *"Adjusted Metformin to 1000mg. Schedule repeat HbA1c in 12 weeks."* and click **Post Note**.
5. Click **"Upload Record for Patient"** to demonstrate clinic front-desk ingestion.

### Step 3: Use Case #3 — Registered Patient Timeline, Medicines & Chatbot
1. Sign in as **Suresh Kumar** (`patient1@health.io` / `demo123`).
2. Filter the unified timeline by **Prescriptions** and **Lab Reports**.
3. Click **"Export FHIR R4 Bundle"** to download the standard HL7 JSON.
4. Click **"Medicines"** in the top navigation to view the consolidated medication schedule.
5. Open the floating **AI Assistant** bottom right and ask:
   - *"What medications am I taking?"*
   - *"What was my last blood sugar reading?"*
   - *"I have sudden severe chest pain"* -> Observe the emergency triaging safety alert directing the user to **108 / 112**.

### Step 4: Admin Portal & Audit Governance
1. Sign in as **Admin** (`admin@hospital.org` / `demo123`).
2. Show the real-time stats cards (Total Users, Processed Records, OCR Success Rate 98.6%).
3. Inspect the **Security & Access Audit Trail** showing all timestamped doctor reviews and patient accesses.
