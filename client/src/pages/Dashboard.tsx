import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderPlus, TrendingUp, ShieldCheck, FileText,
  Clock, ArrowRight, Building2, AlertTriangle, Sparkles
} from 'lucide-react';
import { apiService } from '../services/api';
import { Project } from '../types';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await apiService.getProjects();
        setProjects(data);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const totalIssueSize = projects.reduce((sum, p) => sum + (p.issue_size_cr || 0), 0);
  const avgScore = projects.length > 0
    ? Math.round(projects.reduce((sum, p) => sum + (p.compliance_score || 0), 0) / projects.length)
    : 0;

  return (
    <div className="space-y-10 text-[#0B1120]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#DCE0D6]">
        <div className="stagger-fade-up" style={{ '--i': 1 } as React.CSSProperties}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-[#DCE0D6] font-mono text-xs uppercase tracking-widest text-[#086F83] font-extrabold mb-3 shadow-subtle">
            <Sparkles className="w-3.5 h-3.5 text-[#086F83]" strokeWidth={2.2} />
            <span>SEBI TechSprint PS-4 RegTech Ledger</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B1120]">
            IPO Compliance Dashboard
          </h1>
          <p className="font-sans text-sm font-medium text-[#25314C] mt-1.5 max-w-xl leading-relaxed">
            Deterministic rule validation against SEBI ICDR 2026. Manage your DRHP filings with compliance-as-code precision.
          </p>
        </div>
        <button
          onClick={() => navigate('/projects/new')}
          className="px-5 py-3 rounded-xl text-xs font-mono font-extrabold uppercase tracking-wider bg-[#0B1120] text-white hover:bg-[#086F83] shadow-card transition-all flex items-center justify-center gap-2 shrink-0 btn-press"
        >
          <FolderPlus className="w-4 h-4" strokeWidth={2.2} />
          New Filing
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-white rounded-xl border border-[#DCE0D6] shadow-card divide-y sm:divide-y-0 sm:divide-x divide-[#DCE0D6] overflow-hidden stagger-fade-up" style={{ '--i': 2 } as React.CSSProperties}>
        {[
          { label: 'Active Filings', value: String(projects.length), sub: 'Schedule VI Mapped', icon: FileText, color: 'text-[#086F83]' },
          { label: 'Avg. Compliance', value: `${avgScore}%`, sub: '18+ ICDR Rules', icon: ShieldCheck, color: 'text-[#0B8CA5]' },
          { label: 'Total Issue Size', value: `₹${totalIssueSize.toFixed(1)} Cr`, sub: 'SME Exchange', icon: TrendingUp, color: 'text-[#C2590E]' },
          { label: 'Audit Integrity', value: 'Verified', sub: 'SHA-256 Chain', icon: ShieldCheck, color: 'text-[#086F83]' },
        ].map((s, i) => (
          <div key={i} className="p-6 hover:bg-[#EEF0EB]/60 transition-colors cursor-default">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs uppercase tracking-widest font-extrabold text-[#4B5A7A]">{s.label}</span>
              <s.icon className={`w-4 h-4 ${s.color}`} strokeWidth={2.2} />
            </div>
            <div className="text-3xl font-extrabold tracking-tight font-mono text-[#0B1120]">{s.value}</div>
            <div className="font-sans text-xs font-semibold text-[#25314C] mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Projects */}
      <div className="stagger-fade-up" style={{ '--i': 3 } as React.CSSProperties}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest font-extrabold text-[#086F83] mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#086F83]" />
              SECTION // ACTIVE LEDGERS
            </div>
            <h2 className="font-heading text-xl font-extrabold text-[#0B1120] tracking-tight">IPO Filing Projects</h2>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map(i => (
              <div key={i} className="rounded-xl border border-[#DCE0D6] bg-white p-6 space-y-4 animate-pulse shadow-subtle">
                <div className="h-4 w-24 bg-[#EEF0EB] rounded" />
                <div className="h-6 w-44 bg-[#EEF0EB] rounded" />
                <div className="h-20 bg-[#EEF0EB] rounded-lg" />
                <div className="space-y-3">
                  <div className="h-2 bg-[#EEF0EB] rounded-full" />
                  <div className="h-2 bg-[#EEF0EB] rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 px-6 bg-white rounded-xl border border-[#DCE0D6] shadow-card">
            <div className="w-12 h-12 rounded-xl bg-[#EEF0EB] border border-[#DCE0D6] flex items-center justify-center mx-auto mb-5 shadow-subtle">
              <FolderPlus className="w-6 h-6 text-[#086F83]" strokeWidth={2.2} />
            </div>
            <h3 className="font-heading text-lg font-extrabold text-[#0B1120] mb-1.5">No IPO Projects Initialized</h3>
            <p className="font-sans text-xs font-medium text-[#25314C] max-w-md mx-auto mb-6 leading-relaxed">
              Initialize your first SME IPO filing to auto-generate the 18 mandatory Schedule VI sections with SHA-256 hash logging.
            </p>
            <button
              onClick={() => navigate('/projects/new')}
              className="px-5 py-3 rounded-xl text-xs font-mono font-extrabold uppercase tracking-wider bg-[#0B1120] text-white hover:bg-[#086F83] shadow-card transition-all inline-flex items-center gap-2 btn-press"
            >
              <FolderPlus className="w-4 h-4" strokeWidth={2.2} /> Create First Project
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p, idx) => {
              const score = p.compliance_score || 0;
              const completion = p.completion_percentage || 0;

              return (
                <div
                  key={p.id}
                  onClick={() => navigate(`/project/${p.id}`)}
                  className="group cursor-pointer bg-white rounded-xl border border-[#DCE0D6] p-6 sm:p-7 shadow-card card-interactive flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div>
                        <Badge
                          variant={p.status === 'approved' ? 'pass' : p.status === 'in_review' ? 'info' : 'draft'}
                          className="mb-3"
                        >
                          {p.status.replace('_', ' ')}
                        </Badge>
                        <h3 className="font-heading text-lg font-extrabold text-[#0B1120] group-hover:text-[#086F83] transition-colors line-clamp-1">
                          {p.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#25314C] mt-1 font-sans">
                          <Building2 className="w-3.5 h-3.5 text-[#4B5A7A] shrink-0" strokeWidth={2.2} />
                          <span className="truncate">{p.company_name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#EEF0EB] border border-[#DCE0D6] mb-6 shadow-subtle">
                      <div>
                        <div className="font-mono text-[10px] uppercase font-extrabold text-[#4B5A7A]">Issue Size</div>
                        <div className="font-mono text-sm font-extrabold text-[#0B1120] mt-0.5">{p.issue_size_cr ? `₹${p.issue_size_cr} Cr` : '—'}</div>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] uppercase font-extrabold text-[#4B5A7A]">Paid-Up Cap</div>
                        <div className="font-mono text-sm font-extrabold text-[#0B1120] mt-0.5">{p.post_issue_paid_up_capital ? `₹${p.post_issue_paid_up_capital} Cr` : '—'}</div>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <ProgressBar value={score} label="ICDR Compliance" variant="auto" size="md" />
                      <ProgressBar value={completion} label="DRHP Completion" variant="primary" size="sm" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#DCE0D6] flex items-center justify-between font-mono text-xs font-bold text-[#4B5A7A]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" strokeWidth={2.2} />
                      <span>Updated {new Date(p.updated_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#086F83] font-extrabold group-hover:translate-x-1.5 transition-transform">
                      <span>Open Ledger</span>
                      <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.2} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Alert */}
      <div className="flex items-start gap-4 p-6 rounded-xl bg-white border border-[#DCE0D6] shadow-card stagger-fade-up" style={{ '--i': 4 } as React.CSSProperties}>
        <div className="w-10 h-10 rounded-xl bg-[#EEF0EB] border border-[#DCE0D6] flex items-center justify-center shrink-0 mt-0.5 shadow-subtle">
          <AlertTriangle className="w-5 h-5 text-[#C2590E]" strokeWidth={2.2} />
        </div>
        <div>
          <div className="font-mono text-xs uppercase tracking-widest font-extrabold text-[#C2590E] mb-1">REGULATORY NOTICE</div>
          <h3 className="font-heading text-base font-extrabold text-[#0B1120]">SEBI 2025/2026 SME Listing Alert</h3>
          <p className="font-sans text-xs font-semibold text-[#25314C] mt-1 leading-relaxed">
            Recent ICDR amendments mandate that companies converting from a proprietorship/LLP must show at least <strong className="text-[#0B1120]">1 full financial year post-conversion</strong> before filing the DRHP.
          </p>
        </div>
      </div>
    </div>
  );
};
