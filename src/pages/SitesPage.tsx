import type { UseVisitsReturn } from '../hooks/useVisits';
import type { Page } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { computeSiteRiskScore } from '../utils/analyticsUtils';

interface SitesPageProps {
  data: UseVisitsReturn;
  onNavigate: (page: Page) => void;
}

const INDUSTRY_ICONS: Record<string, string> = {
  hvac: '❄',
  property: '⌂',
  insurance: '◎',
  manufacturing: '⚙',
  restoration: '⟳',
};

function RiskBar({ score }: { score: number }) {
  const color = score >= 70 ? 'var(--danger)' : score >= 40 ? 'var(--warning)' : 'var(--success)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 4, background: 'var(--bg-elevated)', borderRadius: 2 }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 0.5s' }} />
      </div>
      <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color, width: 26, textAlign: 'right' }}>{score}</span>
    </div>
  );
}

export function SitesPage({ data, onNavigate }: SitesPageProps) {
  const { sites, visits } = data;

  const sitesWithStats = sites.map((site) => {
    const siteVisits = visits.filter((v) => v.siteId === site.id);
    const openIssues = siteVisits.flatMap((v) => v.issues).filter((i) => !i.resolved).length;
    const riskScore = computeSiteRiskScore(siteVisits);
    return { ...site, visitCount: siteVisits.length, openIssues, riskScore };
  }).sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div style={{ padding: '24px 20px', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          Sites
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          {sites.length} tracked locations · sorted by risk score
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sitesWithStats.map((site) => (
          <Card key={site.id} hoverable>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              {/* Icon */}
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 9,
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                {INDUSTRY_ICONS[site.industry] ?? '◈'}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{site.name}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {site.address}
                    </p>
                  </div>
                  <Badge value={site.industry}>{site.industry}</Badge>
                </div>

                {/* Stats row */}
                <div style={{ display: 'flex', gap: 14, marginBottom: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    ◈ {site.visitCount} visit{site.visitCount !== 1 ? 's' : ''}
                  </span>
                  {site.openIssues > 0 && (
                    <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--warning)' }}>
                      ⚠ {site.openIssues} open issue{site.openIssues !== 1 ? 's' : ''}
                    </span>
                  )}
                  {site.contactName && (
                    <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      👤 {site.contactName}
                    </span>
                  )}
                </div>

                {/* Risk score bar */}
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Risk Score
                  </p>
                  <RiskBar score={site.riskScore} />
                </div>
              </div>

              {/* Action */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate({ name: 'visits' })}
                style={{ flexShrink: 0 }}
              >
                View →
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {sites.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>◉</p>
          <p style={{ fontSize: 14, fontWeight: 600 }}>No sites yet</p>
          <p style={{ fontSize: 12 }}>Sites are created automatically when you log a visit.</p>
          <Button variant="primary" style={{ marginTop: 16 }} onClick={() => onNavigate({ name: 'new-visit' })}>
            Log First Visit
          </Button>
        </div>
      )}
    </div>
  );
}
