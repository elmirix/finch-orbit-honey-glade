import { createFileRoute } from "@tanstack/react-router";
import { SimulationView } from "@/components/simulation-view";

export const Route = createFileRoute("/ort/simulation")({
  head: () => ({ meta: [{ title: "Пробный ОРТ — Click" }] }),
  component: function OrtSimulationPage() {
    return <SimulationView examId="ort" />;
  },
});
