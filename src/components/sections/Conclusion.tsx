import type * as Y from "yjs";
import { SectionShell } from "./SectionShell";
import { useField } from "@/hooks/useDpiaField";
import { Textarea } from "../ui/textarea";

export function Conclusion({ ydoc }: { ydoc: Y.Doc }) {
  const [v, setV] = useField<string>(ydoc, "conclusion", "");
  return (
    <SectionShell title="Conclusion"
      guidance="Summary of findings, overall risk assessment, effectiveness of measures, GDPR-principle compliance, recommendations. Usually co-written with the Privacy Officer."
    >
      <Textarea rows={10} value={v} onChange={e => setV(e.target.value)} />
    </SectionShell>
  );
}
