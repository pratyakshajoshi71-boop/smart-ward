"""
Alert controller — handles request logic for alerts.
"""

from app.services.alert_service import fetch_all_alerts, fetch_unresolved_alerts
from app.utils.helpers import format_response


def get_alerts():
    """Return all alerts."""
    alerts = fetch_all_alerts()
    return format_response(True, alerts, f"Fetched {len(alerts)} alerts")


def get_active_alerts():
    """Return only unresolved alerts."""
    alerts = fetch_unresolved_alerts()
    return format_response(True, alerts, f"Fetched {len(alerts)} active alerts")


def clear_alerts():
    """Clear all alerts."""
    from app.services.alert_service import clear_all_alerts
    count = clear_all_alerts()
    return format_response(True, {"deleted_count": count}, f"Cleared {count} alerts")
