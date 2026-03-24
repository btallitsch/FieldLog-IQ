import type { UseVisitsReturn } from '../hooks/useVisits';
import type { Page } from '../types';
import { KpiCard } from '../components/dashboard/KpiCard';
import { InsightCard } from '../components/dashboard/InsightCard';
import { SiteVolumeBar } from '../components/dashboard/SiteVolumeBar';
import { VisitCard } from '../components/visits/VisitCard';
import { Card, SectionHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';

interface DashboardPageProps {
  data: UseVisitsReturn;
  onNavigate: (page: Page) => void;
}

export function DashboardPage({ data, onNavigate }: DashboardPageProps) {
  const { kpis, insights, siteVolumes, visits } = data;
  const recentVisits = visits.slice(0, 4);

  return (
    <div style={{ padding: '24px 20px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Field Intelligence
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <Button variant="primary" size="sm" icon="⊕" onClick={() => onNavigate({ name: 'new-visit' })}>
          Log Visit
        </Button>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 12,
          marginBottom: 24,
        }}
      >
        <KpiCard label="Total Visits" value={kpis.totalVisits} icon="◈" accent="var(--accent)" />
        <KpiCard label="Open Issues" value={kpis.openIssues} icon="⚠" accent="var(--warning)" />
        <KpiCard label="Active Sites" value={kpis.activeSites} icon="◉" accent="var(--info)" />
        <KpiCard label="Resolved / Mo" value={kpis.resolvedThisMonth} icon="✓" accent="var(--success)" />
        <KpiCard label="Emergencies" value={kpis.emergencyVisits} icon="⚡" accent="var(--danger)" />
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Intelligence Insights */}
        <Card>
          <SectionHeader
            title="Intelligence Insights"
            subtitle={`${insights.length} active signal${insights.length !== 1 ? 's' : ''}`}
          />
          {insights.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, padding: '20px 0', fontFamily: 'var(--font-mono)' }}>
              No patterns detected yet. Log more visits to unlock insights.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {insights.slice(0, 4).map((ins) => (
                <InsightCard key={ins.id} insight={ins} />
              ))}
            </div>
          )}
        </Card>

        {/* Site Volume */}
        <Card>
          <SectionHeader
            title="Site Volume"
            subtitle="Visits by location"
            right={
              <Button variant="ghost" size="sm" onClick={() => onNavigate({ name: 'sites' })}>
                All sites →
              </Button>
            }
          />
          <SiteVolumeBar volumes={siteVolumes} />
        </Card>
      </div>

      {/* Recent Visits */}
      <Card>
        <SectionHeader
          title="Recent Visits"
          subtitle="Latest field activity"
          right={
            <Button variant="ghost" size="sm" onClick={() => onNavigate({ name: 'visits' })}>
              View all →
            </Button>
          }
        />
        {recentVisits.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, padding: '20px 0' }}>
            No visits yet. Tap Log Visit to start.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentVisits.map((v) => (
              <VisitCard key={v.id} visit={v} onClick={() => onNavigate({ name: 'visit-detail', id: v.id })} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
