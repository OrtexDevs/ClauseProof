import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Scale, ArrowRight, Building2, UserCheck, Shield, Lock, Mail, Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        await apiService.register(email, password, name, role, organization);
      } else {
        await apiService.login(email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full px-4 py-3 rounded-xl bg-white border border-[#E4E2D8] text-sm text-[#16233D] placeholder-[#8A93A6] focus:outline-none focus:border-[#2E7D8C] focus:ring-2 focus:ring-[#2E7D8C]/10 transition-all font-sans input-enhanced';

  return (
    <div className="min-h-[100dvh] bg-transparent text-[#16233D] font-sans flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#2E7D8C]/5 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#C9762E]/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-xl animate-scale-in relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-[#16233D] to-[#2E7D8C] items-center justify-center text-white shadow-elevated mb-4 hover-lift">
            <Scale className="w-8 h-8" strokeWidth={1.8} />
          </div>
          <h2 className="font-heading text-3xl font-bold text-[#16233D] tracking-tight">
            {mode === 'login' ? 'Welcome to ClauseProof' : 'Initialize Workspace'}
          </h2>
          <p className="font-mono text-xs text-[#4A5568] mt-2 uppercase tracking-wider">
            {mode === 'login' ? 'Deterministic SEBI ICDR 2025 compliance' : 'Set up your SME IPO drafting profile'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 border border-[#E4E2D8] shadow-elevated relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2E7D8C] to-[#39A0B0]" />
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[#C9762E]/10 border border-[#C9762E]/30 text-[#C9762E] font-mono text-xs font-semibold flex items-center gap-3 animate-scale-in">
              <div className="w-8 h-8 rounded-lg bg-[#C9762E]/20 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-[#C9762E]" strokeWidth={2} />
              </div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block font-mono text-[11px] font-semibold text-[#4A5568] uppercase tracking-wider mb-2">Full Name</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className={inputCls} placeholder="Enter your full name" />
                </div>
                <div>
                  <label className="block font-mono text-[11px] font-semibold text-[#4A5568] uppercase tracking-wider mb-2">Organization</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-[#8A93A6] absolute left-4 top-3.5" strokeWidth={1.8} />
                    <input type="text" value={organization} onChange={e => setOrganization(e.target.value)} className={inputCls + ' pl-11'} placeholder="Company name" />
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-[11px] font-semibold text-[#4A5568] uppercase tracking-wider mb-2">Role</label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-[#8A93A6] absolute left-4 top-3.5" strokeWidth={1.8} />
                    <select value={role} onChange={e => setRole(e.target.value as UserRole)} className={inputCls + ' pl-11 appearance-none bg-white cursor-pointer'}>
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
              <label className="block font-mono text-[11px] font-semibold text-[#4A5568] uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8A93A6] absolute left-4 top-3.5" strokeWidth={1.8} />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className={inputCls + ' pl-11'} placeholder="you@company.com" />
              </div>
            </div>
            <div>
              <label className="block font-mono text-[11px] font-semibold text-[#4A5568] uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8A93A6] absolute left-4 top-3.5" strokeWidth={1.8} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className={inputCls + ' pl-11 pr-11'} 
                  placeholder="Enter your password" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-[#8A93A6] hover:text-[#16233D] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={1.8} /> : <Eye className="w-4 h-4" strokeWidth={1.8} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 rounded-xl text-sm font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-[#16233D] to-[#2E7D8C] text-white shadow-card transition-all flex items-center justify-center gap-2 disabled:opacity-50 btn-press hover:shadow-elevated"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <>
                  {mode === 'login' ? 'Sign In to Ledger' : 'Create Account'} 
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E4E2D8] text-center">
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="font-mono text-xs text-[#2E7D8C] hover:text-[#16233D] font-semibold transition-colors"
            >
              {mode === 'login' ? 'New user? Initialize an account' : 'Already registered? Sign In'}
            </button>
          </div>
        </div>

        {/* Demo hint */}
        <div className="mt-6 p-5 rounded-2xl bg-white border border-[#E4E2D8] text-center shadow-card hover-lift">
          <div className="font-mono text-xs font-semibold text-[#2E7D8C] flex items-center justify-center gap-2 mb-2 uppercase tracking-wider">
            <Shield className="w-4 h-4" strokeWidth={2} /> Pre-configured Demo Environment
          </div>
          <p className="font-sans text-xs text-[#4A5568]">Sign in with default credentials or register to test multi-role workflows.</p>
        </div>
      </div>
    </div>
  );
};
