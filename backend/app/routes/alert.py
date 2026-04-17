"""
Alert routes.
"""

from fastapi import APIRouter
from app.controllers.alert_controller import get_alerts, get_active_alerts

router = APIRouter(prefix="/alerts", tags=["Alerts"])


@router.get("")
def list_alerts():
    """GET /alerts — get all alerts."""
    return get_alerts()


@router.get("/active")
def list_active_alerts():
    """GET /alerts/active — get unresolved alerts only."""
    return get_active_alerts()


@router.delete("")
def delete_all_alerts():
    """DELETE /alerts — clear all alerts."""
    from app.controllers.alert_controller import clear_alerts
    return clear_alerts()
