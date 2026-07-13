import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Scale, ArrowRight, Building2, UserCheck, Shield } from 'lucide-react';
import { apiService } from '../services/api';
import { UserRole } from '../types';

export const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>(searchParams.get('mode') === 'register' ? 'register' : 'login');
  const [email, setEmail] = useState('rajesh.kumar@techvista.in');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Rajesh Kumar');
  const [role, setRole] = useState<UserRole>('promoter');
  const [organization, setOrganization] = useState('TechVista Solutions Pvt Ltd');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiService.login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full px-4 py-2.5 rounded-xl bg-white border border-[#E4E2D8] text-sm text-[#16233D] placeholder-[#8A93A6] focus:outline-none focus:border-[#2E7D8C] focus:ring-1 focus:ring-[#2E7D8C]/20 transition-all font-sans';

  return (
    <div className="min-h-[100dvh] bg-[#FAFAF7] text-[#16233D] font-sans flex items-center justify-center p-6 relative overflow-hidden">
      <div className="w-full max-w-md animate-fade-up relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-xl bg-[#16233D] items-center justify-center text-white shadow-subtle mb-4">
            <Scale className="w-6 h-6" strokeWidth={2} />
          </div>
          <h2 className="font-heading text-2xl font-bold text-[#16233D] tracking-tight">
            {mode === 'login' ? 'Welcome to ClauseProof' : 'Initialize Workspace'}
          </h2>
          <p className="font-mono text-xs text-[#4A5568] mt-1.5 uppercase tracking-wider">
            {mode === 'login' ? 'Deterministic SEBI ICDR 2025 compliance' : 'Set up your SME IPO drafting profile'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl p-8 border border-[#E4E2D8] shadow-subtle">
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-[#C9762E]/10 border border-[#C9762E]/30 text-[#C9762E] font-mono text-xs font-semibold flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9762E] shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block font-mono text-[11px] font-semibold text-[#4A5568] uppercase tracking-wider mb-1.5">Full Name</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block font-mono text-[11px] font-semibold text-[#4A5568] uppercase tracking-wider mb-1.5">Organization</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-[#8A93A6] absolute left-3.5 top-3" strokeWidth={1.8} />
                    <input type="text" value={organization} onChange={e => setOrganization(e.target.value)} className={inputCls + ' pl-10'} />
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-[11px] font-semibold text-[#4A5568] uppercase tracking-wider mb-1.5">Role</label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-[#8A93A6] absolute left-3.5 top-3" strokeWidth={1.8} />
                    <select value={role} onChange={e => setRole(e.target.value as UserRole)} className={inputCls + ' pl-10 appearance-none bg-white'}>
                      <option value="promoter">Promoter / SME Issuer</option>
                      <option value="merchant_banker">Merchant Banker</option>
                      <option value="legal_counsel">Legal Counsel</option>
                      <option value="compliance_officer">Company Secretary</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block font-mono text-[11px] font-semibold text-[#4A5568] uppercase tracking-wider mb-1.5">Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block font-mono text-[11px] font-semibold text-[#4A5568] uppercase tracking-wider mb-1.5">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className={inputCls} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 rounded-xl text-xs font-mono font-medium uppercase tracking-wider bg-[#16233D] text-white hover:-translate-y-0.5 hover:shadow-subtle transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : <>{mode === 'login' ? 'Sign In to Ledger' : 'Create Account'} <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} /></>}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E4E2D8] text-center">
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="font-mono text-xs text-[#2E7D8C] hover:text-[#16233D] font-medium transition-colors"
            >
              {mode === 'login' ? 'New user? Initialize an account' : 'Already registered? Sign In'}
            </button>
          </div>
        </div>

        {/* Demo hint */}
        <div className="mt-4 p-4 rounded-xl bg-white border border-[#E4E2D8] text-center shadow-subtle">
          <div className="font-mono text-xs font-semibold text-[#2E7D8C] flex items-center justify-center gap-1.5 mb-1 uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" strokeWidth={2} /> Pre-configured Demo Environment
          </div>
          <p className="font-sans text-xs text-[#4A5568]">Sign in with default credentials or register to test multi-role workflows.</p>
        </div>
      </div>
    </div>
  );
};
