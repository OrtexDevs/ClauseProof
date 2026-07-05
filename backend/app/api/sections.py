"""
ClauseProof Sections API
DRHP section management — the Delta Wizard backend.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_sync_db
from app.core.security import get_current_user
from app.core.audit_chain import AuditChain
from app.models.database_models import User, DRHPSection, Project
from app.schemas.api_schemas import SectionCreate, SectionUpdate, SectionResponse
from app.core.drafting_engine import generate_section_draft

router = APIRouter(prefix="/projects/{project_id}/sections", tags=["Sections"])


@router.post("/{section_code}/draft")
def generate_draft(
    project_id: str,
    section_code: str,
    db: Session = Depends(get_sync_db),
    current_user: User = Depends(get_current_user),
):
    """Generate a SEBI Schedule VI precedent-grounded draft for a section."""
    project = db.query(Project).filter(Project.id == project_id).first()
    project_data = {}
    if project:
        project_data = {
            "name": project.name,
            "industry": project.industry,
            "issue_size_cr": project.issue_size_cr,
            "pre_issue_shares": project.pre_issue_shares,
            "fresh_issue_shares": project.fresh_issue_shares,
            "ofs_shares": project.ofs_shares,
            "price_band_high": project.price_band_high,
            "face_value": project.face_value,
            "financials": project.financials or {}
        }
    return generate_section_draft(section_code, project_data)


@router.get("/", response_model=List[SectionResponse])
def list_sections(
    project_id: str,
    db: Session = Depends(get_sync_db),
    current_user: User = Depends(get_current_user),
):
    """Get all sections for a project, ordered by section_order."""
    sections = db.query(DRHPSection).filter(
        DRHPSection.project_id == project_id
    ).order_by(DRHPSection.section_order).all()
    
    return [SectionResponse.model_validate(s) for s in sections]


@router.get("/{section_id}", response_model=SectionResponse)
def get_section(
    project_id: str,
    section_id: str,
    db: Session = Depends(get_sync_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific section."""
    section = db.query(DRHPSection).filter(
        DRHPSection.id == section_id,
        DRHPSection.project_id == project_id,
    ).first()
    
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    return SectionResponse.model_validate(section)


@router.put("/{section_id}", response_model=SectionResponse)
def update_section(
    project_id: str,
    section_id: str,
    update_data: SectionUpdate,
    db: Session = Depends(get_sync_db),
    current_user: User = Depends(get_current_user),
):
    """Update a DRHP section (Delta Wizard save)."""
    section = db.query(DRHPSection).filter(
        DRHPSection.id == section_id,
        DRHPSection.project_id == project_id,
    ).first()
    
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    
    # Track what changed for audit
    changes = {}
    update_dict = update_data.model_dump(exclude_none=True)
    
    for key, value in update_dict.items():
        old_value = getattr(section, key, None)
        if old_value != value:
            changes[key] = {"old": str(old_value)[:100], "new": str(value)[:100]}
            setattr(section, key, value)
    
    if changes:
        section.version += 1
        section.updated_by = current_user.id
        
        db.commit()
        db.refresh(section)
        
        # Audit log with content diff
        AuditChain.log(
            db=db,
            action="section_updated",
            actor_id=current_user.id,
            project_id=project_id,
            entity_type="drhp_section",
            entity_id=section.id,
            details={
                "section_code": section.section_code,
                "version": section.version,
                "changes": changes,
            },
        )
    
    return SectionResponse.model_validate(section)
