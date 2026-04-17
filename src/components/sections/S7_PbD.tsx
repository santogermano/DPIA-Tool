import type * as Y from "yjs";
import { SectionShell } from "./SectionShell";
import { useField } from "@/hooks/useDpiaField";
import type { PbdStrategies } from "@/types/dpia";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

const STRATEGIES: [keyof PbdStrategies, string, string][] = [
  ["minimize", "Minimize", "How are you making sure you are only processing the necessary data?"],
  ["separate", "Separate", "Is personal data separated as much as possible to lower the risk of combination/correlation?"],
  ["abstract", "Abstract", "Is the level of detail in processed personal data minimized?"],
  ["hide", "Hide", "How is personal data protected and kept from being exposed or linked?"],
  ["inform", "Inform", "How do you inform the data subjects?"],
  ["control", "Control", "Do you provide adequate control to data subjects on their personal data?"],
  ["enforce", "Enforce", "How do you enforce organizational and technical controls?"],
  ["demonstrate", "Demonstrate", "How do you demonstrate compliance?"],
  ["other", "Other", "Additional measures, PETs, EEA-based hosting, etc."],
];

export function S7_PbD({ ydoc }: { ydoc: Y.Doc }) {
  const [pbd, setPbd] = useField<PbdStrategies>(ydoc, "pbd", {} as PbdStrategies);
  return (
    <SectionShell title="7. Privacy by Design & by Default"
      guidance="Consider measures across 8 strategies. See Annex 2 examples in the PDF export."
    >
      <div className="grid grid-cols-2 gap-4">
        {STRATEGIES.map(([k, label, hint]) => (
          <div key={k}>
            <Label>{label}</Label>
            <p className="text-xs text-muted-foreground mb-1">{hint}</p>
            <Textarea rows={4} value={pbd[k] || ""} onChange={e => setPbd({ ...pbd, [k]: e.target.value } as PbdStrategies)} />
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
