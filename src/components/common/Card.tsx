import type { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  padding?: number | string;
  onClick?: () => void;
  hoverable?: boolean;
  accent?: string;
}

export function Card({ children, style, padding = 20, onClick, hoverable, accent }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding,
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: hoverable ? 'border-color 0.15s, transform 0.15s' : undefined,
        ...(accent
          ? { borderLeftColor: accent, borderLeftWidth: 3 }
          : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}

export function SectionHeader({ title, subtitle, right }: SectionHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}

export function Divider({ style }: { style?: CSSProperties }) {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '14px 0', ...style }} />;
}

export function EmptyState({ icon, title, description }: { icon: ReactNode; title: string; description?: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.4 }}>{icon}</div>
      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>{title}</p>
      {description && (
        <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>{description}</p>
      )}
    </div>
  );
}
