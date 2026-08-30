from fastapi import APIRouter, HTTPException, Response
from app.services.report_generator import report_generator
from app.services.seed_data import DEMO_CASES

router = APIRouter(prefix="/reports", tags=["Court-Ready Legal Intelligence Dossiers"])

@router.get("/dossier/{case_id}")
@router.get("/{case_id}/dossier")
def export_court_dossier_html(case_id: str):
    case = next((c for c in DEMO_CASES if c.id == case_id), None)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    html_content = report_generator.generate_case_dossier_html(case_id=case_id)
    return Response(content=html_content, media_type="text/html")
