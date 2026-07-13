/**
 * ClauseProof TypeScript Interfaces
 * Perfectly aligned with FastAPI backend Pydantic schemas and database models.
 */

export type UserRole = 'promoter' | 'merchant_banker' | 'legal_counsel' | 'compliance_officer' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization?: string;
  is_active: boolean;
}

export type ProjectStatus = 'draft' | 'in_review' | 'approved' | 'filed';

export interface Project {
  id: string;
  name: string;
  company_name: string;
  cin?: string;
  incorporation_date?: string;
  registered_office?: string;
  industry?: string;
  
  // IPO Details
  issue_size_cr?: number;
  face_value?: number;
  price_band_low?: number;
  price_band_high?: number;
  lot_size?: number;
  
  // Financial Summary (last 3 FYs in ₹ Crores)
  revenue_fy1?: number;
  revenue_fy2?: number;
  revenue_fy3?: number;
  ebitda_fy1?: number;
  ebitda_fy2?: number;
  ebitda_fy3?: number;
  pat_fy1?: number;
  pat_fy2?: number;
  pat_fy3?: number;
  net_worth?: number;
  
  // Capital Structure
  pre_issue_shares?: number;
  fresh_issue_shares?: number;
  ofs_shares?: number;
  post_issue_paid_up_capital?: number;
  
  // Status & Metrics
  status: ProjectStatus;
  compliance_score: number;
  completion_percentage: number;
  
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export type ComplianceStatus = 'pending' | 'pass' | 'fail' | 'warning' | 'skipped';

export interface DRHPSection {
  id: string;
  project_id: string;
  section_code: string;
  section_name: string;
  section_order: number;
  parent_section_id?: string;
  content?: Record<string, any>;
  ai_draft?: string;
  human_edited?: string;
  guidance_notes?: string;
  compliance_status: ComplianceStatus;
  is_mandatory: boolean;
  is_completed: boolean;
  version: number;
  updated_at: string;
}

export interface ComplianceResult {
  id?: string;
  rule_code: string;
  rule_text: string;
  category: 'eligibility' | 'disclosure' | 'financial' | 'structural';
  severity: 'mandatory' | 'recommended' | 'optional';
  status: ComplianceStatus;
  message: string;
  evidence?: Record<string, any>;
  section_id?: string;
  checked_at?: string;
}

export interface ComplianceReport {
  project_id: string;
  total: number;
  passed: number;
  failed: number;
  warnings: number;
  skipped: number;
  score: number;
  details: ComplianceResult[];
}

export interface AuditLog {
  id: number;
  project_id?: string;
  actor_id?: string;
  actor_name?: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  details?: Record<string, any>;
  content_hash: string;
  previous_hash: string;
  timestamp: string;
}

export interface AuditVerification {
  valid: boolean;
  entries_checked: number;
  breaks: Array<{
    entry_id: number;
    expected_previous?: string;
    actual_previous?: string;
    expected_hash?: string;
    actual_hash?: string;
    type: 'chain_break' | 'content_tamper';
  }>;
}

export interface SignOff {
  id: string;
  project_id: string;
  section_id?: string;
  signer_id: string;
  signer_name?: string;
  signer_role: UserRole;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  digital_signature?: string;
  signed_at?: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  project_id: string;
  user_id: string;
  role: UserRole;
  permissions: {
    read: boolean;
    write: boolean;
    sign: boolean;
  };
  user?: User;
}

export interface RegulatoryRule {
  id: string;
  rule_code: string;
  regulation: string;
  chapter?: string;
  section_ref?: string;
  rule_text: string;
  category: string;
  severity: string;
  applicable_to: string;
}
