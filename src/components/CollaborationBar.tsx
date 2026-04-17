import { useCollaborators } from "@/hooks/useCollaborators";
import type { WebrtcProvider } from "y-webrtc";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Users, Pencil } from "lucide-react";

export function CollaborationBar({ provider }: { provider?: WebrtcProvider }) {
  const { collaborators, me, rename } = useCollaborators(provider);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(me?.name || "");

  const commit = () => {
    if (name.trim()) rename(name.trim());
    setEditing(false);
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b bg-muted/30">
      <Users className="h-4 w-4 text-muted-foreground" />
      <div className="flex -space-x-2">
        {collaborators.slice(0, 8).map(c => (
          <div key={c.clientId}
            title={c.name + (c.isMe ? " (you)" : "")}
            className="w-7 h-7 rounded-full border-2 border-background flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: c.color }}>
            {(c.name[0] || "?").toUpperCase()}
          </div>
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {collaborators.length} {collaborators.length === 1 ? "person" : "people"} online
      </span>
      <div className="ml-auto flex items-center gap-2">
        {editing ? (
          <>
            <Input value={name} onChange={e => setName(e.target.value)} className="h-7 w-40" onKeyDown={e => e.key === "Enter" && commit()} />
            <Button size="sm" onClick={commit}>Save</Button>
          </>
        ) : (
          <>
            <span className="text-xs">You are <b>{me?.name}</b></span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setName(me?.name || ""); setEditing(true); }}>
              <Pencil className="h-3 w-3" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
