import type * as Y from "yjs";
import { SectionShell } from "./SectionShell";
import { Checkbox } from "../ui/checkbox";
import { useField } from "@/hooks/useDpiaField";
import type { DataCollection } from "@/types/dpia";

const OPTS: [keyof DataCollection, string][] = [
  ["previouslyCollectedTuePurposeOther", "Data that has previously been collected by TU/e for other purposes"],
  ["previouslyCollectedTuePurposeSame", "Data that has previously been collected by TU/e for this purpose"],
  ["previouslyCollectedExternal", "Data that has previously been collected by an external organization"],
  ["newCollectedTue", "New data collected only by TU/e"],
  ["newCollectedWithExternal", "New data collected together with external collaborators"],
];

export function S4_DataCollection({ ydoc }: { ydoc: Y.Doc }) {
  const [c, setC] = useField<DataCollection>(ydoc, "dataCollection", {} as DataCollection);
  return (
    <SectionShell title="4. Data collection" guidance="Select all options that apply.">
      <div className="space-y-3">
        {OPTS.map(([k, label]) => (
          <label key={k} className="flex items-start gap-2 cursor-pointer">
            <Checkbox checked={!!c[k]} onChange={v => setC({ ...c, [k]: v } as DataCollection)} />
            <span className="text-sm">{label}</span>
          </label>
        ))}
      </div>
    </SectionShell>
  );
}
