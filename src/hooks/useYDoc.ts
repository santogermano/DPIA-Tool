import { useEffect, useState } from "react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { IndexeddbPersistence } from "y-indexeddb";

export type YDocBundle = {
  ydoc: Y.Doc;
  provider?: WebrtcProvider;
  persistence?: IndexeddbPersistence;
  ready: boolean;
  roomId: string;
};

const SIGNALING = [
  "wss://signaling.yjs.dev",
  "wss://y-webrtc-signaling-eu.herokuapp.com",
];

type Entry = { ydoc: Y.Doc; provider: WebrtcProvider; persistence: IndexeddbPersistence; refs: number; synced: Promise<void> };
const docs = new Map<string, Entry>();

function acquire(roomId: string): Entry {
  let e = docs.get(roomId);
  if (!e) {
    const ydoc = new Y.Doc();
    const persistence = new IndexeddbPersistence(`dpia-${roomId}`, ydoc);
    const provider = new WebrtcProvider(`dpia-${roomId}`, ydoc, {
      signaling: SIGNALING,
      maxConns: 20,
    } as any);
    e = { ydoc, provider, persistence, refs: 0, synced: persistence.whenSynced.then(() => {}) };
    docs.set(roomId, e);
  }
  e.refs++;
  return e;
}

function release(roomId: string) {
  const e = docs.get(roomId);
  if (!e) return;
  e.refs--;
  if (e.refs <= 0) {
    e.provider.destroy();
    e.persistence.destroy();
    e.ydoc.destroy();
    docs.delete(roomId);
  }
}

export function useYDoc(roomId: string): YDocBundle {
  const [ready, setReady] = useState(false);
  const [bundle, setBundle] = useState<Entry | null>(null);

  useEffect(() => {
    const e = acquire(roomId);
    setBundle(e);
    setReady(false);
    let cancelled = false;
    e.synced.then(() => { if (!cancelled) setReady(true); });
    return () => { cancelled = true; release(roomId); };
  }, [roomId]);

  return {
    ydoc: bundle?.ydoc ?? getFallback(),
    provider: bundle?.provider,
    persistence: bundle?.persistence,
    ready,
    roomId,
  };
}

let _fallback: Y.Doc | null = null;
function getFallback() {
  if (!_fallback) _fallback = new Y.Doc();
  return _fallback;
}
