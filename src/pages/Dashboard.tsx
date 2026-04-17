import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listMetas, deleteMeta, saveMeta } from "@/lib/storage";
import type { DpiaMeta } from "@/types/dpia";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Upload, LinkIcon, FileText, Shield } from "lucide-react";
import { uid } from "@/lib/ids";
import { DpiaSchema, type Dpia } from "@/types/dpia";
import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";
import { writeDpia } from "@/lib/serialize";

export function Dashboard() {
  const [metas, setMetas] = useState<DpiaMeta[]>([]);
  const [joinUrl, setJoinUrl] = useState("");
  const nav = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMetas(listMetas()); }, []);

  const create = () => {
    const id = uid();
    const now = new Date().toISOString();
    saveMeta({ id, projectName: "Untitled DPIA", status: "draft", createdAt: now, updatedAt: now });
    nav(`/dpia/${id}`);
  };

  const onDelete = (id: string) => {
    if (!confirm("Delete this DPIA from this browser? Collaborators who still have it will keep their copy.")) return;
    deleteMeta(id);
    indexedDB.deleteDatabase(`dpia-${id}`);
    setMetas(listMetas());
  };

  const onImport = async (f: File) => {
    try {
      const text = await f.text();
      const parsed = DpiaSchema.safeParse(JSON.parse(text));
      if (!parsed.success) { alert("Invalid DPIA JSON"); return; }
      const dpia: Dpia = { ...parsed.data, id: parsed.data.id || uid(), updatedAt: new Date().toISOString() };
      // Write into a fresh Y.Doc persisted to indexeddb
      const ydoc = new Y.Doc();
      const persistence = new IndexeddbPersistence(`dpia-${dpia.id}`, ydoc);
      await persistence.whenSynced;
      writeDpia(ydoc, dpia);
      saveMeta({ id: dpia.id, projectName: dpia.projectName, status: dpia.status, createdAt: dpia.createdAt, updatedAt: dpia.updatedAt });
      nav(`/dpia/${dpia.id}`);
    } catch (e) { alert("Could not import: " + (e as Error).message); }
  };

  const onJoin = () => {
    try {
      const url = new URL(joinUrl.trim());
      const match = url.hash.match(/#\/dpia\/(.+)$/) || url.pathname.match(/\/dpia\/([^/?#]+)/);
      const roomId = match?.[1];
      if (!roomId) { alert("Could not find a DPIA id in that URL."); return; }
      nav(`/dpia/${roomId}`);
    } catch { alert("Not a valid URL."); }
  };

  const statusColor = (s: DpiaMeta["status"]) => s === "approved" ? "default" : s === "dpo-reviewed" ? "secondary" : s === "under-review" ? "outline" : "secondary";

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="flex items-center gap-3 mb-8">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">DPIA Tool</h1>
          <p className="text-sm text-muted-foreground">Local, collaborative, GDPR-aligned. Nothing leaves your browser except peer-to-peer WebRTC sync.</p>
        </div>
        <div className="ml-auto flex gap-2">
          <input ref={fileRef} type="file" accept=".json,.dpia.json,application/json" className="hidden" onChange={e => e.target.files?.[0] && onImport(e.target.files[0])} />
          <Button variant="outline" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4 mr-1" /> Import</Button>
          <Button onClick={create}><Plus className="h-4 w-4 mr-1" /> New DPIA</Button>
        </div>
      </header>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Join an existing DPIA</CardTitle>
          <CardDescription>Paste a share URL from a collaborator. WebRTC will connect you peer-to-peer.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input placeholder="https://…/dpia/<uuid>" value={joinUrl} onChange={e => setJoinUrl(e.target.value)} />
          <Button variant="secondary" onClick={onJoin}><LinkIcon className="h-4 w-4 mr-1" /> Join</Button>
        </CardContent>
      </Card>

      <h2 className="text-lg font-semibold mb-3">Your DPIAs</h2>
      {metas.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-muted/10">
          <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground mb-3">No DPIAs yet.</p>
          <Button onClick={create}><Plus className="h-4 w-4 mr-1" /> Create your first DPIA</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metas.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map(m => (
            <Card key={m.id} className="hover:shadow-md transition">
              <CardHeader className="pb-2">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-base truncate">{m.projectName || "Untitled"}</CardTitle>
                    <CardDescription className="text-xs">
                      Updated {new Date(m.updatedAt).toLocaleString()}
                    </CardDescription>
                  </div>
                  <Badge variant={statusColor(m.status) as any}>{m.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex gap-2 pt-2">
                <Link to={`/dpia/${m.id}`} className="flex-1"><Button size="sm" className="w-full">Open</Button></Link>
                <Button variant="ghost" size="icon" onClick={() => onDelete(m.id)}><Trash2 className="h-4 w-4" /></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <footer className="mt-12 text-xs text-muted-foreground text-center">
        Template: TU/e DPIA · No AI API, no cloud store · Data stays in your browsers · Share URL = access (treat like a password)
      </footer>
    </div>
  );
}
