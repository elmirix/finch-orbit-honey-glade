import { createFileRoute, notFound } from "@tanstack/react-router";
import { getSubject } from "@/data/catalog";
import { SubjectView } from "@/components/subject-view";

export const Route = createFileRoute("/ielts/$subject/")({
  loader: ({ params }) => {
    const subject = getSubject("ielts", params.subject);
    if (!subject) throw notFound();
    return subject;
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.title} — IELTS — Click` : "IELTS — Click" }],
  }),
  component: function IeltsSubjectPage() {
    const subject = Route.useLoaderData();
    return <SubjectView examId="ielts" subject={subject} />;
  },
});
