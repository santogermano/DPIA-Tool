import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useYDoc } from "@/hooks/useYDoc";
import { getRoot } from "@/hooks/useDpiaField";
import { CollaborationBar } from "@/components/CollaborationBar";
import { ExportButtons } from "@/components/ExportButtons";
import { SECTION_IDS, SECTION_TITLES, type SectionId, DpiaSchema } from "@/types/dpia";
import { readDpia } from "@/lib/serialize";
import { saveMeta } from "@/lib/storage";
import { sectionCompletion, ProgressRing } from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

// Section components
import { S_Cover } from "@/components/sections/S_Cover";
import { S1_Overview } from "@/components/sections/S1_Overview";
import { S2_Reasons } from "@/components/sections/S2_Reasons";
import { S3_DataSubjects } from "@/components/sections/S3_DataSubjects";
import { S4_DataCollection } from "@/components/sections/S4_DataCollection";
import { S5_DataFlowTable } from "@/components/sections/S5_DataFlowTable";
import { S5_Diagram } from "@/components/sections/S5_Diagram";
import { S6_Parties } from "@/components/sections/S6_Parties";
import { S7_PbD } from "@/components/sections/S7_PbD";
import { S8_Tech } from "@/components/sections/S8_Tech";
import { S8_Security } from "@/components/sections/S8_Security";
import { S9_LegalBasis } from "@/components/sections/S9_LegalBasis";
import { S9_Compatible } from "@/components/sections/S9_Compatible";
import { S10_Rights } from "@/components/sections/S10_Rights";
import { S11_12_Necessity } from "@/components/sections/S11_12_Necessity";
import { E_Risks } from "@/components/sections/E_Risks";
import { Conclusion } from "@/components/sections/Conclusion";
import { Consultation } from "@/components/sections/Consultation";
import { DataFlowDiagram } from "@/components/DataFlowDiagram";
import { useArray } from "@/hooks/useDpiaField";
import type { DataFlowRow, InvolvedParty } from "@/types/dpia";

const SECTION_COMPONENT: Record<SectionId, React.FC<any>> = {
  "cover": S_Cover,
  "s1-overview": S1_Overview,
  "s2-reasons": S2_Reasons,
  "s3-data-subjects": S3_DataSubjects,
  "s4-data-collection": S4_DataCollection,
  "s5-data-flow": S5_DataFlowTable,
  "s5-diagram": S5_Diagram,
  "s6-parties": S6_Parties,
  "s7-pbd": S7_PbD,
  "s8-tech": S8_Tech,
  "s8-security": S8_Security,
  "s9-legal-basis": S9_LegalBasis,
  "s9-compatible": S9_Compatible,
  "s10-rights": S10_Rights,
  "s11-12-necessity": S11_12_Necessity,
  "e-risks": E_Risks,
  "conclusion": Conclusion,
  "consultation": Consultation,
};

export function DPIAEditor() {
  const { id = "" } = useParams();
  const { ydoc, provider, ready } = useYDoc(id);
  const [current, setCurrent] = useState<SectionId>("cover");
  const [_, forceUpdate] = useState(0);
  const diagramGetterRef = useRef<null | (() => Promise<string | null>)>(null);

  // Ensure root has an id + createdAt
  useEffect(() => {
    if (!ready) return;
    const root = getRoot(ydoc);
    if (!root.get("id")) {
      ydoc.transact(() => {
        root.set("id", id);
        const now = new Date().toISOString();
        if (!root.get("createdAt")) root.set("createdAt", now);
        root.set("updatedAt", now);
        if (!root.get("organization")) root.set("organization", "Eindhoven University of Technology");
      });
    }
  }, [ready, ydoc, id]);

  // Observe changes → persist meta to localStorage
  useEffect(() => {
    if (!ready) return;
    const root = getRoot(ydoc);
    const onChange = () => {
      const dpia = readDpia(ydoc, { id });
      saveMeta({ id: dpia.id || id, projectName: dpia.projectName || "Untitled DPIA", status: dpia.status, createdAt: dpia.createdAt, updatedAt: new Date().toISOString() });
      forceUpdate(x => x + 1);
    };
    root.observeDeep(onChange);
    onChange();
    return () => root.unobserveDeep(onChange);
  }, [ready, ydoc, id]);

  const progress = useMemo(() => {
    if (!ready) return { overall: 0, perSection: {} as Record<string, number> };
    try {
      const dpia = DpiaSchema.parse({ ...readDpia(ydoc, { id }) });
      return sectionCompletion(dpia);
    } catch { return { overall: 0, perSection: {} }; }
  }, [ready, ydoc, id, _]);

  const dpiaSnapshot = ready ? readDpia(ydoc, { id }) : null;

  const idx = SECTION_IDS.indexOf(current);
  const prev = SECTION_IDS[idx - 1];
  const next = SECTION_IDS[idx + 1];
  const Component = SECTION_COMPONENT[current];

  if (!ready) {
    return <div className="p-8 text-center text-muted-foreground">Loading DPIA… connecting collaborators…</div>;
  }

  return (
    <>
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-2 border-b bg-background">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-1" /> All DPIAs
        </Link>
        <div className="ml-4">
          <div className="text-sm font-semibold">{dpiaSnapshot?.projectName || "Untitled DPIA"}</div>
          <div className="text-xs text-muted-foreground">Room: {id.slice(0, 8)}… · {dpiaSnapshot?.organization}</div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <ProgressRing value={progress.overall} />
          <ExportButtons ydoc={ydoc} getDiagramPng={() => diagramGetterRef.current ? diagramGetterRef.current() : Promise.resolve(null)} />
        </div>
      </div>

      <CollaborationBar provider={provider} />

      <HiddenDiagramMount ydoc={ydoc} onReady={fn => (diagramGetterRef.current = fn)} />

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <nav className="w-64 border-r p-3 overflow-auto bg-muted/10">
          <ol className="space-y-1 text-sm">
            {SECTION_IDS.map((sid, i) => {
              const p = progress.perSection[sid] || 0;
              const done = p >= 0.99;
              return (
                <li key={sid}>
                  <button
                    onClick={() => setCurrent(sid)}
                    className={`w-full text-left px-2 py-1.5 rounded-md flex items-center gap-2 transition ${current === sid ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                  >
                    <div className="w-4 h-4 shrink-0 rounded-full border flex items-center justify-center text-[10px]"
                      style={{ background: done ? "hsl(var(--primary))" : "transparent", color: done ? "hsl(var(--primary-foreground))" : undefined }}>
                      {done ? "✓" : i}
                    </div>
                    <span className="flex-1">{SECTION_TITLES[sid]}</span>
                    {!done && p > 0 && <span className="text-[10px] text-muted-foreground">{Math.round(p * 100)}%</span>}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Main */}
        <main className="flex-1 overflow-auto p-6 bg-muted/5">
          <div className="max-w-5xl mx-auto">
            <Component ydoc={ydoc} />
            <div className="flex justify-between mt-6 mb-12">
              <Button variant="outline" disabled={!prev} onClick={() => prev && setCurrent(prev)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> {prev ? SECTION_TITLES[prev] : ""}
              </Button>
              <Button disabled={!next} onClick={() => next && setCurrent(next)}>
                {next ? SECTION_TITLES[next] : ""} <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
    </>
  );
}

function HiddenDiagramMount({ ydoc, onReady }: { ydoc: any; onReady: (fn: () => Promise<string | null>) => void }) {
  const rows = useArray<DataFlowRow>(ydoc, "dataFlowRows");
  const parties = useArray<InvolvedParty>(ydoc, "involvedParties");
  return (
    <div style={{ position: "absolute", left: -10000, top: 0, width: 1200, height: 700, pointerEvents: "none" }} aria-hidden>
      <DataFlowDiagram rows={rows.items} parties={parties.items} onExportReady={onReady} />
    </div>
  );
}
