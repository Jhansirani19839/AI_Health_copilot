# AI-Powered Personal Health Copilot

**Altrix Labs Hackathon Challenge Project**  
*A complete real-world web application built for Individuals, Clinics & Doctors in English and தமிழ் (Tamil).*

- **Live URL**: [https://jhansirani19839.github.io/AI_Health_copilot/](https://jhansirani19839.github.io/AI_Health_copilot/)
- **Repository**: [https://github.com/Jhansirani19839/AI_Health_copilot.git](https://github.com/Jhansirani19839/AI_Health_copilot.git)

---

## 🌟 Key Features Across the 3 Real-World Use Cases

1. **Individual Person (Quick Scan - No Login Required)**:
   - Upload any prescription, lab report, or medical file (PNG, JPG, PDF) or capture directly via mobile camera.
   - Dual-engine bilingual OCR (Tesseract.js with `eng+tam` language workers) with offscreen canvas preprocessing.
   - Instant plain-language clinical breakdowns in English and Tamil with abnormal indicators highlighted.
   - Raw OCR viewer with inline edit and re-analyze capability.
   - Optional 1-click "Sign up to save and build my health timeline".

2. **Hospital & Clinic Practice Portal**:
   - Front-desk and doctor workspace to find patients by Name, Phone, or 14-digit ABHA ID.
   - Comprehensive patient chart review: profiles, allergies, chronic conditions, timelines, and abnormal flags.
   - Post doctor clinical notes and prescriptions that synchronize directly to the patient's timeline.
   - Upload medical records directly on behalf of a patient.
   - Print / Save as PDF clinical summaries.

3. **Registered Patient Experience**:
   - ABDM-ready health profile with 14-digit mock ABHA ID linking.
   - Unified chronological timeline filterable by type (Prescriptions, Lab Reports, Discharge Summaries, Consultations).
   - Active medications and dosage regimen tracker.
   - Floating AI Health Assistant chatbot answering **strictly from the patient's own records** in English or Tamil.
   - Strict medical safety disclaimers and emergency triaging (`108 / 112`).
   - Export HL7 FHIR R4 standard JSON Bundle (`Patient`, `Observation`, `MedicationStatement`, `Condition`, `DocumentReference`).
   - Doctor sharing permissions control.

4. **Hospital Admin & Compliance Console**:
   - Directory to inspect, activate, or deactivate users and doctors.
   - Platform stats: total users, records processed, and OCR success rate.
   - Security and data access audit trail.

---

## 🔐 Demo Credentials

All demo accounts use the default password: **`demo123`** (or use the one-click autofill buttons on the login page):

| Role | Name | Email | Password | Details |
| :--- | :--- | :--- | :--- | :--- |
| **Patient** | Suresh Kumar | `patient1@health.io` | `demo123` | Type 2 Diabetes, Hypertension, Tamil speaker |
| **Patient** | Ananya Jayaraman | `patient2@health.io` | `demo123` | Hypothyroidism, Anemia, English speaker |
| **Patient** | Murugan Thangavel | `patient3@health.io` | `demo123` | CAD, Dyslipidemia |
| **Doctor** | Dr. Meenakshi Ramanathan | `doctor1@hospital.org` | `demo123` | MD, Endocrinology & Diabetology |
| **Doctor** | Dr. Karthik Senthilvel | `doctor2@hospital.org` | `demo123` | MD, DM Cardiology |
| **Admin** | Dr. Rajesh Sundaram | `admin@hospital.org` | `demo123` | Hospital Platform Administrator |

---

## ⚙️ Running Locally

```bash
# 1. Clone repository
git clone https://github.com/Jhansirani19839/AI_Health_copilot.git
cd AI_Health_copilot

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Open in browser (typically http://localhost:5173/AI_Health_copilot/)
```

### Build for Production:
```bash
npm run build
```

---

## 🚀 GitHub Actions Deployment

The repository includes a GitHub Actions workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) that automatically builds and deploys to GitHub Pages on every push to `main`.

### To Enable GitHub Pages:
1. Navigate to **Settings** -> **Pages** in the repository.
2. Under **Build and deployment** -> **Source**, select **GitHub Actions**.
3. Access the live URL: `https://jhansirani19839.github.io/AI_Health_copilot/`

---

## 📐 Architecture & Standards

Refer to [`/docs/architecture.md`](docs/architecture.md) for the complete technical design, Mermaid pipeline flowchart, and entity-relationship diagrams.
Refer to [`/docs/demo_slides.md`](docs/demo_slides.md) for the 5-slide hackathon presentation outline.
