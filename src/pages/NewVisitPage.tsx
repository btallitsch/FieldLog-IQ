import type { UseVisitsReturn } from '../hooks/useVisits';
import type { Page, Visit } from '../types';
import { NewVisitForm } from '../components/newvisit/NewVisitForm';

interface NewVisitPageProps {
  data: UseVisitsReturn;
  onNavigate: (page: Page) => void;
}

export function NewVisitPage({ data, onNavigate }: NewVisitPageProps) {
  const { addVisit, getOrCreateSite } = data;

  const handleSave = (draft: Omit<Visit, 'id' | 'timestamp'>) => {
    // Ensure site record exists
    getOrCreateSite(draft.siteName, draft.siteAddress, draft.industry);
    const visit = addVisit(draft);
    onNavigate({ name: 'visit-detail', id: visit.id });
  };

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg-base)' }}>
      {/* Top bar */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-sidebar)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Log New Visit
        </h1>
        <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      <NewVisitForm onSave={handleSave} onCancel={() => onNavigate({ name: 'visits' })} />
    </div>
  );
}
