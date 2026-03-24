import type { SiteVolume } from '../../types';

interface SiteVolumeBarProps {
  volumes: SiteVolume[];
}

export function SiteVolumeBar({ volumes }: SiteVolumeBarProps) {
  const top5 = volumes.slice(0, 5);
  const max = top5[0]?.count ?? 1;

  if (top5.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, padding: '20px 0' }}>
        No visits logged yet.
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {top5.map((site, i) => (
        <div key={site.siteId}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 9,
                  fontWeight: 800,
                  color: i === 0 ? 'var(--accent)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {site.siteName}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {site.openIssues > 0 && (
                <span
                  style={{
                    fontSize: 10,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--warning)',
                    background: 'var(--warning-dim)',
                    padding: '1px 6px',
                    borderRadius: 3,
                    border: '1px solid var(--warning)30',
                  }}
                >
                  {site.openIssues} open
                </span>
              )}
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', width: 40, textAlign: 'right' }}>
                {site.count} / {site.pct}%
              </span>
            </div>
          </div>

          {/* Bar track */}
          <div
            style={{
              height: 4,
              background: 'var(--bg-elevated)',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${(site.count / max) * 100}%`,
                background: i === 0
                  ? 'var(--accent)'
                  : `color-mix(in srgb, var(--accent) ${70 - i * 12}%, var(--border))`,
                borderRadius: 2,
                transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
