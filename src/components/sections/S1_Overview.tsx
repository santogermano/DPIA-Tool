import type * as Y from "yjs";
import { SectionShell } from "./SectionShell";
import { Textarea } from "../ui/textarea";
import { useField } from "@/hooks/useDpiaField";

export function S1_Overview({ ydoc }: { ydoc: Y.Doc }) {
  const [v, setV] = useField<string>(ydoc, "overviewOfProcessing", "");
  return (
    <SectionShell title="1. Overview of the processing"
      guidance="Describe the nature, scope and context of the project and clearly indicate its purpose(s). Clearly describe what is in scope, and what is out of scope of this DPIA."
    >
      <Textarea rows={10} value={v} onChange={e => setV(e.target.value)} placeholder="Describe the project, research, process, or product…" />
    </SectionShell>
  );
}
