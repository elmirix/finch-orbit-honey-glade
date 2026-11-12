import { createFileRoute, notFound } from "@tanstack/react-router";
import { getSubject } from "@/data/catalog";
import { SubjectView } from "@/components/subject-view";

export const Route = createFileRoute("/sat/$subject/")({
  loader: ({ params }) => {
    const subject = getSubject("sat", params.subject);
    if (!subject) throw notFound();
    return subject;
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.title} — SAT — Click` : "SAT — Click" }],
  }),
  component: function SatSubjectPage() {
    const subject = Route.useLoaderData();
    return <SubjectView examId="sat" subject={subject} />;
  },
});
