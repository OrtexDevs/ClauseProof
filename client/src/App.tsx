import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { apiService } from './services/api';
import { Project, User } from './types';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { NewProject } from './pages/NewProject';
import { ProjectDetail } from './pages/ProjectDetail';
import { DeltaWizard } from './pages/DeltaWizard';
import { ComplianceHub } from './pages/ComplianceHub';
import { AuditTrail } from './pages/AuditTrail';
import { Workspace } from './pages/Workspace';

const MainRouter: React.FC = () => {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<User | null>(apiService.getCurrentUser());
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  useEffect(() => {
    setCurrentUser(apiService.getCurrentUser());
  }, [location.pathname]);

  // If on landing or auth, render standalone without sidebar
  if (location.pathname === '/' || location.pathname.startsWith('/auth')) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    );
  }

  return (
    <AppLayout currentProject={currentProject} currentUser={currentUser}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects/new" element={<NewProject />} />
        <Route path="/project/:id" element={<ProjectDetail onProjectChange={(p) => setCurrentProject(p)} />} />
        <Route path="/project/:id/editor" element={<DeltaWizard />} />
        <Route path="/project/:id/compliance" element={<ComplianceHub />} />
        <Route path="/project/:id/audit" element={<AuditTrail />} />
        <Route path="/project/:id/workspace" element={<Workspace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <MainRouter />
    </Router>
  );
};
export default App;
