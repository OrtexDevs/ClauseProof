import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  History, 
  ArrowRight, 
  CheckCircle2, 
  Clock,
  Building2,
  TrendingUp
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
    return <div className="h-96 rounded-3xl bg-slate-800/40 animate-pulse border border-white/5" />;
  }

  if (!project) {
    return <div className="text-center py-20 text-slate-400">IPO Project not found.</div>;
  }

  const completedCount = sections.filter(s => s.is_completed).length;
  const completionPct = sections.length > 0 ? Math.round((completedCount / sections.length) * 100) : 0;
  const score = project.compliance_score || 0;

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={project.status === 'approved' ? 'pass' : 'draft'} className="uppercase">
              {project.status.replace('_', ' ')}
            </Badge>
            <span className="text-xs text-slate-400 font-mono">CIN: {project.cin || 'N/A'}</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">{project.name}</h1>
          <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <span>{project.company_name}</span>
            <span>·</span>
            <span>{project.industry}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/project/${project.id}/editor`)}
            className="px-5 py-3 rounded-xl text-sm font-bold bg-card hover:bg-card-hover border border-white/10 text-white transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Open Delta Wizard</span>
          </button>
          <button
            onClick={() => navigate(`/project/${project.id}/compliance`)}
            className="px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white shadow-glow hover:shadow-glow-lg transition-all flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Run Rule Engine</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <Card glass>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">SEBI ICDR Compliance</div>
          <div className="text-3xl font-black text-white tracking-tight mb-3">{score}%</div>
          <ProgressBar value={score} showValue={false} size="sm" />
        </Card>

        <Card glass>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Schedule VI Completion</div>
          <div className="text-3xl font-black text-white tracking-tight mb-3">{completedCount}/{sections.length}</div>
          <ProgressBar value={completionPct} variant="primary" showValue={false} size="sm" />
        </Card>

        <Card glass>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Issue Size Allocation</div>
          <div className="text-3xl font-black text-white tracking-tight">₹{project.issue_size_cr || '—'} <span className="text-sm font-normal text-slate-400">Cr</span></div>
          <div className="text-xs text-slate-400 mt-2">Paid-Up: ₹{project.post_issue_paid_up_capital} Cr</div>
        </Card>

        <Card glass>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Audit Trail & Sign-Offs</div>
          <div className="text-xl font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5" />
            <span>SHA-256 Active</span>
          </div>
          <button
            onClick={() => navigate(`/project/${project.id}/audit`)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold mt-3 flex items-center gap-1"
          >
            <span>View Hash Logs</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </Card>
      </div>

      {/* Schedule VI Sections List */}
      <Card glass>
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>Schedule VI, Part A — Mandatory Disclosure Sections</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any section to launch the Delta Wizard editor and review built-in SEBI guidance
            </p>
          </div>
          <Badge variant="info" className="font-mono">{completedCount} of {sections.length} Complete</Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {sections.map((sec, idx) => {
            const isDone = sec.is_completed;
            const isInProgress = (sec.human_edited || sec.ai_draft || '').length > 0;

            return (
              <div
                key={sec.id}
                onClick={() => navigate(`/project/${project.id}/editor?section=${idx}`)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                  isDone 
                    ? 'bg-emerald-950/10 border-emerald-500/30 hover:border-emerald-500/60' 
                    : isInProgress 
                      ? 'bg-slate-900/80 border-indigo-500/30 hover:border-indigo-500/60' 
                      : 'bg-slate-900/40 border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                    isDone 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-slate-800 text-slate-400 group-hover:bg-primary/20 group-hover:text-primary-light transition-colors'
                  }`}>
                    {sec.section_order}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-200 group-hover:text-white truncate">
                      {sec.section_name}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
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
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
