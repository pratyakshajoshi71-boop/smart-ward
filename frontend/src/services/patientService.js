import API from './api';

/**
 * Fetch all patients from the backend.
 * GET /patients
 */
export const getPatients = async () => {
  const response = await API.get('/patients');
  return response.data;
};

/**
 * Upload a report for a patient.
 * POST /patients/{patientId}/reports/upload
 */
export const uploadReport = async (patientId, reportName, fileData) => {
  const response = await API.post(`/patients/${patientId}/reports/upload`, {
    report_name: reportName,
    file_data: fileData
  });
  return response.data;
};

/**
 * Book an appointment for a patient.
 * POST /patients/{patientId}/appointments
 */
export const bookAppointment = async (patientId, appointmentData) => {
  const response = await API.post(`/patients/${patientId}/appointments`, appointmentData);
  return response.data;
};

/**
 * Fetch all appointments for a patient.
 * GET /patients/{patientId}/appointments
 */
export const getAppointments = async (patientId) => {
  const response = await API.get(`/patients/${patientId}/appointments`);
  return response.data;
};
