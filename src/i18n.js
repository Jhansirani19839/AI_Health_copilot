import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appName: "HealthCopilot AI",
      tagline: "Your Personal & Clinical AI Health Companion",
      nav: {
        home: "Home",
        quickScan: "Quick Scan",
        timeline: "Health Timeline",
        medicines: "Medicines",
        assistant: "AI Assistant",
        doctorPortal: "Doctor Portal",
        adminPortal: "Admin Portal",
        login: "Sign In",
        signup: "Sign Up",
        logout: "Logout",
        settings: "Settings",
        abhaLinked: "ABHA Linked",
        linkAbha: "Link ABHA ID"
      },
      hero: {
        badge: "Altrix Labs Hackathon Challenge • ABDM & FHIR Ready",
        title: "AI-Powered Personal Health Copilot",
        subtitle: "Instant bilingual OCR, clinical insights, and lifetime medical timeline. Designed for Individuals, Clinics & Doctors in English & தமிழ்.",
        quickScanCta: "Try Quick Scan (No Login)",
        signupCta: "Build My Timeline",
        doctorCta: "Doctor & Clinic Portal"
      },
      quickScan: {
        title: "Instant Medical Document Scanner",
        subtitle: "Upload a lab test, prescription, or discharge report to get bilingual plain-language breakdowns immediately. No sign-up required.",
        uploadPrompt: "Drag & drop prescription/lab PDF or image, or take photo",
        supportedFormats: "Supports PNG, JPG, PDF up to 10MB (English & தமிழ் OCR)",
        processing: "Extracting text with Tesseract OCR & analyzing clinical data...",
        ocrRaw: "Extracted Document Text",
        editOcr: "Edit OCR & Re-Analyze",
        saveCta: "Save to my permanent timeline & track medicines",
        explainEn: "English Explanation",
        explainTa: "தமிழில் விளக்கம் (Tamil Explanation)",
        abnormalFlags: "Abnormal Observations Detected",
        medications: "Detected Medications & Dosages",
        diagnoses: "Key Diagnoses & Conditions",
        downloadReport: "Download Clinical Report (PDF)"
      },
      disclaimer: {
        text: "Important Medical Disclaimer: This is an AI-assisted analysis tool for informational purposes only. It does not provide medical diagnoses or replace consultations with licensed healthcare providers. Always consult a physician for urgent symptoms or treatment decisions.",
        privacy: "Privacy Guarantee: Medical documents are processed locally within your browser and stored exclusively in your device's secure offline storage (IndexedDB)."
      },
      auth: {
        signInTitle: "Welcome Back to Health Copilot",
        signUpTitle: "Create Your Secure Health Account",
        demoCredentials: "Click to autofill pre-configured demo account:",
        rolePatient: "Patient",
        roleDoctor: "Doctor",
        roleAdmin: "Admin",
        email: "Email Address",
        password: "Password",
        fullName: "Full Name",
        submitSignIn: "Sign In Securely",
        submitSignUp: "Create Account"
      },
      timeline: {
        title: "Personal Health Timeline",
        subtitle: "A unified, chronological medical record following FHIR standards.",
        filterAll: "All Records",
        filterPrescription: "Prescriptions",
        filterLab: "Lab Reports",
        filterDischarge: "Discharge Summaries",
        filterConsultation: "Doctor Notes",
        exportFhir: "Export FHIR R4 Bundle",
        addRecord: "Upload Medical Record"
      },
      doctor: {
        title: "Clinical & Practice Workspace",
        searchPatient: "Search patients by Name, Phone, or 14-digit ABHA ID...",
        assignedPatients: "My Patients",
        addNote: "Add Doctor Clinical Note",
        uploadOnBehalf: "Upload Record for Patient",
        vitalSigns: "Vitals & Abnormal Values",
        shareStatus: "Access Status: Authorized"
      },
      admin: {
        title: "Hospital & Platform Administration",
        statsUsers: "Total Users",
        statsRecords: "Total Records Processed",
        statsOcrSuccess: "OCR Success Rate",
        statsDoctors: "Verified Doctors",
        auditTitle: "Security & Access Audit Trail",
        manageUsers: "User & Provider Directory"
      },
      chat: {
        title: "Health Copilot Records Assistant",
        placeholder: "Ask about your medications, test trends, or allergies...",
        emergencyNotice: "If you are experiencing severe chest pain, shortness of breath, sudden numbness, or heavy bleeding, contact emergency medical services (108 / 112) immediately.",
        emptyState: "Ask any question about your medical history. Answers are grounded exclusively in your uploaded health records."
      }
    }
  },
  ta: {
    translation: {
      appName: "ஹெல்த் கோபைலட் AI",
      tagline: "உங்கள் தனிப்பட்ட மற்றும் மருத்துவ AI துணைவர்",
      nav: {
        home: "முகப்பு",
        quickScan: "விரைவு ஸ்கேன் (Quick Scan)",
        timeline: "சுகாதார காலவரிசை",
        medicines: "மருந்துகள்",
        assistant: "AI உதவியாளர்",
        doctorPortal: "மருத்துவர் தளம்",
        adminPortal: "நிர்வாகி தளம்",
        login: "உள்நுழை",
        signup: "பதிவு செய்க",
        logout: "வெளியேறு",
        settings: "அமைப்புகள்",
        abhaLinked: "ABHA இணைக்கப்பட்டது",
        linkAbha: "ABHA ஐடியை இணைக்கவும்"
      },
      hero: {
        badge: "ஆல்ட்ரிக்ஸ் லேப்ஸ் ஹேக்கத்தான் சவால் • ABDM & FHIR தயார்",
        title: "AI-இயங்கும் தனிநபர் சுகாதார கோபைலட்",
        subtitle: "உடனடி இருமொழி OCR, மருத்துவ விளக்கங்கள் மற்றும் வாழ்நாள் மருத்துவ காலவரிசை. தனிநபர்கள், கிளினிக்குகள் மற்றும் மருத்துவர்களுக்காக தமிழ் மற்றும் ஆங்கிலத்தில் உருவாக்கப்பட்டது.",
        quickScanCta: "விரைவு ஸ்கேன் (உள்நுழைவு தேவையில்லை)",
        signupCta: "என் காலவரிசையை உருவாக்கு",
        doctorCta: "மருத்துவர் மற்றும் கிளினிக் தளம்"
      },
      quickScan: {
        title: "உடனடி மருத்துவ ஆவண ஸ்கேனர்",
        subtitle: "மருந்துச் சீட்டு, ஆய்வக அறிக்கை அல்லது டிஸ்சார்ஜ் அறிக்கையை பதிவேற்றி உடனடி எளிய தமிழ் மற்றும் ஆங்கில விளக்கத்தைப் பெறுங்கள். உள்நுழைவு தேவையில்லை.",
        uploadPrompt: "மருத்துவ ஆவணத்தை இங்கே இழுத்து விடவும் அல்லது புகைப்படம் எடுக்கவும்",
        supportedFormats: "PNG, JPG, PDF (10MB வரை ஆதரிக்கப்படும் - தமிழ் & ஆங்கில OCR)",
        processing: "ஆவணத்தை ஸ்கேன் செய்து மருத்துவத் தரவுகளை பகுப்பாய்வு செய்கிறது...",
        ocrRaw: "ஸ்கேன் செய்யப்பட்ட ஆவண உரை (OCR)",
        editOcr: "உரையைத் திருத்தி மீண்டும் ஆய்வு செய்க",
        saveCta: "என் நிரந்தர காலவரிசையில் சேமித்து மருந்துகளைக் கண்காணிக்கவும்",
        explainEn: "ஆங்கில விளக்கம் (English Explanation)",
        explainTa: "தமிழில் எளிய விளக்கம்",
        abnormalFlags: "கண்டறியப்பட்ட அசாதாரண அளவுகள் (Abnormal Values)",
        medications: "கண்டறியப்பட்ட மருந்துகள் & அளவுகள்",
        diagnoses: "முக்கிய நோயறிதல்கள்",
        downloadReport: "மருத்துவ அறிக்கையை பதிவிறக்கு (PDF)"
      },
      disclaimer: {
        text: "முக்கிய மருத்துவ மறுப்பு: இது தகவல் நோக்கங்களுக்கான AI-உதவி பகுப்பாய்வு கருவி மட்டுமே. இது மருத்துவ நோயறிதல் அல்ல அல்லது உரிமம் பெற்ற மருத்துவரின் ஆலோசனையை மாற்றாது. அவசர அறிகுறிகள் அல்லது சிகிச்சை முடிவுகளுக்கு எப்போதும் மருத்துவரை அணுகவும்.",
        privacy: "தனியுரிமை உறுதி: உங்கள் மருத்துவ ஆவணங்கள் உங்கள் உலாவியில் மட்டுமே பகுப்பாய்வு செய்யப்பட்டு சாதனத்தின் பாதுகாப்பான ஆஃப்லைன் சேமிப்பகத்தில் மட்டுமே சேமிக்கப்படுகின்றன."
      },
      auth: {
        signInTitle: "மீண்டும் வருக - ஹெல்த் கோபைலட்",
        signUpTitle: "பாதுகாப்பான கணக்கை உருவாக்கவும்",
        demoCredentials: "டெமோ கணக்கை தானாக நிரப்ப கிளிக் செய்க:",
        rolePatient: "நோயாளி (Patient)",
        roleDoctor: "மருத்துவர் (Doctor)",
        roleAdmin: "நிர்வாகி (Admin)",
        email: "மின்னஞ்சல் முகவரி",
        password: "கடவுச்சொல்",
        fullName: "முழுப் பெயர்",
        submitSignIn: "பாதுகாப்பாக உள்நுழைக",
        submitSignUp: "கணக்கை உருவாக்கு"
      },
      timeline: {
        title: "தனிநபர் சுகாதார காலவரிசை",
        subtitle: "FHIR தரநிலைகளின் அடிப்படையிலான உங்கள் வாழ்நாள் மருத்துவப் பதிவுகள்.",
        filterAll: "அனைத்து பதிவுகளும்",
        filterPrescription: "மருந்துச் சீட்டுகள்",
        filterLab: "ஆய்வக அறிக்கைகள்",
        filterDischarge: "டிஸ்சார்ஜ் சுருக்கங்கள்",
        filterConsultation: "மருத்துவர் குறிப்புகள்",
        exportFhir: "FHIR R4 Bundle பதிவிறக்கு",
        addRecord: "புதிய ஆவணத்தை பதிவேற்றவும்"
      },
      doctor: {
        title: "மருத்துவப் பணி தளம்",
        searchPatient: "பெயர், தொலைபேசி எண் அல்லது 14-இலக்க ABHA ஐடி மூலம் நோயாளிகளைத் தேடுங்கள்...",
        assignedPatients: "எனது நோயாளிகள்",
        addNote: "மருத்துவ குறிப்பைச் சேர்க்கவும்",
        uploadOnBehalf: "நோயாளிக்கு ஆவணத்தை பதிவேற்றவும்",
        vitalSigns: "அசாதாரண அளவுகள் மற்றும் முக்கிய குறிகாட்டிகள்",
        shareStatus: "அணுகல் நிலை: அங்கீகரிக்கப்பட்டது"
      },
      admin: {
        title: "மருத்துவமனை மற்றும் தள நிர்வாகம்",
        statsUsers: "மொத்த பயனர்கள்",
        statsRecords: "பகுப்பாய்வு செய்யப்பட்ட பதிவுகள்",
        statsOcrSuccess: "OCR வெற்றி விகிதம்",
        statsDoctors: "அங்கீகரிக்கப்பட்ட மருத்துவர்கள்",
        auditTitle: "பாதுகாப்பு & அணுகல் தணிக்கை பதிவு",
        manageUsers: "பயனர் மற்றும் மருத்துவர் அடைவு"
      },
      chat: {
        title: "ஹெல்த் கோபைலட் AI உதவியாளர்",
        placeholder: "உங்கள் மருந்துகள், ஆய்வக முடிவுகள் அல்லது ஒவ்வாமைகள் பற்றி கேளுங்கள்...",
        emergencyNotice: "கடுமையான மார்பு வலி, மூச்சுத் திணறல், திடீர் உணர்வின்மை அல்லது அதிக இரத்தப்போக்கு ஏற்பட்டால், உடனடியாக அவசர மருத்துவ சேவையை (108 / 112) தொடர்பு கொள்ளவும்.",
        emptyState: "உங்கள் மருத்துவ வரலாறு பற்றிய கேள்விகளைக் கேளுங்கள். பதில்கள் உங்கள் பதிவுகளிலிருந்து மட்டுமே துல்லியமாக வழங்கப்படும்."
      }
    }
  }
};

const savedLang = localStorage.getItem('ahc_lang') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
