import React from 'react';
import { Project } from '../../types';
import { Badge } from '../common/Badge';
import { ShieldCheck, Activity } from 'lucide-react';

interface NavbarProps {
  currentProject: Project | null;
}

export const Navbar: React.FC<NavbarProps> = ({ currentProject }) => {
  return (
    <header className="h-16 glass-header px-8 flex items-center justify-between sticky top-0 z-40 shadow-subtle transition-all">
      <div className="flex items-center gap-4">
        {currentProject ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#086F83] animate-pulse shrink-0" />
              <span className="font-heading text-sm font-extrabold text-[#0B1120] tracking-tight">{currentProject.name}</span>
            </div>
            <span className="text-xs text-[#25314C] font-mono font-bold uppercase tracking-wider hidden sm:inline">({currentProject.company_name})</span>
            <Badge variant={currentProject.status === 'approved' ? 'pass' : currentProject.status === 'in_review' ? 'info' : 'draft'}>
              {currentProject.status.replace('_', ' ')}
            </Badge>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#086F83] animate-pulse" />
            <span className="font-mono text-xs font-extrabold text-[#086F83] tracking-widest uppercase">SME IPO Compliance Ledger</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-mono text-xs font-bold px-3.5 py-1.5 rounded-xl bg-white border border-[#DCE0D6] text-[#0B1120] shadow-subtle hover:border-[#086F83]/60 transition-all cursor-default">
          <Activity className="w-4 h-4 text-[#086F83]" strokeWidth={2.2} />
          <span className="text-[#25314C] font-semibold">Engine:</span>
          <span className="text-[#086F83] font-extrabold">ICDR 2026 Deterministic</span>
        </div>
      </div>
    </header>
  );
};
