import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import type { ReactNode } from "react";
import { Info } from "lucide-react";

export function SectionShell({ title, description, guidance, children }: { title: string; description?: string; guidance?: ReactNode; children: ReactNode }) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        {guidance && (
          <div className="flex gap-2 rounded-md border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900 p-3 text-sm">
            <Info className="h-4 w-4 mt-0.5 shrink-0 text-blue-600" />
            <div className="text-blue-950 dark:text-blue-100">{guidance}</div>
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
