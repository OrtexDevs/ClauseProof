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

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-between" style={{ backgroundColor: '#F9F8F6' }}>
      {/* Background Glows - warm champagne tones */}
      <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none animate-float" style={{ backgroundColor: 'rgba(201, 181, 156, 0.2)' }} />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none animate-float" style={{ backgroundColor: 'rgba(217, 207, 199, 0.25)', animationDelay: '2s' }} />
      <div className="absolute bottom-10 left-1/3 w-96 h-96 rounded-full blur-3xl pointer-events-none animate-float" style={{ backgroundColor: 'rgba(239, 233, 227, 0.4)', animationDelay: '4s' }} />

      {/* Top Nav */}
      <nav className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between" style={{ borderBottom: '1px solid #D9CFC7' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-glow" style={{ background: 'linear-gradient(135deg, #C9B59C, #a69279)' }}>
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight" style={{ color: '#1c1917' }}>ClauseProof</span>
            <span className="ml-2 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full" style={{ backgroundColor: '#EFE9E3', color: '#8c7a65', border: '1px solid #D9CFC7' }}>
              SEBI TechSprint
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/auth?mode=login')}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors hover:opacity-80"
            style={{ color: '#57534e' }}
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate('/auth?mode=register')}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #C9B59C, #b39d82, #a69279)' }}
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto w-full px-6 py-16 text-center">
        <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6" style={{ backgroundColor: '#EFE9E3', color: '#8c7a65', border: '1px solid #D9CFC7' }}>
          <Award className="w-3.5 h-3.5 inline" style={{ color: '#b39d82' }} /> SEBI Securities Market TechSprint — Problem Statement 4
        </span>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight max-w-5xl mx-auto leading-tight md:leading-none mb-6" style={{ color: '#1c1917' }}>
          Compliance-as-Code for <br className="hidden md:inline" />
          <span style={{ background: 'linear-gradient(135deg, #b39d82, #C9B59C, #8c7a65)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SME IPO Offer Documents</span>
        </h1>

        <p className="text-lg md:text-xl max-w-3xl mx-auto font-normal leading-relaxed mb-10" style={{ color: '#57534e' }}>
          Transforming Draft Red Herring Prospectus (DRHP) drafting from an opaque, intermediary-heavy process into a transparent, deterministic, and auditable compliance operating system.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button 
            onClick={() => navigate('/auth?mode=register')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-white shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3"
            style={{ background: 'linear-gradient(135deg, #C9B59C, #b39d82, #a69279)' }}
          >
            <Sparkles className="w-5 h-5" style={{ color: '#fffbeb' }} />
            <span>Launch Compliance Workspace</span>
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold transition-all duration-300 flex items-center justify-center gap-2"
            style={{ backgroundColor: '#ffffff', border: '1px solid #D9CFC7', color: '#44403c' }}
          >
            <span>Explore Demo Dashboard</span>
            <ArrowRight className="w-5 h-5" style={{ color: '#78716c' }} />
          </button>
        </div>

        {/* Core Pillars Grid */}
        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div className="p-8 rounded-2xl relative overflow-hidden group transition-all duration-300 hover:shadow-glow" style={{ backgroundColor: '#ffffff', border: '1px solid #D9CFC7' }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ backgroundColor: '#EFE9E3', border: '1px solid #D9CFC7' }}>
              <ShieldCheck className="w-6 h-6" style={{ color: '#b39d82' }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#1c1917' }}>Deterministic Rule Engine</h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#57534e' }}>
              Provable compliance validation against 18+ SEBI ICDR 2025 regulations. Pure mathematical and logical verification without LLM hallucination risks.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#b39d82' }}>
              <CheckCircle2 className="w-4 h-4" />
              <span>EBITDA, OFS & GCP Cap Checks</span>
            </div>
          </div>

          <div className="p-8 rounded-2xl relative overflow-hidden group transition-all duration-300 hover:shadow-glow" style={{ backgroundColor: '#ffffff', border: '1px solid #D9CFC7' }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ backgroundColor: '#EFE9E3', border: '1px solid #D9CFC7' }}>
              <FileText className="w-6 h-6" style={{ color: '#b39d82' }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#1c1917' }}>Delta Wizard Editor</h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#57534e' }}>
              Section-by-section DRHP drafting aligned with SEBI Schedule VI, Part A. Built-in regulatory guidance for promoters and automated table of contents.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#b39d82' }}>
              <Sparkles className="w-4 h-4" />
              <span>18 Mandatory Schedule VI Sections</span>
            </div>
          </div>

          <div className="p-8 rounded-2xl relative overflow-hidden group transition-all duration-300 hover:shadow-glow" style={{ backgroundColor: '#ffffff', border: '1px solid #D9CFC7' }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ backgroundColor: '#EFE9E3', border: '1px solid #D9CFC7' }}>
              <History className="w-6 h-6" style={{ color: '#b39d82' }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#1c1917' }}>Hash-Chained Audit Trail</h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#57534e' }}>
              Cryptographic SHA-256 hash chains linking every disclosure edit and digital sign-off. Tamper-evident logging ensuring regulatory integrity.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#b39d82' }}>
              <Lock className="w-4 h-4" />
              <span>Immutable Regulatory Sign-Offs</span>
            </div>
          </div>
        </div>

        {/* Feature Highlights Bar */}
        <div className="mt-16 pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center" style={{ borderTop: '1px solid #D9CFC7' }}>
          <div>
            <div className="text-3xl font-black mb-1" style={{ color: '#1c1917' }}>100%</div>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716c' }}>SEBI ICDR Aligned</div>
          </div>
          <div>
            <div className="text-3xl font-black mb-1" style={{ color: '#1c1917' }}>18+</div>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716c' }}>Deterministic Rules</div>
          </div>
          <div>
            <div className="text-3xl font-black mb-1" style={{ color: '#1c1917' }}>SHA-256</div>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716c' }}>Cryptographic Audit</div>
          </div>
          <div>
            <div className="text-3xl font-black mb-1" style={{ color: '#1c1917' }}>Multi-Role</div>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716c' }}>Promoter & Banker Review</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-8 flex flex-col md:flex-row items-center justify-between text-xs" style={{ borderTop: '1px solid #D9CFC7', color: '#78716c' }}>
        <div>
          © 2026 ClauseProof RegTech Platform. Designed for SEBI Securities Market TechSprint.
        </div>
        <div className="flex items-center gap-6 mt-4 md:mt-0 font-medium" style={{ color: '#57534e' }}>
          <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" style={{ color: '#C9B59C' }} /> Compliance-as-Code</span>
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" style={{ color: '#b39d82' }} /> Multi-Party Review</span>
          <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" style={{ color: '#10b981' }} /> Indian Data Localization</span>
        </div>
      </footer>
    </div>
  );
};
