import type { AnalyticsInsight } from '../../types';
import { Badge, SeverityDot } from '../common/Badge';

interface InsightCardProps {
  insight: AnalyticsInsight;
}

const TYPE_ICONS: Record<string, string> = {
  'repeat-failure': '↻',
  'high-volume-site': '⬆',
  prediction: '◎',
  trend: '↗',
};

export function InsightCard({ insight }: InsightCardProps) {
  const icon = TYPE_ICONS[insight.type] ?? '◈';

  return (
    <div
      style={{
        display: 'flex',
        gap: 14,
        padding: '14px 16px',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 9,
        transition: 'border-color 0.15s',
      }}
    >
      {/* Icon bubble */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          flexShrink: 0,
          color: 'var(--accent)',
        }}
      >
        {icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
          <SeverityDot severity={insight.severity} />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            {insight.title}
          </span>
          {insight.metric && (
            <Badge value={insight.severity}>{insight.metric}</Badge>
          )}
        </div>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {insight.description}
        </p>
      </div>
    </div>
  );
}
