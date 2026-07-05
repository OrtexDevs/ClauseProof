"""
ClauseProof Audit API
Hash-chained audit trail retrieval and verification.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_sync_db
from app.core.security import get_current_user, require_role
from app.core.audit_chain import AuditChain
from app.models.database_models import User, AuditLog
from app.schemas.api_schemas import AuditLogResponse, AuditVerifyResponse

router = APIRouter(prefix="/audit", tags=["Audit Trail"])


@router.get("/project/{project_id}", response_model=List[AuditLogResponse])
def get_project_audit_trail(
    project_id: str, limit: int = 100,
    db: Session = Depends(get_sync_db),
    current_user: User = Depends(get_current_user),
):
    logs = db.query(AuditLog).filter(
        AuditLog.project_id == project_id
    ).order_by(AuditLog.id.desc()).limit(limit).all()
    return [AuditLogResponse.model_validate(log) for log in logs]


@router.get("/project/{project_id}/verify", response_model=AuditVerifyResponse)
def verify_audit_chain(
    project_id: str,
    db: Session = Depends(get_sync_db),
    current_user: User = Depends(get_current_user),
):
    result = AuditChain.verify_chain(db, project_id)
    return AuditVerifyResponse(**result)
