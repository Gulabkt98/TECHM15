import { Badge } from "@/components/ui/badge";
import type { Severity } from "@/types/api";

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <Badge variant={severity} className="uppercase tracking-wide">
      {severity}
    </Badge>
  );
}
