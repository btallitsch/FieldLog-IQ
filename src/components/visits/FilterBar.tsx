import type { VisitStatus, VisitType, IndustryType } from '../../types';

export interface VisitFilters {
  search: string;
  status: VisitStatus | 'all';
  type: VisitType | 'all';
  industry: IndustryType | 'all';
}

interface FilterBarProps {
  filters: VisitFilters;
  onChange: (f: VisitFilters) => void;
  totalCount: number;
  filteredCount: number;
}

const SELECT_STYLE: React.CSSProperties = {
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border)',
  borderRadius: 6,
  color: 'var(--text-secondary)',
  padding: '6px 10px',
  fontSize: 12,
  fontFamily: 'var(--font-mono)',
  cursor: 'pointer',
  outline: 'none',
};

export function FilterBar({ filters, onChange, totalCount, filteredCount }: FilterBarProps) {
  const update = (patch: Partial<VisitFilters>) => onChange({ ...filters, ...patch });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Search */}
      <div style={{ position: 'relative' }}>
        <span
          style={{
            position: 'absolute',
            left: 11,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            fontSize: 14,
            pointerEvents: 'none',
          }}
        >
          ◎
        </span>
        <input
          type="text"
          placeholder="Search sites, technicians, notes…"
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
          style={{
            width: '100%',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 7,
            color: 'var(--text-primary)',
            padding: '8px 12px 8px 34px',
            fontSize: 13,
            fontFamily: 'var(--font-body)',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Dropdowns row */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <select style={SELECT_STYLE} value={filters.status} onChange={(e) => update({ status: e.target.value as VisitFilters['status'] })}>
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="escalated">Escalated</option>
        </select>

        <select style={SELECT_STYLE} value={filters.type} onChange={(e) => update({ type: e.target.value as VisitFilters['type'] })}>
          <option value="all">All Types</option>
          <option value="inspection">Inspection</option>
          <option value="service">Service</option>
          <option value="emergency">Emergency</option>
          <option value="follow-up">Follow-up</option>
        </select>

        <select style={SELECT_STYLE} value={filters.industry} onChange={(e) => update({ industry: e.target.value as VisitFilters['industry'] })}>
          <option value="all">All Industries</option>
          <option value="hvac">HVAC</option>
          <option value="property">Property</option>
          <option value="insurance">Insurance</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="restoration">Restoration</option>
        </select>

        <span style={{ marginLeft: 'auto', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          {filteredCount === totalCount ? `${totalCount} visits` : `${filteredCount} of ${totalCount}`}
        </span>
      </div>
    </div>
  );
}
