# Architecture & Technical Design: AI-Powered Personal Health Copilot

**Altrix Labs Hackathon Challenge Project**  
*Built for Individuals, Clinics & Doctors in English & தமிழ் (Tamil).*

---

## 1. System Overview

The **AI-Powered Personal Health Copilot** is an offline-first, client-side, zero-backend medical application architected for instant deployment to GitHub Pages. It enables:
1. **Unauthenticated Quick Scan**: Instant OCR on phone camera photos, images, and PDFs + bilingual plain-language breakdowns.
2. **Clinical Practice Portal**: Multi-patient dashboard with 14-digit ABHA search, doctor notes, and records upload on behalf of patients.
3. **Personal Health Timeline**: Chronological records with FHIR R4 standard export and a grounded AI chatbot.

---

## 2. End-to-End Clinical Processing Pipeline

```mermaid
flowchart TD
    A["User Uploads Document (PDF / Image / Mobile Camera)"] --> B["File Validation (Format <=10MB)"]
    B --> C["PDF.js Renderer (Multi-page PDF to Canvas)"]
    B --> D["Image Preprocessing (Grayscale + Contrast Enhancement)"]
    C --> E["Tesseract.js OCR Engine (Bilingual 'eng + tam' models)"]
    D --> E
    E --> F["Raw OCR Extracted Text Displayed (Editable)"]
    F --> G{"Is Google Gemini API Key Present?"}
    
    G -- "Yes" --> H["Gemini 1.5 Flash (Strict JSON Schema Clinical Prompt)"]
    G -- "No" --> I["Rule-Based Engine (Regex Meds + Reference Ranges)"]
    
    H --> J["Extracted Clinical Entity Validation"]
    I --> J
    
    J --> K["Abnormal Parameter Detection (HbA1c, Sugars, Cholesterol, Hb, Creatinine)"]
    K --> L["Bilingual Plain-Language Summaries (English & தமிழ்)"]
    L --> M["IndexedDB Storage (ABDM & FHIR R4 Store)"]
    M --> N["Unified Timeline Event + Grounded Records Chatbot Context"]
```

---

## 3. ABDM & FHIR-Ready Data Model

The application uses browser **IndexedDB (via `idb`)** partitioned across 9 distinct stores:

```mermaid
erDiagram
    USERS ||--o| PATIENT_PROFILES : has
    USERS ||--o| DOCTOR_PROFILES : has
    PATIENT_PROFILES ||--o{ RECORDS : owns
    RECORDS ||--o{ EXTRACTED_ITEMS : contains
    PATIENT_PROFILES ||--o{ TIMELINE_EVENTS : tracks
    DOCTOR_PROFILES ||--o{ DOCTOR_NOTES : writes
    PATIENT_PROFILES ||--o{ ACCESS_GRANTS : authorizes
    USERS ||--o{ AUDIT_LOGS : generates

    USERS {
        string id PK
        string email
        string passwordHash "SHA-256 Web Crypto"
        string role "patient | doctor | admin"
        string status "active | deactivated"
    }

    PATIENT_PROFILES {
        string userId PK
        string fullName
        int age
        string gender
        string bloodGroup
        string abhaId "14-digit ABDM ID"
        string phone
        string[] allergies
        string[] chronicConditions
        string[] currentMedicines
    }

    RECORDS {
        string id PK
        string patientId FK
        string recordType "prescription | lab_report | discharge_summary"
        string date
        string doctorName
        string ocrText
        json medications
        json tests
        json abnormalFlags
        string summaryEn
        string summaryTa
    }

    ACCESS_GRANTS {
        string id PK
        string patientId FK
        string doctorId FK
        string status "active | revoked"
        string scope "ALL_RECORDS"
    }
```

---

## 4. HL7 FHIR R4 Mapping

When exporting via the **Export FHIR Bundle** feature, records are dynamically serialized into an HL7 FHIR R4 `Bundle` (`type: "document"`):

| Internal Concept | HL7 FHIR R4 Resource | Identifier / Mapping |
| :--- | :--- | :--- |
| Patient Profile | `Patient` | ABHA Identifier (`https://healthid.ndhm.gov.in`) |
| Lab Tests | `Observation` | ValueQuantity, ReferenceRange, Interpretation (H/L/N) |
| Prescribed Drugs | `MedicationStatement`| Dosage, timing instructions, clinical indication |
| Diagnosed Conditions | `Condition` | Active clinical status |
| Uploaded File/Scan | `DocumentReference` | Attachment metadata and MIME type |

---

## 5. Security & Privacy Guarantees

- **No Remote Server Leakage**: All OCR runs via WebAssembly in the client worker; all records persist locally in IndexedDB.
- **Client-Side Cryptography**: Passwords hashed using the standard Web Crypto API (`crypto.subtle.digest('SHA-256')`).
- **Grounded AI Guardrails**: Chatbot answers strictly from the patient's own records with clear emergency directives (108 / 112) for acute symptoms.
