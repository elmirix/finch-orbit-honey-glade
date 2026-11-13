import { createFileRoute, notFound } from "@tanstack/react-router";
import { getTopic } from "@/data/catalog";
import { TopicView } from "@/components/topic-view";

export const Route = createFileRoute("/ielts/$subject/$topic")({
  loader: ({ params }) => {
    const data = getTopic("ielts", params.subject, params.topic);
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.topic.title} — ${loaderData.subject.title} — IELTS — Click`
          : "IELTS — Click",
      },
    ],
  }),
  component: function IeltsTopicPage() {
    const { subject, topic } = Route.useLoaderData();
    return <TopicView examId="ielts" subject={subject} topic={topic} />;
  },
});
