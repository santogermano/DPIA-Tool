import type * as Y from "yjs";
import { SectionShell } from "./SectionShell";
import { useField } from "@/hooks/useDpiaField";
import type { SecurityAssessment } from "@/types/dpia";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

const FIELDS: [keyof SecurityAssessment, string, string][] = [
  ["iam", "Identity & Access Management (IAM)", "Access controls, least privilege, IAM matrix"],
  ["patch", "Patch Management", "Current patch status, update schedule"],
  ["network", "Network security", "Open ports, exposed interfaces"],
  ["configuration", "Security configuration", "CIS/NIST baselines, hardening"],
  ["loggingMonitoring", "Logging & Monitoring", "Audit logs, privileged account monitoring"],
  ["thirdPartyIntegrations", "Third-Party Integrations", "Supply chain and external dependencies"],
];

export function S8_Security({ ydoc }: { ydoc: Y.Doc }) {
  const [s, setS] = useField<SecurityAssessment>(ydoc, "securityAssessment", {} as SecurityAssessment);
  const patch = (p: Partial<SecurityAssessment>) => setS({ ...s, ...p });

  return (
    <SectionShell title="8.1 Security assessment (if required)"
      guidance="Required when the processing activities involve non-standard IT solutions or special frameworks (NEN 7510, Military TBB, etc.)."
    >
      <label className="flex items-center gap-2 cursor-pointer mb-4">
        <Checkbox checked={!!s.required} onChange={v => patch({ required: v })} />
        <span className="text-sm font-medium">Security assessment is required for this DPIA</span>
      </label>

      {s.required && (
        <div className="space-y-3">
          {FIELDS.map(([k, title, purpose]) => (
            <div key={k as string} className="border rounded-md p-3">
              <Label>{title}</Label>
              <p className="text-xs text-muted-foreground mb-1">{purpose}</p>
              <Textarea rows={3} value={(s[k] as string) || ""} onChange={e => patch({ [k]: e.target.value } as Partial<SecurityAssessment>)} />
            </div>
          ))}
        </div>
      )}
    </SectionShell>
  );
}
