import type { DpiaMeta } from "@/types/dpia";

const KEY = "dpia.metas";

export function listMetas(): DpiaMeta[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as DpiaMeta[]) : [];
  } catch { return []; }
}
export function saveMeta(meta: DpiaMeta) {
  const list = listMetas();
  const idx = list.findIndex(m => m.id === meta.id);
  if (idx >= 0) list[idx] = meta; else list.push(meta);
  localStorage.setItem(KEY, JSON.stringify(list));
}
export function deleteMeta(id: string) {
  localStorage.setItem(KEY, JSON.stringify(listMetas().filter(m => m.id !== id)));
}
