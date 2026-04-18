"""
AI controller — handles request logic for Gemini-powered analysis.
"""

from app.services.ai_service import analyze_with_gemini, build_patient_prompt
from app.services.patient_service import fetch_patient
from app.utils.helpers import format_response


def analyze(prompt: str | None = None, patient_id: str | None = None):
    """
    Run AI analysis.

    If a patientId is provided, build a prompt from that patient's data.
    Otherwise, use the raw prompt string.
    """
    # Build prompt from patient data if patientId is given
    if patient_id:
        patient = fetch_patient(patient_id)
        if not patient:
            return format_response(False, None, f"Patient {patient_id} not found")
        prompt = build_patient_prompt(patient)
    elif not prompt:
        return format_response(False, None, "Provide either a 'prompt' or a 'patientId'")

    # Call Gemini
    result = analyze_with_gemini(prompt)

    return format_response(True, {"analysis": result, "prompt_used": prompt}, "AI analysis complete")

def analyze_report(payload: dict):
    """
    Analyze a PDF report using Gemini.
    """
    from app.services.ai_service import analyze_pdf_with_gemini
    
    base64_data = payload.get("base64_data")
    report_name = payload.get("report_name", "Medical Report")
    if not base64_data:
        return format_response(False, None, "base64_data is required")
        
    # Remove data URI prefix if present (e.g. data:application/pdf;base64,)
    if "," in base64_data:
        base64_data = base64_data.split(",")[1]
    
    result = analyze_pdf_with_gemini(base64_data, report_name)
    
    return format_response(True, {"analysis": result}, "Report analysis complete")
