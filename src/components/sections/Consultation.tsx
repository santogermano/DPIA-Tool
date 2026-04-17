import type * as Y from "yjs";
import { SectionShell } from "./SectionShell";
import { useField } from "@/hooks/useDpiaField";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type C = { dpoAdvice: string; dpoDate: string; otherAdvice: string; otherDate: string };

export function Consultation({ ydoc }: { ydoc: Y.Doc }) {
  const [c, setC] = useField<C>(ydoc, "consultation", { dpoAdvice: "", dpoDate: "", otherAdvice: "", otherDate: "" });
  return (
    <SectionShell title="Consultation"
      guidance="Summary of advice from the DPO (and CISO, if involved)."
    >
      <div className="space-y-6">
        <div>
          <div className="flex gap-2 items-center mb-1">
            <Label className="flex-1">Data Protection Officer advice</Label>
            <Input type="date" className="w-48" value={c.dpoDate} onChange={e => setC({ ...c, dpoDate: e.target.value })} />
          </div>
          <Textarea rows={6} value={c.dpoAdvice} onChange={e => setC({ ...c, dpoAdvice: e.target.value })} />
        </div>
        <div>
          <div className="flex gap-2 items-center mb-1">
            <Label className="flex-1">Other advice (e.g. CISO)</Label>
            <Input type="date" className="w-48" value={c.otherDate} onChange={e => setC({ ...c, otherDate: e.target.value })} />
          </div>
          <Textarea rows={6} value={c.otherAdvice} onChange={e => setC({ ...c, otherAdvice: e.target.value })} />
        </div>
      </div>
    </SectionShell>
  );
}
