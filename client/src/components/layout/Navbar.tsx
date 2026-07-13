import React from 'react';
import { Project } from '../../types';
import { Badge } from '../common/Badge';
import { ShieldCheck, Activity } from 'lucide-react';

interface NavbarProps {
  currentProject: Project | null;
}

export const Navbar: React.FC<NavbarProps> = ({ currentProject }) => {
  return (
    <header className="h-16 glass-header px-8 flex items-center justify-between sticky top-0 z-40 shadow-[0_1px_3px_rgba(22,35,61,0.02)] transition-all">
      <div className="flex items-center gap-4">
        {currentProject ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2E7D8C] animate-pulse shrink-0" />
              <span className="font-heading text-sm font-bold text-[#16233D] tracking-tight">{currentProject.name}</span>
            </div>
            <span className="text-xs text-[#8A93A6] font-mono uppercase tracking-wider hidden sm:inline">({currentProject.company_name})</span>
            <Badge variant={currentProject.status === 'approved' ? 'pass' : currentProject.status === 'in_review' ? 'info' : 'draft'}>
              {currentProject.status.replace('_', ' ')}
            </Badge>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[#2E7D8C] animate-pulse" />
            <span className="font-mono text-[11px] font-bold text-[#2E7D8C] tracking-widest uppercase">SME IPO Compliance Ledger</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-mono text-[11px] font-semibold px-3 py-1.5 rounded-xl bg-white border border-[#E4E2D8] text-[#16233D] shadow-subtle hover:border-[#2E7D8C]/50 transition-all cursor-default">
          <Activity className="w-3.5 h-3.5 text-[#2E7D8C]" strokeWidth={2} />
          <span className="text-[#8A93A6]">Engine:</span>
          <span className="text-[#2E7D8C] font-bold">ICDR 2026 Deterministic</span>
        </div>
      </div>
    </header>
  );
};
