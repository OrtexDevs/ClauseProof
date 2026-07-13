import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderPlus, TrendingUp, ShieldCheck, FileText,
  Clock, ArrowRight, Building2, AlertTriangle
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
    <div className="space-y-10 text-[#16233D]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E4E2D8]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-[#E4E2D8] font-mono text-[11px] uppercase tracking-widest text-[#2E7D8C] font-semibold mb-3 shadow-subtle">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D8C]" />
            <span>SEBI TechSprint PS-4 RegTech Ledger</span>
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#16233D]">
            IPO Compliance Dashboard
          </h1>
          <p className="font-sans text-sm text-[#4A5568] mt-1.5 max-w-xl leading-relaxed">
            Deterministic rule validation against SEBI ICDR 2025. Manage your DRHP filings with compliance-as-code precision.
          </p>
        </div>
        <button
          onClick={() => navigate('/projects/new')}
          className="px-5 py-2.5 rounded-xl text-xs font-mono font-medium uppercase tracking-wider bg-[#16233D] text-white hover:-translate-y-0.5 hover:shadow-subtle transition-all flex items-center gap-2 shrink-0"
        >
          <FolderPlus className="w-4 h-4" strokeWidth={2} />
          New Filing
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-white rounded-xl border border-[#E4E2D8] shadow-subtle divide-y sm:divide-y-0 sm:divide-x divide-[#E4E2D8] overflow-hidden">
        {[
          { label: 'Active Filings', value: String(projects.length), sub: 'Schedule VI Mapped', icon: FileText, color: 'text-[#2E7D8C]' },
          { label: 'Avg. Compliance', value: `${avgScore}%`, sub: '18+ ICDR Rules', icon: ShieldCheck, color: 'text-[#39A0B0]' },
          { label: 'Total Issue Size', value: `₹${totalIssueSize.toFixed(1)} Cr`, sub: 'SME Exchange', icon: TrendingUp, color: 'text-[#C9762E]' },
          { label: 'Audit Integrity', value: 'Verified', sub: 'SHA-256 Chain', icon: ShieldCheck, color: 'text-[#2E7D8C]' },
        ].map((s, i) => (
          <div key={i} className="p-6 stagger-fade-up" style={{ '--i': i } as React.CSSProperties}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[11px] uppercase tracking-widest font-semibold text-[#8A93A6]">{s.label}</span>
              <s.icon className={`w-4 h-4 ${s.color}`} strokeWidth={1.8} />
            </div>
            <div className="text-3xl font-bold tracking-tight font-mono text-[#16233D]">{s.value}</div>
            <div className="font-sans text-xs text-[#4A5568] mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Projects */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest font-semibold text-[#2E7D8C] mb-1">SECTION // ACTIVE LEDGERS</div>
            <h2 className="font-heading text-xl font-bold text-[#16233D] tracking-tight">IPO Filing Projects</h2>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map(i => (
              <div key={i} className="rounded-xl border border-[#E4E2D8] bg-white p-6 space-y-4 animate-pulse">
                <div className="h-4 w-24 bg-[#FAFAF7] rounded" />
                <div className="h-6 w-44 bg-[#FAFAF7] rounded" />
                <div className="h-20 bg-[#FAFAF7] rounded-lg" />
                <div className="space-y-3">
                  <div className="h-2 bg-[#FAFAF7] rounded-full" />
                  <div className="h-2 bg-[#FAFAF7] rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 px-6 bg-white rounded-xl border border-[#E4E2D8] shadow-subtle">
            <div className="w-12 h-12 rounded-xl bg-[#FAFAF7] border border-[#E4E2D8] flex items-center justify-center mx-auto mb-5">
              <FolderPlus className="w-6 h-6 text-[#2E7D8C]" strokeWidth={1.8} />
            </div>
            <h3 className="font-heading text-lg font-bold text-[#16233D] mb-1.5">No IPO Projects Initialized</h3>
            <p className="font-sans text-xs text-[#4A5568] max-w-md mx-auto mb-6 leading-relaxed">
              Initialize your first SME IPO filing to auto-generate the 18 mandatory Schedule VI sections with SHA-256 hash logging.
            </p>
            <button
              onClick={() => navigate('/projects/new')}
              className="px-5 py-2.5 rounded-xl text-xs font-mono font-medium uppercase tracking-wider bg-[#16233D] text-white hover:-translate-y-0.5 hover:shadow-subtle transition-all inline-flex items-center gap-2"
            >
              <FolderPlus className="w-4 h-4" strokeWidth={2} /> Create First Project
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
                  className="group cursor-pointer bg-white rounded-xl border border-[#E4E2D8] p-6 shadow-subtle hover:bg-[#FAFAF7]/60 transition-all duration-200 flex flex-col justify-between stagger-fade-up"
                  style={{ '--i': idx } as React.CSSProperties}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div>
                        <Badge
                          variant={p.status === 'approved' ? 'pass' : p.status === 'in_review' ? 'info' : 'draft'}
                          className="mb-2.5"
                        >
                          {p.status.replace('_', ' ')}
                        </Badge>
                        <h3 className="font-heading text-lg font-bold text-[#16233D] group-hover:text-[#2E7D8C] transition-colors line-clamp-1">
                          {p.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-[#4A5568] mt-1 font-sans">
                          <Building2 className="w-3.5 h-3.5 text-[#8A93A6] shrink-0" strokeWidth={1.8} />
                          <span className="truncate">{p.company_name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg bg-[#FAFAF7] border border-[#E4E2D8] mb-6">
                      <div>
                        <div className="font-mono text-[10px] uppercase font-bold text-[#8A93A6]">Issue Size</div>
                        <div className="font-mono text-sm font-bold text-[#16233D] mt-0.5">{p.issue_size_cr ? `₹${p.issue_size_cr} Cr` : '—'}</div>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] uppercase font-bold text-[#8A93A6]">Paid-Up Cap</div>
                        <div className="font-mono text-sm font-bold text-[#16233D] mt-0.5">{p.post_issue_paid_up_capital ? `₹${p.post_issue_paid_up_capital} Cr` : '—'}</div>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <ProgressBar value={score} label="ICDR Compliance" variant="auto" size="md" />
                      <ProgressBar value={completion} label="DRHP Completion" variant="primary" size="sm" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E4E2D8] flex items-center justify-between font-mono text-xs text-[#8A93A6]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" strokeWidth={1.8} />
                      <span>Updated {new Date(p.updated_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#2E7D8C] font-semibold group-hover:translate-x-1 transition-transform">
                      <span>Open Ledger</span>
                      <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Alert */}
      <div className="flex items-start gap-4 p-6 rounded-xl bg-white border border-[#E4E2D8] shadow-subtle">
        <div className="w-10 h-10 rounded-xl bg-[#FAFAF7] border border-[#E4E2D8] flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5 text-[#C9762E]" strokeWidth={1.8} />
        </div>
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest font-semibold text-[#C9762E] mb-1">REGULATORY NOTICE</div>
          <h3 className="font-heading text-base font-bold text-[#16233D]">SEBI 2025/2026 SME Listing Alert</h3>
          <p className="font-sans text-xs text-[#4A5568] mt-1 leading-relaxed">
            Recent ICDR amendments mandate that companies converting from a proprietorship/LLP must show at least <strong className="text-[#16233D]">1 full financial year post-conversion</strong> before filing the DRHP.
          </p>
        </div>
      </div>
    </div>
  );
};
