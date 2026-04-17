import type * as Y from "yjs";
import { SectionShell } from "./SectionShell";
import { useArray } from "@/hooks/useDpiaField";
import type { RiskRow, Impact, Likelihood, RiskTreatment } from "@/types/dpia";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select } from "../ui/select";
import { Button } from "../ui/button";
import { uid } from "@/lib/ids";
import { Plus, Trash2, AlertTriangle } from "lucide-react";
import { RiskMatrix } from "../RiskMatrix";
import { scoreRisk, IMPACT_ORDER, LIKELIHOOD_ORDER, IMPACT_LABEL, LIKELIHOOD_LABEL, RISK_COLOR, isHighOrCritical } from "@/lib/riskScorer";
import { Badge } from "../ui/badge";

const TREATMENTS: RiskTreatment[] = ["mitigation", "acceptance", "avoidance", "transfer"];

export function E_Risks({ ydoc }: { ydoc: Y.Doc }) {
  const rows = useArray<RiskRow>(ydoc, "riskRows");

  const update = (r: RiskRow, patch: Partial<RiskRow>) => {
    const merged: RiskRow = { ...r, ...patch };
    merged.riskRating = scoreRisk(merged.impact, merged.likelihood);
    merged.residualRating = scoreRisk(merged.residualImpact, merged.residualLikelihood);
    rows.update(r.id, merged);
  };

  const addRisk = () => rows.add({
    id: uid(), number: rows.items.length + 1, description: "",
    impact: "negligible", likelihood: "negligible", riskRating: "low",
    treatment: "acceptance", treatmentDescription: "",
    residualImpact: "negligible", residualLikelihood: "negligible", residualRating: "low",
    riskLevel: "", reviewDate: "", riskOwner: "",
  });

  const hasHighResidual = rows.items.some(r => isHighOrCritical(r.residualRating));

  return (
    <SectionShell title="E. Risk assessment & treatment"
      guidance="Rate each risk by impact × likelihood. Measure residual risk after treatment. Use the matrix as reference."
    >
      {hasHighResidual && (
        <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 p-3 text-sm">
          <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-600 shrink-0" />
          <div>
            <div className="font-semibold">Article 36 GDPR check</div>
            One or more residual risks are rated <b>High</b> or <b>Critical</b>. Consult the supervisory authority before starting processing.
          </div>
        </div>
      )}

      <div className="space-y-4 mt-4">
        {rows.items.map((r, idx) => (
          <div key={r.id} className="border rounded-lg p-3 bg-muted/20">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline">#{idx + 1}</Badge>
              <Badge style={{ backgroundColor: RISK_COLOR[r.riskRating] }}>{r.riskRating}</Badge>
              <span className="text-xs text-muted-foreground">→ residual</span>
              <Badge style={{ backgroundColor: RISK_COLOR[r.residualRating] }}>{r.residualRating}</Badge>
              <Button variant="ghost" size="icon" className="ml-auto" onClick={() => rows.remove(r.id)}><Trash2 className="h-3 w-3" /></Button>
            </div>
            <Textarea rows={4} placeholder="Risk description — principles/standards infringed, context, potential consequences" value={r.description} onChange={e => update(r, { description: e.target.value })} className="mb-2" />
            <div className="grid grid-cols-4 gap-2 mb-2">
              <div>
                <div className="text-xs mb-1">Impact</div>
                <Select value={r.impact} onChange={e => update(r, { impact: e.target.value as Impact })}>
                  {IMPACT_ORDER.map(i => <option key={i} value={i}>{IMPACT_LABEL[i]}</option>)}
                </Select>
              </div>
              <div>
                <div className="text-xs mb-1">Likelihood</div>
                <Select value={r.likelihood} onChange={e => update(r, { likelihood: e.target.value as Likelihood })}>
                  {LIKELIHOOD_ORDER.map(l => <option key={l} value={l}>{LIKELIHOOD_LABEL[l]}</option>)}
                </Select>
              </div>
              <div>
                <div className="text-xs mb-1">Treatment</div>
                <Select value={r.treatment} onChange={e => update(r, { treatment: e.target.value as RiskTreatment })}>
                  {TREATMENTS.map(t => <option key={t} value={t}>{t}</option>)}
                </Select>
              </div>
              <div>
                <div className="text-xs mb-1">Review date</div>
                <Input type="month" value={r.reviewDate} onChange={e => update(r, { reviewDate: e.target.value })} />
              </div>
            </div>
            <Textarea rows={3} placeholder="Description of risk treatment (measures)" value={r.treatmentDescription} onChange={e => update(r, { treatmentDescription: e.target.value })} className="mb-2" />
            <div className="grid grid-cols-4 gap-2 mb-2">
              <div>
                <div className="text-xs mb-1">Residual impact</div>
                <Select value={r.residualImpact} onChange={e => update(r, { residualImpact: e.target.value as Impact })}>
                  {IMPACT_ORDER.map(i => <option key={i} value={i}>{IMPACT_LABEL[i]}</option>)}
                </Select>
              </div>
              <div>
                <div className="text-xs mb-1">Residual likelihood</div>
                <Select value={r.residualLikelihood} onChange={e => update(r, { residualLikelihood: e.target.value as Likelihood })}>
                  {LIKELIHOOD_ORDER.map(l => <option key={l} value={l}>{LIKELIHOOD_LABEL[l]}</option>)}
                </Select>
              </div>
              <Input placeholder="Risk level (operational/…)" value={r.riskLevel} onChange={e => update(r, { riskLevel: e.target.value })} />
              <Input placeholder="Risk owner" value={r.riskOwner} onChange={e => update(r, { riskOwner: e.target.value })} />
            </div>
          </div>
        ))}
        <Button onClick={addRisk}><Plus className="h-4 w-4 mr-1" /> Add risk</Button>
      </div>

      <div className="mt-6">
        <div className="text-sm font-semibold mb-2">Residual risk matrix</div>
        <RiskMatrix risks={rows.items} />
      </div>
    </SectionShell>
  );
}
