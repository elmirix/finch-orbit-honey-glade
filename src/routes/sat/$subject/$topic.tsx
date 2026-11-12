import { createFileRoute, notFound } from "@tanstack/react-router";
import { getTopic } from "@/data/catalog";
import { TopicView } from "@/components/topic-view";

export const Route = createFileRoute("/sat/$subject/$topic")({
  loader: ({ params }) => {
    const data = getTopic("sat", params.subject, params.topic);
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.topic.title} — ${loaderData.subject.title} — SAT — Click`
          : "SAT — Click",
      },
    ],
  }),
  component: function SatTopicPage() {
    const { subject, topic } = Route.useLoaderData();
    return <TopicView examId="sat" subject={subject} topic={topic} />;
  },
});
