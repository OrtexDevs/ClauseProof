import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Scale, 
  Sparkles, 
  FileText, 
  History, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Award,
  Lock,
  Zap
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-between">
      {/* Background Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: '4s' }} />

      {/* Top Nav */}
      <nav className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-glow">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white">ClauseProof</span>
            <span className="ml-2 text-[10px] uppercase font-bold tracking-widest bg-primary/20 text-indigo-300 px-2 py-0.5 rounded-full border border-primary/30">
              SEBI TechSprint
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/auth?mode=login')}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate('/auth?mode=register')}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto w-full px-6 py-16 text-center">
        <Badge variant="primary" className="mb-6 py-1 px-4 text-xs font-bold uppercase tracking-wider animate-bounce">
          <Award className="w-3.5 h-3.5 inline mr-1 text-amber-400" /> SEBI Securities Market TechSprint — Problem Statement 4
        </Badge>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight md:leading-none mb-6">
          Compliance-as-Code for <br className="hidden md:inline" />
          <span className="text-gradient">SME IPO Offer Documents</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed mb-10">
          Transforming Draft Red Herring Prospectus (DRHP) drafting from an opaque, intermediary-heavy process into a transparent, deterministic, and auditable compliance operating system.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button 
            onClick={() => navigate('/auth?mode=register')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 text-white shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>Launch Compliance Workspace</span>
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold bg-card/80 hover:bg-card border border-white/10 text-slate-200 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>Explore Demo Dashboard</span>
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Core Pillars Grid */}
        <div className="grid md:grid-cols-3 gap-6 text-left">
          <Card glass glow className="p-8 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Deterministic Rule Engine</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Provable compliance validation against 18+ SEBI ICDR 2025 regulations. Pure mathematical and logical verification without LLM hallucination risks.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>EBITDA, OFS & GCP Cap Checks</span>
            </div>
          </Card>

          <Card glass glow className="p-8 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Delta Wizard Editor</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Section-by-section DRHP drafting aligned with SEBI Schedule VI, Part A. Built-in regulatory guidance for promoters and automated table of contents.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400">
              <Sparkles className="w-4 h-4" />
              <span>18 Mandatory Schedule VI Sections</span>
            </div>
          </Card>

          <Card glass glow className="p-8 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform">
              <History className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Hash-Chained Audit Trail</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Cryptographic SHA-256 hash chains linking every disclosure edit and digital sign-off. Tamper-evident logging ensuring regulatory integrity.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-pink-400">
              <Lock className="w-4 h-4" />
              <span>Immutable Regulatory Sign-Offs</span>
            </div>
          </Card>
        </div>

        {/* Feature Highlights Bar */}
        <div className="mt-16 pt-12 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-black text-white mb-1">100%</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">SEBI ICDR Aligned</div>
          </div>
          <div>
            <div className="text-3xl font-black text-white mb-1">18+</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Deterministic Rules</div>
          </div>
          <div>
            <div className="text-3xl font-black text-white mb-1">SHA-256</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cryptographic Audit</div>
          </div>
          <div>
            <div className="text-3xl font-black text-white mb-1">Multi-Role</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Promoter & Banker Review</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
        <div>
          © 2026 ClauseProof RegTech Platform. Designed for SEBI Securities Market TechSprint.
        </div>
        <div className="flex items-center gap-6 mt-4 md:mt-0 font-medium">
          <span className="flex items-center gap-1 text-slate-400"><Zap className="w-3.5 h-3.5 text-amber-400" /> Compliance-as-Code</span>
          <span className="flex items-center gap-1 text-slate-400"><Users className="w-3.5 h-3.5 text-indigo-400" /> Multi-Party Review</span>
          <span className="flex items-center gap-1 text-slate-400"><Lock className="w-3.5 h-3.5 text-emerald-400" /> Indian Data Localization</span>
        </div>
      </footer>
    </div>
  );
};
