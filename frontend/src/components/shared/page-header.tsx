import { Badge } from "@/components/ui/badge";

export function PageHeader({
  title,
  description,
  demo,
  actions,
}: {
  title: string;
  description?: string;
  demo?: boolean;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {demo && <Badge variant="demo">Demo data</Badge>}
        </div>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
