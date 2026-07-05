import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  History, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowLeft, 
  Lock, 
  RefreshCw, 
  FileText, 
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

  if (loading) return <div className="h-96 rounded-3xl bg-slate-800/40 animate-pulse border border-white/5" />;
  if (!project) return <div className="text-center py-20 text-slate-400">Project not found.</div>;

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
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Cryptographic Audit Trail</span>
              <span className="text-xs text-slate-500 font-mono">· SHA-256 Chained</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Tamper-Evident Action Log</h1>
          </div>
        </div>

        <button
          onClick={loadAuditData}
          className="px-5 py-2.5 rounded-xl text-sm font-bold bg-card hover:bg-card-hover border border-white/10 text-white transition-all flex items-center gap-2 shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Verify Hash Chain</span>
        </button>
      </div>

      {/* Hash Verification Status Banner */}
      <Card glass className={`p-6 border-2 ${verification?.valid ? 'border-emerald-500/40 bg-gradient-to-r from-emerald-950/30 to-transparent' : 'border-rose-500/40 bg-gradient-to-r from-rose-950/30 to-transparent'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
              verification?.valid ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}>
              {verification?.valid ? <ShieldCheck className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-base font-black tracking-tight ${verification?.valid ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {verification?.valid ? 'CRYPTOGRAPHIC HASH CHAIN VERIFIED' : 'TAMPERING DETECTED / CHAIN BROKEN!'}
                </span>
                <Badge variant={verification?.valid ? 'pass' : 'fail'} className="text-[10px] font-mono">
                  SHA-256
                </Badge>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {verification?.valid 
                  ? `All ${verification.entries_checked} audit entries are cryptographically linked and immutable. Zero data tampering detected.`
                  : `Warning! ${verification?.breaks.length} chain break(s) found in the log history. Regulatory integrity compromised.`}
              </p>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-slate-400">
            <div>Checked Entries: <span className="text-white font-bold">{verification?.entries_checked || 0}</span></div>
            <div>Algorithm: <span className="text-cyan-400 font-bold">SHA-256 Hash Chain</span></div>
          </div>
        </div>
      </Card>

      {/* Timeline List */}
      <Card glass>
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <History className="w-5 h-5 text-cyan-400" />
              <span>Activity Timeline & Cryptographic Hashes</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Each action calculates a SHA-256 hash incorporating the previous entry's hash, forming an immutable ledger
            </p>
          </div>
          <Badge variant="info" className="font-mono">{logs.length} Total Events</Badge>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No audit logs recorded for this filing yet.</div>
        ) : (
          <div className="relative pl-6 border-l-2 border-slate-800 space-y-8 ml-3 my-4">
            {logs.map((log) => (
              <div key={log.id} className="relative group">
                {/* Timeline dot */}
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-800 border-2 border-cyan-400 group-hover:scale-125 transition-transform" />

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-white/15 transition-all space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white capitalize">
                        {log.action.replace(/_/g, ' ')}
                      </span>
                      {log.entity_type && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono uppercase">
                          {log.entity_type}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        {log.actor_name || 'System'}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {log.details && Object.keys(log.details).length > 0 && (
                    <div className="text-xs text-slate-300 bg-slate-950/50 p-2.5 rounded-xl font-mono border border-white/5">
                      {JSON.stringify(log.details, null, 2)}
                    </div>
                  )}

                  {/* Hash Footer */}
                  <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-slate-500">
                    <div className="flex items-center gap-1.5 truncate">
                      <LinkIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="text-slate-400">Hash:</span>
                      <span className="text-cyan-300 truncate">{log.content_hash}</span>
                    </div>
                    <div className="truncate text-slate-600">
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
