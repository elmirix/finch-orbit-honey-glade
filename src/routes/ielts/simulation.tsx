import { createFileRoute } from "@tanstack/react-router";
import { SimulationView } from "@/components/simulation-view";

export const Route = createFileRoute("/ielts/simulation")({
  head: () => ({ meta: [{ title: "Пробный IELTS — Click" }] }),
  component: function IeltsSimulationPage() {
    return <SimulationView examId="ielts" />;
  },
});
