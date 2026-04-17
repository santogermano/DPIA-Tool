import type * as Y from "yjs";
import { SectionShell } from "./SectionShell";
import { useArray } from "@/hooks/useDpiaField";
import type { LegalBasisRow, LegalBasis } from "@/types/dpia";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select } from "../ui/select";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { uid } from "@/lib/ids";
import { Plus, Trash2 } from "lucide-react";

const BASES: { value: LegalBasis; label: string }[] = [
  { value: "consent", label: "Consent" },
  { value: "contract", label: "Performance of a contract" },
  { value: "legal-obligation", label: "Legal obligation" },
  { value: "vital-interests", label: "Vital interests" },
  { value: "public-interest", label: "Public interest / task" },
  { value: "legitimate-interest", label: "Legitimate interest" },
];

export function S9_LegalBasis({ ydoc }: { ydoc: Y.Doc }) {
  const rows = useArray<LegalBasisRow>(ydoc, "legalBasisRows");
  return (
    <SectionShell title="9. Legal basis"
      guidance="Determine which legal basis (GDPR Art. 6) applies per processing purpose. Special/criminal data also require an Art. 9/10 exception."
    >
      <div className="space-y-3">
        {rows.items.map(r => (
          <div key={r.id} className="border rounded-lg p-3 bg-muted/20">
            <div className="flex justify-between mb-2">
              <div className="text-sm font-medium">{r.processingPurpose || "Processing purpose"}</div>
              <Button variant="ghost" size="icon" onClick={() => rows.remove(r.id)}><Trash2 className="h-3 w-3" /></Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Processing purpose" value={r.processingPurpose} onChange={e => rows.update(r.id, { processingPurpose: e.target.value })} />
              <Select value={r.legalBasis} onChange={e => rows.update(r.id, { legalBasis: e.target.value as LegalBasis })}>
                {BASES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
              </Select>
              <label className="flex items-center gap-2 cursor-pointer col-span-2 text-sm">
                <Checkbox checked={r.applicable} onChange={v => rows.update(r.id, { applicable: v })} />
                Applicable
              </label>
              <Textarea placeholder="Description / motivation" value={r.description} onChange={e => rows.update(r.id, { description: e.target.value })} className="col-span-2" />
              <Input placeholder="Special category of data (if any)" value={r.specialCategoryData} onChange={e => rows.update(r.id, { specialCategoryData: e.target.value })} />
              <Input placeholder="Art. 9/10 exception" value={r.exceptionDescription} onChange={e => rows.update(r.id, { exceptionDescription: e.target.value })} />
            </div>
          </div>
        ))}
        <Button onClick={() => rows.add({ id: uid(), processingPurpose: "", legalBasis: "consent", applicable: false, description: "", specialCategoryData: "", exceptionDescription: "" })}>
          <Plus className="h-4 w-4 mr-1" /> Add legal basis row
        </Button>
      </div>
    </SectionShell>
  );
}
