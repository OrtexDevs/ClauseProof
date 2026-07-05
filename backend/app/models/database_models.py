"""
ClauseProof Database Models
SQLAlchemy ORM models for all core entities.
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Text, Integer, Float, Boolean, DateTime, Date,
    ForeignKey, JSON, BigInteger, UniqueConstraint, Index
)
from sqlalchemy.orm import relationship
from app.core.database import Base


def generate_uuid():
    return str(uuid.uuid4())


def utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="promoter")
    organization = Column(String(255))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utcnow)
    
    # Relationships
    projects = relationship("Project", back_populates="creator", foreign_keys="Project.created_by")
    sign_offs = relationship("SignOff", back_populates="signer")
    

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    company_name = Column(String(255), nullable=False)
    cin = Column(String(21))  # Corporate Identity Number
    incorporation_date = Column(Date)
    registered_office = Column(Text)
    industry = Column(String(100))
    
    # IPO Details
    issue_size_cr = Column(Float)  # In Crores
    face_value = Column(Float, default=10.0)
    price_band_low = Column(Float)
    price_band_high = Column(Float)
    lot_size = Column(Integer)
    
    # Financial Summary (last 3 FYs)
    revenue_fy1 = Column(Float)
    revenue_fy2 = Column(Float)
    revenue_fy3 = Column(Float)
    ebitda_fy1 = Column(Float)
    ebitda_fy2 = Column(Float)
    ebitda_fy3 = Column(Float)
    pat_fy1 = Column(Float)
    pat_fy2 = Column(Float)
    pat_fy3 = Column(Float)
    net_worth = Column(Float)
    
    # Capital Structure
    pre_issue_shares = Column(BigInteger)
    fresh_issue_shares = Column(BigInteger)
    ofs_shares = Column(BigInteger)
    post_issue_paid_up_capital = Column(Float)
    
    # Status & Tracking
    status = Column(String(50), default="draft")  # draft, in_review, approved, filed
    compliance_score = Column(Float, default=0.0)
    completion_percentage = Column(Float, default=0.0)
    
    # Metadata
    created_by = Column(String(36), ForeignKey("users.id"))
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)
    
    # Relationships
    creator = relationship("User", back_populates="projects", foreign_keys=[created_by])
    sections = relationship("DRHPSection", back_populates="project", cascade="all, delete-orphan")
    compliance_results = relationship("ComplianceResult", back_populates="project", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="project", cascade="all, delete-orphan")
    sign_offs = relationship("SignOff", back_populates="project", cascade="all, delete-orphan")
    team_members = relationship("ProjectTeam", back_populates="project", cascade="all, delete-orphan")


class ProjectTeam(Base):
    __tablename__ = "project_teams"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    role = Column(String(50), nullable=False)
    permissions = Column(JSON, default=lambda: {"read": True, "write": False, "sign": False})
    added_at = Column(DateTime, default=utcnow)
    
    project = relationship("Project", back_populates="team_members")
    user = relationship("User")
    
    __table_args__ = (
        UniqueConstraint("project_id", "user_id", name="uq_project_user"),
    )


class DRHPSection(Base):
    __tablename__ = "drhp_sections"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    section_code = Column(String(30), nullable=False)
    section_name = Column(String(255), nullable=False)
    section_order = Column(Integer, default=0)
    parent_section_id = Column(String(36), ForeignKey("drhp_sections.id"))
    
    # Content
    content = Column(JSON)  # Structured disclosure data
    ai_draft = Column(Text)  # AI-generated draft
    human_edited = Column(Text)  # Human-reviewed content
    guidance_notes = Column(Text)  # Help text for SME promoters
    
    # Compliance tracking
    compliance_status = Column(String(20), default="pending")  # pending, pass, fail, warning
    is_mandatory = Column(Boolean, default=True)
    is_completed = Column(Boolean, default=False)
    
    # Versioning
    version = Column(Integer, default=1)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)
    updated_by = Column(String(36), ForeignKey("users.id"))
    
    # Relationships
    project = relationship("Project", back_populates="sections")
    parent = relationship("DRHPSection", remote_side=[id])
    compliance_results = relationship("ComplianceResult", back_populates="section", cascade="all, delete-orphan")
    sign_offs = relationship("SignOff", back_populates="section")
    
    __table_args__ = (
        UniqueConstraint("project_id", "section_code", name="uq_project_section"),
        Index("ix_drhp_sections_project", "project_id"),
    )


class RegulatoryRule(Base):
    __tablename__ = "regulatory_rules"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    rule_code = Column(String(50), unique=True, nullable=False)
    regulation = Column(String(100), nullable=False)  # ICDR_2018, ICDR_2025_AMD
    chapter = Column(String(50))
    section_ref = Column(String(100))
    rule_text = Column(Text, nullable=False)
    
    # Validation logic stored as structured JSON
    validation_logic = Column(JSON, nullable=False)
    
    # Classification
    category = Column(String(50))  # eligibility, disclosure, financial, structural
    severity = Column(String(20), default="mandatory")  # mandatory, recommended, optional
    applicable_to = Column(String(50), default="sme")  # sme, mainboard, all
    applicable_sections = Column(JSON)  # List of section_codes this rule applies to
    
    # Versioning
    effective_from = Column(Date)
    effective_until = Column(Date)
    superseded_by = Column(String(36), ForeignKey("regulatory_rules.id"))
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=utcnow)


class ComplianceResult(Base):
    __tablename__ = "compliance_results"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    section_id = Column(String(36), ForeignKey("drhp_sections.id"))
    rule_id = Column(String(36), ForeignKey("regulatory_rules.id"), nullable=False)
    
    status = Column(String(20), nullable=False)  # pass, fail, warning, na, skipped
    message = Column(Text)
    evidence = Column(JSON)  # Supporting data for the result
    
    checked_at = Column(DateTime, default=utcnow)
    
    project = relationship("Project", back_populates="compliance_results")
    section = relationship("DRHPSection", back_populates="compliance_results")
    rule = relationship("RegulatoryRule")
    
    __table_args__ = (
        Index("ix_compliance_project", "project_id"),
    )


class AuditLog(Base):
    __tablename__ = "audit_log"
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    project_id = Column(String(36), ForeignKey("projects.id"))
    actor_id = Column(String(36), ForeignKey("users.id"))
    
    action = Column(String(100), nullable=False)
    entity_type = Column(String(50))
    entity_id = Column(String(36))
    details = Column(JSON)
    
    # Hash chain for tamper-evidence
    content_hash = Column(String(64), nullable=False)
    previous_hash = Column(String(64), nullable=False, default="0" * 64)
    
    timestamp = Column(DateTime, default=utcnow)
    
    project = relationship("Project", back_populates="audit_logs")
    actor = relationship("User")
    
    __table_args__ = (
        Index("ix_audit_log_project", "project_id"),
        Index("ix_audit_log_timestamp", "timestamp"),
    )


class SignOff(Base):
    __tablename__ = "sign_offs"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    section_id = Column(String(36), ForeignKey("drhp_sections.id"))
    signer_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    signer_role = Column(String(50), nullable=False)
    
    status = Column(String(20), nullable=False, default="pending")  # pending, approved, rejected
    comments = Column(Text)
    digital_signature = Column(Text)  # Base64 encoded signature
    
    signed_at = Column(DateTime)
    created_at = Column(DateTime, default=utcnow)
    
    project = relationship("Project", back_populates="sign_offs")
    section = relationship("DRHPSection", back_populates="sign_offs")
    signer = relationship("User", back_populates="sign_offs")
