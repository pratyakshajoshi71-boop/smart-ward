import random
import asyncio
import time

from app.models.patient_model import get_all_patients, update_patient_vitals, update_patient_status
from app.models.resource_model import get_resources, update_resource_field
from app.services.alert_service import evaluate_patient_alerts, evaluate_resource_alerts, save_alerts
from app.utils.helpers import random_vital_fluctuation, current_timestamp, serialize_docs
from app.config.socket_manager import sio

# Interval in seconds between simulation ticks
SIMULATION_INTERVAL = 10

_simulation_task: asyncio.Task | None = None
_running = False


async def _simulate_tick():
    """Run a single simulation cycle."""
    try:
        # --- Update patient vitals ---
        patients = get_all_patients()
        all_new_alerts: list = []

        for patient in patients:
            vitals = patient.get("vitals", {})

            new_vitals = {
                "heartRate": random_vital_fluctuation(vitals.get("heartRate", 80), 55, 150, 4),
                "oxygen": random_vital_fluctuation(vitals.get("oxygen", 96), 75, 100, 2),
                "bpSystolic": random_vital_fluctuation(vitals.get("bpSystolic", 120), 85, 200, 5),
                "bpDiastolic": random_vital_fluctuation(vitals.get("bpDiastolic", 80), 50, 130, 3),
            }

            update_patient_vitals(patient["patientId"], new_vitals)

            # Derive status from vitals (user-defined benchmarks)
            # Critical : HR > 110  OR  SpO2 < 90%
            # Moderate : HR 100–110  OR  SpO2 90–94%
            # Stable   : HR 60–100  AND  SpO2 95–100%
            if new_vitals["heartRate"] > 110 or new_vitals["oxygen"] < 90:
                new_status = "critical"
            elif new_vitals["heartRate"] >= 100 or new_vitals["oxygen"] <= 94:
                new_status = "moderate"
            else:
                new_status = "stable"

            update_patient_status(patient["patientId"], new_status)

            # Evaluate alerts for this patient
            patient_snapshot = {**patient, "vitals": new_vitals}
            alerts = evaluate_patient_alerts(patient_snapshot)
            all_new_alerts.extend(alerts)

        # --- Update ICU occupancy ---
        resources = get_resources()
        icu_beds = resources.get("icuBeds", 20)
        icu_occupied = resources.get("icuOccupied", 14)
        delta = random.choice([-1, 0, 0, 0, 1])  # slight random change
        icu_occupied = max(0, min(icu_beds, icu_occupied + delta))
        update_resource_field("icuOccupied", icu_occupied)
        update_resource_field("icuAvailable", icu_beds - icu_occupied)
        update_resource_field("lastUpdated", current_timestamp())

        # Evaluate resource alerts
        resource_snapshot = {**resources, "icuOccupied": icu_occupied}
        resource_alerts = evaluate_resource_alerts(resource_snapshot)
        all_new_alerts.extend(resource_alerts)

        # Persist new alerts
        if all_new_alerts:
            save_alerts(all_new_alerts)
            # Notify frontend of new alerts (serialize to handle ObjectId)
            await sio.emit("new_alerts", serialize_docs(all_new_alerts))

        # Notify frontend that vitals have updated
        await sio.emit("vitals_updated", {"timestamp": current_timestamp()})

        print(
            f"[Simulation] Tick complete — "
            f"{len(patients)} patients updated, "
            f"{len(all_new_alerts)} new alerts generated."
        )

    except Exception as e:
        print(f"[Simulation] Error during tick: {e}")


async def _simulation_loop():
    """Background loop that runs ticks at fixed intervals."""
    global _running
    while _running:
        await _simulate_tick()
        await asyncio.sleep(SIMULATION_INTERVAL)


def start_simulation():
    """Start the background simulation task."""
    global _simulation_task, _running
    if _running:
        print("[Simulation] Already running.")
        return
    _running = True
    _simulation_task = asyncio.create_task(_simulation_loop())
    print(f"[Simulation] Started (interval={SIMULATION_INTERVAL}s)")


def stop_simulation():
    """Stop the background simulation task."""
    global _running
    _running = False
    if _simulation_task:
        _simulation_task.cancel()
    print("[Simulation] Stopped.")
