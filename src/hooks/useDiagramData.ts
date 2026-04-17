import { useMemo } from "react";
import type { Node, Edge } from "reactflow";
import dagre from "dagre";
import type { DataFlowRow, InvolvedParty } from "@/types/dpia";
import { buildGraph } from "@/lib/diagramBuilder";

export function useDiagramData(rows: DataFlowRow[], parties: InvolvedParty[]): { nodes: Node[]; edges: Edge[] } {
  return useMemo(() => {
    const { nodes, edges } = buildGraph(rows, parties);
    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: "LR", nodesep: 50, ranksep: 90, marginx: 20, marginy: 20 });
    g.setDefaultEdgeLabel(() => ({}));
    nodes.forEach(n => g.setNode(n.id, { width: 200, height: 60 }));
    edges.forEach(e => g.setEdge(e.source, e.target));
    dagre.layout(g);
    const laidOut = nodes.map(n => {
      const pos = g.node(n.id);
      return { ...n, position: { x: pos.x - 100, y: pos.y - 30 } };
    });
    return { nodes: laidOut, edges };
  }, [rows, parties]);
}
