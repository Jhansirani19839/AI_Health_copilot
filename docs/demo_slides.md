# 5-Slide Demo Presentation Outline: AI-Powered Personal Health Copilot
**Altrix Labs Hackathon Challenge**

---

### Slide 1: Problem & Vision
- **Title**: Health Literacy & Fragmented Medical Records in India & Beyond
- **The Challenge**: Patients struggle to understand complex clinical jargon in lab reports and prescriptions, especially across regional languages. Healthcare records are scattered across paper slips, clinic files, and PDFs.
- **The Solution**: **HealthCopilot AI** — an offline-first, bilingual (English & தமிழ்) AI companion that turns unreadable prescriptions and test reports into plain-language actionable timelines, bridging patients and doctors under ABDM & FHIR standards.

---

### Slide 2: Real-World Use Case #1 — Instant "Quick Scan"
- **Zero Friction**: Open the app and upload any document without creating an account or logging in.
- **Client-Side Optical Character Recognition**: Tesseract.js `eng+tam` with canvas preprocessing for phone photos and PDF.js for multi-page lab slips.
- **Bilingual Clinical Breakdowns**: Instant plain-language explanations in English and Tamil with abnormal indicators flagged (e.g., HbA1c > 7%, elevated cholesterol).
- **Edit & Re-Analyze**: Users can correct OCR misreads directly in-browser.
- **Conversion Hook**: "Save to my lifetime timeline" imports guest scans seamlessly upon signup.

---

### Slide 3: Real-World Use Case #2 — Hospital & Clinic Practice Portal
- **Front-Desk & Doctor Workspace**: Look up assigned or visiting patients by Name, Phone, or 14-digit ABHA ID.
- **Clinical Review**: Doctors review extracted vitals, abnormal trends, and original files.
- **Care Plan & Prescription Notes**: Doctors append clinical notes that appear directly in the patient's timeline.
- **Upload on Behalf**: Front-desk staff can scan reports directly into the patient's record during consultation.
- **Print / PDF Summary**: One-click print-ready clinical report export for physical file handovers.

---

### Slide 4: Real-World Use Case #3 — Registered Patient Lifetime Timeline & Grounded Chatbot
- **Unified Medical Timeline**: Filterable by record type (Prescriptions, Lab Reports, Discharge Summaries, Doctor Notes).
- **Active Medicines Tracker**: Regimen schedules, dosages, and bilingual indications aggregated across prescriptions.
- **Grounded AI Assistant**: Chatbot answers questions strictly from the patient's own history (e.g. *"What are my active medications?"*, *"What was my last HbA1c?"*).
- **Critical Safety Guardrails**: Built-in disclaimers and emergency triaging directing acute symptoms to emergency services (108 / 112).
- **Privacy & Consent**: Granular sharing control to authorize specific doctors.

---

### Slide 5: Architecture & ABDM/FHIR Interoperability
- **Architecture**: React + Vite + Tailwind CSS + HashRouter (Zero Backend, GitHub Pages static hosting).
- **Storage**: IndexedDB (9 stores via `idb`) with Web Crypto SHA-256 password security.
- **Dual Inference Engine**: Google Gemini API client calls with automatic fallback to an offline rule-based extraction engine.
- **National Digital Health Ready**: Native 14-digit ABHA linking and one-click HL7 FHIR R4 Bundle JSON export (`Patient`, `Observation`, `MedicationStatement`, `Condition`, `DocumentReference`).
- **Live Demo Link**: [https://jhansirani19839.github.io/AI_Health_copilot/](https://jhansirani19839.github.io/AI_Health_copilot/)
