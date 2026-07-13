import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FolderPlus, FileText, ShieldCheck,
  History, Users, LogOut, Scale, ChevronRight
} from 'lucide-react';
import { apiService } from '../../services/api';
import { User, Project } from '../../types';

interface SidebarProps {
  currentProject: Project | null;
  currentUser: User | null;
}

const linkClass = (active: boolean) =>
  `flex items-center justify-between px-3.5 py-2 rounded-xl text-xs transition-all duration-200 ${
    active
      ? 'bg-[#FAFAF7] text-[#16233D] font-mono font-semibold border border-[#E4E2D8] shadow-subtle'
      : 'text-[#4A5568] hover:text-[#16233D] hover:bg-[#FAFAF7]/60 font-sans font-medium'
  }`;

export const Sidebar: React.FC<SidebarProps> = ({ currentProject, currentUser }) => {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-white border-r border-[#E4E2D8] flex flex-col fixed inset-y-0 left-0 z-50">
      {/* Brand */}
      <div className="p-5 border-b border-[#E4E2D8] flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#16233D] flex items-center justify-center text-white font-bold shrink-0">
          <Scale className="w-4 h-4" strokeWidth={2} />
        </div>
        <div>
          <div className="font-heading text-sm font-bold tracking-tight text-[#16233D] flex items-center gap-1.5">
            ClauseProof <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D8C] animate-pulse" />
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest font-semibold text-[#2E7D8C]">RegTech OS</div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-6 px-3.5 space-y-7">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest font-semibold text-[#8A93A6] px-3.5 mb-2.5">Platform</div>
          <nav className="space-y-1">
            <NavLink to="/dashboard" className={({ isActive }) => linkClass(isActive)}>
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-[#2E7D8C]" strokeWidth={1.8} />
                <span>Dashboard</span>
              </div>
            </NavLink>
            <NavLink to="/projects/new" className={({ isActive }) => linkClass(isActive)}>
              <div className="flex items-center gap-2.5">
                <FolderPlus className="w-4 h-4 text-[#39A0B0]" strokeWidth={1.8} />
                <span>New IPO Filing</span>
              </div>
            </NavLink>
          </nav>
        </div>

        {currentProject && (
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest font-semibold text-[#8A93A6] px-3.5 mb-2.5 flex items-center justify-between">
              <span>Workspace</span>
              <span className="text-[#2E7D8C]">ICDR 2025</span>
            </div>

            <div className="px-3.5 py-2.5 mb-3 rounded-xl bg-[#FAFAF7] border border-[#E4E2D8]">
              <div className="font-heading text-xs font-bold text-[#16233D] truncate">{currentProject.name}</div>
              <div className="font-mono text-[11px] text-[#4A5568] truncate mt-0.5">{currentProject.company_name}</div>
            </div>

            <nav className="space-y-1">
              <NavLink to={`/project/${currentProject.id}`} className={({ isActive }) => linkClass(isActive)}>
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#2E7D8C]" strokeWidth={1.8} />
                  <span>Overview</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#8A93A6]" strokeWidth={1.8} />
              </NavLink>

              <NavLink to={`/project/${currentProject.id}/editor`} className={({ isActive }) => linkClass(isActive)}>
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#39A0B0]" strokeWidth={1.8} />
                  <span>Delta Wizard</span>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-[#E4E2D8] bg-white text-[#16233D] font-semibold">AI</span>
              </NavLink>

              <NavLink to={`/project/${currentProject.id}/compliance`} className={({ isActive }) => linkClass(isActive)}>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#2E7D8C]" strokeWidth={1.8} />
                  <span>Rule Engine</span>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-[#E4E2D8] bg-white text-[#2E7D8C] font-semibold">18</span>
              </NavLink>

              <NavLink to={`/project/${currentProject.id}/workspace`} className={({ isActive }) => linkClass(isActive)}>
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-[#C9762E]" strokeWidth={1.8} />
                  <span>Multi-Party Review</span>
                </div>
              </NavLink>

              <NavLink to={`/project/${currentProject.id}/audit`} className={({ isActive }) => linkClass(isActive)}>
                <div className="flex items-center gap-2.5">
                  <History className="w-4 h-4 text-[#39A0B0]" strokeWidth={1.8} />
                  <span>Audit Trail</span>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-[#E4E2D8] bg-white text-[#4A5568] font-semibold">SHA</span>
              </NavLink>
            </nav>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#E4E2D8] bg-[#FAFAF7]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#16233D] flex items-center justify-center font-mono text-xs font-bold text-white shrink-0">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#16233D] truncate">{currentUser?.name || 'Guest User'}</div>
              <div className="text-[10px] text-[#4A5568] truncate capitalize font-mono">{currentUser?.role?.replace('_', ' ') || 'Promoter'}</div>
            </div>
          </div>
          <button
            onClick={() => { apiService.logout(); navigate('/'); }}
            className="p-2 rounded-lg text-[#8A93A6] hover:text-[#C9762E] hover:bg-white border border-transparent hover:border-[#E4E2D8] transition-all"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </aside>
  );
};
