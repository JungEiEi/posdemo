import { createFileRoute } from "@tanstack/react-router";
import { RequireSession } from "@/components/pos/gate";
import { Shell } from "@/components/pos/shell";
import { StockView } from "@/components/pos/stock-view";

export const Route = createFileRoute("/stock")({
  component: StockPage,
});

function StockPage() {
  return (
    <RequireSession>
      <Shell>
        <StockView />
      </Shell>
    </RequireSession>
  );
}
