import type { ReactNode } from 'react';
import type { Page } from '../../types';
import { useOfflineStatus } from '../../hooks/useOfflineStatus';
import { StatusPill } from '../common/Badge';

interface AppShellProps {
  children: ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const NAV_ITEMS: { label: string; icon: string; page: Page['name'] }[] = [
  { label: 'Dashboard', icon: '⬡', page: 'dashboard' },
  { label: 'Visits', icon: '◈', page: 'visits' },
  { label: 'Log Visit', icon: '⊕', page: 'new-visit' },
  { label: 'Sites', icon: '◉', page: 'sites' },
];

export function AppShell({ children, currentPage, onNavigate }: AppShellProps) {
  const { isOnline } = useOfflineStatus();
  const active = currentPage.name;

  return (
    <div style={{ display: 'flex', height: '100dvh', overflow: 'hidden', background: 'var(--bg-base)' }}>
      {/* Desktop Sidebar */}
      <aside
        style={{
          width: 220,
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          padding: '0 0 16px',
        }}
        className="desktop-sidebar"
      >
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dim) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              ◈
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                FieldLog
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-mono)', letterSpacing: '0.12em' }}>
                IQ
              </div>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.page;
            const isLogVisit = item.page === 'new-visit';
            return (
              <button
                key={item.page}
                onClick={() => onNavigate({ name: item.page } as Page)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 10px',
                  borderRadius: 7,
                  border: isLogVisit ? '1px solid var(--accent)40' : '1px solid transparent',
                  background: isActive
                    ? 'var(--accent-dim)'
                    : isLogVisit
                    ? 'var(--accent)12'
                    : 'transparent',
                  color: isActive ? 'var(--accent)' : isLogVisit ? 'var(--accent)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.12s ease',
                  width: '100%',
                  textAlign: 'left',
                  fontFamily: 'var(--font-body)',
                }}
              >
                <span style={{ fontSize: 16, opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Status indicator */}
        <div style={{ padding: '0 10px' }}>
          <StatusPill online={isOnline} />
          <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6, fontFamily: 'var(--font-mono)', padding: '0 2px' }}>
            {isOnline ? 'Synced · All data saved' : 'Data saved locally'}
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Mobile Top Bar */}
        <header
          className="mobile-header"
          style={{
            height: 52,
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-sidebar)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                color: '#0a0c10',
              }}
            >
              ◈
            </div>
            <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              FieldLog <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>IQ</span>
            </span>
          </div>
          <StatusPill online={isOnline} />
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflow: 'auto' }}>
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <nav
          className="mobile-nav"
          style={{
            height: 60,
            background: 'var(--bg-sidebar)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.page;
            const isLogVisit = item.page === 'new-visit';
            return (
              <button
                key={item.page}
                onClick={() => onNavigate({ name: item.page } as Page)}
                style={{
                  flex: 1,
                  height: '100%',
                  border: 'none',
                  background: 'transparent',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                  cursor: 'pointer',
                  color: isActive ? 'var(--accent)' : isLogVisit ? 'var(--accent)' : 'var(--text-muted)',
                  opacity: isLogVisit && !isActive ? 0.85 : 1,
                }}
              >
                <span style={{ fontSize: isLogVisit ? 22 : 18 }}>{item.icon}</span>
                <span style={{ fontSize: 9, fontWeight: 600, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
                  {item.label.toUpperCase()}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
