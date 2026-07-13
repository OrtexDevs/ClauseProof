import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Project, User } from '../../types';

interface AppLayoutProps {
  children: React.ReactNode;
  currentProject: Project | null;
  currentUser: User | null;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, currentProject, currentUser }) => {
  return (
    <div className="min-h-[100dvh] flex bg-[#FAFAF7] text-[#16233D] font-sans">
      <Sidebar currentProject={currentProject} currentUser={currentUser} />
      <div className="flex-1 ml-64 flex flex-col min-h-[100dvh]">
        <Navbar currentProject={currentProject} />
        <main className="flex-1 p-8 lg:p-12 max-w-[1120px] w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};
