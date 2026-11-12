import { Link } from "@tanstack/react-router";
import { examList, getTopic } from "@/data/catalog";
import { topicsLabel } from "@/lib/format";
import { ExamLink, TopicLink } from "@/components/links";
import { Icon } from "@/components/icons";
import { Page } from "@/components/ui";
import { useProgressHydrated } from "@/components/use-hydrated";
import { topicKey, useProgress } from "@/store/progress";

const steps = [
  {
    index: "01",
    title: "Выберите экзамен",
    text: "ОРТ, SAT и IELTS — три отдельные программы. Предметы и вопросы не смешиваются.",
  },
  {
    index: "02",
    title: "Пройдите тему",
    text: "Сначала короткая теория, затем практика с разбором и проверка темы.",
  },
  {
    index: "03",
    title: "Сдайте пробный",
    text: "10 вопросов и 15 минут на таймере. В конце — балл и разбор ошибок.",
  },
];

function countTopics(examId: (typeof examList)[number]["id"], passed: Record<string, { passed: boolean }>) {
  let total = 0;
  let done = 0;
  const exam = examList.find((item) => item.id === examId);
  if (!exam) return { total, done };
  for (const subject of exam.subjects) {
    for (const topic of subject.topics) {
      total += 1;
      if (passed[topicKey(exam.id, subject.id, topic.id)]?.passed) done += 1;
    }
  }
  return { total, done };
}

export function HomeView() {
  const hydrated = useProgressHydrated();
  const topics = useProgress((state) => state.topics);
  const last = useProgress((state) => state.last);
  const resume = hydrated && last ? getTopic(last.examId, last.subjectId, last.topicId) : undefined;
  const subjectCount = examList.reduce((sum, exam) => sum + exam.subjects.length, 0);
  const topicCount = examList.reduce(
    (sum, exam) => sum + exam.subjects.reduce((inner, subject) => inner + subject.topics.length, 0),
    0,
  );

  return (
    <Page className="pt-10 md:pt-16">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold tracking-widest text-teal">ПОДГОТОВКА</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight text-balance text-mist md:text-5xl">
          Click — подготовка к экзаменам
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate">
          Отдельные треки для ОРТ, SAT и IELTS. У каждого экзамена свои предметы, темы и вопросы —
          без общего переключателя.
        </p>
        <dl className="mt-8 grid grid-cols-3 gap-3 max-w-lg">
          {[
            ["3", "экзамена"],
            [String(subjectCount), "предметов"],
            [String(topicCount), "тем"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl border border-line-dark px-3 py-3">
              <dt className="text-xs text-slate">{label}</dt>
              <dd className="mt-1 text-2xl font-semibold text-mist">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {resume && last ? (
        <section className="card mt-8 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wide text-ok">Продолжить</p>
            <p className="mt-1 text-lg font-semibold">
              {last.subjectTitle}: {resume.topic.title}
            </p>
            <p className="text-sm text-muted">{examList.find((exam) => exam.id === last.examId)?.title}</p>
          </div>
          <TopicLink
            examId={last.examId}
            subjectId={last.subjectId}
            topicId={last.topicId}
            className="tap inline-flex h-11 items-center justify-center rounded-full bg-navy px-5 text-sm font-semibold text-mist"
          >
            К теме
          </TopicLink>
        </section>
      ) : null}

      <section className="mt-10 grid gap-4 md:grid-cols-3" aria-label="Выбор экзамена">
        {examList.map((exam) => {
          const progress = countTopics(exam.id, hydrated ? topics : {});
          return (
            <ExamLink
              key={exam.id}
              examId={exam.id}
              className="card card-hover flex h-full flex-col p-6"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-navy text-teal">
                <Icon name={exam.icon} className="size-6" />
              </span>
              <p className="mt-5 text-xs font-semibold tracking-widest text-ok">ЭКЗАМЕН</p>
              <h2 className="mt-1 text-2xl font-semibold">{exam.title}</h2>
              <p className="mt-1 text-sm text-muted">{exam.fullName}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink">{exam.description}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {exam.subjects.map((subject) => (
                  <li key={subject.id} className="rounded-full bg-line px-2.5 py-1 text-xs font-medium text-ink">
                    {subject.title}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted">
                {topicsLabel(progress.total)}
                {hydrated && progress.done > 0 ? ` · пройдено ${progress.done}` : ""}
              </p>
              <span className="tap mt-5 inline-flex h-11 items-center justify-center rounded-full bg-teal px-5 text-sm font-semibold text-ink">
                Начать подготовку
              </span>
            </ExamLink>
          );
        })}
      </section>

      <section className="card mt-10 p-6 md:p-8">
        <h2 className="text-xl font-semibold">Как устроена подготовка</h2>
        <ol className="mt-6 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <li key={step.index} className="border-t border-line pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-5 md:first:border-l-0 md:first:pl-0">
              <p className="text-sm font-semibold text-ok">{step.index}</p>
              <h3 className="mt-2 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <p className="mt-6 text-sm text-slate">
        Прогресс тем сохраняется в этом браузере.{" "}
        <Link to="/" className="text-teal">
          Click
        </Link>{" "}
        не смешивает задания разных экзаменов.
      </p>
    </Page>
  );
}
