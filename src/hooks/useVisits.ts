import { useState, useMemo, useCallback } from 'react';
import type { Visit, Site, NewVisitInput, AnalyticsInsight, SiteVolume, DashboardKPIs } from '../types';
import { storageService } from '../services/storageService';
import { computeInsights, computeKPIs, rankSitesByVolume, computeSiteRiskScore } from '../utils/analyticsUtils';
import { generateId } from '../utils/idUtils';

export interface UseVisitsReturn {
  visits: Visit[];
  sites: Site[];
  insights: AnalyticsInsight[];
  kpis: DashboardKPIs;
  siteVolumes: SiteVolume[];
  addVisit: (input: NewVisitInput) => Visit;
  updateVisit: (id: string, updates: Partial<Visit>) => void;
  deleteVisit: (id: string) => void;
  getVisit: (id: string) => Visit | undefined;
  getVisitsForSite: (siteId: string) => Visit[];
  getOrCreateSite: (name: string, address: string, industry: Site['industry']) => Site;
}

export function useVisits(): UseVisitsReturn {
  const [visits, setVisits] = useState<Visit[]>(() => {
    storageService.init();
    return storageService.getVisits();
  });

  const [sites, setSites] = useState<Site[]>(() => storageService.getSites());

  // ── Derived analytics ──────────────────────────────────────────────────────

  const insights = useMemo(() => computeInsights(visits, sites), [visits, sites]);
  const kpis = useMemo(() => computeKPIs(visits), [visits]);
  const siteVolumes = useMemo(() => rankSitesByVolume(visits), [visits]);

  // ── Visit CRUD ─────────────────────────────────────────────────────────────

  const addVisit = useCallback((input: NewVisitInput): Visit => {
    const visit: Visit = {
      ...input,
      id: generateId(),
      timestamp: new Date().toISOString(),
    };
    const updated = [visit, ...visits];
    setVisits(updated);
    storageService.saveVisits(updated);
    return visit;
  }, [visits]);

  const updateVisit = useCallback((id: string, updates: Partial<Visit>) => {
    const updated = visits.map((v) => (v.id === id ? { ...v, ...updates } : v));
    setVisits(updated);
    storageService.saveVisits(updated);
  }, [visits]);

  const deleteVisit = useCallback((id: string) => {
    const updated = visits.filter((v) => v.id !== id);
    setVisits(updated);
    storageService.saveVisits(updated);
  }, [visits]);

  const getVisit = useCallback((id: string) => visits.find((v) => v.id === id), [visits]);

  const getVisitsForSite = useCallback(
    (siteId: string) => visits.filter((v) => v.siteId === siteId),
    [visits]
  );

  // ── Site helpers ───────────────────────────────────────────────────────────

  const getOrCreateSite = useCallback(
    (name: string, address: string, industry: Site['industry']): Site => {
      const existing = sites.find(
        (s) => s.name.toLowerCase() === name.toLowerCase()
      );
      if (existing) return existing;

      const siteVisits = visits.filter((v) => v.siteName.toLowerCase() === name.toLowerCase());
      const newSite: Site = {
        id: generateId(),
        name,
        address,
        industry,
        contactName: '',
        contactPhone: '',
        riskScore: computeSiteRiskScore(siteVisits),
      };
      const updatedSites = [...sites, newSite];
      setSites(updatedSites);
      storageService.saveSites(updatedSites);
      return newSite;
    },
    [sites, visits]
  );

  return {
    visits,
    sites,
    insights,
    kpis,
    siteVolumes,
    addVisit,
    updateVisit,
    deleteVisit,
    getVisit,
    getVisitsForSite,
    getOrCreateSite,
  };
}
