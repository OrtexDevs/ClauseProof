/* ClauseProof App - Part 1: Core UI */
const App = {
  currentPage: 'landing',
  currentProject: null,
  currentSection: null,

  init() {
    this.seedDemoUser();
    this.render();
  },

  seedDemoUser() {
    if (DB.users.length === 0) {
      const user = {id: DB.uuid(), email:'demo@clauseproof.in', name:'Rajesh Kumar', role:'promoter', organization:'TechVista Solutions Pvt Ltd'};
      DB.users = [user];
    }
  },

  toast(msg, type='success') {
    let c = document.getElementById('toasts');
    if (!c) { c = document.createElement('div'); c.id='toasts'; c.className='toast-container'; document.body.appendChild(c); }
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span>${type==='success'?'✓':type==='error'?'✗':'⚠'}</span> ${msg}`;
    c.appendChild(t);
    setTimeout(() => t.remove(), 3500);
  },

  navigate(page, data) {
    this.currentPage = page;
    if (data) Object.assign(this, data);
    this.render();
  },

  render() {
    const app = document.getElementById('app');
    const pages = {
      landing: () => this.renderLanding(),
      login: () => this.renderAuth('login'),
      register: () => this.renderAuth('register'),
      dashboard: () => this.renderDashboard(),
      newProject: () => this.renderNewProject(),
      project: () => this.renderProject(),
      editor: () => this.renderEditor(),
      compliance: () => this.renderCompliance(),
      audit: () => this.renderAudit(),
    };
    app.innerHTML = (pages[this.currentPage] || pages.landing)();
    this.attachEvents();
  },

  renderLanding() {
    return `<div class="auth-page" style="flex-direction:column;padding:20px;">
      <div class="landing-hero">
        <h1 style="font-size:42px;font-weight:900;letter-spacing:-1.5px;margin-bottom:16px;">
          <span class="gradient">ClauseProof</span>
        </h1>
        <p style="font-size:16px;color:var(--text-secondary);max-width:500px;margin:0 auto 12px;">
          Compliance-as-Code for SME IPO Document Preparation
        </p>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:32px;">
          SEBI Securities Market TechSprint — Problem Statement 4
        </p>
        <div class="flex items-center gap-16" style="justify-content:center;flex-wrap:wrap;">
          <button class="btn btn-primary btn-lg" onclick="App.navigate('register')">Get Started</button>
          <button class="btn btn-secondary btn-lg" onclick="App.navigate('login')">Sign In</button>
        </div>
      </div>
      <div class="features-grid" style="margin-top:48px;max-width:900px;">
        <div class="feature-card"><div class="feature-icon">⚖️</div><div class="feature-title">Deterministic Validation</div><div class="feature-desc">18+ SEBI ICDR rules executed without AI — provable, reproducible compliance.</div></div>
        <div class="feature-card"><div class="feature-icon">📋</div><div class="feature-title">Delta Wizard</div><div class="feature-desc">Section-by-section DRHP editor with Schedule VI guidance built in.</div></div>
        <div class="feature-card"><div class="feature-icon">🔗</div><div class="feature-title">Hash-Chained Audit</div><div class="feature-desc">SHA-256 tamper-evident audit trail for every action.</div></div>
        <div class="feature-card"><div class="feature-icon">👥</div><div class="feature-title">Multi-Party Workspace</div><div class="feature-desc">Role-based access for promoters, merchant bankers, and legal counsel.</div></div>
        <div class="feature-card"><div class="feature-icon">✅</div><div class="feature-title">Digital Sign-Off</div><div class="feature-desc">Structured approval workflow with cryptographic signatures.</div></div>
        <div class="feature-card"><div class="feature-icon">📊</div><div class="feature-title">Real-Time Dashboard</div><div class="feature-desc">Live compliance score tracking across all DRHP sections.</div></div>
      </div>
    </div>`;
  },

  renderAuth(mode) {
    const isLogin = mode === 'login';
    return `<div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo"><div class="sidebar-logo">CP</div><div><div class="sidebar-title">ClauseProof</div><div class="sidebar-subtitle">Compliance Platform</div></div></div>
        <h2 class="auth-title">${isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p class="auth-subtitle">${isLogin ? 'Sign in to continue' : 'Start your IPO compliance journey'}</p>
        <form onsubmit="App.handleAuth(event,'${mode}')">
          ${isLogin ? '' : `<div class="form-group"><label class="form-label">Full Name</label><input class="form-input" id="authName" placeholder="e.g. Rajesh Kumar" required></div>
          <div class="form-group"><label class="form-label">Organization</label><input class="form-input" id="authOrg" placeholder="e.g. TechVista Solutions Pvt Ltd"></div>
          <div class="form-group"><label class="form-label">Role</label><select class="form-select" id="authRole"><option value="promoter">Promoter / Issuer</option><option value="merchant_banker">Merchant Banker</option><option value="legal_counsel">Legal Counsel</option><option value="compliance_officer">Compliance Officer</option></select></div>`}
          <div class="form-group"><label class="form-label">Email</label><input class="form-input" id="authEmail" type="email" placeholder="you@company.com" required></div>
          <div class="form-group"><label class="form-label">Password</label><input class="form-input" id="authPass" type="password" placeholder="Min 6 characters" required minlength="6"></div>
          <button class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px;" type="submit">${isLogin ? 'Sign In' : 'Create Account'}</button>
        </form>
        <div class="auth-footer">${isLogin ? 'No account? <a onclick="App.navigate(\'register\')">Register</a>' : 'Have an account? <a onclick="App.navigate(\'login\')">Sign In</a>'}</div>
      </div>
    </div>`;
  },

  handleAuth(e, mode) {
    e.preventDefault();
    const email = document.getElementById('authEmail').value;
    if (mode === 'login') {
      const user = DB.users.find(u => u.email === email);
      if (!user) { this.toast('User not found', 'error'); return; }
      DB.currentUser = user;
    } else {
      const user = {id: DB.uuid(), email, name: document.getElementById('authName').value, role: document.getElementById('authRole').value, organization: document.getElementById('authOrg')?.value || ''};
      const users = DB.users; users.push(user); DB.users = users;
      DB.currentUser = user;
    }
    AuditChain.log('user_login', 'user', DB.currentUser.id, {email});
    this.toast(`Welcome, ${DB.currentUser.name}!`);
    this.navigate('dashboard');
  },

  shell(content) {
    const u = DB.currentUser;
    return `<div class="app">
      <aside class="sidebar">
        <div class="sidebar-header"><div class="sidebar-logo">CP</div><div><div class="sidebar-title">ClauseProof</div><div class="sidebar-subtitle">v1.0 MVP</div></div></div>
        <nav class="sidebar-nav">
          <div class="nav-section"><div class="nav-section-title">Main</div>
            <button class="nav-item ${this.currentPage==='dashboard'?'active':''}" onclick="App.navigate('dashboard')"><span class="icon">📊</span>Dashboard</button>
            <button class="nav-item" onclick="App.navigate('newProject')"><span class="icon">➕</span>New Project</button>
          </div>
          ${this.currentProject ? `<div class="nav-section"><div class="nav-section-title">Current Project</div>
            <button class="nav-item ${this.currentPage==='project'?'active':''}" onclick="App.navigate('project')"><span class="icon">📁</span>Overview</button>
            <button class="nav-item ${this.currentPage==='editor'?'active':''}" onclick="App.navigate('editor')"><span class="icon">✏️</span>Delta Wizard</button>
            <button class="nav-item ${this.currentPage==='compliance'?'active':''}" onclick="App.navigate('compliance')"><span class="icon">⚖️</span>Compliance</button>
            <button class="nav-item ${this.currentPage==='audit'?'active':''}" onclick="App.navigate('audit')"><span class="icon">🔗</span>Audit Trail</button>
          </div>` : ''}
        </nav>
        <div style="padding:16px;border-top:1px solid var(--border);">
          <div style="font-size:13px;font-weight:600;">${u?.name||''}</div>
          <div style="font-size:12px;color:var(--text-muted);">${u?.role||''}</div>
          <button class="btn btn-ghost btn-sm" style="margin-top:8px;width:100%;" onclick="DB.currentUser=null;App.navigate('landing')">Sign Out</button>
        </div>
      </aside>
      <main class="main-content">
        <header class="topbar"><div class="topbar-left"><div class="topbar-breadcrumb">${this.getBreadcrumb()}</div></div></header>
        <div class="page-content">${content}</div>
      </main>
    </div>`;
  },

  getBreadcrumb() {
    const p = this.currentProject;
    const map = {dashboard:'Dashboard',project:'Project',editor:'Delta Wizard',compliance:'Compliance',audit:'Audit Trail',newProject:'New Project'};
    let bc = `<span>${map[this.currentPage]||'Dashboard'}</span>`;
    if (p && this.currentPage !== 'dashboard') bc = `${p.company_name} / ` + bc;
    return bc;
  },

  renderDashboard() {
    const projects = DB.projects;
    let projectCards = '';
    if (projects.length === 0) {
      projectCards = `<div class="card text-center" style="padding:60px;"><div style="font-size:48px;margin-bottom:16px;">📋</div><h3 style="margin-bottom:8px;">No Projects Yet</h3><p style="color:var(--text-secondary);margin-bottom:24px;">Create your first IPO filing project to get started.</p><button class="btn btn-primary" onclick="App.navigate('newProject')">➕ Create Project</button></div>`;
    } else {
      projectCards = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:20px;">${projects.map(p => {
        const score = p.compliance_score || 0;
        const cls = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
        const statusBadge = {draft:'badge-draft',in_review:'badge-info',approved:'badge-pass',filed:'badge-pass'}[p.status] || 'badge-draft';
        return `<div class="card" style="cursor:pointer;" onclick="App.currentProject=DB.projects.find(x=>x.id==='${p.id}');App.navigate('project')">
          <div class="card-header"><div><div class="card-title">${p.name}</div><div class="card-subtitle">${p.company_name}</div></div><span class="badge ${statusBadge}">${p.status}</span></div>
          <div style="margin:16px 0;"><div class="flex justify-between mb-16" style="margin-bottom:6px;"><span style="font-size:13px;color:var(--text-secondary);">Compliance</span><span style="font-size:13px;font-weight:700;">${score}%</span></div><div class="progress-bar"><div class="progress-fill ${cls}" style="width:${score}%"></div></div></div>
          <div style="font-size:12px;color:var(--text-muted);">Created ${new Date(p.created_at).toLocaleDateString()}</div>
        </div>`;
      }).join('')}</div>`;
    }
    return this.shell(`<div class="flex justify-between items-center mb-24"><h1 style="font-size:28px;font-weight:800;">Dashboard</h1><button class="btn btn-primary" onclick="App.navigate('newProject')">➕ New Project</button></div>${projectCards}`);
  },

  renderNewProject() {
    return this.shell(`<h1 style="font-size:28px;font-weight:800;margin-bottom:24px;">Create IPO Filing Project</h1>
      <form onsubmit="App.handleCreateProject(event)" style="max-width:800px;">
        <div class="card mb-24"><div class="card-title mb-16">Company Details</div>
          <div class="grid-2">
            <div class="form-group"><label class="form-label">Project Name *</label><input class="form-input" id="pName" required placeholder="e.g. TechVista IPO 2026"></div>
            <div class="form-group"><label class="form-label">Company Name *</label><input class="form-input" id="pCompany" required placeholder="Full legal name"></div>
            <div class="form-group"><label class="form-label">CIN</label><input class="form-input" id="pCin" placeholder="U74999MH2020PTC123456"></div>
            <div class="form-group"><label class="form-label">Incorporation Date</label><input class="form-input" id="pIncDate" type="date"></div>
            <div class="form-group"><label class="form-label">Registered Office</label><input class="form-input" id="pOffice" placeholder="City, State"></div>
            <div class="form-group"><label class="form-label">Industry</label><input class="form-input" id="pIndustry" placeholder="e.g. Information Technology"></div>
          </div>
        </div>
        <div class="card mb-24"><div class="card-title mb-16">IPO Details</div>
          <div class="grid-2">
            <div class="form-group"><label class="form-label">Issue Size (₹ Crores)</label><input class="form-input" id="pIssueSize" type="number" step="0.01"></div>
            <div class="form-group"><label class="form-label">Face Value (₹)</label><input class="form-input" id="pFaceVal" type="number" value="10"></div>
            <div class="form-group"><label class="form-label">Price Band Low (₹)</label><input class="form-input" id="pPriceLow" type="number"></div>
            <div class="form-group"><label class="form-label">Price Band High (₹)</label><input class="form-input" id="pPriceHigh" type="number"></div>
            <div class="form-group"><label class="form-label">Lot Size</label><input class="form-input" id="pLotSize" type="number"></div>
            <div class="form-group"><label class="form-label">Post-Issue Paid-Up Capital (₹Cr)</label><input class="form-input" id="pPostCap" type="number" step="0.01"></div>
            <div class="form-group"><label class="form-label">Pre-Issue Shares</label><input class="form-input" id="pPreShares" type="number"></div>
            <div class="form-group"><label class="form-label">Fresh Issue Shares</label><input class="form-input" id="pFreshShares" type="number"></div>
            <div class="form-group"><label class="form-label">OFS Shares</label><input class="form-input" id="pOfsShares" type="number" value="0"></div>
            <div class="form-group"><label class="form-label">Net Worth (₹Cr)</label><input class="form-input" id="pNetWorth" type="number" step="0.01"></div>
          </div>
        </div>
        <div class="card mb-24"><div class="card-title mb-16">Financial Summary (3 FYs — ₹ Crores)</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;">
            <div><div style="font-size:12px;font-weight:600;color:var(--text-muted);margin-bottom:8px;">FY1 (Latest)</div>
              <div class="form-group"><label class="form-label">Revenue</label><input class="form-input" id="pRev1" type="number" step="0.01"></div>
              <div class="form-group"><label class="form-label">EBITDA</label><input class="form-input" id="pEbitda1" type="number" step="0.01"></div>
              <div class="form-group"><label class="form-label">PAT</label><input class="form-input" id="pPat1" type="number" step="0.01"></div></div>
            <div><div style="font-size:12px;font-weight:600;color:var(--text-muted);margin-bottom:8px;">FY2</div>
              <div class="form-group"><label class="form-label">Revenue</label><input class="form-input" id="pRev2" type="number" step="0.01"></div>
              <div class="form-group"><label class="form-label">EBITDA</label><input class="form-input" id="pEbitda2" type="number" step="0.01"></div>
              <div class="form-group"><label class="form-label">PAT</label><input class="form-input" id="pPat2" type="number" step="0.01"></div></div>
            <div><div style="font-size:12px;font-weight:600;color:var(--text-muted);margin-bottom:8px;">FY3</div>
              <div class="form-group"><label class="form-label">Revenue</label><input class="form-input" id="pRev3" type="number" step="0.01"></div>
              <div class="form-group"><label class="form-label">EBITDA</label><input class="form-input" id="pEbitda3" type="number" step="0.01"></div>
              <div class="form-group"><label class="form-label">PAT</label><input class="form-input" id="pPat3" type="number" step="0.01"></div></div>
          </div>
        </div>
        <div class="flex gap-16"><button class="btn btn-primary btn-lg" type="submit">Create Project & Initialize DRHP</button><button class="btn btn-secondary btn-lg" type="button" onclick="App.navigate('dashboard')">Cancel</button></div>
      </form>`);
  },

  handleCreateProject(e) {
    e.preventDefault();
    const v = id => { const el=document.getElementById(id); return el?.value || ''; };
    const n = id => { const val=v(id); return val ? parseFloat(val) : null; };
    const project = {
      id: DB.uuid(), name: v('pName'), company_name: v('pCompany'), cin: v('pCin'),
      incorporation_date: v('pIncDate'), registered_office: v('pOffice'), industry: v('pIndustry'),
      issue_size_cr: n('pIssueSize'), face_value: n('pFaceVal'), price_band_low: n('pPriceLow'),
      price_band_high: n('pPriceHigh'), lot_size: n('pLotSize') ? parseInt(v('pLotSize')) : null,
      post_issue_paid_up_capital: n('pPostCap'), pre_issue_shares: n('pPreShares') ? parseInt(v('pPreShares')) : null,
      fresh_issue_shares: n('pFreshShares') ? parseInt(v('pFreshShares')) : null, ofs_shares: n('pOfsShares') ? parseInt(v('pOfsShares')) : null,
      net_worth: n('pNetWorth'),
      revenue_fy1: n('pRev1'), revenue_fy2: n('pRev2'), revenue_fy3: n('pRev3'),
      ebitda_fy1: n('pEbitda1'), ebitda_fy2: n('pEbitda2'), ebitda_fy3: n('pEbitda3'),
      pat_fy1: n('pPat1'), pat_fy2: n('pPat2'), pat_fy3: n('pPat3'),
      status: 'draft', compliance_score: 0, created_at: new Date().toISOString(),
    };
    const projects = DB.projects; projects.push(project); DB.projects = projects;
    // Create DRHP sections
    const secs = DB.sections; secs[project.id] = DRHP_TEMPLATE.map(t => ({
      id: DB.uuid(), sectionCode: t.code, sectionName: t.name, sectionOrder: t.order,
      isMandatory: t.mandatory, guidance: t.guidance, content: null, aiDraft: '', humanEdited: '',
      isCompleted: false, complianceStatus: 'pending', version: 1,
    }));
    DB.sections = secs;
    AuditChain.log('project_created', 'project', project.id, {name: project.name}, project.id);
    this.currentProject = project;
    this.toast('Project created with 18 DRHP sections!');
    this.navigate('project');
  },

  attachEvents() { /* Events are inline for MVP simplicity */ }
};

document.addEventListener('DOMContentLoaded', () => App.init());
