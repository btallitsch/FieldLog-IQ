import type {
  Visit,
  Site,
  AnalyticsInsight,
  SiteVolume,
  DashboardKPIs,
  Severity,
} from '../types';
import { generateId } from './idUtils';
import { startOfMonth } from './dateUtils';

// ─── KPI Computation ───────────────────────────────────────────────────────────

export function computeKPIs(visits: Visit[]): DashboardKPIs {
  const monthStart = startOfMonth();
  const openIssues = visits.flatMap((v) => v.issues).filter((i) => !i.resolved).length;
  const resolvedThisMonth = visits
    .filter((v) => new Date(v.timestamp) >= monthStart && v.status === 'resolved')
    .length;
  const activeSiteIds = new Set(visits.map((v) => v.siteId));
  const emergencyVisits = visits.filter((v) => v.type === 'emergency').length;

  return {
    totalVisits: visits.length,
    openIssues,
    activeSites: activeSiteIds.size,
    resolvedThisMonth,
    emergencyVisits,
  };
}

// ─── Site Volume Ranking ───────────────────────────────────────────────────────

export function rankSitesByVolume(visits: Visit[]): SiteVolume[] {
  const map: Record<string, { siteName: string; count: number; openIssues: number }> = {};

  visits.forEach((v) => {
    if (!map[v.siteId]) map[v.siteId] = { siteName: v.siteName, count: 0, openIssues: 0 };
    map[v.siteId].count++;
    map[v.siteId].openIssues += v.issues.filter((i) => !i.resolved).length;
  });

  const total = visits.length || 1;
  return Object.entries(map)
    .map(([siteId, { siteName, count, openIssues }]) => ({
      siteId,
      siteName,
      count,
      pct: Math.round((count / total) * 100),
      openIssues,
    }))
    .sort((a, b) => b.count - a.count);
}

// ─── Repeat Failure Detection ──────────────────────────────────────────────────

export function detectRepeatFailures(visits: Visit[]): AnalyticsInsight[] {
  // Build: siteId → category → visitIds[]
  const siteMap: Record<string, Record<string, string[]>> = {};

  visits.forEach((v) => {
    if (!siteMap[v.siteId]) siteMap[v.siteId] = {};
    v.issues.forEach((issue) => {
      const cat = issue.category;
      if (!siteMap[v.siteId][cat]) siteMap[v.siteId][cat] = [];
      siteMap[v.siteId][cat].push(v.id);
    });
  });

  const insights: AnalyticsInsight[] = [];

  Object.entries(siteMap).forEach(([siteId, categories]) => {
    const siteName = visits.find((v) => v.siteId === siteId)?.siteName ?? siteId;

    Object.entries(categories).forEach(([category, visitIds]) => {
      if (visitIds.length >= 2) {
        const severity: Severity = visitIds.length >= 4 ? 'critical' : visitIds.length >= 3 ? 'high' : 'medium';
        insights.push({
          id: generateId(),
          type: 'repeat-failure',
          title: `Recurring: ${category}`,
          description: `${siteName} reported "${category}" across ${visitIds.length} visits. Root cause investigation recommended.`,
          severity,
          siteIds: [siteId],
          metric: `${visitIds.length}× logged`,
        });
      }
    });
  });

  return insights.sort((a, b) => {
    const order: Severity[] = ['critical', 'high', 'medium', 'low'];
    return order.indexOf(a.severity) - order.indexOf(b.severity);
  });
}

// ─── High-Volume Site Insight ──────────────────────────────────────────────────

export function detectHighVolumeSites(visits: Visit[]): AnalyticsInsight[] {
  const ranking = rankSitesByVolume(visits);
  const insights: AnalyticsInsight[] = [];

  if (ranking.length === 0) return insights;

  // Find sites accounting for top concentration
  let cumPct = 0;
  const topSites: SiteVolume[] = [];
  for (const site of ranking) {
    cumPct += site.pct;
    topSites.push(site);
    if (cumPct >= 60 && topSites.length >= 2) break;
  }

  if (topSites.length >= 2 && cumPct >= 40) {
    const names = topSites.map((s) => s.siteName).join(', ');
    insights.push({
      id: generateId(),
      type: 'high-volume-site',
      title: `${topSites.length} Sites · ${cumPct}% of Calls`,
      description: `${names} are driving the majority of field visits. Consider proactive maintenance contracts.`,
      severity: cumPct >= 60 ? 'high' : 'medium',
      siteIds: topSites.map((s) => s.siteId),
      metric: `${cumPct}% concentration`,
    });
  }

  return insights;
}

// ─── Predictive Service Insight ────────────────────────────────────────────────

export function predictNextServices(visits: Visit[]): AnalyticsInsight[] {
  const siteVisits: Record<string, Visit[]> = {};

  visits.forEach((v) => {
    if (!siteVisits[v.siteId]) siteVisits[v.siteId] = [];
    siteVisits[v.siteId].push(v);
  });

  const insights: AnalyticsInsight[] = [];
  const today = Date.now();

  Object.entries(siteVisits).forEach(([, siteVs]) => {
    if (siteVs.length < 2) return;
    const sorted = [...siteVs].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Average interval in days
    let totalGap = 0;
    for (let i = 1; i < sorted.length; i++) {
      totalGap +=
        new Date(sorted[i].timestamp).getTime() - new Date(sorted[i - 1].timestamp).getTime();
    }
    const avgGapMs = totalGap / (sorted.length - 1);
    const avgGapDays = Math.round(avgGapMs / 86_400_000);

    const lastVisitMs = new Date(sorted[sorted.length - 1].timestamp).getTime();
    const nextEstimatedMs = lastVisitMs + avgGapMs;
    const daysUntil = Math.round((nextEstimatedMs - today) / 86_400_000);

    if (daysUntil <= 14 && daysUntil >= -3) {
      const siteName = sorted[0].siteName;
      const label =
        daysUntil < 0 ? `${Math.abs(daysUntil)}d overdue` : daysUntil === 0 ? 'today' : `in ${daysUntil}d`;
      insights.push({
        id: generateId(),
        type: 'prediction',
        title: `Service Due: ${siteName}`,
        description: `Based on a ${avgGapDays}-day average visit cycle, the next service visit is predicted ${label}.`,
        severity: daysUntil < 0 ? 'high' : 'medium',
        siteIds: [sorted[0].siteId],
        metric: label,
      });
    }
  });

  return insights;
}

// ─── Aggregated Insights ───────────────────────────────────────────────────────

export function computeInsights(visits: Visit[], _sites: Site[]): AnalyticsInsight[] {
  return [
    ...detectRepeatFailures(visits),
    ...detectHighVolumeSites(visits),
    ...predictNextServices(visits),
  ].slice(0, 8); // Cap at 8 top insights
}

// ─── Risk Score for a Site ─────────────────────────────────────────────────────

export function computeSiteRiskScore(visits: Visit[]): number {
  if (visits.length === 0) return 0;
  const openIssues = visits.flatMap((v) => v.issues).filter((i) => !i.resolved).length;
  const criticalIssues = visits
    .flatMap((v) => v.issues)
    .filter((i) => i.severity === 'critical' && !i.resolved).length;
  const emergencies = visits.filter((v) => v.type === 'emergency').length;
  const score = Math.min(100, openIssues * 5 + criticalIssues * 20 + emergencies * 15);
  return score;
}
