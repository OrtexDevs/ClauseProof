import React from 'react';
import { Project } from '../../types';
import { Badge } from '../common/Badge';

interface NavbarProps {
  currentProject: Project | null;
}

export const Navbar: React.FC<NavbarProps> = ({ currentProject }) => {
  return (
    <header className="h-16 bg-[#FAFAF7]/90 backdrop-blur-md border-b border-[#E4E2D8] px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {currentProject ? (
          <div className="flex items-center gap-3">
            <span className="font-heading text-sm font-bold text-[#16233D] tracking-tight">{currentProject.name}</span>
            <span className="text-xs text-[#8A93A6] font-mono uppercase tracking-wider">({currentProject.company_name})</span>
            <Badge variant={currentProject.status === 'approved' ? 'pass' : currentProject.status === 'in_review' ? 'info' : 'draft'}>
              {currentProject.status.replace('_', ' ')}
            </Badge>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-semibold text-[#2E7D8C] tracking-widest uppercase">SME IPO Compliance Ledger</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 font-mono text-[11px] font-medium px-3 py-1.5 rounded-lg bg-white border border-[#E4E2D8] text-[#2E7D8C] shadow-subtle uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D8C] animate-pulse" />
          <span>SEBI ICDR 2025 Rules: Active</span>
        </div>
      </div>
    </header>
  );
};
