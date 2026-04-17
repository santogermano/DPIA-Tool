import type * as Y from "yjs";
import { SectionShell } from "./SectionShell";
import { useField } from "@/hooks/useDpiaField";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

type N = { proportionality: string; subsidiarity: string };

export function S11_12_Necessity({ ydoc }: { ydoc: Y.Doc }) {
  const [n, setN] = useField<N>(ydoc, "necessity", { proportionality: "", subsidiarity: "" });
  return (
    <SectionShell title="11 & 12. Necessity and proportionality"
      guidance="Assess whether each planned processing activity is necessary and proportionate."
    >
      <div className="space-y-4">
        <div>
          <Label>11. Proportionality</Label>
          <p className="text-xs text-muted-foreground mb-1">Is the infringement on privacy proportionate to the purpose?</p>
          <Textarea rows={6} value={n.proportionality} onChange={e => setN({ ...n, proportionality: e.target.value })} />
        </div>
        <div>
          <Label>12. Subsidiarity</Label>
          <p className="text-xs text-muted-foreground mb-1">Can the purposes be achieved by less intrusive means?</p>
          <Textarea rows={6} value={n.subsidiarity} onChange={e => setN({ ...n, subsidiarity: e.target.value })} />
        </div>
      </div>
    </SectionShell>
  );
}
