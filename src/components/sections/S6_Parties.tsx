import type * as Y from "yjs";
import { SectionShell } from "./SectionShell";
import { useArray } from "@/hooks/useDpiaField";
import type { InvolvedParty, PartyRole } from "@/types/dpia";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select } from "../ui/select";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { uid } from "@/lib/ids";
import { Plus, Trash2, AlertTriangle } from "lucide-react";

const ROLES: PartyRole[] = ["controller", "joint-controller", "processor", "sub-processor", "provider", "recipient", "third-party"];

export function S6_Parties({ ydoc }: { ydoc: Y.Doc }) {
  const parties = useArray<InvolvedParty>(ydoc, "involvedParties");
  return (
    <SectionShell title="6. Involved parties"
      guidance="Identify each party, their role, the data they can access, their location, and any transfer mechanism for third-country transfers."
    >
      <div className="space-y-4">
        {parties.items.map(p => (
          <div key={p.id} className="border rounded-lg p-3 bg-muted/20">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">{p.name || "Unnamed party"}</div>
              <Button variant="ghost" size="icon" onClick={() => parties.remove(p.id)}><Trash2 className="h-3 w-3" /></Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Name" value={p.name} onChange={e => parties.update(p.id, { name: e.target.value })} />
              <Select value={p.role} onChange={e => parties.update(p.id, { role: e.target.value as PartyRole })}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </Select>
              <Input placeholder="Functions / Departments with access" value={p.functions} onChange={e => parties.update(p.id, { functions: e.target.value })} />
              <Textarea placeholder="Interest description" value={p.interestDescription} onChange={e => parties.update(p.id, { interestDescription: e.target.value })} />
              <Input placeholder="Data category" value={p.dataCategory} onChange={e => parties.update(p.id, { dataCategory: e.target.value })} />
              <Input placeholder="Location (country)" value={p.location} onChange={e => parties.update(p.id, { location: e.target.value })} />
              <Input placeholder="Data Processing Agreement" value={p.dpa} onChange={e => parties.update(p.id, { dpa: e.target.value })} />
              <Input placeholder="Transfer mechanism & safeguards" value={p.transferMechanism} onChange={e => parties.update(p.id, { transferMechanism: e.target.value })} />
            </div>
            <label className="flex items-center gap-2 mt-2 cursor-pointer text-xs">
              <Checkbox checked={p.isThirdCountry} onChange={v => parties.update(p.id, { isThirdCountry: v })} />
              <span>Outside EEA (third country) — requires transfer mechanism</span>
              {p.isThirdCountry && !p.transferMechanism && <span className="flex items-center gap-1 text-amber-600 ml-2"><AlertTriangle className="h-3 w-3" /> no mechanism set</span>}
            </label>
          </div>
        ))}
        <Button onClick={() => parties.add({ id: uid(), name: "", role: "processor", functions: "", interestDescription: "", dataCategory: "", location: "", dpa: "", transferMechanism: "", isThirdCountry: false })}>
          <Plus className="h-4 w-4 mr-1" /> Add party
        </Button>
      </div>
    </SectionShell>
  );
}
