import type * as Y from "yjs";
import { SectionShell } from "./SectionShell";
import { useField } from "@/hooks/useDpiaField";
import type { RightRow, RightKey } from "@/types/dpia";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { useEffect } from "react";

const RIGHTS: { key: RightKey; label: string }[] = [
  { key: "access", label: "Right of access" },
  { key: "rectification", label: "Right to rectification" },
  { key: "restriction", label: "Right to restriction of processing" },
  { key: "erasure", label: "Right to be forgotten" },
  { key: "portability", label: "Right to data portability" },
  { key: "object", label: "Right to object" },
  { key: "noAutomatedDecision", label: "Right not to be subjected to automated decisions" },
];

const BASES = ["consent", "contract", "legalObligation", "vitalInterest", "publicInterest", "legitimateInterest", "scientificResearch"] as const;
const BASIS_LABELS: Record<typeof BASES[number], string> = {
  consent: "Consent", contract: "Contract", legalObligation: "Legal obligation", vitalInterest: "Vital", publicInterest: "Public", legitimateInterest: "Legitimate", scientificResearch: "Scientific",
};

const defaultRow = (key: RightKey): RightRow => ({ right: key, consent: true, contract: true, legalObligation: true, vitalInterest: true, publicInterest: true, legitimateInterest: true, scientificResearch: true, explanation: "" });

export function S10_Rights({ ydoc }: { ydoc: Y.Doc }) {
  const [rights, setRights] = useField<RightRow[]>(ydoc, "rights", []);

  useEffect(() => {
    if (!rights || rights.length === 0) setRights(RIGHTS.map(r => defaultRow(r.key)));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const update = (key: RightKey, patch: Partial<RightRow>) => {
    const existing = rights.length > 0 ? rights : RIGHTS.map(r => defaultRow(r.key));
    setRights(existing.map(r => r.right === key ? { ...r, ...patch } : r));
  };

  const list = rights.length > 0 ? rights : RIGHTS.map(r => defaultRow(r.key));

  return (
    <SectionShell title="10. Data subjects' rights"
      guidance="Indicate how each right is taken into account per legal basis, and any legal restrictions."
    >
      <div className="overflow-auto">
        <table className="w-full text-xs border">
          <thead>
            <tr className="bg-muted/30">
              <th className="p-2 text-left">Right</th>
              {BASES.map(b => <th key={b} className="p-2 text-center">{BASIS_LABELS[b]}</th>)}
              <th className="p-2 text-left">Explanation</th>
            </tr>
          </thead>
          <tbody>
            {list.map(r => (
              <tr key={r.right} className="border-t align-top">
                <td className="p-2 font-medium">{RIGHTS.find(x => x.key === r.right)?.label}</td>
                {BASES.map(b => (
                  <td key={b} className="p-2 text-center">
                    <Checkbox checked={!!r[b]} onChange={v => update(r.right, { [b]: v } as Partial<RightRow>)} />
                  </td>
                ))}
                <td className="p-1 min-w-[240px]"><Textarea rows={2} value={r.explanation} onChange={e => update(r.right, { explanation: e.target.value })} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionShell>
  );
}
