"""
ClauseProof Workspace & Sign-Off API
Multi-party collaboration and digital sign-off management.
"""
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_sync_db
from app.core.security import get_current_user
from app.core.audit_chain import AuditChain
from app.models.database_models import User, Project, SignOff, ProjectTeam
from app.schemas.api_schemas import (
    SignOffCreate, SignOffResponse, TeamMemberAdd, TeamMemberResponse, UserResponse
)

router = APIRouter(tags=["Workspace"])


@router.post("/projects/{project_id}/team")
def add_team_member(
    project_id: str, member: TeamMemberAdd,
    db: Session = Depends(get_sync_db),
    current_user: User = Depends(get_current_user),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    existing = db.query(ProjectTeam).filter(
        ProjectTeam.project_id == project_id,
        ProjectTeam.user_id == member.user_id,
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="User already in team")
    
    tm = ProjectTeam(
        project_id=project_id, user_id=member.user_id,
        role=member.role,
        permissions=member.permissions or {"read": True, "write": False, "sign": False},
    )
    db.add(tm)
    db.commit()
    
    AuditChain.log(db=db, action="team_member_added", actor_id=current_user.id,
                   project_id=project_id, entity_type="team", entity_id=member.user_id,
                   details={"role": member.role})
    return {"status": "added"}


@router.get("/projects/{project_id}/team")
def get_team(
    project_id: str,
    db: Session = Depends(get_sync_db),
    current_user: User = Depends(get_current_user),
):
    members = db.query(ProjectTeam).filter(ProjectTeam.project_id == project_id).all()
    result = []
    for m in members:
        user = db.query(User).filter(User.id == m.user_id).first()
        result.append({
            "id": m.id, "project_id": m.project_id, "user_id": m.user_id,
            "role": m.role, "permissions": m.permissions,
            "user": UserResponse.model_validate(user).model_dump() if user else None,
        })
    return result


@router.post("/projects/{project_id}/signoff", response_model=SignOffResponse)
def create_signoff(
    project_id: str, signoff_data: SignOffCreate,
    db: Session = Depends(get_sync_db),
    current_user: User = Depends(get_current_user),
):
    signoff = SignOff(
        project_id=project_id, section_id=signoff_data.section_id,
        signer_id=current_user.id, signer_role=current_user.role,
        status=signoff_data.status, comments=signoff_data.comments,
        signed_at=datetime.now(timezone.utc) if signoff_data.status != "pending" else None,
    )
    db.add(signoff)
    db.commit()
    db.refresh(signoff)
    
    AuditChain.log(db=db, action=f"signoff_{signoff_data.status}", actor_id=current_user.id,
                   project_id=project_id, entity_type="signoff", entity_id=signoff.id,
                   details={"section_id": signoff_data.section_id, "status": signoff_data.status})
    return SignOffResponse.model_validate(signoff)


@router.get("/projects/{project_id}/signoffs", response_model=List[SignOffResponse])
def get_signoffs(
    project_id: str,
    db: Session = Depends(get_sync_db),
    current_user: User = Depends(get_current_user),
):
    signoffs = db.query(SignOff).filter(SignOff.project_id == project_id).all()
    return [SignOffResponse.model_validate(s) for s in signoffs]
