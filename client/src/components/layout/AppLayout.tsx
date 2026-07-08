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
    <div className="min-h-screen flex" style={{ backgroundColor: '#F9F8F6' }}>
      <Sidebar currentProject={currentProject} currentUser={currentUser} />
      <div className="flex-1 ml-64 flex flex-col min-h-screen" style={{ backgroundColor: '#F9F8F6' }}>
        <Navbar currentProject={currentProject} />
        <main className="flex-1 p-8 max-w-7xl w-full mx-auto animate-fade-in" style={{ backgroundColor: '#F9F8F6' }}>
          {children}
        </main>
      </div>
    </div>
  );
};
