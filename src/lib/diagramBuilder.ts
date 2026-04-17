import type { Node, Edge } from "reactflow";
import type { DataFlowRow, InvolvedParty } from "@/types/dpia";

const EEA = new Set(["netherlands", "nl", "germany", "de", "france", "fr", "belgium", "be", "spain", "es", "italy", "it", "portugal", "pt", "ireland", "ie", "austria", "at", "sweden", "se", "denmark", "dk", "finland", "fi", "poland", "pl", "czech", "czech republic", "cz", "slovakia", "sk", "slovenia", "si", "hungary", "hu", "romania", "ro", "bulgaria", "bg", "greece", "gr", "croatia", "hr", "estonia", "ee", "latvia", "lv", "lithuania", "lt", "luxembourg", "lu", "malta", "mt", "cyprus", "cy", "iceland", "is", "norway", "no", "liechtenstein", "li", "eu", "eea"]);

function isThirdCountry(loc: string): boolean {
  const l = (loc || "").toLowerCase().trim();
  if (!l) return false;
  for (const c of EEA) if (l.includes(c)) return false;
  return true;
}

const STYLES = {
  subject: { background: "#dbeafe", color: "#1e3a8a", border: "2px solid #3b82f6" },
  data:    { background: "#dcfce7", color: "#14532d", border: "2px solid #22c55e" },
  purpose: { background: "#ede9fe", color: "#4c1d95", border: "2px solid #8b5cf6" },
  storage: { background: "#fef3c7", color: "#78350f", border: "2px solid #f59e0b" },
  processor: { background: "#fed7aa", color: "#7c2d12", border: "2px solid #f97316" },
  third:   { background: "#fecaca", color: "#7f1d1d", border: "2px solid #ef4444" },
  retention: { background: "#e0e7ff", color: "#312e81", border: "2px dashed #6366f1" },
};

function splitList(s: string): string[] {
  return (s || "").split(/[,;\n]/).map(x => x.trim()).filter(Boolean);
}

export function buildGraph(rows: DataFlowRow[], parties: InvolvedParty[]): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const seen = new Set<string>();

  const push = (id: string, label: string, type: keyof typeof STYLES) => {
    if (seen.has(id) || !label.trim()) return;
    seen.add(id);
    nodes.push({
      id,
      data: { label },
      position: { x: 0, y: 0 },
      style: { ...STYLES[type], padding: 10, borderRadius: 8, fontSize: 12, width: 200 },
    });
  };

  rows.forEach((r, rIdx) => {
    const subjects = splitList(r.dataSubjects);
    const dataItems = splitList(r.personalDataItems || r.personalDataCategory);
    const purposeId = `p-${rIdx}`;
    const storageId = `store-${rIdx}`;
    const retentionId = `ret-${rIdx}`;

    if (r.processingPurpose) push(purposeId, r.processingPurpose, "purpose");
    subjects.forEach((s, i) => {
      const id = `subj-${s}`;
      push(id, s, "subject");
      dataItems.forEach((d, j) => {
        const dId = `data-${d}`;
        push(dId, d, "data");
        edges.push({ id: `e-${rIdx}-${i}-${j}`, source: id, target: dId, label: "collects", animated: true });
        if (r.processingPurpose) edges.push({ id: `e-dp-${rIdx}-${i}-${j}`, source: dId, target: purposeId, label: "used for" });
      });
    });
    if (r.storageLocation) {
      push(storageId, r.storageLocation, "storage");
      if (r.processingPurpose) edges.push({ id: `e-ps-${rIdx}`, source: purposeId, target: storageId, label: "stored in" });
    }
    if (r.retentionPeriod) {
      push(retentionId, `Retention: ${r.retentionPeriod}`, "retention");
      if (r.storageLocation) edges.push({ id: `e-sr-${rIdx}`, source: storageId, target: retentionId, label: "deleted after" });
    }
  });

  parties.forEach((p, pIdx) => {
    if (!p.name) return;
    const isThird = p.isThirdCountry || isThirdCountry(p.location);
    const id = `party-${p.id}`;
    push(id, `${p.name} (${p.role})`, isThird ? "third" : "processor");
    rows.forEach((r, rIdx) => {
      if (r.storageLocation) {
        edges.push({ id: `e-storep-${rIdx}-${pIdx}`, source: `store-${rIdx}`, target: id, label: isThird ? "transferred to" : "shared with" });
      }
    });
  });

  return { nodes, edges };
}
