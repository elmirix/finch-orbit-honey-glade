import { createFileRoute } from "@tanstack/react-router";
import { SimulationView } from "@/components/simulation-view";

export const Route = createFileRoute("/sat/simulation")({
  head: () => ({ meta: [{ title: "Пробный SAT — Click" }] }),
  component: function SatSimulationPage() {
    return <SimulationView examId="sat" />;
  },
});
