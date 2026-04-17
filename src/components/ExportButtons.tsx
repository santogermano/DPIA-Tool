import { useState } from "react";
import type * as Y from "yjs";
import { Button } from "./ui/button";
import { Download, FileJson, FileText, Copy, Check } from "lucide-react";
import { readDpia, downloadJson } from "@/lib/serialize";
import { downloadPdf } from "@/lib/pdfExport";
import { saveMeta } from "@/lib/storage";

export function ExportButtons({ ydoc, getDiagramPng }: { ydoc: Y.Doc; getDiagramPng?: () => Promise<string | null> }) {
  const [pending, setPending] = useState<"pdf" | "json" | null>(null);
  const [copied, setCopied] = useState(false);

  const handleJson = () => {
    setPending("json");
    try {
      const dpia = readDpia(ydoc);
      dpia.updatedAt = new Date().toISOString();
      downloadJson(dpia);
      saveMeta({ id: dpia.id, projectName: dpia.projectName, status: dpia.status, createdAt: dpia.createdAt, updatedAt: dpia.updatedAt });
    } finally { setPending(null); }
  };

  const handlePdf = async () => {
    setPending("pdf");
    try {
      const dpia = readDpia(ydoc);
      dpia.updatedAt = new Date().toISOString();
      const png = getDiagramPng ? await getDiagramPng() : null;
      await downloadPdf(dpia, png);
    } finally { setPending(null); }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex gap-2 items-center">
      <Button variant="outline" size="sm" onClick={copyLink}>
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? "Copied" : "Copy share link"}
      </Button>
      <Button variant="outline" size="sm" onClick={handleJson} disabled={pending !== null}>
        <FileJson className="h-4 w-4 mr-1" /> {pending === "json" ? "…" : "Export JSON"}
      </Button>
      <Button size="sm" onClick={handlePdf} disabled={pending !== null}>
        <FileText className="h-4 w-4 mr-1" /> {pending === "pdf" ? "Generating…" : "Export PDF"}
      </Button>
    </div>
  );
}
