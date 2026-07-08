"""
ClauseProof Pydantic Schemas
Request/Response schemas for API endpoints.
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any
from datetime import datetime, date


# === Auth Schemas ===

class UserCreate(BaseModel):
    email: EmailStr
    name: str = Field(min_length=2, max_length=100)
    password: str = Field(min_length=8, max_length=128)
    role: str = "promoter"
    organization: Optional[str] = Field(default=None, max_length=200)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    organization: Optional[str] = None
    is_active: bool = True
    
    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# === Project Schemas ===

class ProjectCreate(BaseModel):
    name: str = Field(min_length=3, max_length=100)
    company_name: str = Field(min_length=2, max_length=200)
    cin: Optional[str] = None
    incorporation_date: Optional[date] = None
    registered_office: Optional[str] = None
    industry: Optional[str] = None
    
    # IPO Details
    issue_size_cr: Optional[float] = None
    face_value: Optional[float] = 10.0
    price_band_low: Optional[float] = None
    price_band_high: Optional[float] = None
    lot_size: Optional[int] = None
    
    # Financial (3 FYs)
    revenue_fy1: Optional[float] = None
    revenue_fy2: Optional[float] = None
    revenue_fy3: Optional[float] = None
    ebitda_fy1: Optional[float] = None
    ebitda_fy2: Optional[float] = None
    ebitda_fy3: Optional[float] = None
    pat_fy1: Optional[float] = None
    pat_fy2: Optional[float] = None
    pat_fy3: Optional[float] = None
    net_worth: Optional[float] = None
    
    # Capital Structure
    pre_issue_shares: Optional[int] = None
    fresh_issue_shares: Optional[int] = None
    ofs_shares: Optional[int] = None
    post_issue_paid_up_capital: Optional[float] = None


class ProjectUpdate(ProjectCreate):
    name: Optional[str] = None
    company_name: Optional[str] = None
    status: Optional[str] = None


class ProjectResponse(BaseModel):
    id: str
    name: str
    company_name: str
    cin: Optional[str] = None
    incorporation_date: Optional[date] = None
    registered_office: Optional[str] = None
    industry: Optional[str] = None
    
    issue_size_cr: Optional[float] = None
    face_value: Optional[float] = None
    price_band_low: Optional[float] = None
    price_band_high: Optional[float] = None
    lot_size: Optional[int] = None
    
    revenue_fy1: Optional[float] = None
    revenue_fy2: Optional[float] = None
    revenue_fy3: Optional[float] = None
    ebitda_fy1: Optional[float] = None
    ebitda_fy2: Optional[float] = None
    ebitda_fy3: Optional[float] = None
    pat_fy1: Optional[float] = None
    pat_fy2: Optional[float] = None
    pat_fy3: Optional[float] = None
    net_worth: Optional[float] = None
    
    pre_issue_shares: Optional[int] = None
    fresh_issue_shares: Optional[int] = None
    ofs_shares: Optional[int] = None
    post_issue_paid_up_capital: Optional[float] = None
    
    status: str = "draft"
    compliance_score: float = 0.0
    completion_percentage: float = 0.0
    
    created_by: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class ProjectListResponse(BaseModel):
    projects: List[ProjectResponse]
    total: int


# === Section Schemas ===

class SectionCreate(BaseModel):
    section_code: str = Field(min_length=1, max_length=50)
    section_name: str = Field(min_length=2, max_length=200)
    section_order: int = 0
    parent_section_id: Optional[str] = None
    content: Optional[dict] = None
    ai_draft: Optional[str] = None
    human_edited: Optional[str] = None
    guidance_notes: Optional[str] = None
    is_mandatory: bool = True


class SectionUpdate(BaseModel):
    content: Optional[dict] = None
    ai_draft: Optional[str] = None
    human_edited: Optional[str] = None
    is_completed: Optional[bool] = None


class SectionResponse(BaseModel):
    id: str
    project_id: str
    section_code: str
    section_name: str
    section_order: int
    parent_section_id: Optional[str] = None
    content: Optional[dict] = None
    ai_draft: Optional[str] = None
    human_edited: Optional[str] = None
    guidance_notes: Optional[str] = None
    compliance_status: str = "pending"
    is_mandatory: bool = True
    is_completed: bool = False
    version: int = 1
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# === Compliance Schemas ===

class ComplianceResultResponse(BaseModel):
    rule_code: str
    rule_text: str
    category: str
    severity: str
    status: str
    message: str
    evidence: Optional[dict] = None
    section_id: Optional[str] = None


class ComplianceReport(BaseModel):
    project_id: str
    total: int
    passed: int
    failed: int
    warnings: int
    skipped: int
    score: float
    details: List[ComplianceResultResponse]


# === Audit Schemas ===

class AuditLogResponse(BaseModel):
    id: int
    project_id: Optional[str] = None
    actor_id: Optional[str] = None
    action: str
    entity_type: Optional[str] = None
    entity_id: Optional[str] = None
    details: Optional[dict] = None
    content_hash: str
    previous_hash: str
    timestamp: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class AuditVerifyResponse(BaseModel):
    valid: bool
    entries_checked: int
    breaks: List[dict]


# === Sign-Off Schemas ===

class SignOffCreate(BaseModel):
    section_id: Optional[str] = None
    status: str = "approved"
    comments: Optional[str] = None


class SignOffResponse(BaseModel):
    id: str
    project_id: str
    section_id: Optional[str] = None
    signer_id: str
    signer_role: str
    status: str
    comments: Optional[str] = None
    signed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# === Team Schemas ===

class TeamMemberAdd(BaseModel):
    user_id: str
    role: str
    permissions: Optional[dict] = None


class TeamMemberResponse(BaseModel):
    id: str
    project_id: str
    user_id: str
    role: str
    permissions: Optional[dict] = None
    user: Optional[UserResponse] = None
    
    class Config:
        from_attributes = True
