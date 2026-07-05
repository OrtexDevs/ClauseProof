import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Scale, Sparkles, ArrowRight, Building2, UserCheck, Shield } from 'lucide-react';
import { apiService } from '../services/api';
import { UserRole } from '../types';

export const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

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
      if (mode === 'login') {
        await apiService.login(email, password);
      } else {
        // Register simulation in local engine
        await apiService.login(email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-6">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: '3s' }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-glow mb-4">
            <Scale className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {mode === 'login' ? 'Welcome Back to ClauseProof' : 'Initialize RegTech Account'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {mode === 'login' ? 'Sign in to access your SME IPO compliance workspace' : 'Create your multi-party IPO document drafting profile'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Adv. Ananya Desai"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Organization / Legal Firm
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. LexCorp Advocates & Solicitors"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Role in IPO Lifecycle
                  </label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
                    >
                      <option value="promoter">Promoter / SME Issuer</option>
                      <option value="merchant_banker">Merchant Banker (Lead Manager)</option>
                      <option value="legal_counsel">Legal Counsel / Advisor</option>
                      <option value="compliance_officer">SEBI Compliance Officer</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Work Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to Workspace' : 'Create RegTech Profile'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-xs text-slate-400 hover:text-indigo-400 font-medium transition-colors"
            >
              {mode === 'login' 
                ? "New to ClauseProof? Create an account" 
                : "Already have a profile? Sign In"}
            </button>
          </div>
        </div>

        {/* Demo Credentials Hint */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-900/60 border border-white/5 text-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center justify-center gap-1.5 mb-1">
            <Shield className="w-3.5 h-3.5" /> Demo Environment Notice
          </div>
          <p className="text-xs text-slate-400">
            You can sign in directly with the default demo promoter credentials or register any email to test multi-role workflows.
          </p>
        </div>
      </div>
    </div>
  );
};
