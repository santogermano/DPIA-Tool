import type * as Y from "yjs";
import { SectionShell } from "./SectionShell";
import { DataFlowDiagram } from "../DataFlowDiagram";
import { useArray } from "@/hooks/useDpiaField";
import type { DataFlowRow, InvolvedParty } from "@/types/dpia";

export function S5_Diagram({ ydoc }: { ydoc: Y.Doc }) {
  const rows = useArray<DataFlowRow>(ydoc, "dataFlowRows");
  const parties = useArray<InvolvedParty>(ydoc, "involvedParties");
  return (
    <SectionShell title="5.1 Data diagram (auto-generated)"
      guidance="The diagram updates live as you edit sections 5 and 6. Blue = data subjects, green = data, purple = purpose, amber = storage, orange = processor, red = third country."
    >
      <DataFlowDiagram rows={rows.items} parties={parties.items} />
    </SectionShell>
  );
}
