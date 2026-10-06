/**
 * ABDM (Ayushman Bharat Digital Mission) & HL7 FHIR R4 Bundle Generator
 * Maps internal extracted records into FHIR R4 standard resources
 */

export function convertToFHIRBundle({ patientProfile, records }) {
  const patientId = patientProfile?.userId || 'patient-default';
  const abhaId = patientProfile?.abhaId || '91-1234-5678-9012';

  const entries = [];

  // 1. Patient Resource
  const fhirPatient = {
    fullUrl: `urn:uuid:patient-${patientId}`,
    resource: {
      resourceType: 'Patient',
      id: patientId,
      identifier: [
        {
          system: 'https://healthid.ndhm.gov.in',
          type: {
            coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v2-0203', code: 'MR', display: 'ABHA Number' }]
          },
          value: abhaId
        }
      ],
      name: [{ use: 'official', text: patientProfile?.fullName || 'Anonymous Patient' }],
      gender: (patientProfile?.gender || 'other').toLowerCase(),
      birthDate: patientProfile?.dob || '1990-01-01',
      telecom: patientProfile?.phone ? [{ system: 'phone', value: patientProfile.phone, use: 'mobile' }] : []
    }
  };
  entries.push(fhirPatient);

  // 2. Records mapping to FHIR Resources
  records.forEach((rec, idx) => {
    const docRefId = `docref-${rec.id || idx}`;
    
    // DocumentReference
    entries.push({
      fullUrl: `urn:uuid:${docRefId}`,
      resource: {
        resourceType: 'DocumentReference',
        id: docRefId,
        status: 'current',
        subject: { reference: `urn:uuid:patient-${patientId}` },
        date: new Date(rec.date || Date.now()).toISOString(),
        type: {
          text: rec.recordType || 'Medical Record'
        },
        description: rec.summaryEn || 'Clinical Document',
        content: [
          {
            attachment: {
              contentType: 'application/pdf',
              title: rec.fileName || 'document.pdf'
            }
          }
        ]
      }
    });

    // Diagnoses -> Condition
    (rec.diagnoses || []).forEach((diag, dIdx) => {
      entries.push({
        fullUrl: `urn:uuid:condition-${rec.id || idx}-${dIdx}`,
        resource: {
          resourceType: 'Condition',
          id: `condition-${rec.id || idx}-${dIdx}`,
          clinicalStatus: {
            coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }]
          },
          subject: { reference: `urn:uuid:patient-${patientId}` },
          code: { text: diag },
          recordedDate: rec.date || new Date().toISOString()
        }
      });
    });

    // Tests -> Observation
    (rec.tests || []).forEach((t, tIdx) => {
      entries.push({
        fullUrl: `urn:uuid:obs-${rec.id || idx}-${tIdx}`,
        resource: {
          resourceType: 'Observation',
          id: `obs-${rec.id || idx}-${tIdx}`,
          status: 'final',
          code: { text: t.name },
          subject: { reference: `urn:uuid:patient-${patientId}` },
          effectiveDateTime: rec.date || new Date().toISOString(),
          valueQuantity: {
            value: typeof t.value === 'number' ? t.value : parseFloat(t.value) || 0,
            unit: t.unit || ''
          },
          referenceRange: [
            { text: t.range || 'Standard' }
          ],
          interpretation: [
            {
              coding: [{
                system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
                code: t.status === 'HIGH' ? 'H' : (t.status === 'LOW' ? 'L' : 'N'),
                display: t.status || 'NORMAL'
              }]
            }
          ]
        }
      });
    });

    // Medications -> MedicationStatement
    (rec.medications || []).forEach((m, mIdx) => {
      entries.push({
        fullUrl: `urn:uuid:med-${rec.id || idx}-${mIdx}`,
        resource: {
          resourceType: 'MedicationStatement',
          id: `med-${rec.id || idx}-${mIdx}`,
          status: 'active',
          medicationCodeableConcept: { text: m.name },
          subject: { reference: `urn:uuid:patient-${patientId}` },
          dosage: [
            {
              text: `${m.dosage || ''} - ${m.frequency || ''}`,
              patientInstruction: m.instructions || 'As advised'
            }
          ]
        }
      });
    });
  });

  return {
    resourceType: 'Bundle',
    id: `bundle-ahc-${patientId}`,
    type: 'document',
    timestamp: new Date().toISOString(),
    entry: entries
  };
}

/**
 * Trigger browser download of the FHIR JSON Bundle
 */
export function downloadFHIRJson(bundle, fileName = 'FHIR_Health_Record_Bundle.json') {
  const jsonStr = JSON.stringify(bundle, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
