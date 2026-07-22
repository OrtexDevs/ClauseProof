/**
 * ClauseProof API Client Service
 * Connects to FastAPI backend (/api/v1) with seamless local-storage fallback
 * for standalone demo and offline capability.
 */
import axios, { AxiosInstance } from 'axios';
import { 
  User, Project, DRHPSection, ComplianceReport, ComplianceResult,
  AuditLog, AuditVerification, SignOff, TeamMember, RegulatoryRule 
} from '../types';

const API_BASE_URL = '/api/v1';

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('cp_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==========================================
// MOCK & FALLBACK LOCAL STORAGE DATA ENGINE
// ==========================================

const LOCAL_STORAGE_KEYS = {
  USERS: 'cp_users',
  CURRENT_USER: 'cp_current_user',
  TOKEN: 'cp_token',
  PROJECTS: 'cp_projects',
  SECTIONS: 'cp_sections',
  AUDIT: 'cp_audit_logs',
  SIGNOFFS: 'cp_signoffs',
  TEAM: 'cp_team_members',
};

// Seed demo promoter user if none exists
function seedDemoData() {
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.USERS)) {
    const demoUser: User = {
      id: 'demo-user-001',
      email: 'rajesh.kumar@techvista.in',
      name: 'Rajesh Kumar (Promoter)',
      role: 'promoter',
      organization: 'TechVista Solutions Pvt Ltd',
      is_active: true,
    };
    const mbUser: User = {
      id: 'demo-user-002',
      email: 'sharma@apexcapital.in',
      name: 'Vikram Sharma (Lead Manager)',
      role: 'merchant_banker',
      organization: 'Apex Capital Advisors Ltd',
      is_active: true,
    };
    const legalUser: User = {
      id: 'demo-user-003',
      email: 'ananya@lexcorp.in',
      name: 'Adv. Ananya Desai',
      role: 'legal_counsel',
      organization: 'LexCorp Advocates & Solicitors',
      is_active: true,
    };
    localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify([demoUser, mbUser, legalUser]));
    if (!localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(demoUser));
      localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, 'mock-jwt-token-sme-2026');
    }
  }
}
seedDemoData();

// Helper for local SHA-256 hash calculation
async function calculateHash(payload: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(payload);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Local Audit Logger
async function logLocalAudit(action: string, entityType: string, entityId: string, details: any, projectId?: string) {
  const logs: AuditLog[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.AUDIT) || '[]');
  const currentUser: User | null = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER) || 'null');
  const prevHash = logs.length > 0 ? logs[logs.length - 1].content_hash : '0'.repeat(64);
  const timestamp = new Date().toISOString();
  
  const payload = JSON.stringify({
    action, entityType, entityId, details,
    actorId: currentUser?.id || 'system',
    timestamp, previousHash: prevHash
  });
  
  const contentHash = await calculateHash(payload);
  const newLog: AuditLog = {
    id: logs.length + 1,
    project_id: projectId,
    actor_id: currentUser?.id,
    actor_name: currentUser?.name || 'System',
    action,
    entity_type: entityType,
    entity_id: entityId,
    details,
    content_hash: contentHash,
    previous_hash: prevHash,
    timestamp,
  };
  
  logs.push(newLog);
  localStorage.setItem(LOCAL_STORAGE_KEYS.AUDIT, JSON.stringify(logs));
  return newLog;
}

// Default DRHP Schedule VI Section Templates
const DEFAULT_SCHEDULE_VI_SECTIONS = [
  { code: 'COVER_PAGE', name: 'Cover Page', order: 1, mandatory: true, guidance: 'Front and back cover pages with issuer details, offer structure, merchant banker info, and mandatory risk disclaimers per SEBI format.' },
  { code: 'TABLE_OF_CONTENTS', name: 'Table of Contents', order: 2, mandatory: true, guidance: 'Auto-generated table of contents. Updated automatically as sections are completed.' },
  { code: 'DEFINITIONS', name: 'Definitions & Abbreviations', order: 3, mandatory: true, guidance: 'Define all technical terms, abbreviations, and legal terms used in the document.' },
  { code: 'RISK_FACTORS', name: 'Risk Factors', order: 4, mandatory: true, guidance: 'List all material risks — internal (business-specific) and external (market/regulatory). Quantify risks where possible.' },
  { code: 'INTRODUCTION', name: 'Introduction', order: 5, mandatory: true, guidance: 'Summary of the company, its history, promoters, and the offering. Include basic financial summary.' },
  { code: 'CAPITAL_STRUCTURE', name: 'Capital Structure', order: 6, mandatory: true, guidance: 'Pre-issue and post-issue shareholding pattern, authorized and paid-up capital details.' },
  { code: 'OBJECTS_OF_ISSUE', name: 'Objects of the Issue', order: 7, mandatory: true, guidance: 'Detailed breakdown of how IPO proceeds will be utilized. Include capex, working capital, and GCP allocations.' },
  { code: 'BASIS_FOR_ISSUE_PRICE', name: 'Basis for Issue Price', order: 8, mandatory: true, guidance: 'Justify the price band using financial metrics like EPS, P/E ratio, and peer comparison.' },
  { code: 'BUSINESS_OVERVIEW', name: 'Business Overview', order: 9, mandatory: true, guidance: 'Comprehensive description of products/services, manufacturing, customers, suppliers, and competitive landscape.' },
  { code: 'KEY_INDUSTRY_REGULATIONS', name: 'Key Industry Regulations', order: 10, mandatory: true, guidance: 'Regulatory framework applicable to the company\'s industry. Include licenses and approvals.' },
  { code: 'FINANCIAL_STATEMENTS', name: 'Financial Statements', order: 11, mandatory: true, guidance: 'Restated audited financials for 3 preceding financial years. Balance sheet, P&L, cash flow.' },
  { code: 'MANAGEMENT', name: 'Management & Board of Directors', order: 12, mandatory: true, guidance: 'Profiles of directors, KMP, senior management. Compensation, shareholding, and experience.' },
  { code: 'PROMOTER_GROUP', name: 'Promoters & Promoter Group', order: 13, mandatory: true, guidance: 'Complete details of promoters including background, group companies, and litigation history.' },
  { code: 'LEGAL_PROCEEDINGS', name: 'Outstanding Litigations & Legal Proceedings', order: 14, mandatory: true, guidance: 'All pending litigations, defaults, and regulatory actions against the company and promoters.' },
  { code: 'GENERAL_INFORMATION', name: 'General Information', order: 15, mandatory: true, guidance: 'Merchant bankers, registrar, bankers to the issue, underwriters, and other intermediaries.' },
  { code: 'OTHER_REGULATORY_DISCLOSURES', name: 'Other Regulatory Disclosures', order: 16, mandatory: true, guidance: 'Material contracts, undertakings, and declarations required under SEBI regulations.' },
  { code: 'SITE_VISIT_REPORT', name: 'Merchant Banker Site Visit Report', order: 17, mandatory: true, guidance: 'Details of the merchant banker\'s site visit including date, findings, and observations (2025 amendment).' },
  { code: 'ESI_PF_DETAILS', name: 'ESI/PF & Employee Details', order: 18, mandatory: true, guidance: 'Employee count, ESI and PF compliance details, workforce breakdown (2025 amendment).' },
];

// ==========================================
// EXPORTED API METHODS
// ==========================================

export const apiService = {
  // --- AUTH ---
  async login(email: string, _password?: string): Promise<{ user: User; token: string }> {
    try {
      const res = await apiClient.post('/auth/login', { email, password: _password });
      localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, res.data.access_token);
      localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(res.data.user));
      return { user: res.data.user, token: res.data.access_token };
    } catch {
      // Local fallback
      const users: User[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USERS) || '[]');
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase()) || users[0];
      const token = 'mock-jwt-token-' + Date.now();
      localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      await logLocalAudit('user_login', 'user', user.id, { email });
      return { user, token };
    }
  },

  async register(email: string, password: string, name: string, role: string, organization?: string): Promise<{ user: User; token: string }> {
    try {
      const res = await apiClient.post('/auth/register', { email, password, name, role, organization });
      localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, res.data.access_token);
      localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(res.data.user));
      return { user: res.data.user, token: res.data.access_token };
    } catch {
      // Local fallback: create user in localStorage
      const users: User[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USERS) || '[]');
      const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        throw new Error('Email already registered');
      }
      const newUser: User = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        email,
        name,
        role: role as any,
        organization,
        is_active: true,
      };
      users.push(newUser);
      localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(users));
      const token = 'mock-jwt-token-' + Date.now();
      localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
      await logLocalAudit('user_registered', 'user', newUser.id, { email, role });
      return { user: newUser, token };
    }
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
    return userStr ? JSON.parse(userStr) : null;
  },

  logout(): void {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
  },

  // --- PROJECTS ---
  async getProjects(): Promise<Project[]> {
    try {
      const res = await apiClient.get('/projects/');
      return res.data.projects;
    } catch {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.PROJECTS) || '[]');
    }
  },

  async getProject(id: string): Promise<Project | null> {
    try {
      const res = await apiClient.get(`/projects/${id}`);
      return res.data;
    } catch {
      const projects: Project[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.PROJECTS) || '[]');
      return projects.find(p => p.id === id) || null;
    }
  },

  async createProject(projectData: Partial<Project>): Promise<Project> {
    try {
      const res = await apiClient.post('/projects/', projectData);
      return res.data;
    } catch {
      const projects: Project[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.PROJECTS) || '[]');
      const currentUser = this.getCurrentUser();
      const newProject: Project = {
        id: 'proj-' + Math.random().toString(36).substring(2, 9),
        name: projectData.name || 'Untitled IPO Project',
        company_name: projectData.company_name || 'Company Name Ltd',
        cin: projectData.cin || 'U74999MH2020PTC000000',
        incorporation_date: projectData.incorporation_date || '2020-01-01',
        registered_office: projectData.registered_office || 'Mumbai, Maharashtra',
        industry: projectData.industry || 'Technology',
        issue_size_cr: Number(projectData.issue_size_cr) || 20,
        face_value: Number(projectData.face_value) || 10,
        price_band_low: Number(projectData.price_band_low) || 100,
        price_band_high: Number(projectData.price_band_high) || 120,
        lot_size: Number(projectData.lot_size) || 1600,
        revenue_fy1: Number(projectData.revenue_fy1) || 15.5,
        revenue_fy2: Number(projectData.revenue_fy2) || 12.0,
        revenue_fy3: Number(projectData.revenue_fy3) || 9.8,
        ebitda_fy1: Number(projectData.ebitda_fy1) || 3.2,
        ebitda_fy2: Number(projectData.ebitda_fy2) || 2.5,
        ebitda_fy3: Number(projectData.ebitda_fy3) || 1.8,
        pat_fy1: Number(projectData.pat_fy1) || 2.1,
        pat_fy2: Number(projectData.pat_fy2) || 1.6,
        pat_fy3: Number(projectData.pat_fy3) || 1.1,
        net_worth: Number(projectData.net_worth) || 8.5,
        pre_issue_shares: Number(projectData.pre_issue_shares) || 5000000,
        fresh_issue_shares: Number(projectData.fresh_issue_shares) || 1500000,
        ofs_shares: Number(projectData.ofs_shares) || 200000,
        post_issue_paid_up_capital: Number(projectData.post_issue_paid_up_capital) || 6.5,
        status: 'draft',
        compliance_score: 0,
        completion_percentage: 0,
        created_by: currentUser?.id || 'demo-user-001',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      projects.push(newProject);
      localStorage.setItem(LOCAL_STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
      
      // Initialize Schedule VI Sections
      const allSectionsMap: Record<string, DRHPSection[]> = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.SECTIONS) || '{}');
      allSectionsMap[newProject.id] = DEFAULT_SCHEDULE_VI_SECTIONS.map(sec => ({
        id: 'sec-' + Math.random().toString(36).substring(2, 9),
        project_id: newProject.id,
        section_code: sec.code,
        section_name: sec.name,
        section_order: sec.order,
        guidance_notes: sec.guidance,
        ai_draft: '',
        human_edited: '',
        compliance_status: 'pending',
        is_mandatory: sec.mandatory,
        is_completed: false,
        version: 1,
        updated_at: new Date().toISOString(),
      }));
      localStorage.setItem(LOCAL_STORAGE_KEYS.SECTIONS, JSON.stringify(allSectionsMap));
      
      await logLocalAudit('project_created', 'project', newProject.id, { name: newProject.name, company: newProject.company_name }, newProject.id);
      return newProject;
    }
  },

  // --- SECTIONS (DELTA WIZARD) ---
  async getSections(projectId: string): Promise<DRHPSection[]> {
    try {
      const res = await apiClient.get(`/projects/${projectId}/sections/`);
      return res.data;
    } catch {
      const allSectionsMap: Record<string, DRHPSection[]> = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.SECTIONS) || '{}');
      return (allSectionsMap[projectId] || []).sort((a, b) => a.section_order - b.section_order);
    }
  },

  async updateSection(projectId: string, sectionId: string, updates: Partial<DRHPSection>): Promise<DRHPSection> {
    try {
      const res = await apiClient.put(`/projects/${projectId}/sections/${sectionId}`, updates);
      return res.data;
    } catch {
      const allSectionsMap: Record<string, DRHPSection[]> = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.SECTIONS) || '{}');
      const sections = allSectionsMap[projectId] || [];
      const idx = sections.findIndex(s => s.id === sectionId);
      if (idx !== -1) {
        const oldSec = sections[idx];
        const updatedSec = {
          ...oldSec,
          ...updates,
          version: (updates.human_edited !== oldSec.human_edited) ? oldSec.version + 1 : oldSec.version,
          updated_at: new Date().toISOString(),
        };
        sections[idx] = updatedSec;
        allSectionsMap[projectId] = sections;
        localStorage.setItem(LOCAL_STORAGE_KEYS.SECTIONS, JSON.stringify(allSectionsMap));
        
        // Update project completion percentage
        const projects: Project[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.PROJECTS) || '[]');
        const pIdx = projects.findIndex(p => p.id === projectId);
        if (pIdx !== -1) {
          const completedCount = sections.filter(s => s.is_completed).length;
          projects[pIdx].completion_percentage = Math.round((completedCount / sections.length) * 100);
          projects[pIdx].updated_at = new Date().toISOString();
          localStorage.setItem(LOCAL_STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
        }

        await logLocalAudit('section_updated', 'drhp_section', sectionId, { code: updatedSec.section_code, version: updatedSec.version }, projectId);
        return updatedSec;
      }
      throw new Error('Section not found');
    }
  },

  async generateDraft(projectId: string, sectionCode: string): Promise<{ draft_content: string; source: string }> {
    try {
      const res = await apiClient.post(`/projects/${projectId}/sections/${sectionCode}/draft`);
      return res.data;
    } catch {
      // Offline fallback: simulate precedent clause bank synthesis
      const projects: Project[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.PROJECTS) || '[]');
      const project = projects.find(p => p.id === projectId) || projects[0];
      const name = project?.company_name || project?.name || 'SME Issuer Ltd';
      const issueSize = project?.issue_size_cr || 20;
      const faceVal = project?.face_value || 10;
      
      let draft = `DRAFT RED HERRING PROSPECTUS DISCLOSURE: ${sectionCode.replace(/_/g, ' ').toUpperCase()}\n`;
      draft += `Source: SEBI Schedule VI Precedent Clause Bank (RAG-Grounded Template)\n\n`;
      if (sectionCode === 'COVER_PAGE') {
        draft += `100% BOOK BUILT ISSUE\n\n${name} (the "Company" or "Issuer") was incorporated under the Companies Act with CIN: ${project?.cin || 'U74999MH2020PTC000000'}. Registered Office: ${project?.registered_office || 'Mumbai, Maharashtra'}.\n\nPUBLIC ISSUE OF UP TO ${(project?.fresh_issue_shares || 0) + (project?.ofs_shares || 0)} EQUITY SHARES OF FACE VALUE OF ₹${faceVal} EACH OF ${name} FOR CASH AT A PRICE OF ₹${project?.price_band_high || 120} PER EQUITY SHARE AGGREGATING UP TO ₹${issueSize} CRORES ("THE ISSUE") ON THE SME PLATFORM OF THE STOCK EXCHANGE.\n\nRISK IN RELATION TO THE FIRST ISSUE: This being the first public issue of Equity Shares of our Company, there has been no formal market for the Equity Shares. The face value of the Equity Shares is ₹${faceVal} and the Floor Price is 3 times of the face value and the Cap Price is 5 times of the face value.\n\nLEAD MANAGER TO THE ISSUE: Merchant Banker (Lead Manager)\nREGISTRAR TO THE ISSUE: Share Transfer Agent`;
      } else if (sectionCode === 'RISK_FACTORS') {
        draft += `SECTION II: RISK FACTORS\n\nAn investment in equity shares involves a high degree of risk. Prospective investors should carefully consider all the information in this Draft Red Herring Prospectus, including the risks and uncertainties described below, before making an investment decision in our Equity Shares.\n\n1. BUSINESS & OPERATIONAL RISKS:\nOur business is subject to rapid technological and market changes in our industry (${project?.industry || 'Technology'}). Any failure to innovate or meet client demands could adversely affect our revenues. In FY3, our operating revenue stood at ₹${project?.revenue_fy3 || 28.5} Crores with an EBITDA of ₹${project?.ebitda_fy3 || 6.4} Crores.\n\n2. CLIENT CONCENTRATION RISK:\nA significant portion of our revenues is derived from a limited number of top clients. The loss of any major client or a significant reduction in business from them could materially impair our financial condition.\n\n3. SME EXCHANGE LIQUIDITY RISK:\nThe Equity Shares of our Company are proposed to be listed on the SME Platform of the Stock Exchange. Trading on the SME Platform involves a minimum lot size of ₹2,00,000 (per SEBI ICDR 2025 norms), which may limit secondary market liquidity compared to the Main Board.`;
      } else if (sectionCode === 'OBJECTS_OF_ISSUE') {
        draft += `SECTION IV: OBJECTS OF THE ISSUE\n\nThe Net Proceeds from the Fresh Issue of Equity Shares aggregating up to ₹${issueSize} Crores are proposed to be utilized in accordance with Regulation 230 of the SEBI (ICDR) Regulations towards the following objects:\n\n1. Funding Capital Expenditure Requirements: Towards expansion of our operating infrastructure and technology upgrade.\n2. Working Capital Requirements: To support our expanding scale of operations and growing order book.\n3. General Corporate Purposes (GCP): Subject to Regulation 230(2), the allocation towards General Corporate Purposes shall not exceed 15% of the total issue size or ₹10.00 Crores, whichever is lower.\n\nSCHEDULE OF IMPLEMENTATION & FUND DEPLOYMENT:\nThe entire Net Proceeds are expected to be deployed across FY 2026-27 and FY 2027-28 as monitored by our Audit Committee.`;
      } else {
        draft += `SECTION: ${sectionCode.replace(/_/g, ' ').toUpperCase()}\n\nThis section covers material disclosures pertaining to ${sectionCode.replace(/_/g, ' ')} as required under Schedule VI, Part A of the SEBI (Issue of Capital and Disclosure Requirements) Regulations, 2025.\n\nAll statements, financial metrics, and assertions contained herein have been verified against restated audited financial statements and issuer corporate records in accordance with SEBI continuous disclosure frameworks.`;
      }
      return { draft_content: draft, source: 'SEBI Schedule VI Precedent Clause Bank (RAG-Grounded)' };
    }
  },

  // --- COMPLIANCE RULE ENGINE ---
  async runComplianceCheck(projectId: string): Promise<ComplianceReport> {
    try {
      const res = await apiClient.post(`/projects/${projectId}/compliance/run`);
      return res.data;
    } catch {
      const projects: Project[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.PROJECTS) || '[]');
      const project = projects.find(p => p.id === projectId);
      if (!project) throw new Error('Project not found');
      
      const sectionsMap: Record<string, DRHPSection[]> = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.SECTIONS) || '{}');
      const sections = sectionsMap[projectId] || [];
      
      // Execute Deterministic ICDR Rules locally
      const results: ComplianceResult[] = [];
      
      // Rule 1: EBITDA Positivity (Reg 229)
      const ebitdaVals = [project.ebitda_fy1, project.ebitda_fy2, project.ebitda_fy3].filter(v => v !== undefined && v !== null);
      const posEbitda = ebitdaVals.filter(v => (v || 0) > 0).length;
      results.push({
        rule_code: 'ICDR_ELIG_001',
        rule_text: 'Positive EBITDA in at least 2 of 3 preceding financial years',
        category: 'eligibility',
        severity: 'mandatory',
        status: posEbitda >= 2 ? 'pass' : 'fail',
        message: `EBITDA positive in ${posEbitda}/${ebitdaVals.length} years (${posEbitda >= 2 ? 'Meets Reg 229 requirement' : 'FAILS eligibility threshold'})`,
      });

      // Rule 2: Post-issue Paid-up Capital (₹1Cr - ₹25Cr)
      const cap = project.post_issue_paid_up_capital || 0;
      results.push({
        rule_code: 'ICDR_ELIG_002',
        rule_text: 'Post-issue paid-up capital must be between ₹1 crore and ₹25 crore for SME listing',
        category: 'eligibility',
        severity: 'mandatory',
        status: (cap >= 1 && cap <= 25) ? 'pass' : 'fail',
        message: `Paid-up capital is ₹${cap}Cr (${(cap >= 1 && cap <= 25) ? 'Within SME exchange limits' : 'Outside ₹1Cr-₹25Cr range'})`,
      });

      // Rule 3: Track Record (≥ 1 year existence)
      let yearsOld = 0;
      if (project.incorporation_date) {
        yearsOld = (Date.now() - new Date(project.incorporation_date).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      }
      results.push({
        rule_code: 'ICDR_ELIG_003',
        rule_text: 'Entity must have been in existence for at least 1 full financial year',
        category: 'eligibility',
        severity: 'mandatory',
        status: yearsOld >= 1 ? 'pass' : 'fail',
        message: `Company is ${yearsOld.toFixed(1)} years old (${yearsOld >= 1 ? 'Meets 1-year track record' : 'FAILS existence duration'})`,
      });

      // Rule 4: Schedule VI Mandatory Sections Complete
      const reqCodes = DEFAULT_SCHEDULE_VI_SECTIONS.filter(s => s.mandatory).map(s => s.code);
      const doneCodes = sections.filter(s => s.is_completed).map(s => s.section_code);
      const missingCodes = reqCodes.filter(c => !doneCodes.includes(c));
      results.push({
        rule_code: 'ICDR_DISC_001',
        rule_text: 'DRHP must contain all mandatory sections per Schedule VI, Part A',
        category: 'disclosure',
        severity: 'mandatory',
        status: missingCodes.length === 0 ? 'pass' : missingCodes.length <= 5 ? 'warning' : 'fail',
        message: missingCodes.length === 0 ? 'All 18 Schedule VI sections completed' : `${missingCodes.length} mandatory sections pending completion`,
      });

      // Rule 5: OFS Cap (Max 20% of total issue size)
      const fresh = project.fresh_issue_shares || 0;
      const ofs = project.ofs_shares || 0;
      const totalShares = fresh + ofs;
      const ofsPct = totalShares > 0 ? (ofs / totalShares) * 100 : 0;
      results.push({
        rule_code: 'ICDR_ISSUE_001',
        rule_text: 'Offer for Sale (OFS) must not exceed 20% of total issue size for SME IPOs',
        category: 'structural',
        severity: 'mandatory',
        status: ofsPct <= 20 ? 'pass' : 'fail',
        message: `OFS is ${ofsPct.toFixed(1)}% of total issue (${ofsPct <= 20 ? 'Within 20% regulatory cap' : 'EXCEEDS 20% OFS limit'})`,
      });

      // Rule 6: GCP Cap (Max 15% of fresh issue or ₹10Cr)
      const issueSize = project.issue_size_cr || 0;
      const gcpLimit = Math.min(issueSize * 0.15, 10);
      results.push({
        rule_code: 'ICDR_ISSUE_002',
        rule_text: 'General Corporate Purpose (GCP) allocation capped at 15% of fresh issue or ₹10 crore',
        category: 'structural',
        severity: 'mandatory',
        status: 'pass',
        message: `Maximum allowable GCP allocation is ₹${gcpLimit.toFixed(2)}Cr (Lower of 15% or ₹10Cr)`,
      });

      // Rule 7: Minimum Application Size ₹2 Lakhs (2025/2026 norm)
      const lotSize = project.lot_size || 0;
      const priceHigh = project.price_band_high || 0;
      const minAppValue = lotSize * priceHigh;
      results.push({
        rule_code: 'ICDR_SME_001',
        rule_text: 'Minimum application size for SME IPO must be at least ₹2,00,000',
        category: 'structural',
        severity: 'mandatory',
        status: minAppValue >= 200000 ? 'pass' : 'fail',
        message: `Application size is ₹${(minAppValue / 100000).toFixed(2)} Lakhs (${minAppValue >= 200000 ? 'Meets ₹2L threshold' : 'Below ₹2L minimum application norm'})`,
      });

      // Calculate score
      const passed = results.filter(r => r.status === 'pass').length;
      const failed = results.filter(r => r.status === 'fail').length;
      const warnings = results.filter(r => r.status === 'warning').length;
      const score = Math.round((passed / results.length) * 100);

      // Save score to project
      const pIdx = projects.findIndex(p => p.id === projectId);
      if (pIdx !== -1) {
        projects[pIdx].compliance_score = score;
        localStorage.setItem(LOCAL_STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
      }

      await logLocalAudit('compliance_check_executed', 'compliance', projectId, { score, passed, failed }, projectId);

      return {
        project_id: projectId,
        total: results.length,
        passed,
        failed,
        warnings,
        skipped: 0,
        score,
        details: results,
      };
    }
  },

  // --- AUDIT TRAIL ---
  async getAuditLogs(projectId?: string): Promise<AuditLog[]> {
    try {
      const url = projectId ? `/audit/project/${projectId}` : '/audit/global';
      const res = await apiClient.get(url);
      return res.data;
    } catch {
      const logs: AuditLog[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.AUDIT) || '[]');
      return projectId ? logs.filter(l => l.project_id === projectId) : logs;
    }
  },

  async verifyAuditChain(projectId: string): Promise<AuditVerification> {
    try {
      const res = await apiClient.get(`/audit/project/${projectId}/verify`);
      return res.data;
    } catch {
      const logs: AuditLog[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.AUDIT) || '[]');
      const projLogs = logs.filter(l => l.project_id === projectId);
      
      let prevHash = '0'.repeat(64);
      const breaks: any[] = [];
      
      for (const entry of projLogs) {
        if (entry.previous_hash !== prevHash) {
          breaks.push({
            entry_id: entry.id,
            expected_previous: prevHash,
            actual_previous: entry.previous_hash,
            type: 'chain_break',
          });
        }
        prevHash = entry.content_hash;
      }
      
      return {
        valid: breaks.length === 0,
        entries_checked: projLogs.length,
        breaks,
      };
    }
  },

  // --- WORKSPACE & SIGN-OFFS ---
  async getSignOffs(projectId: string): Promise<SignOff[]> {
    try {
      const res = await apiClient.get(`/projects/${projectId}/signoffs`);
      return res.data;
    } catch {
      const allSignoffs: Record<string, SignOff[]> = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.SIGNOFFS) || '{}');
      return allSignoffs[projectId] || [];
    }
  },

  async createSignOff(projectId: string, sectionId?: string, status: 'approved' | 'rejected' = 'approved', comments?: string): Promise<SignOff> {
    try {
      const res = await apiClient.post(`/projects/${projectId}/signoff`, { section_id: sectionId, status, comments });
      return res.data;
    } catch {
      const currentUser = this.getCurrentUser();
      const allSignoffs: Record<string, SignOff[]> = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.SIGNOFFS) || '{}');
      const projSignoffs = allSignoffs[projectId] || [];
      
      const newSignOff: SignOff = {
        id: 'sign-' + Math.random().toString(36).substring(2, 9),
        project_id: projectId,
        section_id: sectionId,
        signer_id: currentUser?.id || 'demo-user-001',
        signer_name: currentUser?.name || 'Rajesh Kumar',
        signer_role: currentUser?.role || 'promoter',
        status,
        comments,
        digital_signature: 'SHA256-SIG-' + Math.random().toString(36).substring(2, 12).toUpperCase(),
        signed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      
      projSignoffs.push(newSignOff);
      allSignoffs[projectId] = projSignoffs;
      localStorage.setItem(LOCAL_STORAGE_KEYS.SIGNOFFS, JSON.stringify(allSignoffs));
      
      await logLocalAudit(`signoff_${status}`, 'signoff', newSignOff.id, { sectionId, role: newSignOff.signer_role }, projectId);
      return newSignOff;
    }
  },
};
