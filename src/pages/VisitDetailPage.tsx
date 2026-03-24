import type { UseVisitsReturn } from '../hooks/useVisits';
import type { Page, Visit } from '../types';
import { Badge, SeverityDot } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Card, Divider } from '../components/common/Card';
import { formatDateTime, formatDuration } from '../utils/dateUtils';

interface VisitDetailPageProps {
  visitId: string;
  data: UseVisitsReturn;
  onNavigate: (page: Page) => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
        {title}
      </p>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{label}</span>
      <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

export function VisitDetailPage({ visitId, data, onNavigate }: VisitDetailPageProps) {
  const { getVisit, updateVisit, deleteVisit } = data;
  const visit = getVisit(visitId) as Visit | undefined;

  if (!visit) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Visit not found.</p>
        <Button onClick={() => onNavigate({ name: 'visits' })}>← Back to Visits</Button>
      </div>
    );
  }

  const openIssues = visit.issues.filter((i) => !i.resolved);
  const resolvedIssues = visit.issues.filter((i) => i.resolved);
  const completedChecks = visit.checklist.filter((c) => c.checked).length;

  const handleDelete = () => {
    if (confirm('Delete this visit? This cannot be undone.')) {
      deleteVisit(visit.id);
      onNavigate({ name: 'visits' });
    }
  };

  const toggleIssueResolved = (issueId: string) => {
    const updated = visit.issues.map((i) =>
      i.id === issueId ? { ...i, resolved: !i.resolved } : i
    );
    updateVisit(visit.id, { issues: updated });
  };

  const toggleStatus = () => {
    const next: Visit['status'] =
      visit.status === 'open' ? 'in-progress' : visit.status === 'in-progress' ? 'resolved' : 'open';
    updateVisit(visit.id, { status: next });
  };

  return (
    <div style={{ padding: '24px 20px', maxWidth: 720, margin: '0 auto' }}>
      {/* Back + Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <Button variant="ghost" size="sm" onClick={() => onNavigate({ name: 'visits' })}>
          ← Visits
        </Button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Button variant="secondary" size="sm" onClick={toggleStatus}>
            Mark {visit.status === 'resolved' ? 'Open' : 'Resolved'}
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      {/* Hero */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
          <Badge value={visit.type}>{visit.type}</Badge>
          <Badge value={visit.status}>{visit.status}</Badge>
          <Badge value={visit.industry}>{visit.industry}</Badge>
        </div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          {visit.siteName}
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {visit.siteAddress}
        </p>
      </div>

      {/* Meta info */}
      <Card style={{ marginBottom: 16 }} padding="0">
        <div style={{ padding: '0 16px' }}>
          <InfoRow label="Timestamp" value={formatDateTime(visit.timestamp)} />
          <InfoRow label="Technician" value={visit.technician} />
          {visit.duration != null && <InfoRow label="Duration" value={formatDuration(visit.duration)} />}
          {visit.geo && (
            <InfoRow label="GPS" value={`${visit.geo.lat}, ${visit.geo.lng}`} />
          )}
        </div>
      </Card>

      {/* Issues */}
      {visit.issues.length > 0 && (
        <Card style={{ marginBottom: 16 }}>
          <Section title={`Issues (${visit.issues.length})`}>
            {openIssues.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
                {openIssues.map((issue) => (
                  <div
                    key={issue.id}
                    style={{
                      display: 'flex',
                      gap: 12,
                      padding: '10px 12px',
                      background: 'var(--bg-elevated)',
                      borderRadius: 7,
                      border: '1px solid var(--border)',
                    }}
                  >
                    <SeverityDot severity={issue.severity} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                          {issue.category}
                        </span>
                        <Badge value={issue.severity}>{issue.severity}</Badge>
                      </div>
                      <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                        {issue.description}
                      </p>
                    </div>
                    <Button variant="success" size="sm" onClick={() => toggleIssueResolved(issue.id)}>
                      Resolve
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {resolvedIssues.length > 0 && (
              <>
                {openIssues.length > 0 && <Divider />}
                <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', margin: '0 0 8px' }}>RESOLVED</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {resolvedIssues.map((issue) => (
                    <div
                      key={issue.id}
                      style={{
                        display: 'flex',
                        gap: 12,
                        padding: '9px 12px',
                        background: 'var(--bg-elevated)',
                        borderRadius: 7,
                        border: '1px solid var(--success)20',
                        opacity: 0.65,
                      }}
                    >
                      <span style={{ color: 'var(--success)', fontSize: 14, flexShrink: 0 }}>✓</span>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'line-through' }}>
                          {issue.category}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => toggleIssueResolved(issue.id)}>
                        Reopen
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Section>
        </Card>
      )}

      {/* Equipment */}
      {visit.equipment.length > 0 && (
        <Card style={{ marginBottom: 16 }}>
          <Section title={`Equipment (${visit.equipment.length})`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {visit.equipment.map((eq) => (
                <div
                  key={eq.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    background: 'var(--bg-elevated)',
                    borderRadius: 7,
                    border: '1px solid var(--border)',
                    gap: 12,
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                      {eq.tag}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8 }}>
                      {eq.type} · {eq.model}
                    </span>
                    {eq.notes && (
                      <p style={{ margin: '3px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>{eq.notes}</p>
                    )}
                  </div>
                  <Badge value={eq.condition}>{eq.condition}</Badge>
                </div>
              ))}
            </div>
          </Section>
        </Card>
      )}

      {/* Checklist */}
      {visit.checklist.length > 0 && (
        <Card style={{ marginBottom: 16 }}>
          <Section title={`Checklist · ${completedChecks}/${visit.checklist.length}`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {visit.checklist.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '7px 10px',
                    borderRadius: 6,
                    background: item.checked ? 'var(--success-dim)' : 'var(--bg-elevated)',
                    border: `1px solid ${item.checked ? 'var(--success)30' : 'var(--border)'}`,
                  }}
                >
                  <span style={{ color: item.checked ? 'var(--success)' : 'var(--border)', fontSize: 14, flexShrink: 0 }}>
                    {item.checked ? '✓' : '○'}
                  </span>
                  <span style={{ fontSize: 12, color: item.checked ? 'var(--text-secondary)' : 'var(--text-primary)', textDecoration: item.checked ? 'line-through' : 'none' }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        </Card>
      )}

      {/* Notes */}
      {visit.notes && (
        <Card>
          <Section title="Field Notes">
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {visit.notes}
            </p>
          </Section>
        </Card>
      )}
    </div>
  );
}
