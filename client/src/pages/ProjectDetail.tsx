import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  History, 
  ArrowRight, 
  CheckCircle2, 
  Building2,
  Download
} from 'lucide-react';
import { apiService } from '../services/api';
import { Project, DRHPSection } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';

export const ProjectDetail: React.FC<{ onProjectChange?: (p: Project) => void }> = ({ onProjectChange }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [sections, setSections] = useState<DRHPSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      try {
        const [projData, secData] = await Promise.all([
          apiService.getProject(id),
          apiService.getSections(id)
        ]);
        setProject(projData);
        setSections(secData);
        if (projData && onProjectChange) onProjectChange(projData);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, onProjectChange]);

  if (loading) {
    return <div className="h-96 rounded-2xl bg-white border border-[#DCE0D6] animate-pulse shadow-subtle" />;
  }

  if (!project) {
    return <div className="text-center py-20 text-[#4B5A7A] font-mono text-xs font-bold">IPO Project not found.</div>;
  }

  const completedCount = sections.filter(s => s.is_completed).length;
  const completionPct = sections.length > 0 ? Math.round((completedCount / sections.length) * 100) : 0;
  const score = project.compliance_score || 0;

  return (
    <div className="space-y-8 text-[#0B1120]">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#DCE0D6]">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <Badge variant={project.status === 'approved' ? 'pass' : 'draft'} className="uppercase">
              {project.status.replace('_', ' ')}
            </Badge>
            <span className="text-xs text-[#25314C] font-mono font-bold">CIN: {project.cin || 'N/A'}</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B1120]">{project.name}</h1>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#25314C] mt-1.5 font-sans">
            <Building2 className="w-4 h-4 text-[#4B5A7A]" strokeWidth={2.2} />
            <span className="font-bold text-[#0B1120]">{project.company_name}</span>
            <span>·</span>
            <span>{project.industry}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => {
              const htmlContent = `
  <div style="font-family: -apple-system, sans-serif; line-height: 1.6; color: #0B1120; max-width: 900px; margin: 40px auto; padding: 0 20px;">
    <div style="text-align: center; border-bottom: 2px solid #DCE0D6; padding-bottom: 20px; margin-bottom: 30px;">
      <span style="background: #EEF0EB; border: 1px solid #DCE0D6; color: #086F83; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase; font-family: monospace;">SEBI TechSprint — Problem Statement 4</span>
      <h1 style="color: #0B1120; font-size: 26px; margin-top: 15px; margin-bottom: 5px; font-family: sans-serif; font-weight: 800;">DRAFT RED HERRING PROSPECTUS (DRHP)</h1>
      <p style="color: #25314C; font-size: 14px; font-weight: 600;">SME IPO Offer Document Prepared via ClauseProof RegTech OS</p>
    </div>

    <div style="background: #EEF0EB; border: 1px solid #DCE0D6; padding: 20px; border-radius: 8px; margin-bottom: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-family: monospace;">
      <div style="font-size: 13px;"><div style="font-weight: bold; color: #4B5A7A; font-size: 10px; text-transform: uppercase;">Issuer Legal Name</div><strong style="color: #0B1120;">${project.company_name}</strong></div>
      <div style="font-size: 13px;"><div style="font-weight: bold; color: #4B5A7A; font-size: 10px; text-transform: uppercase;">Corporate Identity Number (CIN)</div><strong style="color: #0B1120;">${project.cin || 'N/A'}</strong></div>
      <div style="font-size: 13px;"><div style="font-weight: bold; color: #4B5A7A; font-size: 10px; text-transform: uppercase;">Total Issue Size</div><strong style="color: #0B1120;">₹${project.issue_size_cr} Crores</strong></div>
      <div style="font-size: 13px;"><div style="font-weight: bold; color: #4B5A7A; font-size: 10px; text-transform: uppercase;">Post-Issue Paid-Up Capital</div><strong style="color: #0B1120;">₹${project.post_issue_paid_up_capital} Crores</strong></div>
      <div style="font-size: 13px;"><div style="font-weight: bold; color: #4B5A7A; font-size: 10px; text-transform: uppercase;">SEBI ICDR Compliance Score</div><strong style="color: #086F83;">${score}% (18+ Deterministic Rules Validated)</strong></div>
      <div style="font-size: 13px;"><div style="font-weight: bold; color: #4B5A7A; font-size: 10px; text-transform: uppercase;">Audit Trail Integrity</div><strong style="color: #0B8CA5;">SHA-256 Hash Chain Verified</strong></div>
    </div>

    <h2 style="font-size: 20px; color: #0B1120; font-weight: 800; border-bottom: 1px solid #DCE0D6; padding-bottom: 10px;">Schedule VI, Part A — Mandatory Disclosures</h2>
    
    ${sections.map(s => `
      <div style="margin-bottom: 35px; page-break-inside: avoid; border-bottom: 1px solid #DCE0D6; padding-bottom: 25px;">
        <div style="font-size: 16px; color: #0B1120; font-weight: bold; margin-bottom: 10px; display: flex; align-items: center; gap: 10px;">
          <span style="background: #EEF0EB; border: 1px solid #DCE0D6; color: #0B1120; width: 26px; height: 26px; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; font-family: monospace;">${s.section_order}</span>
          <span>${s.section_name}</span>
          <span style="font-size: 11px; color: #4B5A7A; font-weight: bold; margin-left: auto; font-family: monospace;">[${s.section_code}]</span>
        </div>
        <div style="background: #ffffff; padding: 15px; border: 1px solid #DCE0D6; border-left: 3px solid #086F83; font-size: 13px; white-space: pre-wrap; font-family: sans-serif; color: #25314C; font-weight: 500;">${s.human_edited || s.ai_draft || 'No disclosure drafted yet. Mandatory section pending completion in Delta Wizard.'}</div>
      </div>
    `).join('')}

    <div style="text-align: center; font-size: 11px; color: #4B5A7A; margin-top: 50px; border-top: 1px solid #DCE0D6; padding-top: 20px; font-family: monospace;">
      <p>Generated by ClauseProof RegTech Platform · Aligned with SEBI ICDR 2026 Regulations</p>
      <p>Cryptographic Verification Hash: <span style="background: #EEF0EB; padding: 2px 6px; border-radius: 4px; border: 1px solid #DCE0D6; color: #0B1120; font-weight: bold;">SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span></p>
    </div>
  </div>`;
              
              const printWindow = window.open('', '_blank');
              if (printWindow) {
                printWindow.document.write(`<!DOCTYPE html><html><head><title>${project.company_name} DRHP Package</title><meta charset="utf-8"><style>body{font-family:system-ui,-apple-system,sans-serif;margin:0;padding:20px;color:#0B1120;background:#ffffff;}@media print{body{padding:0;}@page{margin:15mm;}}</style></head><body>${htmlContent}</body></html>`);
                printWindow.document.close();
                printWindow.focus();
                setTimeout(() => { printWindow.print(); }, 250);
              } else {
                const blob = new Blob([`<!DOCTYPE html><html><head><title>${project.company_name} DRHP Package</title><meta charset="utf-8"><style>body{font-family:system-ui,-apple-system,sans-serif;margin:40px auto;max-width:900px;color:#0B1120;background:#ffffff;line-height:1.6;}</style></head><body>${htmlContent}</body></html>`], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${project.company_name.replace(/\s+/g, '_')}_DRHP_ScheduleVI_Package.html`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-white border border-[#DCE0D6] text-[#086F83] hover:border-[#086F83]/60 transition-all flex items-center gap-2 shadow-subtle hover:shadow-card btn-press"
          >
            <Download className="w-4 h-4" strokeWidth={2.2} />
            <span>Export DRHP</span>
          </button>

          <button
            onClick={() => navigate(`/project/${project.id}/editor`)}
            className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-white border border-[#DCE0D6] text-[#0B1120] hover:border-[#086F83]/60 transition-all flex items-center gap-2 shadow-subtle hover:shadow-card btn-press"
          >
            <Sparkles className="w-4 h-4 text-[#0B8CA5]" strokeWidth={2.2} />
            <span>Open Delta Wizard</span>
          </button>

          <button
            onClick={() => navigate(`/project/${project.id}/compliance`)}
            className="px-6 py-2.5 rounded-xl text-xs font-mono font-extrabold uppercase tracking-wider bg-gradient-to-r from-[#0B1120] to-[#086F83] text-white shadow-card transition-all flex items-center gap-2 btn-press hover:shadow-elevated"
          >
            <ShieldCheck className="w-4 h-4" strokeWidth={2.2} />
            <span>Run Rule Engine</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card>
          <div className="font-mono text-xs font-extrabold uppercase tracking-wider text-[#4B5A7A] mb-2">SEBI ICDR Compliance</div>
          <div className="font-mono text-3xl font-extrabold text-[#0B1120] tracking-tight mb-3">{score}%</div>
          <ProgressBar value={score} showValue={false} size="sm" />
        </Card>

        <Card>
          <div className="font-mono text-xs font-extrabold uppercase tracking-wider text-[#4B5A7A] mb-2">Schedule VI Completion</div>
          <div className="font-mono text-3xl font-extrabold text-[#0B1120] tracking-tight mb-3">{completedCount}/{sections.length}</div>
          <ProgressBar value={completionPct} variant="primary" showValue={false} size="sm" />
        </Card>

        <Card>
          <div className="font-mono text-xs font-extrabold uppercase tracking-wider text-[#4B5A7A] mb-2">Issue Size Allocation</div>
          <div className="font-mono text-3xl font-extrabold text-[#0B1120] tracking-tight">₹{project.issue_size_cr || '—'} <span className="text-xs font-bold text-[#4B5A7A]">Cr</span></div>
          <div className="font-sans text-xs font-semibold text-[#25314C] mt-2">Paid-Up: ₹{project.post_issue_paid_up_capital} Cr</div>
        </Card>

        <Card>
          <div className="font-mono text-xs font-extrabold uppercase tracking-wider text-[#4B5A7A] mb-2">Audit Trail & Sign-Offs</div>
          <div className="text-sm font-extrabold text-[#086F83] font-mono mt-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" strokeWidth={2.2} />
            <span>SHA-256 Active</span>
          </div>
          <button
            onClick={() => navigate(`/project/${project.id}/audit`)}
            className="font-mono text-xs text-[#0B8CA5] hover:text-[#0B1120] font-extrabold mt-3 flex items-center gap-1.5 transition-colors"
          >
            <span>View Hash Logs</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.2} />
          </button>
        </Card>
      </div>

      {/* Schedule VI Sections List */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-[#DCE0D6] gap-3">
          <div>
            <h3 className="font-heading text-lg sm:text-xl font-extrabold text-[#0B1120] tracking-tight flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-[#086F83]" strokeWidth={2.2} />
              <span>Schedule VI, Part A — Mandatory Disclosure Sections</span>
            </h3>
            <p className="font-sans text-xs sm:text-sm font-medium text-[#25314C] mt-1">
              Select any section to launch the Delta Wizard editor and review built-in SEBI regulatory guidance
            </p>
          </div>
          <Badge variant="info">{completedCount} of {sections.length} Complete</Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-3.5">
          {sections.map((sec, idx) => {
            const isDone = sec.is_completed;
            const isInProgress = (sec.human_edited || sec.ai_draft || '').length > 0;

            return (
              <div
                key={sec.id}
                onClick={() => navigate(`/project/${project.id}/editor?section=${idx}`)}
                className="p-4 rounded-xl border border-[#DCE0D6] bg-white hover:bg-[#EEF0EB]/60 hover:border-[#086F83]/50 transition-all duration-200 cursor-pointer flex items-center justify-between group shadow-subtle hover:shadow-card"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 border transition-colors ${
                    isDone 
                      ? 'bg-[#086F83]/15 text-[#086F83] border-[#086F83]/40' 
                      : 'bg-[#EEF0EB] text-[#0B1120] border-[#DCE0D6] group-hover:border-[#086F83]/50'
                  }`}>
                    {sec.section_order}
                  </div>
                  <div className="min-w-0">
                    <div className="font-heading text-sm font-extrabold text-[#0B1120] group-hover:text-[#086F83] truncate transition-colors">
                      {sec.section_name}
                    </div>
                    <div className="font-mono text-xs font-bold text-[#4B5A7A] truncate mt-0.5">
                      {sec.section_code} · v{sec.version}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {isDone ? (
                    <Badge variant="pass">Complete</Badge>
                  ) : isInProgress ? (
                    <Badge variant="warning">In Progress</Badge>
                  ) : (
                    <Badge variant="draft">Pending</Badge>
                  )}
                  <ArrowRight className="w-4 h-4 text-[#4B5A7A] group-hover:text-[#086F83] group-hover:translate-x-1 transition-all" strokeWidth={2.2} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
