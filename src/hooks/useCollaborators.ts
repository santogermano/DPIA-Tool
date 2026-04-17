import { useEffect, useState } from "react";
import type { WebrtcProvider } from "y-webrtc";

export type Collaborator = {
  clientId: number;
  name: string;
  color: string;
  isMe: boolean;
};

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"];

function loadIdentity() {
  const name = localStorage.getItem("dpia.user.name") || `User-${Math.floor(Math.random() * 9000 + 1000)}`;
  const color = localStorage.getItem("dpia.user.color") || COLORS[Math.floor(Math.random() * COLORS.length)];
  localStorage.setItem("dpia.user.name", name);
  localStorage.setItem("dpia.user.color", color);
  return { name, color };
}

export function useCollaborators(provider: WebrtcProvider | undefined): { collaborators: Collaborator[]; me: Collaborator | null; rename: (n: string) => void } {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [me, setMe] = useState<Collaborator | null>(null);

  useEffect(() => {
    if (!provider) return;
    const { name, color } = loadIdentity();
    provider.awareness.setLocalStateField("user", { name, color });

    const update = () => {
      const states = Array.from(provider.awareness.getStates().entries());
      const list: Collaborator[] = states.map(([clientId, state]) => ({
        clientId,
        name: (state as any)?.user?.name || "Anonymous",
        color: (state as any)?.user?.color || "#64748b",
        isMe: clientId === provider.awareness.clientID,
      }));
      setCollaborators(list);
      setMe(list.find(c => c.isMe) || null);
    };
    update();
    provider.awareness.on("change", update);
    return () => { provider.awareness.off("change", update); };
  }, [provider]);

  const rename = (n: string) => {
    if (!provider) return;
    localStorage.setItem("dpia.user.name", n);
    const color = localStorage.getItem("dpia.user.color") || "#64748b";
    provider.awareness.setLocalStateField("user", { name: n, color });
  };

  return { collaborators, me, rename };
}
