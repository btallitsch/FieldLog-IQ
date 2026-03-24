import { useState } from 'react';
import type { Visit, Equipment, Issue, ChecklistItem, IndustryType, VisitType, GeoLocation } from '../../types';
import { generateId } from '../../utils/idUtils';
import { Button } from '../common/Button';
import { useGeo } from '../../hooks/useGeo';

type Step = 'site' | 'details' | 'equipment' | 'issues' | 'checklist' | 'notes';
const STEPS: Step[] = ['site', 'details', 'equipment', 'issues', 'checklist', 'notes'];
const STEP_LABELS: Record<Step, string> = {
  site: 'Site Info',
  details: 'Visit Details',
  equipment: 'Equipment',
  issues: 'Issues',
  checklist: 'Checklist',
  notes: 'Notes & Submit',
};

const DEFAULT_CHECKLISTS: Record<IndustryType, string[]> = {
  hvac: ['Inspect filters', 'Check refrigerant levels', 'Test thermostat calibration', 'Inspect electrical connections', 'Clean condenser coils'],
  property: ['Roof and gutters', 'Foundation inspection', 'Plumbing fixtures', 'Electrical panel', 'HVAC filter check'],
  insurance: ['Document pre-existing damage', 'Photo all affected areas', 'Review policy coverage', 'Collect witness statements', 'Measure affected square footage'],
  manufacturing: ['Safety barrier integrity', 'Fluid levels check', 'Belt and chain tension', 'Electrical grounding', 'Emergency stop test'],
  restoration: ['Moisture meter readings', 'Air quality test', 'Mold swab sampling', 'Document structural damage', 'Insurance photo documentation'],
};

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border)',
  borderRadius: 7,
  color: 'var(--text-primary)',
  padding: '9px 12px',
  fontSize: 13,
  fontFamily: 'var(--font-body)',
  outline: 'none',
  boxSizing: 'border-box',
};

const LABEL_STYLE: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  fontFamily: 'var(--font-mono)',
  letterSpacing: '0.07em',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  marginBottom: 5,
};

interface NewVisitFormProps {
  onSave: (draft: Omit<Visit, 'id' | 'timestamp'>) => void;
  onCancel: () => void;
}

export function NewVisitForm({ onSave, onCancel }: NewVisitFormProps) {
  const [step, setStep] = useState<Step>('site');
  const stepIndex = STEPS.indexOf(step);

  // Form state
  const [siteName, setSiteName] = useState('');
  const [siteAddress, setSiteAddress] = useState('');
  const [industry, setIndustry] = useState<IndustryType>('hvac');
  const [visitType, setVisitType] = useState<VisitType>('inspection');
  const [technician, setTechnician] = useState('');
  const [duration, setDuration] = useState('');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [notes, setNotes] = useState('');
  const [geo, setGeo] = useState<GeoLocation | null>(null);

  const { location: geoLoc, loading: geoLoading, error: geoError, capture: captureGeo } = useGeo();

  // Populate checklist when industry changes
  const applyIndustryChecklist = (ind: IndustryType) => {
    setIndustry(ind);
    if (checklist.length === 0) {
      setChecklist(
        DEFAULT_CHECKLISTS[ind].map((label) => ({
          id: generateId(),
          label,
          checked: false,
          required: true,
        }))
      );
    }
  };

  const handleGeoCapture = () => {
    captureGeo();
  };

  // Sync geo location
  if (geoLoc && !geo) setGeo(geoLoc);

  // Equipment helpers
  const addEquipment = () =>
    setEquipment([...equipment, { id: generateId(), tag: '', type: '', model: '', condition: 'good', notes: '' }]);
  const updateEq = (id: string, patch: Partial<Equipment>) =>
    setEquipment(equipment.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  const removeEq = (id: string) => setEquipment(equipment.filter((e) => e.id !== id));

  // Issue helpers
  const addIssue = () =>
    setIssues([...issues, { id: generateId(), category: '', description: '', severity: 'medium', resolved: false }]);
  const updateIssue = (id: string, patch: Partial<Issue>) =>
    setIssues(issues.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  const removeIssue = (id: string) => setIssues(issues.filter((i) => i.id !== id));

  // Checklist helpers
  const toggleCheck = (id: string) =>
    setChecklist(checklist.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c)));
  const addCustomCheck = () =>
    setChecklist([...checklist, { id: generateId(), label: '', checked: false, required: false }]);
  const updateCheckLabel = (id: string, label: string) =>
    setChecklist(checklist.map((c) => (c.id === id ? { ...c, label } : c)));
  const removeCheck = (id: string) => setChecklist(checklist.filter((c) => c.id !== id));

  const canAdvance = (): boolean => {
    if (step === 'site') return siteName.trim().length > 0 && siteAddress.trim().length > 0;
    if (step === 'details') return technician.trim().length > 0;
    return true;
  };

  const handleSubmit = () => {
    onSave({
      siteId: generateId(),
      siteName: siteName.trim(),
      siteAddress: siteAddress.trim(),
      technician: technician.trim(),
      type: visitType,
      status: 'open',
      industry,
      geo,
      equipment,
      issues,
      checklist,
      notes,
      photos: [],
      duration: duration ? parseInt(duration, 10) : null,
    });
  };

  const SELECT: React.CSSProperties = { ...INPUT_STYLE, cursor: 'pointer' };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 20px' }}>
      {/* Progress bar */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
          {STEPS.map((s, i) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                background: i <= stepIndex ? 'var(--accent)' : 'var(--border)',
                transition: 'background 0.3s',
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {STEP_LABELS[step]}
          </span>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            STEP {stepIndex + 1}/{STEPS.length}
          </span>
        </div>
      </div>

      {/* ── Step: Site Info ── */}
      {step === 'site' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={LABEL_STYLE}>Site Name *</label>
            <input style={INPUT_STYLE} value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="e.g. Riverside Industrial Complex" />
          </div>
          <div>
            <label style={LABEL_STYLE}>Site Address *</label>
            <input style={INPUT_STYLE} value={siteAddress} onChange={(e) => setSiteAddress(e.target.value)} placeholder="Full street address" />
          </div>
          <div>
            <label style={LABEL_STYLE}>Industry</label>
            <select style={SELECT} value={industry} onChange={(e) => applyIndustryChecklist(e.target.value as IndustryType)}>
              <option value="hvac">HVAC</option>
              <option value="property">Property Management</option>
              <option value="insurance">Insurance / Adjuster</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="restoration">Water / Fire Restoration</option>
            </select>
          </div>

          {/* Geo capture */}
          <div>
            <label style={LABEL_STYLE}>Location (GPS)</label>
            {geo ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: 'var(--success-dim)', border: '1px solid var(--success)30', borderRadius: 7 }}>
                <span style={{ color: 'var(--success)', fontSize: 14 }}>◎</span>
                <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--success)' }}>
                  {geo.lat}, {geo.lng}
                </span>
                <button onClick={() => setGeo(null)} style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>clear</button>
              </div>
            ) : (
              <div>
                <Button variant="secondary" icon="◎" onClick={handleGeoCapture} loading={geoLoading}>
                  {geoLoading ? 'Acquiring…' : 'Capture GPS Location'}
                </Button>
                {geoError && <p style={{ margin: '5px 0 0', fontSize: 11, color: 'var(--danger)', fontFamily: 'var(--font-mono)' }}>{geoError}</p>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Step: Visit Details ── */}
      {step === 'details' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={LABEL_STYLE}>Technician / Inspector *</label>
            <input style={INPUT_STYLE} value={technician} onChange={(e) => setTechnician(e.target.value)} placeholder="Full name" />
          </div>
          <div>
            <label style={LABEL_STYLE}>Visit Type</label>
            <select style={SELECT} value={visitType} onChange={(e) => setVisitType(e.target.value as VisitType)}>
              <option value="inspection">Inspection</option>
              <option value="service">Service</option>
              <option value="emergency">Emergency</option>
              <option value="follow-up">Follow-up</option>
            </select>
          </div>
          <div>
            <label style={LABEL_STYLE}>Duration (minutes)</label>
            <input style={INPUT_STYLE} type="number" min="1" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 90" />
          </div>
        </div>
      )}

      {/* ── Step: Equipment ── */}
      {step === 'equipment' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {equipment.map((eq) => (
            <div key={eq.id} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={LABEL_STYLE}>Tag / ID</label>
                  <input style={INPUT_STYLE} value={eq.tag} onChange={(e) => updateEq(eq.id, { tag: e.target.value })} placeholder="e.g. HVAC-A1" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={LABEL_STYLE}>Type</label>
                  <input style={INPUT_STYLE} value={eq.type} onChange={(e) => updateEq(eq.id, { type: e.target.value })} placeholder="Rooftop Unit" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 2 }}>
                  <label style={LABEL_STYLE}>Model</label>
                  <input style={INPUT_STYLE} value={eq.model} onChange={(e) => updateEq(eq.id, { model: e.target.value })} placeholder="Trane XR15" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={LABEL_STYLE}>Condition</label>
                  <select style={SELECT} value={eq.condition} onChange={(e) => updateEq(eq.id, { condition: e.target.value as Equipment['condition'] })}>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={LABEL_STYLE}>Notes</label>
                <input style={INPUT_STYLE} value={eq.notes} onChange={(e) => updateEq(eq.id, { notes: e.target.value })} placeholder="Optional observations" />
              </div>
              <Button variant="danger" size="sm" onClick={() => removeEq(eq.id)}>Remove Equipment</Button>
            </div>
          ))}
          <Button variant="secondary" icon="+" onClick={addEquipment}>Add Equipment</Button>
          {equipment.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>No equipment tagged yet — skip or add above.</p>
          )}
        </div>
      )}

      {/* ── Step: Issues ── */}
      {step === 'issues' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {issues.map((issue) => (
            <div key={issue.id} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 2 }}>
                  <label style={LABEL_STYLE}>Category</label>
                  <input style={INPUT_STYLE} value={issue.category} onChange={(e) => updateIssue(issue.id, { category: e.target.value })} placeholder="e.g. Compressor Failure" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={LABEL_STYLE}>Severity</label>
                  <select style={SELECT} value={issue.severity} onChange={(e) => updateIssue(issue.id, { severity: e.target.value as Issue['severity'] })}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={LABEL_STYLE}>Description</label>
                <textarea
                  style={{ ...INPUT_STYLE, minHeight: 70, resize: 'vertical' }}
                  value={issue.description}
                  onChange={(e) => updateIssue(issue.id, { description: e.target.value })}
                  placeholder="Describe the issue in detail"
                />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={issue.resolved} onChange={(e) => updateIssue(issue.id, { resolved: e.target.checked })} />
                Mark as resolved on this visit
              </label>
              <Button variant="danger" size="sm" onClick={() => removeIssue(issue.id)}>Remove Issue</Button>
            </div>
          ))}
          <Button variant="secondary" icon="+" onClick={addIssue}>Add Issue</Button>
          {issues.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>No issues found — great visit! Skip or add above.</p>
          )}
        </div>
      )}

      {/* ── Step: Checklist ── */}
      {step === 'checklist' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ margin: '0 0 8px', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Pre-loaded for {industry}. Check off completed items.
          </p>
          {checklist.map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--bg-elevated)', borderRadius: 7, border: `1px solid ${item.checked ? 'var(--success)30' : 'var(--border)'}` }}>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleCheck(item.id)}
                style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--accent)', flexShrink: 0 }}
              />
              <input
                style={{ flex: 1, background: 'none', border: 'none', color: item.checked ? 'var(--text-muted)' : 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-body)', outline: 'none', textDecoration: item.checked ? 'line-through' : 'none' }}
                value={item.label}
                onChange={(e) => updateCheckLabel(item.id, e.target.value)}
              />
              <button onClick={() => removeCheck(item.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14, flexShrink: 0 }}>×</button>
            </div>
          ))}
          <Button variant="ghost" size="sm" onClick={addCustomCheck}>+ Add custom item</Button>
          <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {checklist.filter((c) => c.checked).length}/{checklist.length} completed
          </p>
        </div>
      )}

      {/* ── Step: Notes & Submit ── */}
      {step === 'notes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={LABEL_STYLE}>Field Notes</label>
            <textarea
              style={{ ...INPUT_STYLE, minHeight: 120, resize: 'vertical', lineHeight: 1.6 }}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe findings, actions taken, follow-up needed…"
            />
          </div>

          {/* Summary */}
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: '14px 16px' }}>
            <p style={{ margin: '0 0 10px', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.07em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Visit Summary</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {[
                ['Site', siteName],
                ['Technician', technician],
                ['Type', visitType],
                ['Industry', industry],
                ['Equipment', `${equipment.length} tagged`],
                ['Issues', `${issues.length} logged`],
                ['Checklist', `${checklist.filter((c) => c.checked).length}/${checklist.length} done`],
                ['GPS', geo ? `${geo.lat}, ${geo.lng}` : 'Not captured'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{k}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
        {stepIndex > 0 && (
          <Button variant="ghost" onClick={() => setStep(STEPS[stepIndex - 1])}>
            ← Back
          </Button>
        )}
        <Button variant="ghost" onClick={onCancel} style={{ marginRight: 'auto' }}>
          Cancel
        </Button>
        {step !== 'notes' ? (
          <Button variant="primary" disabled={!canAdvance()} onClick={() => setStep(STEPS[stepIndex + 1])}>
            Next →
          </Button>
        ) : (
          <Button variant="primary" onClick={handleSubmit}>
            Save Visit ✓
          </Button>
        )}
      </div>
    </div>
  );
}
