import { useState } from 'react';
import type { Page } from './types';
import { useVisits } from './hooks/useVisits';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { VisitsPage } from './pages/VisitsPage';
import { VisitDetailPage } from './pages/VisitDetailPage';
import { NewVisitPage } from './pages/NewVisitPage';
import { SitesPage } from './pages/SitesPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>({ name: 'dashboard' });
  const data = useVisits();

  const renderPage = () => {
    switch (currentPage.name) {
      case 'dashboard':
        return <DashboardPage data={data} onNavigate={setCurrentPage} />;
      case 'visits':
        return <VisitsPage data={data} onNavigate={setCurrentPage} />;
      case 'visit-detail':
        return <VisitDetailPage visitId={currentPage.id} data={data} onNavigate={setCurrentPage} />;
      case 'new-visit':
        return <NewVisitPage data={data} onNavigate={setCurrentPage} />;
      case 'sites':
        return <SitesPage data={data} onNavigate={setCurrentPage} />;
      default:
        return <DashboardPage data={data} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AppShell currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </AppShell>
  );
}
