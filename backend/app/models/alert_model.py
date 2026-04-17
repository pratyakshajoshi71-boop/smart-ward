"""
Alert model — MongoDB document helpers.
"""

from app.config.db import alerts_collection
from app.utils.helpers import serialize_doc, serialize_docs


def get_all_alerts() -> list:
    """Retrieve all alerts, newest first."""
    return serialize_docs(alerts_collection.find().sort("timestamp", -1))


def get_unresolved_alerts() -> list:
    """Retrieve unresolved alerts."""
    return serialize_docs(
        alerts_collection.find({"resolved": False}).sort("timestamp", -1)
    )


def insert_alert(alert: dict):
    """Insert a new alert document."""
    alerts_collection.insert_one(alert)


def resolve_alert(alert_id: str):
    """Mark an alert as resolved."""
    alerts_collection.update_one(
        {"alertId": alert_id},
        {"$set": {"resolved": True}},
    )


def upsert_alert(alert: dict):
    """Insert or update an alert."""
    alerts_collection.update_one(
        {"alertId": alert["alertId"]},
        {"$set": alert},
        upsert=True,
    )


def clear_all_alerts():
    """Delete all alerts from the collection."""
    alerts_collection.delete_many({})
