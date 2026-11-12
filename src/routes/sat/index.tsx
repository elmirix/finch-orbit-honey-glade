import { createFileRoute } from "@tanstack/react-router";
import { ExamView } from "@/components/exam-view";

export const Route = createFileRoute("/sat/")({
  head: () => ({ meta: [{ title: "SAT — Click" }] }),
  component: function SatPage() {
    return <ExamView examId="sat" />;
  },
});
