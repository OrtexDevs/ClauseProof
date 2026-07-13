import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
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

  if (loading) return <div className="h-96 rounded-2xl bg-white border border-[#E4E2D8] animate-pulse" />;
  if (!project) return <div className="text-center py-20 text-[#8A93A6] font-mono text-xs">Project not found.</div>;

  return (
    <div className="space-y-8 text-[#16233D]">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E4E2D8]">
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => navigate(`/project/${project.id}`)}
            className="w-10 h-10 rounded-xl bg-white border border-[#E4E2D8] flex items-center justify-center text-[#4A5568] hover:text-[#16233D] hover:border-[#2E7D8C]/50 transition-all shadow-subtle hover:shadow-card"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="font-bold text-[#2E7D8C] uppercase tracking-wider">Multi-Party Collaboration</span>
              <span className="text-[#8A93A6]">· Digital Sign-Offs</span>
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-[#16233D]">IPO Workspace & Approvals</h1>
          </div>
        </div>
      </div>

      {/* Role & Sign-Off Workflow Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Active Team Members (2 cols) */}
        <Card className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E4E2D8]">
            <div>
              <h3 className="font-heading text-lg font-bold text-[#16233D] tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5 text-[#2E7D8C]" strokeWidth={1.8} />
                <span>Multi-Party IPO Review Team</span>
              </h3>
              <p className="font-sans text-xs text-[#4A5568] mt-0.5">
                Role-based review hierarchy across Promoters, Merchant Bankers, and Legal Counsel
              </p>
            </div>
            <Badge variant="primary">3 Roles Mapped</Badge>
          </div>

          <div className="space-y-3">
            {/* Promoter */}
            <div className="p-4 rounded-xl bg-[#FAFAF7] border border-[#E4E2D8] flex items-center justify-between shadow-subtle hover:shadow-card transition-all">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#16233D] to-[#2E7D8C] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-card">
                  RK
                </div>
                <div>
                  <div className="font-heading text-sm font-bold text-[#16233D]">Rajesh Kumar</div>
                  <div className="font-sans text-xs text-[#4A5568] flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-[#8A93A6]" />
                    <span>TechVista Solutions Pvt Ltd</span>
                  </div>
                </div>
              </div>
              <Badge variant="primary">Promoter / Issuer</Badge>
            </div>

            {/* Merchant Banker */}
            <div className="p-4 rounded-xl bg-[#FAFAF7] border border-[#E4E2D8] flex items-center justify-between shadow-subtle hover:shadow-card transition-all">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2E7D8C] to-[#39A0B0] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-card">
                  VS
                </div>
                <div>
                  <div className="font-heading text-sm font-bold text-[#16233D]">Vikram Sharma (Lead Manager)</div>
                  <div className="font-sans text-xs text-[#4A5568] flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-[#8A93A6]" />
                    <span>Apex Capital Advisors Ltd</span>
                  </div>
                </div>
              </div>
              <Badge variant="info">Merchant Banker</Badge>
            </div>

            {/* Legal Counsel */}
            <div className="p-4 rounded-xl bg-[#FAFAF7] border border-[#E4E2D8] flex items-center justify-between shadow-subtle hover:shadow-card transition-all">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#39A0B0] to-[#2E7D8C] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-card">
                  AD
                </div>
                <div>
                  <div className="font-heading text-sm font-bold text-[#16233D]">Adv. Ananya Desai</div>
                  <div className="font-sans text-xs text-[#4A5568] flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-[#8A93A6]" />
                    <span>LexCorp Advocates & Solicitors</span>
                  </div>
                </div>
              </div>
              <Badge variant="warning">Legal Counsel</Badge>
            </div>
          </div>
        </Card>

        {/* Right: Execute Sign-Off (1 col) */}
        <Card className="flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2E7D8C] to-[#39A0B0]" />
          
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#2E7D8C] mb-3 pb-3 border-b border-[#E4E2D8] uppercase tracking-wider">
              <FileSignature className="w-4 h-4 text-[#2E7D8C]" strokeWidth={1.8} />
              <span>Digital Sign-Off Stamping</span>
            </div>
            <p className="font-sans text-xs text-[#4A5568] leading-relaxed mb-4">
              Execute your formal approval for this DRHP filing. Your digital signature will be cryptographically hashed and recorded into the SHA-256 audit ledger.
            </p>

            <div className="mb-4">
              <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#8A93A6] mb-1.5">
                Approval Comments / Notes
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="e.g. Reviewed financial statements and Schedule VI disclosures. Approved for SEBI submission."
                className="w-full h-24 p-3 rounded-xl bg-[#FAFAF7] border border-[#E4E2D8] text-[#16233D] placeholder-[#8A93A6] font-sans text-xs focus:outline-none focus:border-[#2E7D8C] focus:ring-2 focus:ring-[#2E7D8C]/10 resize-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-[#E4E2D8]">
            <button
              onClick={() => handleSignOff('approved')}
              disabled={signing}
              className="w-full py-3 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#16233D] to-[#2E7D8C] text-white shadow-card transition-all flex items-center justify-center gap-2 disabled:opacity-50 btn-press hover:shadow-elevated"
            >
              <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
              <span>Approve & Sign DRHP Filing</span>
            </button>
            <button
              onClick={() => handleSignOff('rejected')}
              disabled={signing}
              className="w-full py-3 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider bg-[#FAFAF7] hover:bg-white border border-[#C9762E]/40 text-[#C9762E] transition-all flex items-center justify-center gap-2 disabled:opacity-50 btn-press hover:shadow-card"
            >
              <XCircle className="w-4 h-4" strokeWidth={2} />
              <span>Request Revisions / Reject</span>
            </button>
          </div>
        </Card>
      </div>

      {/* Sign-Off History Table */}
      <Card>
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E4E2D8]">
          <div>
            <h3 className="font-heading text-lg font-bold text-[#16233D] tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#2E7D8C]" strokeWidth={1.8} />
              <span>Cryptographic Sign-Off History</span>
            </h3>
            <p className="font-sans text-xs text-[#4A5568] mt-0.5">
              Immutable record of all stakeholder approvals stamped with SHA-256 signatures
            </p>
          </div>
          <Badge variant="info">{signoffs.length} Sign-Offs Recorded</Badge>
        </div>

        {signoffs.length === 0 ? (
          <div className="text-center py-16 text-[#8A93A6] font-mono text-xs">No digital sign-offs executed yet. Use the panel above to submit your approval.</div>
        ) : (
          <div className="space-y-3">
            {signoffs.map((s) => (
              <div key={s.id} className="p-5 rounded-xl bg-[#FAFAF7] border border-[#E4E2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-subtle hover:shadow-card transition-all">
                <div className="flex items-start gap-4 min-w-0">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 mt-0.5 ${
                    s.status === 'approved' 
                      ? 'from-[#2E7D8C]/10 to-[#2E7D8C]/5 text-[#2E7D8C] border border-[#2E7D8C]/20' 
                      : 'from-[#C9762E]/10 to-[#C9762E]/5 text-[#C9762E] border border-[#C9762E]/20'
                  }`}>
                    {s.status === 'approved' ? <CheckCircle2 className="w-5 h-5" strokeWidth={2} /> : <XCircle className="w-5 h-5" strokeWidth={2} />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-sm font-bold text-[#16233D]">{s.signer_name || 'Rajesh Kumar'}</span>
                      <Badge variant={s.status === 'approved' ? 'pass' : 'fail'}>
                        {s.status}
                      </Badge>
                    </div>
                    <div className="font-mono text-xs text-[#8A93A6] capitalize mt-0.5">
                      Role: {s.signer_role.replace('_', ' ')}
                    </div>
                    {s.comments && (
                      <p className="font-sans text-xs text-[#4A5568] mt-2 bg-white p-3 rounded-xl border border-[#E4E2D8] max-w-2xl">
                        "{s.comments}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono text-xs text-[#8A93A6] border-t sm:border-t-0 pt-2 sm:pt-0 border-[#E4E2D8] space-y-1">
                  <div className="text-[#2E7D8C] font-semibold flex items-center sm:justify-end gap-1">
                    <Lock className="w-3 h-3" strokeWidth={2} />
                    <span>{s.digital_signature}</span>
                  </div>
                  <div className="text-[#8A93A6] text-[11px]">
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
