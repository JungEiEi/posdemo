import { createFileRoute } from "@tanstack/react-router";
import { RequireSession } from "@/components/pos/gate";
import { PosView } from "@/components/pos/pos-view";
import { Shell } from "@/components/pos/shell";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <RequireSession>
      <Shell>
        <PosView />
      </Shell>
    </RequireSession>
  );
}
