/* ClauseProof — Data Layer & Rule Engine */

const DB = {
  _store(key, val) { localStorage.setItem(`cp_${key}`, JSON.stringify(val)); },
  _load(key, def) { try { return JSON.parse(localStorage.getItem(`cp_${key}`)) || def; } catch { return def; } },
  
  get users() { return this._load('users', []); },
  set users(v) { this._store('users', v); },
  get currentUser() { return this._load('currentUser', null); },
  set currentUser(v) { this._store('currentUser', v); },
  get projects() { return this._load('projects', []); },
  set projects(v) { this._store('projects', v); },
  get sections() { return this._load('sections', {}); },
  set sections(v) { this._store('sections', v); },
  get auditLog() { return this._load('auditLog', []); },
  set auditLog(v) { this._store('auditLog', v); },
  get signoffs() { return this._load('signoffs', []); },
  set signoffs(v) { this._store('signoffs', v); },
  
  uuid() { return crypto.randomUUID ? crypto.randomUUID() : 'xxxx-xxxx-4xxx'.replace(/[xy]/g, c => { const r = Math.random()*16|0; return (c==='x'?r:(r&0x3|0x8)).toString(16); }) + '-' + Date.now().toString(36); },
};

// Hash chain for audit trail
async function sha256(msg) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}

const AuditChain = {
  GENESIS: '0'.repeat(64),
  async log(action, entityType, entityId, details, projectId) {
    const logs = DB.auditLog;
    const prevHash = logs.length > 0 ? logs[logs.length-1].contentHash : this.GENESIS;
    const user = DB.currentUser;
    const ts = new Date().toISOString();
    const payload = JSON.stringify({action, entityType, entityId: entityId||'', details: details||{}, actorId: user?.id||'', timestamp: ts, previousHash: prevHash});
    const contentHash = await sha256(payload);
    const entry = { id: logs.length+1, projectId, actorId: user?.id, actorName: user?.name, action, entityType, entityId, details, contentHash, previousHash: prevHash, timestamp: ts };
    logs.push(entry);
    DB.auditLog = logs;
    return entry;
  },
  verify(projectId) {
    const logs = DB.auditLog.filter(l => !projectId || l.projectId === projectId);
    let prev = this.GENESIS;
    const breaks = [];
    for (const entry of logs) {
      if (entry.previousHash !== prev) breaks.push({id: entry.id, type: 'chain_break'});
      prev = entry.contentHash;
    }
    return { valid: breaks.length===0, checked: logs.length, breaks };
  }
};

// Default DRHP sections (SEBI ICDR Schedule VI)
const DRHP_TEMPLATE = [
  {code:'COVER_PAGE', name:'Cover Page', order:1, mandatory:true, guidance:'Front/back cover with issuer details, offer structure, merchant banker info, and mandatory risk disclaimers per SEBI format.'},
  {code:'TABLE_OF_CONTENTS', name:'Table of Contents', order:2, mandatory:true, guidance:'Auto-generated listing of all sections. Updated as document evolves.'},
  {code:'DEFINITIONS', name:'Definitions & Abbreviations', order:3, mandatory:true, guidance:'Define all technical, legal, and financial terms. Include SEBI, ICDR, DRHP, KMP, etc.'},
  {code:'RISK_FACTORS', name:'Risk Factors', order:4, mandatory:true, guidance:'Internal risks (business, financial, operational) and external risks (market, regulatory, economic). Quantify where possible. SEBI requires specificity — avoid generic statements.'},
  {code:'INTRODUCTION', name:'Introduction', order:5, mandatory:true, guidance:'Company overview, history, promoter background, and summary financial highlights. First section investors read carefully.'},
  {code:'CAPITAL_STRUCTURE', name:'Capital Structure', order:6, mandatory:true, guidance:'Authorized capital, issued/subscribed/paid-up capital. Pre and post-issue shareholding pattern. ESOP details if applicable.'},
  {code:'OBJECTS_OF_ISSUE', name:'Objects of the Issue', order:7, mandatory:true, guidance:'Specific use of IPO proceeds: capex, working capital, debt repayment, acquisitions. GCP capped at 15% or ₹10Cr (whichever lower). Cannot repay promoter loans.'},
  {code:'BASIS_FOR_ISSUE_PRICE', name:'Basis for Issue Price', order:8, mandatory:true, guidance:'Justify price band using EPS, P/E ratio, RONW, NAV. Peer comparison with listed companies. Qualitative factors.'},
  {code:'BUSINESS_OVERVIEW', name:'Business Overview', order:9, mandatory:true, guidance:'Products/services, manufacturing process, customers, suppliers, competitive advantages, growth strategy, capacity details.'},
  {code:'KEY_INDUSTRY_REGULATIONS', name:'Key Industry Regulations', order:10, mandatory:true, guidance:'Applicable laws, licenses, permits. Industry-specific regulatory framework and compliance status.'},
  {code:'FINANCIAL_STATEMENTS', name:'Financial Statements', order:11, mandatory:true, guidance:'Restated audited financials for 3 preceding FYs. Balance sheet, P&L, cash flow, notes. Must follow Ind AS/Indian GAAP.'},
  {code:'MANAGEMENT', name:'Management & Board of Directors', order:12, mandatory:true, guidance:'Director profiles, KMP details, compensation, shareholding, experience, other directorships, corporate governance.'},
  {code:'PROMOTER_GROUP', name:'Promoters & Promoter Group', order:13, mandatory:true, guidance:'Promoter background, group companies, related party transactions, promoter contribution details.'},
  {code:'LEGAL_PROCEEDINGS', name:'Outstanding Litigations', order:14, mandatory:true, guidance:'All pending litigations against company, promoters, directors. Tax disputes, criminal proceedings, regulatory actions.'},
  {code:'GENERAL_INFORMATION', name:'General Information', order:15, mandatory:true, guidance:'Intermediaries (merchant bankers, registrar, bankers), underwriting details, monitoring agency, expert opinions.'},
  {code:'OTHER_REGULATORY_DISCLOSURES', name:'Other Regulatory Disclosures', order:16, mandatory:true, guidance:'Material contracts, undertakings, declarations as per SEBI. Merchant banker fee disclosure, site visit report.'},
  {code:'SITE_VISIT_REPORT', name:'Merchant Banker Site Visit', order:17, mandatory:true, guidance:'2025 amendment requirement: Date of visit, plant/office inspected, observations, findings. Mandatory for SME IPOs.'},
  {code:'ESI_PF_DETAILS', name:'ESI/PF & Employee Details', order:18, mandatory:true, guidance:'2025 amendment: Employee count, ESI/PF registration & compliance status, workforce composition.'},
];

// SEBI ICDR Rule Engine — Deterministic Validation
const RuleEngine = {
  rules: [
    {code:'ICDR_ELIG_001', text:'Positive EBITDA in at least 2 of 3 preceding FYs', category:'eligibility', severity:'mandatory',
     check(p) { const vals=[p.ebitda_fy1,p.ebitda_fy2,p.ebitda_fy3].filter(v=>v!=null); if(!vals.length) return {status:'warning',message:'No EBITDA data'}; const pos=vals.filter(v=>v>0).length; return {status:pos>=2?'pass':'fail', message:`EBITDA positive in ${pos}/${vals.length} years`, evidence:{values:vals,positive:pos}}; }},
    {code:'ICDR_ELIG_002', text:'Post-issue paid-up capital between ₹1Cr and ₹25Cr', category:'eligibility', severity:'mandatory',
     check(p) { const v=p.post_issue_paid_up_capital; if(!v) return {status:'warning',message:'Capital not specified'}; return {status:v>=1&&v<=25?'pass':'fail', message:`₹${v}Cr ${v>=1&&v<=25?'within':'outside'} SME range (₹1-25Cr)`}; }},
    {code:'ICDR_ELIG_003', text:'Entity in existence for at least 1 full financial year', category:'eligibility', severity:'mandatory',
     check(p) { if(!p.incorporation_date) return {status:'warning',message:'Incorporation date not set'}; const yrs=((Date.now()-new Date(p.incorporation_date))/(365.25*86400000)); return {status:yrs>=1?'pass':'fail', message:`Company is ${yrs.toFixed(1)} years old`}; }},
    {code:'ICDR_DISC_001', text:'All mandatory Schedule VI sections present', category:'disclosure', severity:'mandatory',
     check(p,sections) { const req=DRHP_TEMPLATE.filter(s=>s.mandatory).map(s=>s.code); const done=sections.filter(s=>s.isCompleted).map(s=>s.sectionCode); const missing=req.filter(c=>!done.includes(c)); return {status:missing.length===0?'pass':missing.length<=5?'warning':'fail', message:missing.length===0?'All sections complete':`${missing.length} sections incomplete`, evidence:{missing}}; }},
    {code:'ICDR_DISC_002', text:'Company identification details (CIN, office, industry)', category:'disclosure', severity:'mandatory',
     check(p) { const fields=['company_name','cin','incorporation_date','registered_office','industry']; const missing=fields.filter(f=>!p[f]); return {status:missing.length===0?'pass':'fail', message:missing.length===0?'All ID fields populated':`Missing: ${missing.join(', ')}`, evidence:{missing}}; }},
    {code:'ICDR_DISC_003', text:'3-year financial data (Revenue, EBITDA, PAT)', category:'financial', severity:'mandatory',
     check(p) { const fields=['revenue_fy1','revenue_fy2','revenue_fy3','ebitda_fy1','ebitda_fy2','ebitda_fy3','pat_fy1','pat_fy2','pat_fy3']; const missing=fields.filter(f=>!p[f]&&p[f]!==0); return {status:missing.length===0?'pass':missing.length<=3?'warning':'fail', message:missing.length===0?'All financial data provided':`Missing ${missing.length} financial fields`}; }},
    {code:'ICDR_ISSUE_001', text:'OFS must not exceed 20% of total issue size', category:'structural', severity:'mandatory',
     check(p) { const f=p.fresh_issue_shares||0, o=p.ofs_shares||0, t=f+o; if(!t) return {status:'warning',message:'Issue size not specified'}; const pct=(o/t*100).toFixed(1); return {status:pct<=20?'pass':'fail', message:`OFS is ${pct}% of total (limit: 20%)`}; }},
    {code:'ICDR_ISSUE_002', text:'GCP capped at 15% of fresh issue or ₹10Cr', category:'structural', severity:'mandatory',
     check(p) { if(!p.issue_size_cr) return {status:'warning',message:'Issue size not specified'}; const lim=Math.min(p.issue_size_cr*0.15, 10); return {status:'pass', message:`GCP limit: ₹${lim.toFixed(1)}Cr`}; }},
    {code:'ICDR_ISSUE_003', text:'Issue size, face value, and lot size specified', category:'structural', severity:'mandatory',
     check(p) { const fields=['issue_size_cr','face_value','lot_size']; const missing=fields.filter(f=>!p[f]); return {status:missing.length===0?'pass':'fail', message:missing.length===0?'Issue details complete':`Missing: ${missing.join(', ')}`}; }},
    {code:'ICDR_FIN_001', text:'Net worth must be positive', category:'financial', severity:'mandatory',
     check(p) { if(!p.net_worth&&p.net_worth!==0) return {status:'warning',message:'Net worth not disclosed'}; return {status:p.net_worth>0?'pass':'fail', message:`Net worth: ₹${p.net_worth}Cr`}; }},
    {code:'ICDR_FIN_002', text:'Revenue positive in at least 2 of 3 FYs', category:'financial', severity:'recommended',
     check(p) { const vals=[p.revenue_fy1,p.revenue_fy2,p.revenue_fy3].filter(v=>v!=null); if(!vals.length) return {status:'warning',message:'No revenue data'}; const pos=vals.filter(v=>v>0).length; return {status:pos>=2?'pass':'warning', message:`Revenue positive in ${pos}/${vals.length} years`}; }},
    {code:'ICDR_STRUCT_001', text:'Pre-issue and fresh issue shares specified', category:'structural', severity:'mandatory',
     check(p) { const ok=p.pre_issue_shares&&p.fresh_issue_shares; return {status:ok?'pass':'fail', message:ok?'Share counts specified':'Missing share count data'}; }},
    {code:'ICDR_XREF_001', text:'Price band lower ≤ upper', category:'structural', severity:'mandatory',
     check(p) { if(!p.price_band_low||!p.price_band_high) return {status:'warning',message:'Price band not set'}; return {status:p.price_band_low<=p.price_band_high?'pass':'fail', message:`₹${p.price_band_low} — ₹${p.price_band_high}`}; }},
    {code:'ICDR_CONTENT_001', text:'Risk Factors section has substantive content', category:'disclosure', severity:'mandatory',
     check(p,sections) { const s=sections.find(x=>x.sectionCode==='RISK_FACTORS'); const len=(s?.humanEdited||s?.aiDraft||'').length; return {status:len>=500?'pass':len>0?'warning':'fail', message:`Risk Factors: ${len} characters ${len>=500?'(adequate)':'(needs more detail)'}`}; }},
    {code:'ICDR_CONTENT_002', text:'Business Overview has comprehensive description', category:'disclosure', severity:'mandatory',
     check(p,sections) { const s=sections.find(x=>x.sectionCode==='BUSINESS_OVERVIEW'); const len=(s?.humanEdited||s?.aiDraft||'').length; return {status:len>=500?'pass':len>0?'warning':'fail', message:`Business Overview: ${len} characters`}; }},
    {code:'ICDR_CONTENT_003', text:'Objects of Issue details use of proceeds', category:'disclosure', severity:'mandatory',
     check(p,sections) { const s=sections.find(x=>x.sectionCode==='OBJECTS_OF_ISSUE'); const len=(s?.humanEdited||s?.aiDraft||'').length; return {status:len>=200?'pass':len>0?'warning':'fail', message:`Objects of Issue: ${len} characters`}; }},
    {code:'ICDR_SME_001', text:'Minimum application size ₹2 lakhs (lot size check)', category:'structural', severity:'mandatory',
     check(p) { if(!p.lot_size||!p.price_band_high) return {status:'warning',message:'Lot/price not set'}; const appSize=p.lot_size*p.price_band_high; return {status:appSize>=200000?'pass':'fail', message:`Min application: ₹${(appSize/100000).toFixed(1)}L (req: ₹2L)`}; }},
    {code:'ICDR_SME_002', text:'IPO proceeds cannot repay promoter/related party loans', category:'structural', severity:'mandatory',
     check(p,sections) { const s=sections.find(x=>x.sectionCode==='OBJECTS_OF_ISSUE'); const text=(s?.humanEdited||s?.aiDraft||'').toLowerCase(); const flagged=text.includes('promoter loan')||text.includes('related party'); return {status:flagged?'warning':'pass', message:flagged?'Possible promoter loan repayment detected — verify':'No promoter loan repayment detected'}; }},
  ],

  runAll(projectId) {
    const projects = DB.projects;
    const project = projects.find(p=>p.id===projectId);
    if(!project) return {error:'Project not found'};
    
    const allSections = DB.sections[projectId] || [];
    const results = this.rules.map(rule => {
      try {
        const result = rule.check(project, allSections);
        return { ruleCode: rule.code, ruleText: rule.text, category: rule.category, severity: rule.severity, ...result };
      } catch(e) {
        return { ruleCode: rule.code, ruleText: rule.text, category: rule.category, severity: rule.severity, status:'warning', message:'Rule error: '+e.message };
      }
    });
    
    const passed=results.filter(r=>r.status==='pass').length;
    const failed=results.filter(r=>r.status==='fail').length;
    const warnings=results.filter(r=>r.status==='warning').length;
    const total=results.length;
    const score=total>0?Math.round(passed/total*100):0;
    
    // Update project
    project.compliance_score = score;
    DB.projects = projects;
    
    return { total, passed, failed, warnings, score, details: results };
  }
};
