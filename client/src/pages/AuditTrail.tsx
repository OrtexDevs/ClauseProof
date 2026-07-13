import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  History, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowLeft, 
  RefreshCw, 
  User, 
  Clock,
  Link as LinkIcon
} from 'lucide-react';
import { apiService } from '../services/api';
import { Project, AuditLog, AuditVerification } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const AuditTrail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [verification, setVerification] = useState<AuditVerification | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadAuditData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [projData, logsData, verifData] = await Promise.all([
        apiService.getProject(id),
        apiService.getAuditLogs(id),
        apiService.verifyAuditChain(id)
      ]);
      setProject(projData);
      setLogs(logsData.reverse()); // Newest first
      setVerification(verifData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditData();
  }, [id]);

  if (loading) return <div className="h-96 rounded-xl bg-white border border-[#E4E2D8] animate-pulse" />;
  if (!project) return <div className="text-center py-20 text-[#8A93A6] font-mono text-xs">Project not found.</div>;

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
              <span className="font-bold text-[#2E7D8C] uppercase tracking-wider">Cryptographic Audit Trail</span>
              <span className="text-[#8A93A6]">· SHA-256 Chained</span>
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-[#16233D]">Tamper-Evident Action Log</h1>
          </div>
        </div>

        <button
          onClick={loadAuditData}
          className="px-5 py-2.5 rounded-xl text-xs font-mono font-medium uppercase tracking-wider bg-[#16233D] hover:-translate-y-0.5 hover:shadow-subtle text-white transition-all flex items-center gap-2 shrink-0"
        >
          <RefreshCw className="w-4 h-4" strokeWidth={2} />
          <span>Verify Hash Chain</span>
        </button>
      </div>

      {/* Hash Verification Status Banner */}
      <Card className={`p-6 border ${verification?.valid ? 'border-[#2E7D8C]/50 bg-[#FAFAF7]' : 'border-[#C9762E]/50 bg-[#FAFAF7]'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border border-[#E4E2D8] bg-white ${
              verification?.valid ? 'text-[#2E7D8C]' : 'text-[#C9762E]'
            }`}>
              {verification?.valid ? <ShieldCheck className="w-7 h-7" strokeWidth={1.8} /> : <AlertTriangle className="w-7 h-7" strokeWidth={1.8} />}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className={`font-heading text-base font-bold tracking-tight ${verification?.valid ? 'text-[#2E7D8C]' : 'text-[#C9762E]'}`}>
                  {verification?.valid ? 'CRYPTOGRAPHIC HASH CHAIN VERIFIED' : 'TAMPERING DETECTED / CHAIN BROKEN!'}
                </span>
                <Badge variant={verification?.valid ? 'pass' : 'fail'} className="text-[10px]">
                  SHA-256
                </Badge>
              </div>
              <p className="font-sans text-xs text-[#4A5568] mt-1 leading-relaxed">
                {verification?.valid 
                  ? `All ${verification.entries_checked} audit entries are cryptographically linked and immutable. Zero data tampering detected.`
                  : `Warning! ${verification?.breaks.length} chain break(s) found in the log history. Regulatory integrity compromised.`}
              </p>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-[#8A93A6] space-y-1">
            <div>Checked Entries: <span className="text-[#16233D] font-bold">{verification?.entries_checked || 0}</span></div>
            <div>Algorithm: <span className="text-[#2E7D8C] font-bold">SHA-256 Hash Chain</span></div>
          </div>
        </div>
      </Card>

      {/* Timeline List */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-[#E4E2D8] gap-2">
          <div>
            <h3 className="font-heading text-lg font-bold text-[#16233D] tracking-tight flex items-center gap-2">
              <History className="w-5 h-5 text-[#2E7D8C]" strokeWidth={1.8} />
              <span>Activity Timeline & Cryptographic Hashes</span>
            </h3>
            <p className="font-sans text-xs text-[#4A5568] mt-0.5">
              Each action calculates a SHA-256 hash incorporating the previous entry's hash, forming an immutable ledger
            </p>
          </div>
          <Badge variant="info">{logs.length} Total Events</Badge>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-16 text-[#8A93A6] font-mono text-xs">No audit logs recorded for this filing yet.</div>
        ) : (
          <div className="relative pl-6 border-l-2 border-[#E4E2D8] space-y-6 ml-3 my-4">
            {logs.map((log) => (
              <div key={log.id} className="relative group">
                {/* Timeline dot */}
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-[#2E7D8C] group-hover:scale-125 transition-transform" />

                <div className="p-4 rounded-xl bg-[#FAFAF7] border border-[#E4E2D8] hover:border-[#8A93A6] transition-all space-y-2.5 shadow-subtle">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-heading text-sm font-bold text-[#16233D] capitalize">
                        {log.action.replace(/_/g, ' ')}
                      </span>
                      {log.entity_type && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-[#E4E2D8] text-[#4A5568] font-mono uppercase font-semibold">
                          {log.entity_type}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#8A93A6] font-mono">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#8A93A6]" strokeWidth={1.8} />
                        <span className="text-[#16233D] font-medium">{log.actor_name || 'System'}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#8A93A6]" strokeWidth={1.8} />
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {log.details && Object.keys(log.details).length > 0 && (
                    <div className="font-mono text-xs text-[#4A5568] bg-white p-3 rounded-lg border border-[#E4E2D8] overflow-x-auto">
                      {JSON.stringify(log.details, null, 2)}
                    </div>
                  )}

                  {/* Hash Footer */}
                  <div className="pt-2.5 border-t border-[#E4E2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-[#8A93A6]">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <LinkIcon className="w-3.5 h-3.5 text-[#2E7D8C] shrink-0" strokeWidth={2} />
                      <span className="shrink-0">Hash:</span>
                      <span className="text-[#2E7D8C] truncate font-semibold">{log.content_hash}</span>
                    </div>
                    <div className="truncate shrink-0 text-[#8A93A6]">
                      Prev: {log.previous_hash.substring(0, 16)}...
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
