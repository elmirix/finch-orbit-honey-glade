import { createFileRoute } from "@tanstack/react-router";
import { ExamView } from "@/components/exam-view";

export const Route = createFileRoute("/ielts/")({
  head: () => ({ meta: [{ title: "IELTS — Click" }] }),
  component: function IeltsPage() {
    return <ExamView examId="ielts" />;
  },
});
