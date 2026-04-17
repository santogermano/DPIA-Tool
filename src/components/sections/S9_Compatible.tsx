import type * as Y from "yjs";
import { SectionShell } from "./SectionShell";
import { useArray } from "@/hooks/useDpiaField";
import type { CompatiblePurposeRow } from "@/types/dpia";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { uid } from "@/lib/ids";
import { Plus, Trash2 } from "lucide-react";

export function S9_Compatible({ ydoc }: { ydoc: Y.Doc }) {
  const rows = useArray<CompatiblePurposeRow>(ydoc, "compatiblePurposeRows");
  return (
    <SectionShell title="9.1 Compatible purpose when re-using data"
      guidance="Only needed when re-using personal data previously collected for a different purpose."
    >
      <div className="space-y-3">
        {rows.items.map(r => (
          <div key={r.id} className="border rounded-lg p-3 bg-muted/20">
            <div className="flex justify-between mb-2">
              <div className="text-xs text-muted-foreground">Re-use analysis</div>
              <Button variant="ghost" size="icon" onClick={() => rows.remove(r.id)}><Trash2 className="h-3 w-3" /></Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Processing activity" value={r.processingActivity} onChange={e => rows.update(r.id, { processingActivity: e.target.value })} />
              <Input placeholder="Personal data" value={r.personalData} onChange={e => rows.update(r.id, { personalData: e.target.value })} />
              <Input placeholder="Original purpose" value={r.originalPurpose} onChange={e => rows.update(r.id, { originalPurpose: e.target.value })} />
              <Input placeholder="New purpose" value={r.newPurpose} onChange={e => rows.update(r.id, { newPurpose: e.target.value })} />
              <Textarea placeholder="Explanation of compatibility" value={r.compatibilityExplanation} onChange={e => rows.update(r.id, { compatibilityExplanation: e.target.value })} className="col-span-2" />
            </div>
          </div>
        ))}
        <Button onClick={() => rows.add({ id: uid(), processingActivity: "", personalData: "", originalPurpose: "", newPurpose: "", compatibilityExplanation: "" })}>
          <Plus className="h-4 w-4 mr-1" /> Add compatibility row
        </Button>
      </div>
    </SectionShell>
  );
}
