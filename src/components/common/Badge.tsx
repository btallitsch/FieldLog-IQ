import type { ReactNode, CSSProperties } from 'react';
import type { Severity, VisitType, VisitStatus, IndustryType, Condition } from '../../types';

type BadgeVariant = 'severity' | 'visitType' | 'visitStatus' | 'industry' | 'condition' | 'default';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  value?: Severity | VisitType | VisitStatus | IndustryType | Condition | string;
  className?: string;
  style?: CSSProperties;
}

const COLOR_MAP: Record<string, string> = {
  // Severity
  critical: 'var(--danger)',
  high: 'var(--warning)',
  medium: 'var(--accent)',
  low: 'var(--success)',
  // Visit Type
  emergency: 'var(--danger)',
  service: 'var(--warning)',
  inspection: 'var(--info)',
  'follow-up': '#a78bfa',
  // Visit Status
  open: 'var(--text-secondary)',
  'in-progress': 'var(--accent)',
  resolved: 'var(--success)',
  escalated: 'var(--danger)',
  // Condition
  good: 'var(--success)',
  fair: 'var(--accent)',
  poor: 'var(--warning)',
  // Industry
  hvac: '#60a5fa',
  property: '#34d399',
  insurance: '#a78bfa',
  manufacturing: '#f97316',
  restoration: '#38bdf8',
};

export function Badge({ children, value }: BadgeProps) {
  const key = (value ?? '').toString().toLowerCase();
  const color = COLOR_MAP[key] ?? 'var(--text-secondary)';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-mono)',
        color,
        background: `${color}18`,
        border: `1px solid ${color}40`,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

/** Colored severity dot */
export function SeverityDot({ severity }: { severity: Severity }) {
  const color = COLOR_MAP[severity] ?? 'var(--text-muted)';
  return (
    <span
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 4px ${color}80`,
        flexShrink: 0,
      }}
    />
  );
}

/** Online/Offline pill */
export function StatusPill({ online }: { online: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '3px 10px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.05em',
        color: online ? 'var(--success)' : 'var(--warning)',
        background: online ? 'var(--success-dim)' : 'var(--warning-dim)',
        border: `1px solid ${online ? 'var(--success)' : 'var(--warning)'}40`,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
      {online ? 'ONLINE' : 'OFFLINE'}
    </span>
  );
}
