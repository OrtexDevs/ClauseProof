import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Scale, FileText, History, ArrowRight, CheckCircle2, Sparkles, Activity } from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] bg-transparent text-[#0B1120] font-sans flex flex-col relative overflow-hidden">
      {/* Nav */}
      <nav className="w-full px-6 lg:px-10 py-6 flex items-center justify-between relative z-10 border-b border-[#DCE0D6] glass-header">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0B1120] flex items-center justify-center text-white font-bold shadow-card shrink-0">
            <Scale className="w-4 h-4" strokeWidth={2.2} />
          </div>
          <span className="font-heading text-lg font-extrabold tracking-tight text-[#0B1120] flex items-center gap-2">
            ClauseProof
            <span className="font-mono text-xs uppercase tracking-widest text-[#086F83] font-bold px-2.5 py-0.5 rounded-md border border-[#DCE0D6] bg-white shadow-subtle flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#086F83] animate-pulse" />
              SEBI 2026
            </span>
          </span>
        </div>
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => navigate('/auth?mode=login')}
            className="px-4.5 py-2 rounded-xl text-xs font-mono font-bold bg-white border border-[#DCE0D6] text-[#25314C] hover:text-[#0B1120] hover:border-[#086F83]/60 shadow-subtle transition-all btn-press"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/auth?mode=register')}
            className="px-5 py-2.5 rounded-xl text-xs font-mono font-extrabold bg-[#0B1120] text-white hover:bg-[#086F83] shadow-card transition-all flex items-center gap-2 btn-press"
          >
            Get Started <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.2} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 w-full px-6 lg:px-10 py-16 lg:py-24 relative z-10 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 stagger-fade-up" style={{ '--i': 1 } as React.CSSProperties}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-[#DCE0D6] font-mono text-xs uppercase tracking-widest text-[#086F83] font-extrabold mb-6 shadow-subtle">
              <Sparkles className="w-3.5 h-3.5 text-[#086F83]" strokeWidth={2.2} />
              <span>SEBI Securities Market TechSprint // RegTech OS</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-[#0B1120] max-w-xl mb-6">
              Compliance-as-Code for SME IPO Filings
            </h1>

            <p className="font-sans text-base sm:text-lg font-medium text-[#25314C] leading-relaxed max-w-[54ch] mb-9">
              Turn Draft Red Herring Prospectus preparation from an opaque, intermediary-heavy manual process into a transparent, deterministic, and cryptographically auditable compliance OS.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => navigate('/auth?mode=register')}
                className="px-6.5 py-4 rounded-xl text-xs font-mono font-extrabold uppercase tracking-wider bg-[#0B1120] text-white hover:bg-[#086F83] shadow-card transition-all flex items-center justify-center gap-2 btn-press"
              >
                Launch Workspace <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6.5 py-4 rounded-xl text-xs font-mono font-extrabold uppercase tracking-wider bg-white border border-[#DCE0D6] text-[#25314C] hover:border-[#086F83]/60 hover:text-[#0B1120] shadow-subtle transition-all text-center btn-press"
              >
                Explore Live Demo
              </button>
            </div>

            <div className="mt-10 pt-8 border-t border-[#DCE0D6] flex flex-wrap items-center gap-6 font-mono text-xs text-[#25314C]">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#086F83]" strokeWidth={2.2} /> 18+ Deterministic Rules
              </div>
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#0B8CA5]" strokeWidth={2.2} /> SHA-256 Audit Ledger
              </div>
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#C2590E]" strokeWidth={2.2} /> Schedule VI Aligned
              </div>
            </div>
          </div>

          {/* Right visual — stats showcase with card-interactive */}
          <div className="lg:col-span-5 space-y-4 stagger-fade-up" style={{ '--i': 2 } as React.CSSProperties}>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-xl bg-white border border-[#DCE0D6] shadow-card card-interactive cursor-default">
                <div className="font-mono text-3xl font-extrabold tracking-tight text-[#0B1120]">100%</div>
                <div className="font-mono text-xs font-extrabold text-[#086F83] mt-2 uppercase tracking-wider">SEBI ICDR Aligned</div>
                <div className="font-sans text-xs font-semibold text-[#4B5A7A] mt-1 leading-normal">Schedule VI Part A automated mapping</div>
              </div>

              <div className="p-6 rounded-xl bg-white border border-[#DCE0D6] shadow-card card-interactive cursor-default">
                <div className="font-mono text-3xl font-extrabold tracking-tight text-[#0B1120]">18+</div>
                <div className="font-mono text-xs font-extrabold text-[#0B8CA5] mt-2 uppercase tracking-wider">Deterministic Rules</div>
                <div className="font-sans text-xs font-semibold text-[#4B5A7A] mt-1 leading-normal">Provable mathematical verification</div>
              </div>

              <div className="p-6 rounded-xl bg-white border border-[#DCE0D6] shadow-card card-interactive cursor-default">
                <div className="font-mono text-3xl font-extrabold tracking-tight text-[#0B1120]">SHA-256</div>
                <div className="font-mono text-xs font-extrabold text-[#086F83] mt-2 uppercase tracking-wider">Crypto Audit Chain</div>
                <div className="font-sans text-xs font-semibold text-[#4B5A7A] mt-1 leading-normal">Tamper-evident hash ledger</div>
              </div>

              <div className="p-6 rounded-xl bg-white border border-[#DCE0D6] shadow-card card-interactive cursor-default">
                <div className="font-mono text-3xl font-extrabold tracking-tight text-[#0B1120]">RBAC</div>
                <div className="font-mono text-xs font-extrabold text-[#C2590E] mt-2 uppercase tracking-wider">Multi-Party Review</div>
                <div className="font-sans text-xs font-semibold text-[#4B5A7A] mt-1 leading-normal">Promoter, Banker & Legal workflow</div>
              </div>
            </div>

            <div className="p-5 rounded-xl glass-panel flex items-center justify-between shadow-subtle border border-[#DCE0D6]">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-[#086F83] animate-pulse" strokeWidth={2.2} />
                <div>
                  <div className="font-heading text-xs font-extrabold text-[#0B1120]">Live Sandbox Environment</div>
                  <div className="font-mono text-[11px] font-bold text-[#4B5A7A]">Zero-latency local compliance validation</div>
                </div>
              </div>
              <span className="font-mono text-[11px] font-extrabold px-2.5 py-1 rounded bg-[#086F83]/15 text-[#086F83] border border-[#086F83]/30 uppercase">Active</span>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="mt-24 pt-16 border-t border-[#DCE0D6] space-y-12 stagger-fade-up" style={{ '--i': 3 } as React.CSSProperties}>
          <div>
            <div className="font-mono text-xs uppercase tracking-widest font-extrabold text-[#086F83] mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#086F83]" />
              SECTION // REGULATORY ARCHITECTURE
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0B1120] tracking-tight">
              Deterministic RegTech Infrastructure
            </h2>
            <p className="font-sans text-sm font-medium text-[#25314C] max-w-2xl mt-2 leading-relaxed">
              Every single check is mathematically verified against the SEBI (Issue of Capital and Disclosure Requirements) Regulations, 2026 with zero LLM hallucination risk.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-xl bg-white border border-[#DCE0D6] shadow-card card-interactive cursor-default">
              <div className="w-11 h-11 rounded-xl bg-[#EEF0EB] border border-[#DCE0D6] flex items-center justify-center text-[#086F83] mb-6 shadow-subtle">
                <ShieldCheck className="w-5 h-5" strokeWidth={2.2} />
              </div>
              <h3 className="font-heading text-lg font-extrabold text-[#0B1120] mb-2.5">Deterministic Rule Engine</h3>
              <p className="font-sans text-xs font-medium text-[#25314C] leading-relaxed">
                Provable compliance validation against 18+ SEBI ICDR 2026 regulations. Pure mathematical verification checking EBITDA thresholds, capital corridors, and OFS limits.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-white border border-[#DCE0D6] shadow-card card-interactive cursor-default">
              <div className="w-11 h-11 rounded-xl bg-[#EEF0EB] border border-[#DCE0D6] flex items-center justify-center text-[#0B8CA5] mb-6 shadow-subtle">
                <FileText className="w-5 h-5" strokeWidth={2.2} />
              </div>
              <h3 className="font-heading text-lg font-extrabold text-[#0B1120] mb-2.5">Delta Wizard Editor</h3>
              <p className="font-sans text-xs font-medium text-[#25314C] leading-relaxed">
                Section-by-section DRHP drafting aligned with Schedule VI, Part A. Built-in regulatory guidance across all 18 mandatory sections with real-time validation feedback.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-white border border-[#DCE0D6] shadow-card card-interactive cursor-default">
              <div className="w-11 h-11 rounded-xl bg-[#EEF0EB] border border-[#DCE0D6] flex items-center justify-center text-[#C2590E] mb-6 shadow-subtle">
                <History className="w-5 h-5" strokeWidth={2.2} />
              </div>
              <h3 className="font-heading text-lg font-extrabold text-[#0B1120] mb-2.5">Hash-Chained Audit</h3>
              <p className="font-sans text-xs font-medium text-[#25314C] leading-relaxed">
                SHA-256 hash chains linking every edit and cryptographic sign-off. Tamper-evident logging ensuring audit trail integrity across Promoter, Legal, and Banker roles.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 lg:px-10 py-8 border-t border-[#DCE0D6] font-mono text-xs font-bold text-[#4B5A7A] relative z-10 bg-[#EEF0EB]/50 backdrop-blur-sm">
        <div className="max-w-[1440px] mx-auto w-full flex flex-col sm:flex-row items-center justify-between">
          <span>2026 ClauseProof // SEBI Securities Market TechSprint</span>
          <div className="flex items-center gap-6 mt-4 sm:mt-0 text-[#0B1120] font-extrabold">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#086F83] animate-pulse" /> Compliance-as-Code</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#0B8CA5]" /> Indian Data Localization</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
