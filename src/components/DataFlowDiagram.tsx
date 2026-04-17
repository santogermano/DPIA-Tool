import { useRef } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import { useDiagramData } from "@/hooks/useDiagramData";
import type { DataFlowRow, InvolvedParty } from "@/types/dpia";
import { Button } from "./ui/button";
import { Download, Info } from "lucide-react";
import { toPng } from "html-to-image";

export function DataFlowDiagram({ rows, parties, onExportReady }: { rows: DataFlowRow[]; parties: InvolvedParty[]; onExportReady?: (getPng: () => Promise<string | null>) => void }) {
  const { nodes, edges } = useDiagramData(rows, parties);
  const wrapRef = useRef<HTMLDivElement>(null);

  const exportPng = async (): Promise<string | null> => {
    const pane = wrapRef.current?.querySelector(".react-flow__viewport") as HTMLElement | null;
    if (!pane) return null;
    try { return await toPng(pane, { cacheBust: true, backgroundColor: "#ffffff", pixelRatio: 2 }); }
    catch { return null; }
  };

  if (typeof onExportReady === "function") onExportReady(exportPng);

  const handleDownloadClick = async () => {
    const png = await exportPng();
    if (!png) return;
    const a = document.createElement("a");
    a.href = png; a.download = "dpia-diagram.png"; a.click();
  };

  if (nodes.length === 0) {
    return (
      <div className="flex items-center gap-2 border border-dashed rounded-lg p-8 text-muted-foreground text-sm">
        <Info className="h-4 w-4" />
        Add data flow rows (section 5) and involved parties (section 6) to see the diagram.
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-2 border-b bg-muted/30">
        <div className="text-xs text-muted-foreground">Auto-generated from sections 5 & 6. Drag nodes to rearrange.</div>
        <Button size="sm" variant="outline" onClick={handleDownloadClick}><Download className="h-3 w-3 mr-1" /> PNG</Button>
      </div>
      <div ref={wrapRef} style={{ width: "100%", height: 520 }}>
        <ReactFlow nodes={nodes} edges={edges} fitView proOptions={{ hideAttribution: true }}>
          <Background />
          <Controls />
          <MiniMap zoomable pannable />
        </ReactFlow>
      </div>
    </div>
  );
}
