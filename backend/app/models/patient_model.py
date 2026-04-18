"""
Patient model — MongoDB document helpers.
"""

from app.config.db import patients_collection
from app.utils.helpers import serialize_doc, serialize_docs


def get_all_patients() -> list:
    """Retrieve all patient documents."""
    return serialize_docs(patients_collection.find())


def get_patient_by_id(patient_id: str) -> dict | None:
    """Retrieve a single patient by patientId."""
    doc = patients_collection.find_one({"patientId": patient_id})
    return serialize_doc(doc) if doc else None


def upsert_patient(patient: dict):
    """Insert or update a patient document."""
    patients_collection.update_one(
        {"patientId": patient["patientId"]},
        {"$set": patient},
        upsert=True,
    )


def update_patient_vitals(patient_id: str, vitals: dict):
    """Update only the vitals sub-document for a patient."""
    patients_collection.update_one(
        {"patientId": patient_id},
        {"$set": {"vitals": vitals}},
    )


def update_patient_status(patient_id: str, status: str):
    """Update the status field for a patient."""
    patients_collection.update_one(
        {"patientId": patient_id},
        {"$set": {"status": status}},
    )


def add_patient_report(patient_id: str, report: dict):
    """Add a report object to the patient's reports array."""
    patients_collection.update_one(
        {"patientId": patient_id},
        {"$push": {"reports": report}},
    )


def add_patient_appointment(patient_id: str, appointment: dict):
    """Add an appointment object to the patient's appointments array."""
    patients_collection.update_one(
        {"patientId": patient_id},
        {"$push": {"appointments": appointment}},
        upsert=True,
    )


def get_patient_appointments(patient_id: str) -> list:
    """Retrieve all appointments for a patient."""
    doc = patients_collection.find_one({"patientId": patient_id}, {"appointments": 1})
    if doc:
        return doc.get("appointments", [])
    return []
