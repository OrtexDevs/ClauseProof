import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, 
  ShieldCheck, 
  UserCheck, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Plus, 
  FileSignature, 
  Building2,
  Lock
} from 'lucide-react';
import { apiService } from '../services/api';
import { Project, SignOff, User } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const Workspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [signoffs, setSignoffs] = useState<SignOff[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [signing, setSigning] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');

  const loadWorkspaceData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [projData, signData] = await Promise.all([
        apiService.getProject(id),
        apiService.getSignOffs(id)
      ]);
      setProject(projData);
      setSignoffs(signData);
      setCurrentUser(apiService.getCurrentUser());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspaceData();
  }, [id]);

  const handleSignOff = async (status: 'approved' | 'rejected') => {
    if (!project) return;
    setSigning(true);
    try {
      await apiService.createSignOff(project.id, undefined, status, comment || `${status === 'approved' ? 'Approved' : 'Rejected'} by ${currentUser?.name}`);
      setComment('');
      await loadWorkspaceData();
    } finally {
      setSigning(false);
    }
  };

  if (loading) return <div className="h-96 rounded-3xl bg-[#EFE9E3] animate-pulse border border-[#D9CFC7]" />;
  if (!project) return <div className="text-center py-20 text-[#78716c]">Project not found.</div>;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/project/${project.id}`)}
            className="w-10 h-10 rounded-xl bg-card border border-[#D9CFC7] flex items-center justify-center text-[#78716c] hover:text-[#44403c] transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#b39d82] uppercase tracking-wider">Multi-Party Collaboration</span>
              <span className="text-xs text-[#a8a29e] font-mono">· Digital Sign-Offs</span>
            </div>
            <h1 className="text-2xl font-black text-[#1c1917] tracking-tight">IPO Workspace & Approvals</h1>
          </div>
        </div>
      </div>

      {/* Role & Sign-Off Workflow Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Active Team Members (2 cols) */}
        <Card glass className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#D9CFC7]">
            <div>
              <h3 className="text-lg font-bold text-[#1c1917] tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5 text-[#b39d82]" />
                <span>Multi-Party IPO Review Team</span>
              </h3>
              <p className="text-xs text-[#78716c] mt-0.5">
                Role-based review hierarchy across Promoters, Merchant Bankers, and Legal Counsel
              </p>
            </div>
            <Badge variant="primary">3 Roles Mapped</Badge>
          </div>

          <div className="space-y-3">
            {/* Promoter */}
            <div className="p-4 rounded-2xl bg-[#EFE9E3] border border-[#D9CFC7] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EFE9E3] text-[#b39d82] flex items-center justify-center font-bold text-sm shrink-0">
                  RK
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1c1917]">Rajesh Kumar</div>
                  <div className="text-xs text-[#78716c] flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-[#a8a29e]" />
                    <span>TechVista Solutions Pvt Ltd</span>
                  </div>
                </div>
              </div>
              <Badge variant="primary" className="uppercase text-[10px]">Promoter / Issuer</Badge>
            </div>

            {/* Merchant Banker */}
            <div className="p-4 rounded-2xl bg-[#EFE9E3] border border-[#D9CFC7] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EFE9E3] text-[#b39d82] flex items-center justify-center font-bold text-sm shrink-0">
                  VS
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1c1917]">Vikram Sharma (Lead Manager)</div>
                  <div className="text-xs text-[#78716c] flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-[#a8a29e]" />
                    <span>Apex Capital Advisors Ltd</span>
                  </div>
                </div>
              </div>
              <Badge variant="info" className="uppercase text-[10px]">Merchant Banker</Badge>
            </div>

            {/* Legal Counsel */}
            <div className="p-4 rounded-2xl bg-[#EFE9E3] border border-[#D9CFC7] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EFE9E3] text-[#b39d82] flex items-center justify-center font-bold text-sm shrink-0">
                  AD
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1c1917]">Adv. Ananya Desai</div>
                  <div className="text-xs text-[#78716c] flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-[#a8a29e]" />
                    <span>LexCorp Advocates & Solicitors</span>
                  </div>
                </div>
              </div>
              <Badge variant="warning" className="uppercase text-[10px]">Legal Counsel</Badge>
            </div>
          </div>
        </Card>

        {/* Right: Execute Sign-Off (1 col) */}
        <Card glass className="flex flex-col justify-between border-[#D9CFC7] bg-gradient-to-b from-purple-950/20 to-transparent">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-[#8c7a65] mb-3 pb-3 border-b border-[#D9CFC7]">
              <FileSignature className="w-5 h-5 text-[#b39d82]" />
              <span>Digital Sign-Off Stamping</span>
            </div>
            <p className="text-xs text-[#44403c] leading-relaxed mb-4">
              Execute your formal approval for this DRHP filing. Your digital signature will be cryptographically hashed and recorded into the SHA-256 audit ledger.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                Approval Comments / Notes
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="e.g. Reviewed financial statements and Schedule VI disclosures. Approved for SEBI submission."
                className="w-full h-24 p-3 rounded-xl bg-white border border-[#D9CFC7] text-[#1c1917] text-xs focus:outline-none focus:border-[#C9B59C] resize-none"
              />
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-[#D9CFC7]">
            <button
              onClick={() => handleSignOff('approved')}
              disabled={signing}
              className="w-full py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-glow hover:shadow-glow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve & Sign DRHP Filing</span>
            </button>
            <button
              onClick={() => handleSignOff('rejected')}
              disabled={signing}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              <span>Request Revisions / Reject</span>
            </button>
          </div>
        </Card>
      </div>

      {/* Sign-Off History Table */}
      <Card glass>
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#D9CFC7]">
          <div>
            <h3 className="text-lg font-bold text-[#1c1917] tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Cryptographic Sign-Off History</span>
            </h3>
            <p className="text-xs text-[#78716c] mt-0.5">
              Immutable record of all stakeholder approvals stamped with SHA-256 signatures
            </p>
          </div>
          <Badge variant="info" className="font-mono">{signoffs.length} Sign-Offs Recorded</Badge>
        </div>

        {signoffs.length === 0 ? (
          <div className="text-center py-12 text-[#78716c]">No digital sign-offs executed yet. Use the panel above to submit your approval.</div>
        ) : (
          <div className="space-y-3">
            {signoffs.map((s) => (
              <div key={s.id} className="p-4 rounded-2xl bg-[#EFE9E3] border border-[#D9CFC7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    s.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {s.status === 'approved' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#1c1917]">{s.signer_name || 'Rajesh Kumar'}</span>
                      <Badge variant={s.status === 'approved' ? 'pass' : 'fail'} className="text-[10px] uppercase font-mono">
                        {s.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-[#78716c] capitalize mt-0.5 font-mono">
                      Role: {s.signer_role.replace('_', ' ')}
                    </div>
                    {s.comments && (
                      <p className="text-xs text-[#44403c] mt-2 bg-[#EFE9E3] p-2 rounded-lg border border-[#D9CFC7] max-w-2xl">
                        "{s.comments}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0 text-xs font-mono text-[#a8a29e] border-t sm:border-t-0 pt-2 sm:pt-0 border-[#D9CFC7]">
                  <div className="text-[#b39d82] font-bold flex items-center sm:justify-end gap-1">
                    <Lock className="w-3 h-3" />
                    <span>{s.digital_signature}</span>
                  </div>
                  <div className="text-[#a8a29e] mt-0.5">
                    {new Date(s.signed_at || s.created_at).toLocaleString()}
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
