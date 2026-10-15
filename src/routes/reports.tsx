import { createFileRoute } from "@tanstack/react-router";
import { RequireSession } from "@/components/pos/gate";
import { ReportsView } from "@/components/pos/reports-view";
import { Shell } from "@/components/pos/shell";

export const Route = createFileRoute("/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <RequireSession>
      <Shell>
        <ReportsView />
      </Shell>
    </RequireSession>
  );
}
