import type * as Y from "yjs";
import { SectionShell } from "./SectionShell";
import { useField } from "@/hooks/useDpiaField";
import type { Reasons } from "@/types/dpia";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function S2_Reasons({ ydoc }: { ydoc: Y.Doc }) {
  const [r, setR] = useField<Reasons>(ydoc, "reasons", {} as Reasons);
  const patch = (p: Partial<Reasons>) => setR({ ...r, ...p });

  return (
    <SectionShell title="2. Reasons for the DPIA" guidance="Indicate what has determined the necessity of a DPIA.">
      <div className="space-y-3">
        <label className="flex items-start gap-2 cursor-pointer">
          <Checkbox checked={!!r.highRisk} onChange={v => patch({ highRisk: v })} />
          <span className="text-sm">The proposed activity evidently results in a high risk to the rights and freedoms of the data subjects involved.</span>
        </label>
        <label className="flex items-start gap-2 cursor-pointer">
          <Checkbox checked={!!r.listedByAuthority} onChange={v => patch({ listedByAuthority: v })} />
          <span className="text-sm flex-1">The proposed activity is part of the list of processing activities that require a DPIA, as established by the Autoriteit Persoonsgegevens or another supervisory authority, namely:</span>
        </label>
        <Input value={r.listedBody || ""} onChange={e => patch({ listedBody: e.target.value })} disabled={!r.listedByAuthority} className="ml-6" placeholder="Supervisory authority" />

        <label className="flex items-start gap-2 cursor-pointer">
          <Checkbox checked={!!r.preDpiaIndicated} onChange={v => patch({ preDpiaIndicated: v })} />
          <span className="text-sm flex-1">The pre-DPIA indicated a DPIA was required — applicable combination of criteria:</span>
        </label>
        <Input value={r.preDpiaCriteria || ""} onChange={e => patch({ preDpiaCriteria: e.target.value })} disabled={!r.preDpiaIndicated} className="ml-6" />

        <label className="flex items-start gap-2 cursor-pointer">
          <Checkbox checked={!!r.internalAdvice} onChange={v => patch({ internalAdvice: v })} />
          <span className="text-sm">Internal advice was given to conduct a DPIA. Advice by:</span>
        </label>
        <Input value={r.internalAdviceBy || ""} onChange={e => patch({ internalAdviceBy: e.target.value })} disabled={!r.internalAdvice} className="ml-6" />

        <label className="flex items-start gap-2 cursor-pointer">
          <Checkbox checked={!!r.externalAdvice} onChange={v => patch({ externalAdvice: v })} />
          <span className="text-sm">External advice was given to conduct a DPIA. Advice by:</span>
        </label>
        <Input value={r.externalAdviceBy || ""} onChange={e => patch({ externalAdviceBy: e.target.value })} disabled={!r.externalAdvice} className="ml-6" />
      </div>
    </SectionShell>
  );
}
