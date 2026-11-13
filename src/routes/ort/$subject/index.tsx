import { createFileRoute, notFound } from "@tanstack/react-router";
import { getSubject } from "@/data/catalog";
import { SubjectView } from "@/components/subject-view";

export const Route = createFileRoute("/ort/$subject/")({
  loader: ({ params }) => {
    const subject = getSubject("ort", params.subject);
    if (!subject) throw notFound();
    return subject;
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.title} — ОРТ — Click` : "ОРТ — Click" }],
  }),
  component: function OrtSubjectPage() {
    const subject = Route.useLoaderData();
    return <SubjectView examId="ort" subject={subject} />;
  },
});
