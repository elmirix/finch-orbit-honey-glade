import { createFileRoute } from "@tanstack/react-router";
import { ExamView } from "@/components/exam-view";

export const Route = createFileRoute("/ort/")({
  head: () => ({ meta: [{ title: "ОРТ — Click" }] }),
  component: function OrtPage() {
    return <ExamView examId="ort" />;
  },
});
