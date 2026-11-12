import { createFileRoute, notFound } from "@tanstack/react-router";
import { getTopic } from "@/data/catalog";
import { TopicView } from "@/components/topic-view";

export const Route = createFileRoute("/ort/$subject/$topic")({
  loader: ({ params }) => {
    const data = getTopic("ort", params.subject, params.topic);
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.topic.title} — ${loaderData.subject.title} — ОРТ — Click`
          : "ОРТ — Click",
      },
    ],
  }),
  component: function OrtTopicPage() {
    const { subject, topic } = Route.useLoaderData();
    return <TopicView examId="ort" subject={subject} topic={topic} />;
  },
});
