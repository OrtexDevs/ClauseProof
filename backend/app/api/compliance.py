"""
ClauseProof Compliance API
Deterministic rule engine execution and compliance reporting.
"""
import json
import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_sync_db
from app.core.security import get_current_user
from app.core.rule_engine import RuleEngine
from app.core.audit_chain import AuditChain
from app.models.database_models import User, RegulatoryRule, ComplianceResult

router = APIRouter(prefix="/projects/{project_id}/compliance", tags=["Compliance"])


def _ensure_rules_loaded(db: Session):
    """Load ICDR rules from JSON if not already in DB."""
    count = db.query(RegulatoryRule).count()
    if count > 0:
        return
    
    rules_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
        "rules", "icdr_rules.json"
    )
    
    if not os.path.exists(rules_path):
        return
    
    with open(rules_path, "r") as f:
        rules_data = json.load(f)
    
    for rule_data in rules_data:
        rule = RegulatoryRule(**rule_data, is_active=True)
        db.add(rule)
    
    db.commit()


@router.post("/run")
def run_compliance_check(
    project_id: str,
    db: Session = Depends(get_sync_db),
    current_user: User = Depends(get_current_user),
):
    """
    Run all ICDR compliance rules against the project.
    Returns detailed, deterministic results for every rule.
    """
    _ensure_rules_loaded(db)
    
    engine = RuleEngine(db)
    results = engine.run_all_rules(project_id)
    
    if "error" in results:
        raise HTTPException(status_code=404, detail=results["error"])
    
    # Audit log
    AuditChain.log(
        db=db,
        action="compliance_check_executed",
        actor_id=current_user.id,
        project_id=project_id,
        entity_type="compliance",
        entity_id=project_id,
        details={
            "total": results["total"],
            "passed": results["passed"],
            "failed": results["failed"],
            "score": results.get("score", 0),
        },
    )
    
    return results


@router.get("/results")
def get_compliance_results(
    project_id: str,
    db: Session = Depends(get_sync_db),
    current_user: User = Depends(get_current_user),
):
    """Get stored compliance results for a project."""
    results = db.query(ComplianceResult).filter(
        ComplianceResult.project_id == project_id
    ).all()
    
    output = []
    for r in results:
        rule = r.rule
        output.append({
            "id": r.id,
            "rule_code": rule.rule_code if rule else "N/A",
            "rule_text": rule.rule_text if rule else "N/A",
            "category": rule.category if rule else "N/A",
            "severity": rule.severity if rule else "N/A",
            "status": r.status,
            "message": r.message,
            "evidence": r.evidence,
            "checked_at": r.checked_at.isoformat() if r.checked_at else None,
        })
    
    # Summary counts
    passed = sum(1 for r in output if r["status"] == "pass")
    failed = sum(1 for r in output if r["status"] == "fail")
    warnings = sum(1 for r in output if r["status"] == "warning")
    total = len(output)
    
    return {
        "project_id": project_id,
        "total": total,
        "passed": passed,
        "failed": failed,
        "warnings": warnings,
        "score": round((passed / total * 100), 1) if total > 0 else 0,
        "details": output,
    }


@router.get("/rules")
def list_rules(
    db: Session = Depends(get_sync_db),
    current_user: User = Depends(get_current_user),
):
    """List all active ICDR regulatory rules."""
    _ensure_rules_loaded(db)
    
    rules = db.query(RegulatoryRule).filter(
        RegulatoryRule.is_active == True
    ).all()
    
    return [{
        "id": r.id,
        "rule_code": r.rule_code,
        "regulation": r.regulation,
        "chapter": r.chapter,
        "section_ref": r.section_ref,
        "rule_text": r.rule_text,
        "category": r.category,
        "severity": r.severity,
        "applicable_to": r.applicable_to,
    } for r in rules]
