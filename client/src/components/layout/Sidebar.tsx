import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderPlus, 
  FileText, 
  ShieldCheck, 
  History, 
  Users, 
  LogOut, 
  Scale, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { apiService } from '../../services/api';
import { User, Project } from '../../types';

interface SidebarProps {
  currentProject: Project | null;
  currentUser: User | null;
}

const navLinkClass = (isActive: boolean) =>
  `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
    isActive
      ? 'bg-gradient-to-r from-[#C9B59C]/25 to-[#EFE9E3] text-[#6b5c4b] border-l-4 border-[#C9B59C] font-semibold shadow-sm'
      : 'text-[#78716c] hover:text-[#44403c] hover:bg-[#EFE9E3]'
  }`;

export const Sidebar: React.FC<SidebarProps> = ({ currentProject, currentUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    apiService.logout();
    navigate('/');
  };

  return (
    <aside className="w-64 backdrop-blur-xl flex flex-col fixed inset-y-0 left-0 z-50 shadow-glass" style={{ backgroundColor: '#ffffff', borderRight: '1px solid #D9CFC7' }}>
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3" style={{ borderBottom: '1px solid #D9CFC7' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-glow" style={{ background: 'linear-gradient(135deg, #C9B59C, #a69279)' }}>
          <Scale className="w-5 h-5" />
        </div>
        <div>
          <div className="font-extrabold text-base tracking-tight flex items-center gap-1.5" style={{ color: '#1c1917' }}>
            ClauseProof <Sparkles className="w-3.5 h-3.5 animate-pulse" style={{ color: '#C9B59C' }} />
          </div>
          <div className="text-[10px] uppercase tracking-widest font-bold" style={{ color: '#b39d82' }}>
            RegTech OS v1.0
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
        {/* Main Section */}
        <div>
          <div className="text-[10px] uppercase tracking-wider font-bold px-3 mb-2" style={{ color: '#a8a29e' }}>
            Platform
          </div>
          <nav className="space-y-1">
            <NavLink to="/dashboard" className={({ isActive }) => navLinkClass(isActive)}>
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" style={{ color: '#b39d82' }} />
                <span>Dashboard</span>
              </div>
            </NavLink>

            <NavLink to="/projects/new" className={({ isActive }) => navLinkClass(isActive)}>
              <div className="flex items-center gap-3">
                <FolderPlus className="w-4 h-4" style={{ color: '#10b981' }} />
                <span>New IPO Filing</span>
              </div>
            </NavLink>
          </nav>
        </div>

        {/* Current Project Workspace */}
        {currentProject && (
          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold px-3 mb-2 flex items-center justify-between" style={{ color: '#a8a29e' }}>
              <span>Active Workspace</span>
              <span className="text-xs font-mono" style={{ color: '#b39d82' }}>SEBI ICDR</span>
            </div>
            
            <div className="px-3 py-2 mb-3 rounded-lg" style={{ backgroundColor: '#EFE9E3', border: '1px solid #D9CFC7' }}>
              <div className="text-xs font-bold truncate" style={{ color: '#1c1917' }}>{currentProject.name}</div>
              <div className="text-[11px] truncate mt-0.5" style={{ color: '#78716c' }}>{currentProject.company_name}</div>
            </div>

            <nav className="space-y-1">
              <NavLink to={`/project/${currentProject.id}`} className={({ isActive }) => navLinkClass(isActive)}>
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4" style={{ color: '#3b82f6' }} />
                  <span>Overview</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5" style={{ color: '#a8a29e' }} />
              </NavLink>

              <NavLink to={`/project/${currentProject.id}/editor`} className={({ isActive }) => navLinkClass(isActive)}>
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4" style={{ color: '#C9B59C' }} />
                  <span>Delta Wizard</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold" style={{ backgroundColor: 'rgba(201,181,156,0.2)', color: '#b39d82' }}>AI</span>
              </NavLink>

              <NavLink to={`/project/${currentProject.id}/compliance`} className={({ isActive }) => navLinkClass(isActive)}>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4" style={{ color: '#10b981' }} />
                  <span>Rule Engine</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#059669' }}>18 Rules</span>
              </NavLink>

              <NavLink to={`/project/${currentProject.id}/workspace`} className={({ isActive }) => navLinkClass(isActive)}>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                  <span>Multi-Party Review</span>
                </div>
              </NavLink>

              <NavLink to={`/project/${currentProject.id}/audit`} className={({ isActive }) => navLinkClass(isActive)}>
                <div className="flex items-center gap-3">
                  <History className="w-4 h-4" style={{ color: '#06b6d4' }} />
                  <span>Audit Trail</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold" style={{ backgroundColor: 'rgba(6,182,212,0.1)', color: '#0891b2' }}>SHA-256</span>
              </NavLink>
            </nav>
          </div>
        )}
      </div>

      {/* User Footer */}
      <div className="p-4" style={{ borderTop: '1px solid #D9CFC7', backgroundColor: '#F9F8F6' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #C9B59C, #a69279)' }}>
              {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold truncate" style={{ color: '#1c1917' }}>{currentUser?.name || 'Guest User'}</div>
              <div className="text-[10px] truncate capitalize font-mono" style={{ color: '#78716c' }}>{currentUser?.role?.replace('_', ' ') || 'Promoter'}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg transition-colors hover:bg-rose-50"
            style={{ color: '#78716c' }}
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
