import type { Dpia } from "@/types/dpia";

function fieldFilled(v: unknown): boolean {
  if (v == null) return false;
  if (typeof v === "string") return v.trim().length > 0;
  if (typeof v === "boolean") return v === true;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "object") return Object.values(v as object).some(fieldFilled);
  return true;
}

export function sectionCompletion(dpia: Dpia): { overall: number; perSection: Record<string, number> } {
  const per: Record<string, number> = {
    "cover": [dpia.projectName, dpia.people.department, dpia.people.projectLeader, dpia.people.dpo].filter(fieldFilled).length / 4,
    "s1-overview": fieldFilled(dpia.overviewOfProcessing) ? 1 : 0,
    "s2-reasons": Object.values(dpia.reasons).some(fieldFilled) ? 1 : 0,
    "s3-data-subjects": fieldFilled(dpia.dataSubjects) ? 1 : 0,
    "s4-data-collection": Object.values(dpia.dataCollection).some(Boolean) ? 1 : 0,
    "s5-data-flow": dpia.dataFlowRows.length > 0 ? 1 : 0,
    "s5-diagram": dpia.dataFlowRows.length > 0 ? 1 : 0,
    "s6-parties": dpia.involvedParties.length > 0 ? 1 : 0,
    "s7-pbd": Object.values(dpia.pbd).filter(fieldFilled).length / 9,
    "s8-tech": dpia.techRows.length > 0 ? 1 : 0,
    "s8-security": dpia.securityAssessment.required ? (Object.entries(dpia.securityAssessment).filter(([k, v]) => k !== "required" && fieldFilled(v)).length / 6) : 1,
    "s9-legal-basis": dpia.legalBasisRows.length > 0 ? 1 : 0,
    "s9-compatible": 1,
    "s10-rights": dpia.rights.some(r => fieldFilled(r.explanation)) ? 1 : 0,
    "s11-12-necessity": (fieldFilled(dpia.necessity.proportionality) ? 0.5 : 0) + (fieldFilled(dpia.necessity.subsidiarity) ? 0.5 : 0),
    "e-risks": dpia.riskRows.length > 0 ? 1 : 0,
    "conclusion": fieldFilled(dpia.conclusion) ? 1 : 0,
    "consultation": fieldFilled(dpia.consultation.dpoAdvice) ? 1 : 0,
  };
  const overall = Object.values(per).reduce((a, b) => a + b, 0) / Object.keys(per).length;
  return { overall, perSection: per };
}

export function ProgressRing({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const c = 2 * Math.PI * 16;
  const off = c * (1 - value);
  return (
    <div className="inline-flex items-center gap-2">
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="16" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
        <circle cx="20" cy="20" r="16" fill="none" stroke="hsl(var(--primary))" strokeWidth="4"
          strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 20 20)" strokeLinecap="round" />
        <text x="20" y="22" textAnchor="middle" fontSize="11" fontWeight="bold" fill="currentColor">{pct}</text>
      </svg>
      <span className="text-xs text-muted-foreground">% complete</span>
    </div>
  );
}
