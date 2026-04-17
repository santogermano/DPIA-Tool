import { useSyncExternalStore, useCallback } from "react";
import * as Y from "yjs";

/** Root Y.Map for a DPIA lives under key "dpia". Leaf values stored as plain JSON. */
export function getRoot(ydoc: Y.Doc): Y.Map<any> {
  return ydoc.getMap("dpia");
}

/** Walk a dotted path, creating nested Y.Map along the way if needed. Arrays stored as Y.Array. */
function resolve(root: Y.Map<any>, path: string[], create = false): { parent: any; key: string } | null {
  let cur: any = root;
  for (let i = 0; i < path.length - 1; i++) {
    const k = path[i];
    let next = cur.get ? cur.get(k) : cur[k];
    if (next === undefined) {
      if (!create) return null;
      next = new Y.Map();
      cur.set(k, next);
    }
    cur = next;
  }
  return { parent: cur, key: path[path.length - 1] };
}

export function useField<T>(ydoc: Y.Doc | undefined, path: string, defaultValue: T): [T, (v: T) => void] {
  const subscribe = useCallback((cb: () => void) => {
    if (!ydoc) return () => {};
    const root = getRoot(ydoc);
    const listener = () => cb();
    root.observeDeep(listener);
    return () => root.unobserveDeep(listener);
  }, [ydoc]);

  const getSnapshot = useCallback((): T => {
    if (!ydoc) return defaultValue;
    const segs = path.split(".");
    const res = resolve(getRoot(ydoc), segs, false);
    if (!res) return defaultValue;
    const v = res.parent.get ? res.parent.get(res.key) : res.parent[res.key];
    return (v === undefined ? defaultValue : v) as T;
  }, [ydoc, path, defaultValue]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const setValue = useCallback((v: T) => {
    if (!ydoc) return;
    const segs = path.split(".");
    const res = resolve(getRoot(ydoc), segs, true)!;
    ydoc.transact(() => { res.parent.set(res.key, v); }, "local");
  }, [ydoc, path]);

  return [value, setValue];
}

/** Array helper: reads a Y.Array<Y.Map> at path and gives mutation helpers. */
export function useArray<T extends { id: string }>(ydoc: Y.Doc | undefined, path: string): {
  items: T[];
  add: (item: T) => void;
  update: (id: string, patch: Partial<T>) => void;
  remove: (id: string) => void;
  set: (items: T[]) => void;
} {
  const subscribe = useCallback((cb: () => void) => {
    if (!ydoc) return () => {};
    const root = getRoot(ydoc);
    const listener = () => cb();
    root.observeDeep(listener);
    return () => root.unobserveDeep(listener);
  }, [ydoc]);

  const getSnapshot = useCallback((): T[] => {
    if (!ydoc) return [];
    const segs = path.split(".");
    const res = resolve(getRoot(ydoc), segs, false);
    if (!res) return [];
    const arr = res.parent.get ? res.parent.get(res.key) : res.parent[res.key];
    if (!arr) return [];
    return (arr as any[]) as T[];
  }, [ydoc, path]);

  const items = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const setAll = useCallback((next: T[]) => {
    if (!ydoc) return;
    const segs = path.split(".");
    const res = resolve(getRoot(ydoc), segs, true)!;
    ydoc.transact(() => { res.parent.set(res.key, next); }, "local");
  }, [ydoc, path]);

  const add = useCallback((item: T) => setAll([...items, item]), [items, setAll]);
  const update = useCallback((id: string, patch: Partial<T>) => setAll(items.map(i => i.id === id ? { ...i, ...patch } : i)), [items, setAll]);
  const remove = useCallback((id: string) => setAll(items.filter(i => i.id !== id)), [items, setAll]);

  return { items, add, update, remove, set: setAll };
}
