import { createFileRoute } from "@tanstack/react-router";
import { AdminView } from "@/components/pos/admin-view";
import { RequireSession } from "@/components/pos/gate";
import { Shell } from "@/components/pos/shell";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  return (
    <RequireSession>
      <Shell>
        <AdminView />
      </Shell>
    </RequireSession>
  );
}
