interface KpiCardProps {
  label: string;
  value: number | string;
  icon: string;
  accent?: string;
  sub?: string;
}

export function KpiCard({ label, value, icon, accent = 'var(--accent)', sub }: KpiCardProps) {
  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow strip */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, ${accent}00, ${accent}, ${accent}00)`,
          borderRadius: '10px 10px 0 0',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          {label}
        </span>
        <span style={{ fontSize: 18, opacity: 0.7 }}>{icon}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.03em' }}>
          {value}
        </span>
        {sub && (
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}
