"""
Alert service — generates alerts based on patient vitals and resource thresholds.
"""

from app.models.alert_model import get_all_alerts, get_unresolved_alerts, insert_alert
from app.utils.helpers import generate_alert_id, current_timestamp


def fetch_all_alerts() -> list:
    """Return all alerts."""
    try:
        return get_all_alerts()
    except Exception as e:
        print(f"[AlertService] Error fetching alerts: {e}")
        return []


def fetch_unresolved_alerts() -> list:
    """Return only unresolved alerts."""
    try:
        return get_unresolved_alerts()
    except Exception as e:
        print(f"[AlertService] Error fetching unresolved alerts: {e}")
        return []


def evaluate_patient_alerts(patient: dict) -> list:
    """
    Evaluate a single patient's vitals and generate alerts if thresholds breached.

    Rules:
    - oxygen < 90       → CRITICAL
    - heartRate > 120    → WARNING
    """
    alerts = []
    vitals = patient.get("vitals", {})
    patient_id = patient.get("patientId", "Unknown")
    name = patient.get("name", "Unknown")

    oxygen = vitals.get("oxygen", 100)
    heart_rate = vitals.get("heartRate", 80)

    if oxygen < 90:
        alert = {
            "alertId": generate_alert_id(),
            "type": "CRITICAL",
            "message": f"Patient {patient_id} ({name}) — Oxygen level dropped to {oxygen}%",
            "patientId": patient_id,
            "timestamp": current_timestamp(),
            "resolved": False,
        }
        alerts.append(alert)

    if heart_rate > 120:
        alert = {
            "alertId": generate_alert_id(),
            "type": "WARNING",
            "message": f"Patient {patient_id} ({name}) — Heart rate elevated to {heart_rate} bpm",
            "patientId": patient_id,
            "timestamp": current_timestamp(),
            "resolved": False,
        }
        alerts.append(alert)

    return alerts


def evaluate_resource_alerts(resources: dict) -> list:
    """
    Evaluate hospital resource levels and generate system alerts.

    Rules:
    - ICU occupancy > 85% → SYSTEM ALERT
    """
    alerts = []
    icu_beds = resources.get("icuBeds", 20)
    icu_occupied = resources.get("icuOccupied", 0)

    if icu_beds > 0:
        occupancy_pct = (icu_occupied / icu_beds) * 100
        if occupancy_pct > 85:
            alert = {
                "alertId": generate_alert_id(),
                "type": "SYSTEM",
                "message": f"ICU occupancy at {occupancy_pct:.0f}% — exceeds 85% threshold",
                "patientId": None,
                "timestamp": current_timestamp(),
                "resolved": False,
            }
            alerts.append(alert)

    return alerts


def save_alerts(alerts: list):
    """Persist a list of alert dicts to MongoDB."""
    for alert in alerts:
        try:
            insert_alert(alert)
        except Exception as e:
            print(f"[AlertService] Error saving alert {alert.get('alertId')}: {e}")


def clear_all_alerts() -> int:
    """Clear all alerts and return the count of deleted alerts."""
    from app.models.alert_model import alerts_collection
    try:
        result = alerts_collection.delete_many({})
        return result.deleted_count
    except Exception as e:
        print(f"[AlertService] Error clearing alerts: {e}")
        return 0
