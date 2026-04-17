import { scoreRisk, IMPACT_ORDER, LIKELIHOOD_ORDER, IMPACT_LABEL, LIKELIHOOD_LABEL, RISK_COLOR } from "@/lib/riskScorer";
import type { Impact, Likelihood, RiskRow } from "@/types/dpia";

export function RiskMatrix({ risks, highlight }: { risks: RiskRow[]; highlight?: { impact: Impact; likelihood: Likelihood } | null }) {
  // Tally residual risks per cell
  const buckets: Record<string, RiskRow[]> = {};
  for (const r of risks) {
    const k = `${r.residualLikelihood}|${r.residualImpact}`;
    (buckets[k] ||= []).push(r);
  }

  return (
    <div className="overflow-auto">
      <table className="border-collapse text-xs">
        <thead>
          <tr>
            <th className="p-2 text-muted-foreground"></th>
            <th className="p-2 text-muted-foreground" colSpan={IMPACT_ORDER.length}>Impact →</th>
          </tr>
          <tr>
            <th className="p-2 text-muted-foreground">Likelihood ↓</th>
            {IMPACT_ORDER.map(i => <th key={i} className="p-2 border bg-muted/30 font-medium">{IMPACT_LABEL[i]}</th>)}
          </tr>
        </thead>
        <tbody>
          {[...LIKELIHOOD_ORDER].reverse().map(l => (
            <tr key={l}>
              <th className="p-2 border bg-muted/30 font-medium text-left">{LIKELIHOOD_LABEL[l]}</th>
              {IMPACT_ORDER.map(i => {
                const level = scoreRisk(i, l);
                const cellRisks = buckets[`${l}|${i}`] || [];
                const isHl = highlight && highlight.impact === i && highlight.likelihood === l;
                return (
                  <td key={i} className="p-2 border text-center text-white font-bold min-w-[70px]"
                    style={{ backgroundColor: RISK_COLOR[level], outline: isHl ? "3px solid #0ea5e9" : undefined, outlineOffset: -2 }}>
                    <div className="uppercase text-[10px]">{level}</div>
                    {cellRisks.length > 0 && <div className="mt-1 text-[10px]">{cellRisks.length} risk{cellRisks.length > 1 ? "s" : ""}</div>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
