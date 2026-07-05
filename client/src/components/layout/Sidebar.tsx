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

export const Sidebar: React.FC<SidebarProps> = ({ currentProject, currentUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    apiService.logout();
    navigate('/');
  };

  return (
    <aside className="w-64 bg-card/90 backdrop-blur-xl border-r border-white/10 flex flex-col fixed inset-y-0 left-0 z-50 shadow-2xl">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-glow">
          <Scale className="w-5 h-5" />
        </div>
        <div>
          <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
            ClauseProof <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          </div>
          <div className="text-[10px] uppercase tracking-widest font-bold text-indigo-400">
            RegTech OS v1.0
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
        {/* Main Section */}
        <div>
          <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 px-3 mb-2">
            Platform
          </div>
          <nav className="space-y-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary/20 to-purple-500/10 text-indigo-300 border-l-4 border-primary font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                <span>Dashboard</span>
              </div>
            </NavLink>

            <NavLink
              to="/projects/new"
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary/20 to-purple-500/10 text-indigo-300 border-l-4 border-primary font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <FolderPlus className="w-4 h-4 text-emerald-400" />
                <span>New IPO Filing</span>
              </div>
            </NavLink>
          </nav>
        </div>

        {/* Current Project Workspace */}
        {currentProject && (
          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 px-3 mb-2 flex items-center justify-between">
              <span>Active Workspace</span>
              <span className="text-xs text-indigo-400 font-mono">SEBI ICDR</span>
            </div>
            
            <div className="px-3 py-2 mb-3 rounded-lg bg-slate-800/60 border border-white/5">
              <div className="text-xs font-bold text-slate-200 truncate">{currentProject.name}</div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">{currentProject.company_name}</div>
            </div>

            <nav className="space-y-1">
              <NavLink
                to={`/project/${currentProject.id}`}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary/20 to-purple-500/10 text-indigo-300 border-l-4 border-primary font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>Overview</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </NavLink>

              <NavLink
                to={`/project/${currentProject.id}/editor`}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary/20 to-purple-500/10 text-indigo-300 border-l-4 border-primary font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Delta Wizard</span>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">AI</span>
              </NavLink>

              <NavLink
                to={`/project/${currentProject.id}/compliance`}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary/20 to-purple-500/10 text-indigo-300 border-l-4 border-primary font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Rule Engine</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">18 Rules</span>
              </NavLink>

              <NavLink
                to={`/project/${currentProject.id}/workspace`}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary/20 to-purple-500/10 text-indigo-300 border-l-4 border-primary font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>Multi-Party Review</span>
                </div>
              </NavLink>

              <NavLink
                to={`/project/${currentProject.id}/audit`}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary/20 to-purple-500/10 text-indigo-300 border-l-4 border-primary font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <History className="w-4 h-4 text-cyan-400" />
                  <span>Audit Trail</span>
                </div>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono font-bold">SHA-256</span>
              </NavLink>
            </nav>
          </div>
        )}
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-white/10 bg-slate-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-sm">
              {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-200 truncate">{currentUser?.name || 'Guest User'}</div>
              <div className="text-[10px] text-slate-400 truncate capitalize font-mono">{currentUser?.role?.replace('_', ' ') || 'Promoter'}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
