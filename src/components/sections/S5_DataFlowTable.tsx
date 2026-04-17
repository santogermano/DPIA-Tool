import type * as Y from "yjs";
import { SectionShell } from "./SectionShell";
import { useArray } from "@/hooks/useDpiaField";
import type { DataFlowRow, DataCategory } from "@/types/dpia";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Select } from "../ui/select";
import { uid } from "@/lib/ids";
import { Plus, Trash2 } from "lucide-react";

const CAT: DataCategory[] = ["regular", "special", "sensitive", "criminal", "national-id", "anonymous"];

export function S5_DataFlowTable({ ydoc }: { ydoc: Y.Doc }) {
  const rows = useArray<DataFlowRow>(ydoc, "dataFlowRows");

  return (
    <SectionShell title="5. Data flow table"
      guidance="Describe each processing activity, its purpose, personal data, data subjects, source, storage, retention. This feeds the auto-generated data diagram."
    >
      <div className="space-y-4">
        {rows.items.map((r, idx) => (
          <div key={r.id} className="border rounded-lg p-3 bg-muted/20">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-muted-foreground">Row {idx + 1}</div>
              <Button variant="ghost" size="icon" onClick={() => rows.remove(r.id)}><Trash2 className="h-3 w-3" /></Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Processing activity (WHAT)" value={r.processingActivity} onChange={e => rows.update(r.id, { processingActivity: e.target.value })} />
              <Input placeholder="Processing purpose (WHY)" value={r.processingPurpose} onChange={e => rows.update(r.id, { processingPurpose: e.target.value })} />
              <Input placeholder="Personal data category label (e.g. Contact details)" value={r.personalDataCategory} onChange={e => rows.update(r.id, { personalDataCategory: e.target.value })} />
              <Input placeholder="Personal data items (e.g. name, email)" value={r.personalDataItems} onChange={e => rows.update(r.id, { personalDataItems: e.target.value })} />
              <Select value={r.dataCategoryType} onChange={e => rows.update(r.id, { dataCategoryType: e.target.value as DataCategory })}>
                {CAT.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
              <Input placeholder="Data subjects (e.g. research participants)" value={r.dataSubjects} onChange={e => rows.update(r.id, { dataSubjects: e.target.value })} />
              <Input placeholder="Source" value={r.source} onChange={e => rows.update(r.id, { source: e.target.value })} />
              <Input placeholder="Storage location (e.g. Research Drive)" value={r.storageLocation} onChange={e => rows.update(r.id, { storageLocation: e.target.value })} />
              <Input placeholder="Retention period" value={r.retentionPeriod} onChange={e => rows.update(r.id, { retentionPeriod: e.target.value })} />
              <Textarea placeholder="Motivation for retention period" value={r.retentionMotivation} onChange={e => rows.update(r.id, { retentionMotivation: e.target.value })} />
            </div>
          </div>
        ))}
        <Button onClick={() => rows.add({ id: uid(), processingActivity: "", processingPurpose: "", personalDataCategory: "", personalDataItems: "", dataCategoryType: "regular", dataSubjects: "", source: "", storageLocation: "", retentionPeriod: "", retentionMotivation: "" })}>
          <Plus className="h-4 w-4 mr-1" /> Add processing activity
        </Button>
      </div>
    </SectionShell>
  );
}
