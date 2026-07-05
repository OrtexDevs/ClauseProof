/* ClauseProof App - Part 2: Project, Editor, Compliance, Audit pages */

// Project Overview
App.renderProject = function() {
  const p = this.currentProject;
  if (!p) return this.shell('<p>No project selected</p>');
  const sections = DB.sections[p.id] || [];
  const completed = sections.filter(s => s.isCompleted).length;
  const pct = Math.round(completed / sections.length * 100);
  const score = p.compliance_score || 0;
  const scoreCls = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';

  return this.shell(`
    <div class="flex justify-between items-center mb-24">
      <div><h1 style="font-size:28px;font-weight:800;">${p.name}</h1><p style="color:var(--text-secondary);">${p.company_name} ${p.cin ? '· '+p.cin : ''}</p></div>
      <div class="flex gap-8">
        <button class="btn btn-primary" onclick="App.navigate('editor')">✏️ Open Editor</button>
        <button class="btn btn-secondary" onclick="App.runCompliance()">⚖️ Run Compliance</button>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon">📊</div><div class="stat-value">${score}%</div><div class="stat-label">Compliance Score</div><div class="progress-bar" style="margin-top:8px;"><div class="progress-fill ${scoreCls}" style="width:${score}%"></div></div></div>
      <div class="stat-card success"><div class="stat-icon">📋</div><div class="stat-value">${completed}/${sections.length}</div><div class="stat-label">Sections Completed</div><div class="progress-bar" style="margin-top:8px;"><div class="progress-fill high" style="width:${pct}%"></div></div></div>
      <div class="stat-card warning"><div class="stat-icon">💰</div><div class="stat-value">₹${p.issue_size_cr||'—'}Cr</div><div class="stat-label">Issue Size</div></div>
      <div class="stat-card"><div class="stat-icon">📄</div><div class="stat-value"><span class="badge badge-draft">${p.status}</span></div><div class="stat-label">Filing Status</div></div>
    </div>
    <div class="card mb-24"><div class="card-header"><div class="card-title">DRHP Sections (Schedule VI)</div><span style="font-size:13px;color:var(--text-secondary);">${completed} of ${sections.length} complete</span></div>
      <div class="section-list">${sections.map((s, i) => `
        <div class="section-item ${s.isCompleted?'completed':''}" onclick="App.currentSection=${i};App.navigate('editor')">
          <div class="section-number">${s.sectionOrder}</div>
          <div class="section-info"><div class="section-name">${s.sectionName}</div><div class="section-status">${s.sectionCode} · v${s.version}</div></div>
          <span class="badge ${s.isCompleted?'badge-pass':s.humanEdited?'badge-warning':'badge-draft'}">${s.isCompleted?'Complete':s.humanEdited?'In Progress':'Pending'}</span>
        </div>`).join('')}
      </div>
    </div>`);
};

// Delta Wizard Editor
App.renderEditor = function() {
  const p = this.currentProject;
  if (!p) return this.shell('<p>No project selected</p>');
  const sections = DB.sections[p.id] || [];
  const idx = this.currentSection || 0;
  const sec = sections[idx];
  if (!sec) return this.shell('<p>No sections found</p>');

  return this.shell(`
    <div class="flex justify-between items-center mb-24">
      <div><h1 style="font-size:24px;font-weight:800;">Delta Wizard</h1><p style="color:var(--text-secondary);">Section-by-section DRHP editor</p></div>
      <div class="flex gap-8">
        <button class="btn btn-secondary btn-sm" onclick="App.saveSection()">💾 Save</button>
        <button class="btn btn-secondary btn-sm" onclick="App.toggleComplete(${idx})">✅ Mark ${sec.isCompleted?'Incomplete':'Complete'}</button>
      </div>
    </div>
    <div class="editor-container">
      <div class="editor-sidebar">
        <div class="section-list">${sections.map((s, i) => `
          <div class="section-item ${i===idx?'active':''} ${s.isCompleted?'completed':''}" onclick="App.currentSection=${i};App.navigate('editor')" style="padding:10px 14px;">
            <div class="section-number" style="width:26px;height:26px;font-size:11px;">${s.sectionOrder}</div>
            <div class="section-info"><div class="section-name" style="font-size:13px;">${s.sectionName}</div></div>
          </div>`).join('')}
        </div>
      </div>
      <div class="editor-main">
        <div class="card" style="margin-bottom:16px;padding:16px;">
          <div class="flex justify-between items-center">
            <div><strong>${sec.sectionName}</strong> <span class="badge ${sec.isCompleted?'badge-pass':'badge-draft'}" style="margin-left:8px;">${sec.isCompleted?'Complete':'Draft'}</span></div>
            <span style="font-size:12px;color:var(--text-muted);">Version ${sec.version}</span>
          </div>
        </div>
        <div class="editor-panel" style="flex:1;">
          <textarea class="editor-textarea" id="editorContent" placeholder="Enter disclosure content for ${sec.sectionName}...">${sec.humanEdited || sec.aiDraft || ''}</textarea>
        </div>
      </div>
      <div class="guidance-panel">
        <div class="guidance-title">📖 SEBI Guidance</div>
        <div class="guidance-text">${sec.guidance || 'No guidance available.'}</div>
        <div style="margin-top:24px;padding-top:16px;border-top:1px solid var(--border);">
          <div class="guidance-title">📐 Section Code</div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text-muted);">${sec.sectionCode}</div>
        </div>
        <div style="margin-top:16px;">
          <div class="guidance-title">📊 Status</div>
          <div style="font-size:13px;color:var(--text-secondary);">Mandatory: ${sec.isMandatory?'Yes':'No'}</div>
          <div style="font-size:13px;color:var(--text-secondary);">Compliance: ${sec.complianceStatus}</div>
        </div>
      </div>
    </div>`);
};

App.saveSection = function() {
  const p = this.currentProject;
  const idx = this.currentSection || 0;
  const secs = DB.sections;
  const sec = secs[p.id][idx];
  const content = document.getElementById('editorContent')?.value || '';
  sec.humanEdited = content;
  sec.version++;
  DB.sections = secs;
  AuditChain.log('section_updated', 'section', sec.id, {code: sec.sectionCode, version: sec.version, chars: content.length}, p.id);
  this.toast(`Saved: ${sec.sectionName} (v${sec.version})`);
};

App.toggleComplete = function(idx) {
  const p = this.currentProject;
  const secs = DB.sections;
  secs[p.id][idx].isCompleted = !secs[p.id][idx].isCompleted;
  DB.sections = secs;
  AuditChain.log('section_status_changed', 'section', secs[p.id][idx].id, {completed: secs[p.id][idx].isCompleted}, p.id);
  this.navigate('editor');
};

// Compliance Dashboard
App.runCompliance = function() {
  const p = this.currentProject;
  if (!p) return;
  const result = RuleEngine.runAll(p.id);
  this.currentProject = DB.projects.find(x => x.id === p.id);
  AuditChain.log('compliance_check', 'project', p.id, {score: result.score, passed: result.passed, failed: result.failed}, p.id);
  this._lastCompliance = result;
  this.navigate('compliance');
};

App.renderCompliance = function() {
  const p = this.currentProject;
  if (!p) return this.shell('<p>No project selected</p>');
  if (!this._lastCompliance) this._lastCompliance = RuleEngine.runAll(p.id);
  const r = this._lastCompliance;
  const scoreCls = r.score >= 70 ? 'high' : r.score >= 40 ? 'medium' : 'low';

  return this.shell(`
    <div class="flex justify-between items-center mb-24">
      <div><h1 style="font-size:28px;font-weight:800;">Compliance Dashboard</h1><p style="color:var(--text-secondary);">Deterministic SEBI ICDR validation results</p></div>
      <button class="btn btn-primary" onclick="App.runCompliance()">🔄 Re-run Validation</button>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon">📊</div><div class="stat-value" style="color:${r.score>=70?'var(--success)':r.score>=40?'var(--warning)':'var(--danger)'};">${r.score}%</div><div class="stat-label">Compliance Score</div><div class="progress-bar" style="margin-top:8px;"><div class="progress-fill ${scoreCls}" style="width:${r.score}%"></div></div></div>
      <div class="stat-card success"><div class="stat-icon">✅</div><div class="stat-value">${r.passed}</div><div class="stat-label">Rules Passed</div></div>
      <div class="stat-card danger"><div class="stat-icon">❌</div><div class="stat-value">${r.failed}</div><div class="stat-label">Rules Failed</div></div>
      <div class="stat-card warning"><div class="stat-icon">⚠️</div><div class="stat-value">${r.warnings}</div><div class="stat-label">Warnings</div></div>
    </div>
    <div class="card">
      <div class="card-title mb-16">Rule-by-Rule Results (${r.total} rules)</div>
      <table class="compliance-table">
        <thead><tr><th>Rule</th><th>Description</th><th>Category</th><th>Status</th><th>Details</th></tr></thead>
        <tbody>${r.details.map(d => `<tr>
          <td><span style="font-family:'JetBrains Mono',monospace;font-size:12px;">${d.ruleCode}</span></td>
          <td style="max-width:300px;">${d.ruleText}</td>
          <td><span class="badge badge-info">${d.category}</span></td>
          <td><span class="badge badge-${d.status==='pass'?'pass':d.status==='fail'?'fail':'warning'}">${d.status.toUpperCase()}</span></td>
          <td style="font-size:13px;color:var(--text-secondary);max-width:250px;">${d.message}</td>
        </tr>`).join('')}</tbody>
      </table>
    </div>`);
};

// Audit Trail
App.renderAudit = function() {
  const p = this.currentProject;
  const logs = DB.auditLog.filter(l => !p || l.projectId === p?.id).reverse().slice(0, 50);
  const verification = AuditChain.verify(p?.id);

  return this.shell(`
    <div class="flex justify-between items-center mb-24">
      <div><h1 style="font-size:28px;font-weight:800;">Audit Trail</h1><p style="color:var(--text-secondary);">Hash-chained, tamper-evident action log</p></div>
      <div class="card" style="padding:12px 20px;display:flex;align-items:center;gap:12px;">
        <span style="font-size:20px;">${verification.valid?'🟢':'🔴'}</span>
        <div><div style="font-size:14px;font-weight:700;">${verification.valid?'Chain Verified':'Chain Broken!'}</div><div style="font-size:12px;color:var(--text-muted);">${verification.checked} entries checked</div></div>
      </div>
    </div>
    <div class="audit-timeline">${logs.length === 0 ? '<p style="color:var(--text-muted);padding:20px;">No audit entries yet.</p>' :
      logs.map(l => `<div class="audit-entry">
        <div class="audit-action">${l.action.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}</div>
        <div class="audit-meta">${l.actorName||'System'} · ${new Date(l.timestamp).toLocaleString()} · ${l.entityType||''}</div>
        ${l.details ? `<div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">${JSON.stringify(l.details).slice(0,120)}</div>` : ''}
        <div class="audit-hash">🔗 ${l.contentHash.slice(0,16)}...${l.contentHash.slice(-8)} ← ${l.previousHash.slice(0,12)}...</div>
      </div>`).join('')}
    </div>`);
};
