import type { Visit, Site } from '../types';
import { SEED_VISITS, SEED_SITES } from './seedData';

const VISITS_KEY = 'fieldlog_visits_v1';
const SITES_KEY = 'fieldlog_sites_v1';

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage write failed:', e);
  }
}

// ─── Visits ────────────────────────────────────────────────────────────────────

export const storageService = {
  // Initialize with seed data if empty
  init(): void {
    const visits = safeGet<Visit[]>(VISITS_KEY, []);
    const sites = safeGet<Site[]>(SITES_KEY, []);
    if (visits.length === 0) safeSet(VISITS_KEY, SEED_VISITS);
    if (sites.length === 0) safeSet(SITES_KEY, SEED_SITES);
  },

  getVisits(): Visit[] {
    return safeGet<Visit[]>(VISITS_KEY, SEED_VISITS);
  },

  saveVisits(visits: Visit[]): void {
    safeSet(VISITS_KEY, visits);
  },

  getSites(): Site[] {
    return safeGet<Site[]>(SITES_KEY, SEED_SITES);
  },

  saveSites(sites: Site[]): void {
    safeSet(SITES_KEY, sites);
  },

  clearAll(): void {
    localStorage.removeItem(VISITS_KEY);
    localStorage.removeItem(SITES_KEY);
  },
};
