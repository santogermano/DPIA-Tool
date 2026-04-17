import type * as Y from "yjs";
import { SectionShell } from "./SectionShell";
import { Textarea } from "../ui/textarea";
import { useField } from "@/hooks/useDpiaField";

export function S3_DataSubjects({ ydoc }: { ydoc: Y.Doc }) {
  const [v, setV] = useField<string>(ydoc, "dataSubjects", "");
  return (
    <SectionShell title="3. Data subjects"
      guidance="Indicate the categories of individuals that the personal data relates to, their number, age group, and if they belong to any vulnerable group."
    >
      <Textarea rows={8} value={v} onChange={e => setV(e.target.value)} placeholder="E.g. research participants, students, employees…" />
    </SectionShell>
  );
}
