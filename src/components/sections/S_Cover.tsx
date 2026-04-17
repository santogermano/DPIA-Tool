import type * as Y from "yjs";
import { SectionShell } from "./SectionShell";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useField, useArray } from "@/hooks/useDpiaField";
import type { VersionEntry, People, Status } from "@/types/dpia";
import { Button } from "../ui/button";
import { Select } from "../ui/select";
import { uid } from "@/lib/ids";
import { Trash2, Plus } from "lucide-react";

const FIELDS: [keyof People, string][] = [
  ["department", "Name Service / Department"],
  ["dataDomainOwner", "Data Domain Owner"],
  ["dataSteward", "Data Steward / Data Domain Coordinator"],
  ["dpo", "Data Protection Officer"],
  ["ciso", "CISO (if necessary)"],
  ["projectLeader", "Project Leader"],
  ["privacyOfficer", "Privacy Officer"],
  ["consultedStakeholders", "Consulted Stakeholders (if applicable)"],
];

export function S_Cover({ ydoc }: { ydoc: Y.Doc }) {
  const [projectName, setProjectName] = useField<string>(ydoc, "projectName", "");
  const [org, setOrg] = useField<string>(ydoc, "organization", "Eindhoven University of Technology");
  const [status, setStatus] = useField<Status>(ydoc, "status", "draft");
  const [people, setPeople] = useField<People>(ydoc, "people", {} as People);
  const versions = useArray<VersionEntry>(ydoc, "versions");

  const setPerson = (k: keyof People, v: string) => setPeople({ ...people, [k]: v } as People);

  return (
    <SectionShell title="Cover page" description="Project identification and roles">
      <div className="grid gap-3">
        <div>
          <Label>Project Name</Label>
          <Input value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="[PROJECT NAME]" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Organization</Label>
            <Input value={org} onChange={e => setOrg(e.target.value)} />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={status} onChange={e => setStatus(e.target.value as Status)}>
              <option value="draft">Draft</option>
              <option value="under-review">Under Review</option>
              <option value="dpo-reviewed">DPO Reviewed</option>
              <option value="approved">Approved</option>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {FIELDS.map(([k, label]) => (
            <div key={k}>
              <Label>{label}</Label>
              <Input value={people[k] || ""} onChange={e => setPerson(k, e.target.value)} placeholder="xx" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <Label>Version history</Label>
        <table className="w-full text-sm mt-2 border">
          <thead>
            <tr className="bg-muted/30">
              <th className="p-2 text-left text-xs">Date</th>
              <th className="p-2 text-left text-xs">Version</th>
              <th className="p-2 text-left text-xs">Author</th>
              <th className="p-2 text-left text-xs">Changes</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {versions.items.map(v => (
              <tr key={v.id} className="border-t">
                <td className="p-1"><Input value={v.date} onChange={e => versions.update(v.id, { date: e.target.value })} className="h-8" /></td>
                <td className="p-1"><Input value={v.version} onChange={e => versions.update(v.id, { version: e.target.value })} className="h-8" /></td>
                <td className="p-1"><Input value={v.author} onChange={e => versions.update(v.id, { author: e.target.value })} className="h-8" /></td>
                <td className="p-1"><Textarea value={v.changes} onChange={e => versions.update(v.id, { changes: e.target.value })} className="min-h-[36px]" /></td>
                <td className="p-1"><Button variant="ghost" size="icon" onClick={() => versions.remove(v.id)}><Trash2 className="h-3 w-3" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button variant="outline" size="sm" onClick={() => versions.add({ id: uid(), date: "", version: "", author: "", changes: "" })} className="mt-2">
          <Plus className="h-3 w-3 mr-1" /> Add version row
        </Button>
      </div>
    </SectionShell>
  );
}
