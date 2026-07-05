import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  RefreshCw, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Scale,
  FileText,
  Sparkles
} from 'lucide-react';
import { apiService } from '../services/api';
import { Project, ComplianceReport } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';

export const ComplianceHub: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [running, setRunning] = useState<boolean>(false);
  const [filter, setFilter] = useState<'all' | 'pass' | 'fail' | 'warning'>('all');

  const fetchCompliance = async () => {
    if (!id) return;
    setRunning(true);
    try {
      const [projData, repData] = await Promise.all([
        apiService.getProject(id),
        apiService.runComplianceCheck(id)
      ]);
      setProject(projData);
      setReport(repData);
    } finally {
      setLoading(false);
      setRunning(false);
    }
  };

  useEffect(() => {
    fetchCompliance();
  }, [id]);

  if (loading) return <div className="h-96 rounded-3xl bg-slate-800/40 animate-pulse border border-white/5" />;
  if (!project || !report) return <div className="text-center py-20 text-slate-400">Compliance data not found.</div>;

  const filteredDetails = report.details.filter(d => {
    if (filter === 'all') return true;
    return d.status === filter;
  });

  const score = report.score || 0;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/project/${project.id}`)}
            className="w-10 h-10 rounded-xl bg-card border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Deterministic Rule Engine</span>
              <span className="text-xs text-slate-500 font-mono">· SEBI ICDR 2025</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Compliance Validation Hub</h1>
          </div>
        </div>

        <button
          onClick={fetchCompliance}
          disabled={running}
          className="px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white shadow-glow hover:shadow-glow-lg transition-all flex items-center gap-2 disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${running ? 'animate-spin' : ''}`} />
          <span>{running ? 'Executing 18 Rules...' : 'Re-Run Deterministic Validation'}</span>
        </button>
      </div>

      {/* Score Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <Card glass className="md:col-span-1 bg-gradient-to-br from-indigo-950/40 via-card to-card border-indigo-500/30 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">ICDR Compliance Score</div>
            <div className="text-4xl font-black text-white tracking-tight mb-4">{score}%</div>
            <ProgressBar value={score} showValue={false} size="md" />
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between">
            <span>Status:</span>
            <span className={`font-bold uppercase ${score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-rose-400'}`}>
              {score >= 70 ? 'Eligible for Filing' : score >= 40 ? 'Review Required' : 'Critical Deficiencies'}
            </span>
          </div>
        </Card>

        <Card glass className="flex flex-col justify-center text-center">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-white">{report.passed}</div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Rules Passed</div>
        </Card>

        <Card glass className="flex flex-col justify-center text-center">
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center mx-auto mb-2">
            <XCircle className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-white">{report.failed}</div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Rules Failed</div>
        </Card>

        <Card glass className="flex flex-col justify-center text-center">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto mb-2">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-white">{report.warnings}</div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Warnings / Advisories</div>
        </Card>
      </div>

      {/* Filter Tabs & Rule Table */}
      <Card glass>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Scale className="w-5 h-5 text-indigo-400" />
              <span>SEBI ICDR Rule Execution Report</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Deterministic mathematical and logical verification without LLM hallucination
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-white/5 self-start">
            {(['all', 'pass', 'fail', 'warning'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  filter === t 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t} ({t === 'all' ? report.total : t === 'pass' ? report.passed : t === 'fail' ? report.failed : report.warnings})
              </button>
            ))}
          </div>
        </div>

        {/* Rules Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-900/40">
                <th className="py-3 px-4 rounded-l-xl">Rule Code</th>
                <th className="py-3 px-4">Regulation Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 rounded-r-xl">Execution Evidence & Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredDetails.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No regulatory rules match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredDetails.map((rule, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-mono text-xs font-bold text-indigo-400 whitespace-nowrap">
                      {rule.rule_code}
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-200 max-w-md">
                      {rule.rule_text}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 capitalize font-medium border border-white/5">
                        {rule.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                        rule.severity === 'mandatory' ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20' : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                      }`}>
                        {rule.severity}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <Badge variant={rule.status === 'pass' ? 'pass' : rule.status === 'fail' ? 'fail' : 'warning'} className="uppercase font-mono">
                        {rule.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-300 font-mono bg-slate-950/40 rounded-lg p-2.5 max-w-sm">
                      {rule.message}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
