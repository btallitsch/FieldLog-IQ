import { useState, useMemo } from 'react';
import type { UseVisitsReturn } from '../hooks/useVisits';
import type { Page } from '../types';
import { VisitCard } from '../components/visits/VisitCard';
import { FilterBar, type VisitFilters } from '../components/visits/FilterBar';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/Card';

interface VisitsPageProps {
  data: UseVisitsReturn;
  onNavigate: (page: Page) => void;
}

const DEFAULT_FILTERS: VisitFilters = {
  search: '',
  status: 'all',
  type: 'all',
  industry: 'all',
};

export function VisitsPage({ data, onNavigate }: VisitsPageProps) {
  const { visits } = data;
  const [filters, setFilters] = useState<VisitFilters>(DEFAULT_FILTERS);

  const filtered = useMemo(() => {
    let result = [...visits];
    const q = filters.search.trim().toLowerCase();

    if (q) {
      result = result.filter(
        (v) =>
          v.siteName.toLowerCase().includes(q) ||
          v.siteAddress.toLowerCase().includes(q) ||
          v.technician.toLowerCase().includes(q) ||
          v.notes.toLowerCase().includes(q) ||
          v.issues.some((i) => i.category.toLowerCase().includes(q))
      );
    }
    if (filters.status !== 'all') result = result.filter((v) => v.status === filters.status);
    if (filters.type !== 'all') result = result.filter((v) => v.type === filters.type);
    if (filters.industry !== 'all') result = result.filter((v) => v.industry === filters.industry);

    return result;
  }, [visits, filters]);

  return (
    <div style={{ padding: '24px 20px', maxWidth: 800, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Visit Log
          </h1>
          <p style={{ margin: '3px 0 0', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            {visits.length} total records
          </p>
        </div>
        <Button variant="primary" size="sm" icon="⊕" onClick={() => onNavigate({ name: 'new-visit' })}>
          Log Visit
        </Button>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: 18 }}>
        <FilterBar
          filters={filters}
          onChange={setFilters}
          totalCount={visits.length}
          filteredCount={filtered.length}
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="◈"
          title="No visits match your filters"
          description="Try adjusting your search or clearing filters."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((v) => (
            <VisitCard
              key={v.id}
              visit={v}
              onClick={() => onNavigate({ name: 'visit-detail', id: v.id })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
