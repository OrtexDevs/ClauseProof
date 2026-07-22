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
  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200 ${
    active
      ? 'bg-[#EEF0EB] text-[#0B1120] font-mono font-extrabold border border-[#DCE0D6] shadow-subtle scale-[1.01]'
      : 'text-[#25314C] hover:text-[#0B1120] hover:bg-[#EEF0EB]/60 font-sans font-semibold hover:translate-x-0.5'
  }`;

export const Sidebar: React.FC<SidebarProps> = ({ currentProject, currentUser }) => {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-white backdrop-blur-md border-r border-[#DCE0D6] flex flex-col fixed inset-y-0 left-0 z-50 shadow-[1px_0_8px_rgba(11,17,32,0.03)]">
      {/* Brand */}
      <div className="p-5 border-b border-[#DCE0D6] flex items-center gap-3 bg-[#EEF0EB]/50">
        <div className="w-9 h-9 rounded-xl bg-[#0B1120] flex items-center justify-center text-white font-bold shrink-0 shadow-subtle">
          <Scale className="w-4 h-4" strokeWidth={2.2} />
        </div>
        <div>
          <div className="font-heading text-sm font-extrabold tracking-tight text-[#0B1120] flex items-center gap-1.5">
            ClauseProof <span className="w-2 h-2 rounded-full bg-[#086F83] animate-pulse shrink-0" />
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest font-extrabold text-[#086F83]">RegTech OS</div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-6 px-3.5 space-y-7">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest font-extrabold text-[#4B5A7A] px-3.5 mb-2.5">Platform</div>
          <nav className="space-y-1.5">
            <NavLink to="/dashboard" className={({ isActive }) => linkClass(isActive)}>
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-[#086F83]" strokeWidth={2.2} />
                <span>Dashboard</span>
              </div>
            </NavLink>
            <NavLink to="/projects/new" className={({ isActive }) => linkClass(isActive)}>
              <div className="flex items-center gap-2.5">
                <FolderPlus className="w-4 h-4 text-[#0B8CA5]" strokeWidth={2.2} />
                <span>New IPO Filing</span>
              </div>
            </NavLink>
          </nav>
        </div>

        {currentProject && (
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest font-extrabold text-[#4B5A7A] px-3.5 mb-2.5 flex items-center justify-between">
              <span>Workspace</span>
              <span className="text-[#086F83] bg-[#EEF0EB] font-bold px-1.5 py-0.5 rounded border border-[#DCE0D6] text-[10px]">ICDR 2026</span>
            </div>

            <div className="px-3.5 py-3 mb-3.5 rounded-xl bg-[#EEF0EB] border border-[#DCE0D6] shadow-subtle">
              <div className="font-heading text-xs font-extrabold text-[#0B1120] truncate">{currentProject.name}</div>
              <div className="font-mono text-xs font-semibold text-[#25314C] truncate mt-0.5">{currentProject.company_name}</div>
            </div>

            <nav className="space-y-1.5">
              <NavLink to={`/project/${currentProject.id}`} className={({ isActive }) => linkClass(isActive)}>
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#086F83]" strokeWidth={2.2} />
                  <span>Overview</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#4B5A7A]" strokeWidth={2.2} />
              </NavLink>

              <NavLink to={`/project/${currentProject.id}/editor`} className={({ isActive }) => linkClass(isActive)}>
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#0B8CA5]" strokeWidth={2.2} />
                  <span>Delta Wizard</span>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-[#DCE0D6] bg-white text-[#0B1120] font-extrabold shadow-subtle">AI</span>
              </NavLink>

              <NavLink to={`/project/${currentProject.id}/compliance`} className={({ isActive }) => linkClass(isActive)}>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#086F83]" strokeWidth={2.2} />
                  <span>Rule Engine</span>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-[#DCE0D6] bg-white text-[#086F83] font-extrabold shadow-subtle">18</span>
              </NavLink>

              <NavLink to={`/project/${currentProject.id}/workspace`} className={({ isActive }) => linkClass(isActive)}>
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-[#C2590E]" strokeWidth={2.2} />
                  <span>Multi-Party Review</span>
                </div>
              </NavLink>

              <NavLink to={`/project/${currentProject.id}/audit`} className={({ isActive }) => linkClass(isActive)}>
                <div className="flex items-center gap-2.5">
                  <History className="w-4 h-4 text-[#0B8CA5]" strokeWidth={2.2} />
                  <span>Audit Trail</span>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-[#DCE0D6] bg-white text-[#25314C] font-extrabold shadow-subtle">SHA</span>
              </NavLink>
            </nav>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#DCE0D6] bg-[#EEF0EB]/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#0B1120] flex items-center justify-center font-mono text-xs font-bold text-white shrink-0 shadow-subtle">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-heading font-extrabold text-[#0B1120] truncate">{currentUser?.name || 'Guest User'}</div>
              <div className="text-[11px] font-semibold text-[#25314C] truncate capitalize font-mono">{currentUser?.role?.replace('_', ' ') || 'Promoter'}</div>
            </div>
          </div>
          <button
            onClick={() => { apiService.logout(); navigate('/'); }}
            className="p-2 rounded-lg text-[#4B5A7A] hover:text-[#C2590E] hover:bg-white border border-transparent hover:border-[#DCE0D6] transition-all shadow-subtle"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </aside>
  );
};
