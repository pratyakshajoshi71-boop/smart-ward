"""
Patient controller — handles request logic and returns clean JSON responses.
"""

from app.services.patient_service import fetch_all_patients, fetch_patient
from app.utils.helpers import format_response


def get_patients():
    """Return all patients."""
    patients = fetch_all_patients()
    if patients:
        return format_response(True, patients, f"Fetched {len(patients)} patients")
    return format_response(False, [], "No patients found")


def get_patient(patient_id: str):
    """Return a single patient by ID."""
    patient = fetch_patient(patient_id)
    if patient:
        return format_response(True, patient, f"Patient {patient_id} found")
    return format_response(False, None, f"Patient {patient_id} not found")


def upload_report(patient_id: str, payload: dict):
    """Handle uploading a report for a patient."""
    from app.models.patient_model import add_patient_report
    from app.utils.helpers import current_timestamp
    
    report_name = payload.get("report_name")
    file_data = payload.get("file_data")
    
    if not report_name or not file_data:
        return format_response(False, None, "report_name and file_data are required")
        
    report = {
        "name": report_name,
        "date": current_timestamp().split("T")[0], # Just the date part
        "type": "Uploaded",
        "file_data": file_data
    }
    
    add_patient_report(patient_id, report)
    
    return format_response(True, {"report": report}, f"Report {report_name} uploaded successfully")


def book_appointment(patient_id: str, payload: dict):
    """Handle booking an appointment for a patient."""
    from app.models.patient_model import add_patient_appointment

    doctor = payload.get("doctor")
    date = payload.get("date")
    time = payload.get("time")
    appt_type = payload.get("type", "General Checkup")

    if not doctor or not date or not time:
        return format_response(False, None, "doctor, date, and time are required")

    appointment = {
        "doctor": doctor,
        "date": date,
        "time": time,
        "type": appt_type,
        "status": "upcoming",
    }

    add_patient_appointment(patient_id, appointment)

    return format_response(True, {"appointment": appointment}, "Appointment booked successfully")


def list_appointments(patient_id: str):
    """Return all appointments for a patient."""
    from app.models.patient_model import get_patient_appointments

    appointments = get_patient_appointments(patient_id)
    return format_response(True, appointments, f"Fetched {len(appointments)} appointments")
