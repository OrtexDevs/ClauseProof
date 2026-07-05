import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderPlus, 
  TrendingUp, 
  ShieldCheck, 
  FileText, 
  Clock, 
  ArrowRight, 
  Building2, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { apiService } from '../services/api';
import { Project } from '../types';
import { Card } from '../components/common/Card';
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
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/60 border border-indigo-500/20 shadow-glass">
        <div>
          <Badge variant="primary" className="mb-2">SEBI TechSprint Problem Statement 4</Badge>
          <h2 className="text-2xl font-black text-white tracking-tight">
            SME IPO Compliance Operating System
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Deterministic rule validation against SEBI ICDR 2025 regulations. Manage your Draft Red Herring Prospectus (DRHP) with compliance-as-code precision.
          </p>
        </div>
        <button
          onClick={() => navigate('/projects/new')}
          className="px-6 py-3.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 shrink-0"
        >
          <FolderPlus className="w-4 h-4" />
          <span>New IPO Filing</span>
        </button>
      </div>

      {/* High Level Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card glass className="relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Filings</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">{projects.length}</div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">100%</span> Schedule VI Mapped
          </div>
        </Card>

        <Card glass className="relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg. Compliance Score</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">{avgScore}%</div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-indigo-400 font-semibold">18+</span> ICDR Rules Validated
          </div>
        </Card>

        <Card glass className="relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Issue Size</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">₹{totalIssueSize.toFixed(1)} <span className="text-lg font-bold text-slate-400">Cr</span></div>
          <div className="text-xs text-slate-400 mt-1">SME Exchange Allocation</div>
        </Card>

        <Card glass className="relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Audit Trail Integrity</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 tracking-tight flex items-center gap-1.5">
            <span>VERIFIED</span>
          </div>
          <div className="text-xs text-slate-400 mt-1 font-mono">SHA-256 Hash Chain</div>
        </Card>
      </div>

      {/* Projects Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">IPO Filing Projects</h3>
            <p className="text-xs text-slate-400 mt-0.5">Select a project to manage Schedule VI disclosures and run rule validation</p>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 rounded-2xl bg-slate-800/40 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <Card glass className="text-center py-16 px-6">
            <div className="w-16 h-16 rounded-3xl bg-slate-800/80 border border-white/10 flex items-center justify-center mx-auto text-slate-400 mb-4">
              <FolderPlus className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No IPO Projects Found</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
              Initialize your first SME IPO filing to automatically generate the 18 mandatory Schedule VI DRHP sections and start compliance validation.
            </p>
            <button
              onClick={() => navigate('/projects/new')}
              className="px-6 py-3 rounded-xl text-sm font-bold bg-primary hover:bg-primary-dark text-white transition-all shadow-glow inline-flex items-center gap-2"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Create First IPO Project</span>
            </button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => {
              const score = p.compliance_score || 0;
              const completion = p.completion_percentage || 0;

              return (
                <Card
                  key={p.id}
                  glass
                  glow
                  onClick={() => navigate(`/project/${p.id}`)}
                  className="cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div>
                        <Badge 
                          variant={p.status === 'approved' ? 'pass' : p.status === 'in_review' ? 'info' : 'draft'} 
                          className="mb-2 uppercase text-[10px]"
                        >
                          {p.status.replace('_', ' ')}
                        </Badge>
                        <h4 className="text-lg font-bold text-white group-hover:text-primary-light transition-colors line-clamp-1">
                          {p.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{p.company_name}</span>
                        </div>
                      </div>
                    </div>

                    {/* Financial Metrics Box */}
                    <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/5 mb-5">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-500">Issue Size</div>
                        <div className="text-sm font-bold text-slate-200 mt-0.5">₹{p.issue_size_cr || '—'} Cr</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-500">Paid-Up Cap</div>
                        <div className="text-sm font-bold text-slate-200 mt-0.5">₹{p.post_issue_paid_up_capital || '—'} Cr</div>
                      </div>
                    </div>

                    {/* Progress Bars */}
                    <div className="space-y-4 mb-6">
                      <ProgressBar
                        value={score}
                        label="SEBI ICDR Compliance Score"
                        variant="auto"
                        size="md"
                      />
                      <ProgressBar
                        value={completion}
                        label="Schedule VI DRHP Completion"
                        variant="primary"
                        size="sm"
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Updated {new Date(p.updated_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">
                      <span>Open Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Tips Box */}
      <Card glass className="bg-gradient-to-r from-amber-500/10 via-transparent to-transparent border-amber-500/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-300">SEBI 2025/2026 SME Listing Alert</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Recent ICDR amendments mandate that companies converting from a proprietorship/LLP must show at least <strong className="text-white">1 full financial year of existence post-conversion</strong> before filing the DRHP. Ensure your incorporation date reflects this in the Rule Engine check.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
