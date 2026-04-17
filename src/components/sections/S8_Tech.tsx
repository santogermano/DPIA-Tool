import type * as Y from "yjs";
import { SectionShell } from "./SectionShell";
import { useArray } from "@/hooks/useDpiaField";
import type { TechRow } from "@/types/dpia";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { uid } from "@/lib/ids";
import { Plus, Trash2 } from "lucide-react";

export function S8_Tech({ ydoc }: { ydoc: Y.Doc }) {
  const rows = useArray<TechRow>(ydoc, "techRows");
  return (
    <SectionShell title="8. Processing activity technology & method"
      guidance="Describe tools, systems, techniques. Flag (semi-)automated decision making, ML, profiling, cloud, big data."
    >
      <div className="space-y-3">
        {rows.items.map(r => (
          <div key={r.id} className="border rounded-lg p-3 bg-muted/20">
            <div className="flex justify-between mb-2">
              <Input className="mr-2" placeholder="Tool / technique / method" value={r.tool} onChange={e => rows.update(r.id, { tool: e.target.value })} />
              <Button variant="ghost" size="icon" onClick={() => rows.remove(r.id)}><Trash2 className="h-3 w-3" /></Button>
            </div>
            <Textarea rows={4} placeholder="Elaboration" value={r.elaboration} onChange={e => rows.update(r.id, { elaboration: e.target.value })} />
          </div>
        ))}
        <Button onClick={() => rows.add({ id: uid(), tool: "", elaboration: "" })}><Plus className="h-4 w-4 mr-1" /> Add tool/method</Button>
      </div>
    </SectionShell>
  );
}
