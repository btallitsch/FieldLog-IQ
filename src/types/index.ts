// ─── Core Enums ───────────────────────────────────────────────────────────────

export type IndustryType =
  | 'hvac'
  | 'property'
  | 'insurance'
  | 'manufacturing'
  | 'restoration';

export type VisitType = 'inspection' | 'service' | 'emergency' | 'follow-up';

export type VisitStatus = 'open' | 'in-progress' | 'resolved' | 'escalated';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export type Condition = 'good' | 'fair' | 'poor' | 'critical';

export type InsightType =
  | 'repeat-failure'
  | 'high-volume-site'
  | 'prediction'
  | 'trend';

// ─── Domain Models ─────────────────────────────────────────────────────────────

export interface GeoLocation {
  lat: number;
  lng: number;
  address: string;
  capturedAt: string;
}

export interface Equipment {
  id: string;
  tag: string;
  type: string;
  model: string;
  condition: Condition;
  notes: string;
}

export interface Issue {
  id: string;
  category: string;
  description: string;
  severity: Severity;
  resolved: boolean;
}

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  required: boolean;
}

export interface Visit {
  id: string;
  siteId: string;
  siteName: string;
  siteAddress: string;
  timestamp: string;
  technician: string;
  type: VisitType;
  status: VisitStatus;
  industry: IndustryType;
  geo: GeoLocation | null;
  equipment: Equipment[];
  issues: Issue[];
  checklist: ChecklistItem[];
  notes: string;
  photos: string[];
  duration: number | null; // minutes
}

export interface Site {
  id: string;
  name: string;
  address: string;
  industry: IndustryType;
  contactName: string;
  contactPhone: string;
  riskScore: number; // 0–100
}

// ─── Analytics ─────────────────────────────────────────────────────────────────

export interface AnalyticsInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  severity: Severity;
  siteIds: string[];
  metric?: string;
}

export interface SiteVolume {
  siteId: string;
  siteName: string;
  count: number;
  pct: number;
  openIssues: number;
}

export interface DashboardKPIs {
  totalVisits: number;
  openIssues: number;
  activeSites: number;
  resolvedThisMonth: number;
  emergencyVisits: number;
}

// ─── Navigation ────────────────────────────────────────────────────────────────

export type Page =
  | { name: 'dashboard' }
  | { name: 'visits' }
  | { name: 'visit-detail'; id: string }
  | { name: 'new-visit' }
  | { name: 'sites' };

// ─── Form Input ────────────────────────────────────────────────────────────────

export type NewVisitInput = Omit<Visit, 'id' | 'timestamp'>;
