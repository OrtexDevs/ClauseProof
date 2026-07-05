import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Shield, Sparkles, Building2, Bell } from 'lucide-react';
import { Project } from '../../types';
import { Badge } from '../common/Badge';

interface NavbarProps {
  currentProject: Project | null;
}

export const Navbar: React.FC<NavbarProps> = ({ currentProject }) => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'SME IPO Compliance Dashboard';
    if (path === '/projects/new') return 'Initialize New IPO Filing';
    if (path.includes('/editor')) return 'Delta Wizard — Schedule VI Editor';
    if (path.includes('/compliance')) return 'SEBI ICDR Deterministic Rule Engine';
    if (path.includes('/workspace')) return 'Multi-Party Workspace & Digital Sign-Offs';
    if (path.includes('/audit')) return 'Cryptographic Hash-Chained Audit Trail';
    if (path.includes('/project/')) return 'IPO Project Overview';
    return 'ClauseProof RegTech';
  };

  return (
    <header className="h-16 bg-card/70 backdrop-blur-md border-b border-white/10 sticky top-0 z-40 px-8 flex items-center justify-between shadow-glass">
      {/* Breadcrumb / Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-2">
          {getPageTitle()}
        </h1>
        {currentProject && location.pathname !== '/dashboard' && (
          <div className="hidden md:flex items-center gap-2 border-l border-white/10 pl-3">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-300">{currentProject.company_name}</span>
            <Badge variant={currentProject.status === 'approved' ? 'pass' : 'draft'} className="ml-1 text-[10px]">
              {currentProject.status.toUpperCase()}
            </Badge>
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* TechSprint Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-300">
          <Shield className="w-3.5 h-3.5 text-indigo-400" />
          <span>SEBI TechSprint Problem Statement 4</span>
        </div>

        {/* AI Grounded Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Grounded in ICDR 2025</span>
        </div>

        {/* Notifications */}
        <button className="w-8 h-8 rounded-full bg-slate-800/80 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
        </button>
      </div>
    </header>
  );
};
