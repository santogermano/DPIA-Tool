import * as Y from "yjs";
import type { Dpia } from "@/types/dpia";
import { DpiaSchema } from "@/types/dpia";
import { getRoot } from "@/hooks/useDpiaField";

/** Read entire DPIA as plain JSON from the Y.Doc. */
export function readDpia(ydoc: Y.Doc, fallback: Partial<Dpia> = {}): Dpia {
  const root = getRoot(ydoc);
  const raw: Record<string, any> = { ...fallback };
  root.forEach((v, k) => { raw[k] = v; });
  const parsed = DpiaSchema.safeParse(raw);
  if (parsed.success) return parsed.data;
  // fill missing defaults
  return DpiaSchema.parse({ ...raw, ...missingDefaults(raw) });
}

function missingDefaults(raw: Record<string, any>): Partial<Dpia> {
  return {
    id: raw.id || "unknown",
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
    projectName: raw.projectName || "Untitled DPIA",
  };
}

/** Write a full DPIA JSON into Y.Doc, replacing the root map contents. */
export function writeDpia(ydoc: Y.Doc, dpia: Dpia) {
  const root = getRoot(ydoc);
  ydoc.transact(() => {
    root.clear();
    for (const [k, v] of Object.entries(dpia)) root.set(k, v);
  }, "import");
}

export function downloadJson(dpia: Dpia) {
  const blob = new Blob([JSON.stringify(dpia, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `DPIA_${(dpia.projectName || "untitled").replace(/[^\w-]+/g, "_")}_${new Date().toISOString().slice(0, 10)}.dpia.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}
