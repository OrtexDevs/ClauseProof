"""
ClauseProof Projects API
CRUD operations for IPO filing projects.
"""
import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_sync_db
from app.core.security import get_current_user
from app.core.audit_chain import AuditChain
from app.models.database_models import User, Project, DRHPSection, ProjectTeam
from app.schemas.api_schemas import (
    ProjectCreate, ProjectUpdate, ProjectResponse, ProjectListResponse
)

router = APIRouter(prefix="/projects", tags=["Projects"])

# Default DRHP sections per Schedule VI
DEFAULT_DRHP_SECTIONS = [
    {"code": "COVER_PAGE", "name": "Cover Page", "order": 1, "mandatory": True,
     "guidance": "Front and back cover pages with issuer details, offer structure, and mandatory disclaimers."},
    {"code": "TABLE_OF_CONTENTS", "name": "Table of Contents", "order": 2, "mandatory": True,
     "guidance": "Auto-generated table of contents. Updated automatically as sections are completed."},
    {"code": "DEFINITIONS", "name": "Definitions & Abbreviations", "order": 3, "mandatory": True,
     "guidance": "Define all technical terms, abbreviations, and legal terms used in the document."},
    {"code": "RISK_FACTORS", "name": "Risk Factors", "order": 4, "mandatory": True,
     "guidance": "List all material risks — internal (business-specific) and external (market/regulatory). Quantify risks where possible."},
    {"code": "INTRODUCTION", "name": "Introduction", "order": 5, "mandatory": True,
     "guidance": "Summary of the company, its history, promoters, and the offering. Include basic financial summary."},
    {"code": "CAPITAL_STRUCTURE", "name": "Capital Structure", "order": 6, "mandatory": True,
     "guidance": "Pre-issue and post-issue shareholding pattern, authorized and paid-up capital details."},
    {"code": "OBJECTS_OF_ISSUE", "name": "Objects of the Issue", "order": 7, "mandatory": True,
     "guidance": "Detailed breakdown of how IPO proceeds will be utilized. Include capex, working capital, and GCP allocations."},
    {"code": "BASIS_FOR_ISSUE_PRICE", "name": "Basis for Issue Price", "order": 8, "mandatory": True,
     "guidance": "Justify the price band using financial metrics like EPS, P/E ratio, and peer comparison."},
    {"code": "BUSINESS_OVERVIEW", "name": "Business Overview", "order": 9, "mandatory": True,
     "guidance": "Comprehensive description of products/services, manufacturing, customers, suppliers, and competitive landscape."},
    {"code": "KEY_INDUSTRY_REGULATIONS", "name": "Key Industry Regulations", "order": 10, "mandatory": True,
     "guidance": "Regulatory framework applicable to the company's industry. Include licenses and approvals."},
    {"code": "FINANCIAL_STATEMENTS", "name": "Financial Statements", "order": 11, "mandatory": True,
     "guidance": "Restated audited financials for 3 preceding financial years. Balance sheet, P&L, cash flow."},
    {"code": "MANAGEMENT", "name": "Management & Board of Directors", "order": 12, "mandatory": True,
     "guidance": "Profiles of directors, KMP, senior management. Compensation, shareholding, and experience."},
    {"code": "PROMOTER_GROUP", "name": "Promoters & Promoter Group", "order": 13, "mandatory": True,
     "guidance": "Complete details of promoters including background, group companies, and litigation history."},
    {"code": "LEGAL_PROCEEDINGS", "name": "Outstanding Litigations & Legal Proceedings", "order": 14, "mandatory": True,
     "guidance": "All pending litigations, defaults, and regulatory actions against the company and promoters."},
    {"code": "GENERAL_INFORMATION", "name": "General Information", "order": 15, "mandatory": True,
     "guidance": "Merchant bankers, registrar, bankers to the issue, underwriters, and other intermediaries."},
    {"code": "OTHER_REGULATORY_DISCLOSURES", "name": "Other Regulatory & Statutory Disclosures", "order": 16, "mandatory": True,
     "guidance": "Material contracts, undertakings, and declarations required under SEBI regulations."},
    {"code": "SITE_VISIT_REPORT", "name": "Merchant Banker Site Visit Report", "order": 17, "mandatory": True,
     "guidance": "Details of the merchant banker's site visit including date, findings, and observations (2025 amendment)."},
    {"code": "ESI_PF_DETAILS", "name": "ESI/PF & Employee Details", "order": 18, "mandatory": True,
     "guidance": "Employee count, ESI and PF compliance details, workforce breakdown (2025 amendment)."},
]


@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_sync_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new IPO filing project with default DRHP sections."""
    project = Project(
        **project_data.model_dump(exclude_none=True),
        created_by=current_user.id,
    )
    db.add(project)
    db.flush()
    
    # Create default DRHP sections
    for sec in DEFAULT_DRHP_SECTIONS:
        section = DRHPSection(
            project_id=project.id,
            section_code=sec["code"],
            section_name=sec["name"],
            section_order=sec["order"],
            is_mandatory=sec["mandatory"],
            guidance_notes=sec["guidance"],
        )
        db.add(section)
    
    # Add creator to team
    team_member = ProjectTeam(
        project_id=project.id,
        user_id=current_user.id,
        role=current_user.role,
        permissions={"read": True, "write": True, "sign": True},
    )
    db.add(team_member)
    
    db.commit()
    db.refresh(project)
    
    # Audit log
    AuditChain.log(
        db=db,
        action="project_created",
        actor_id=current_user.id,
        project_id=project.id,
        entity_type="project",
        entity_id=project.id,
        details={"name": project.name, "company": project.company_name},
    )
    
    return ProjectResponse.model_validate(project)


@router.get("/", response_model=ProjectListResponse)
def list_projects(
    db: Session = Depends(get_sync_db),
    current_user: User = Depends(get_current_user),
):
    """List all projects accessible to the current user."""
    if current_user.role == "admin":
        projects = db.query(Project).order_by(Project.updated_at.desc()).all()
    else:
        # Get projects where user is a team member
        team_project_ids = db.query(ProjectTeam.project_id).filter(
            ProjectTeam.user_id == current_user.id
        ).all()
        project_ids = [p[0] for p in team_project_ids]
        
        projects = db.query(Project).filter(
            (Project.created_by == current_user.id) | (Project.id.in_(project_ids))
        ).order_by(Project.updated_at.desc()).all()
    
    return ProjectListResponse(
        projects=[ProjectResponse.model_validate(p) for p in projects],
        total=len(projects),
    )


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: str,
    db: Session = Depends(get_sync_db),
    current_user: User = Depends(get_current_user),
):
    """Get project details."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectResponse.model_validate(project)


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: str,
    update_data: ProjectUpdate,
    db: Session = Depends(get_sync_db),
    current_user: User = Depends(get_current_user),
):
    """Update project details."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_dict = update_data.model_dump(exclude_none=True)
    for key, value in update_dict.items():
        setattr(project, key, value)
    
    db.commit()
    db.refresh(project)
    
    # Audit log
    AuditChain.log(
        db=db,
        action="project_updated",
        actor_id=current_user.id,
        project_id=project.id,
        entity_type="project",
        entity_id=project.id,
        details={"updated_fields": list(update_dict.keys())},
    )
    
    return ProjectResponse.model_validate(project)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: str,
    db: Session = Depends(get_sync_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a project (admin or creator only)."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if current_user.role != "admin" and project.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    db.delete(project)
    db.commit()
