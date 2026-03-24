import type { Visit } from '../../types';
import { Badge } from '../common/Badge';
import { timeAgo, formatDuration } from '../../utils/dateUtils';

interface VisitCardProps {
  visit: Visit;
  onClick: () => void;
}

const INDUSTRY_ICONS: Record<string, string> = {
  hvac: '❄',
  property: '⌂',
  insurance: '◎',
  manufacturing: '⚙',
  restoration: '⟳',
};

export function VisitCard({ visit, onClick }: VisitCardProps) {
  const openIssues = visit.issues.filter((i) => !i.resolved).length;
  const completedChecks = visit.checklist.filter((c) => c.checked).length;
  const totalChecks = visit.checklist.length;
  const indIcon = INDUSTRY_ICONS[visit.industry] ?? '◈';

  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '14px 16px',
        cursor: 'pointer',
        transition: 'border-color 0.15s, transform 0.1s',
        display: 'flex',
        gap: 14,
        alignItems: 'flex-start',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)60';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
      }}
    >
      {/* Industry icon */}
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 8,
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        {indIcon}
      </div>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {visit.siteName}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {visit.siteAddress}
            </p>
          </div>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
            {timeAgo(visit.timestamp)}
          </span>
        </div>

        {/* Badges row */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge value={visit.type}>{visit.type}</Badge>
          <Badge value={visit.status}>{visit.status}</Badge>
          {openIssues > 0 && (
            <Badge value="high">{openIssues} open issue{openIssues > 1 ? 's' : ''}</Badge>
          )}
        </div>

        {/* Footer row */}
        <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            👤 {visit.technician}
          </span>
          {totalChecks > 0 && (
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              ✓ {completedChecks}/{totalChecks}
            </span>
          )}
          {visit.duration != null && (
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              ⏱ {formatDuration(visit.duration)}
            </span>
          )}
          {visit.geo && (
            <span style={{ fontSize: 11, color: 'var(--info)', fontFamily: 'var(--font-mono)' }}>
              ◎ GPS
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
