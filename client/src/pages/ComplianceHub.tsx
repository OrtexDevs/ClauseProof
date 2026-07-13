import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  RefreshCw, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Scale
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

  if (loading) return <div className="h-96 rounded-xl bg-white border border-[#E4E2D8] animate-pulse" />;
  if (!project || !report) return <div className="text-center py-20 text-[#8A93A6] font-mono text-xs">Compliance data not found.</div>;

  const filteredDetails = report.details.filter(d => {
    if (filter === 'all') return true;
    return d.status === filter;
  });

  const score = report.score || 0;

  return (
    <div className="space-y-8 text-[#16233D]">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E4E2D8]">
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => navigate(`/project/${project.id}`)}
            className="w-10 h-10 rounded-xl bg-white border border-[#E4E2D8] flex items-center justify-center text-[#4A5568] hover:text-[#16233D] hover:border-[#8A93A6] transition-all shadow-subtle"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="font-bold text-[#2E7D8C] uppercase tracking-wider">Deterministic Rule Engine</span>
              <span className="text-[#8A93A6]">· SEBI ICDR 2025</span>
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-[#16233D]">Compliance Validation Hub</h1>
          </div>
        </div>

        <button
          onClick={fetchCompliance}
          disabled={running}
          className="px-6 py-3 rounded-xl text-xs font-mono font-medium uppercase tracking-wider bg-[#16233D] hover:-translate-y-0.5 hover:shadow-subtle text-white transition-all flex items-center gap-2 disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${running ? 'animate-spin' : ''}`} strokeWidth={2} />
          <span>{running ? 'Executing 18 Rules...' : 'Re-Run Deterministic Validation'}</span>
        </button>
      </div>

      {/* Score Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <Card className="md:col-span-1 flex flex-col justify-between">
          <div>
            <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#8A93A6] mb-2">ICDR Compliance Score</div>
            <div className="font-mono text-4xl font-bold text-[#2E7D8C] tracking-tight mb-4">{score}%</div>
            <ProgressBar value={score} showValue={false} size="md" />
          </div>
          <div className="mt-4 pt-3 border-t border-[#E4E2D8] font-mono text-xs text-[#8A93A6] flex items-center justify-between">
            <span>Status:</span>
            <span className={`font-bold uppercase ${score >= 70 ? 'text-[#2E7D8C]' : score >= 40 ? 'text-[#39A0B0]' : 'text-[#C9762E]'}`}>
              {score >= 70 ? 'Eligible for Filing' : score >= 40 ? 'Review Required' : 'Critical Deficiencies'}
            </span>
          </div>
        </Card>

        <Card className="flex flex-col justify-center text-center">
          <div className="w-10 h-10 rounded-xl bg-[#FAFAF7] border border-[#E4E2D8] text-[#2E7D8C] flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-5 h-5" strokeWidth={2} />
          </div>
          <div className="font-mono text-3xl font-bold text-[#16233D]">{report.passed}</div>
          <div className="font-mono text-[11px] font-semibold text-[#8A93A6] uppercase tracking-wider mt-1">Rules Passed</div>
        </Card>

        <Card className="flex flex-col justify-center text-center">
          <div className="w-10 h-10 rounded-xl bg-[#FAFAF7] border border-[#E4E2D8] text-[#C9762E] flex items-center justify-center mx-auto mb-3">
            <XCircle className="w-5 h-5" strokeWidth={2} />
          </div>
          <div className="font-mono text-3xl font-bold text-[#16233D]">{report.failed}</div>
          <div className="font-mono text-[11px] font-semibold text-[#8A93A6] uppercase tracking-wider mt-1">Rules Failed</div>
        </Card>

        <Card className="flex flex-col justify-center text-center">
          <div className="w-10 h-10 rounded-xl bg-[#FAFAF7] border border-[#E4E2D8] text-[#39A0B0] flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-5 h-5" strokeWidth={2} />
          </div>
          <div className="font-mono text-3xl font-bold text-[#16233D]">{report.warnings}</div>
          <div className="font-mono text-[11px] font-semibold text-[#8A93A6] uppercase tracking-wider mt-1">Warnings / Advisories</div>
        </Card>
      </div>

      {/* Filter Tabs & Rule Table */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E4E2D8]">
          <div>
            <h3 className="font-heading text-lg font-bold text-[#16233D] tracking-tight flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#2E7D8C]" strokeWidth={1.8} />
              <span>SEBI ICDR Rule Execution Report</span>
            </h3>
            <p className="font-sans text-xs text-[#4A5568] mt-0.5">
              Deterministic mathematical and logical verification without LLM hallucination
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#FAFAF7] border border-[#E4E2D8] self-start">
            {(['all', 'pass', 'fail', 'warning'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold capitalize transition-all ${
                  filter === t 
                    ? 'bg-[#16233D] text-white shadow-subtle' 
                    : 'text-[#4A5568] hover:text-[#16233D]'
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
              <tr className="border-b border-[#E4E2D8] font-mono text-[11px] font-bold uppercase tracking-wider text-[#8A93A6] bg-[#FAFAF7]">
                <th className="py-3 px-4 rounded-l-xl">Rule Code</th>
                <th className="py-3 px-4">Regulation Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 rounded-r-xl">Execution Evidence & Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E2D8] font-sans text-sm">
              {filteredDetails.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8A93A6] font-mono text-xs">
                    No regulatory rules match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredDetails.map((rule, idx) => (
                  <tr key={idx} className="hover:bg-[#FAFAF7]/60 transition-colors">
                    <td className="py-4 px-4 font-mono text-xs font-bold text-[#2E7D8C] whitespace-nowrap">
                      {rule.rule_code}
                    </td>
                    <td className="py-4 px-4 font-medium text-[#16233D] max-w-md">
                      {rule.rule_text}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-[#FAFAF7] text-[#4A5568] capitalize font-medium border border-[#E4E2D8]">
                        {rule.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`font-mono text-[11px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider ${
                        rule.severity === 'mandatory' ? 'text-[#C9762E] bg-[#FAFAF7] border border-[#C9762E]/30' : 'text-[#39A0B0] bg-[#FAFAF7] border border-[#39A0B0]/30'
                      }`}>
                        {rule.severity}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <Badge variant={rule.status === 'pass' ? 'pass' : rule.status === 'fail' ? 'fail' : 'warning'}>
                        {rule.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-[#16233D] bg-[#FAFAF7] rounded-xl p-3 max-w-sm border border-[#E4E2D8]">
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
