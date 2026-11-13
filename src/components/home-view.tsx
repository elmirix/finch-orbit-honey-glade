import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { examList, getTopic } from "@/data/catalog";
import { topicsLabel } from "@/lib/format";
import { ExamLink, TopicLink } from "@/components/links";
import { Icon } from "@/components/icons";
import { Page } from "@/components/ui";
import { useProgressHydrated } from "@/components/use-hydrated";
import { topicKey, useProgress } from "@/store/progress";
import { DevelopersSection } from "@/components/DevelopersSection";
import { RegisterModal } from "@/components/RegisterModal";

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

function countTopics(
  examId: (typeof examList)[number]["id"],
  passed: Record<string, { passed: boolean }>,
) {
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Проверяем, зарегистрирован ли пользователь
  useEffect(() => {
    const user = localStorage.getItem("click_user");
    if (user) setIsLoggedIn(true);
  }, []);

  const hydrated = useProgressHydrated();
  const topics = useProgress((state) => state.topics);
  const last = useProgress((state) => state.last);
  const resume =
    hydrated && last ? getTopic(last.examId, last.subjectId, last.topicId) : undefined;

  const subjectCount = examList.reduce((sum, exam) => sum + exam.subjects.length, 0);
  const topicCount = examList.reduce(
    (sum, exam) =>
      sum + exam.subjects.reduce((inner, subject) => inner + subject.topics.length, 0),
    0,
  );

  return (
    <Page className="pt-10 md:pt-16">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl"
      >
        <p className="text-sm font-semibold tracking-widest text-teal">ПОДГОТОВКА</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight text-balance text-mist md:text-5xl">
          Click — подготовка к экзаменам
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate">
          Отдельные треки для ОРТ, SAT и IELTS. У каждого экзамена свои предметы, темы и
          вопросы — без общего переключателя.
        </p>

        {/* ЛОГИКА КНОПОК НА ГЛАВНОЙ */}
        <div className="mt-6 flex flex-wrap gap-4">
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="rounded-full bg-teal px-8 py-3 font-semibold text-[#071120] shadow-[0_0_25px_rgba(100,255,218,0.35)] transition-transform hover:scale-105 active:scale-95"
              >
                Перейти в кабинет
              </Link>
              <Link
                to="/profile"
                className="rounded-full border border-white/15 bg-white/[0.06] px-8 py-3 font-semibold text-mist backdrop-blur-xl transition-all hover:border-teal/50 hover:bg-white/[0.12] hover:text-teal"
              >
                Мой профиль
              </Link>
            </>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-full bg-teal px-8 py-3 font-semibold text-[#071120] shadow-[0_0_25px_rgba(100,255,218,0.35)] transition-transform hover:scale-105 active:scale-95"
            >
              Создать аккаунт
            </button>
          )}
        </div>

        {/* Стеклянные мини-карточки статистики */}
        <dl className="mt-8 grid max-w-lg grid-cols-3 gap-3">
          {[
            ["3", "экзамена"],
            [String(subjectCount), "предметов"],
            [String(topicCount), "тем"],
          ].map(([value, label], idx) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.12 + idx * 0.08 }}
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-white/15 bg-white/[0.05] px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-xl transition-colors hover:border-teal/50 hover:bg-white/[0.09]"
            >
              <dt className="text-xs text-slate">{label}</dt>
              <dd className="mt-1 text-2xl font-semibold text-mist">{value}</dd>
            </motion.div>
          ))}
        </dl>
      </motion.section>

      {resume && last ? (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ y: -2 }}
          className="card mt-8 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-xs font-semibold tracking-wide text-teal">Продолжить</p>
            <p className="mt-1 text-lg font-semibold text-mist">
              {last.subjectTitle}: {resume.topic.title}
            </p>
            <p className="text-sm text-slate">
              {examList.find((exam) => exam.id === last.examId)?.title}
            </p>
          </div>
          <TopicLink
            examId={last.examId}
            subjectId={last.subjectId}
            topicId={last.topicId}
            className="tap inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 text-sm font-semibold text-mist shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-md transition-all hover:scale-105 hover:border-teal/50 hover:bg-teal hover:text-[#071120] active:scale-95"
          >
            К теме
          </TopicLink>
        </motion.section>
      ) : null}

      <section className="mt-10 grid gap-4 md:grid-cols-3" aria-label="Выбор экзамена">
        {examList.map((exam, index) => {
          const progress = countTopics(exam.id, hydrated ? topics : {});
          return (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 + index * 0.1, ease: "easeOut" }}
              whileHover={{ y: -6, scale: 1.015 }}
              whileTap={{ scale: 0.99 }}
              className="h-full"
            >
              <ExamLink examId={exam.id} className="card card-hover flex h-full flex-col p-6">
                <span className="flex size-12 items-center justify-center rounded-2xl border border-teal/30 bg-teal/10 text-teal shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                  <Icon name={exam.icon} className="size-6" />
                </span>
                <p className="mt-5 text-xs font-semibold tracking-widest text-teal">ЭКЗАМЕН</p>
                <h2 className="mt-1 text-2xl font-semibold text-mist">{exam.title}</h2>
                <p className="mt-1 text-sm text-slate">{exam.fullName}</p>
                <p className="mt-3 text-sm leading-relaxed text-mist/90">{exam.description}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {exam.subjects.map((subject) => (
                    <li
                      key={subject.id}
                      className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 text-xs font-medium text-mist/90 backdrop-blur-md"
                    >
                      {subject.title}
                    </li>
                  ))}
                </ul>
                <p className="mt-auto pt-4 text-xs text-slate">
                  {topicsLabel(progress.total)}
                  {hydrated && progress.done > 0 ? ` · пройдено ${progress.done}` : ""}
                </p>
                <span className="tap mt-4 inline-flex h-11 items-center justify-center rounded-full bg-teal px-5 text-sm font-semibold text-[#071120] shadow-[0_0_20px_rgba(100,255,218,0.25)] transition-transform duration-200 hover:brightness-105">
                  Начать подготовку
                </span>
              </ExamLink>
            </motion.div>
          );
        })}
      </section>

      <motion.section
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="card mt-10 p-6 md:p-8"
      >
        <h2 className="text-xl font-semibold text-mist">Как устроена подготовка</h2>
        <ol className="mt-6 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.li
              key={step.index}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="border-t border-white/10 pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-5 md:first:border-l-0 md:first:pl-0"
            >
              <p className="text-sm font-semibold text-teal">{step.index}</p>
              <h3 className="mt-2 font-semibold text-mist">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate">{step.text}</p>
            </motion.li>
          ))}
        </ol>
      </motion.section>

      <DevelopersSection />
            {/* Вызов окна регистрации */}
      <RegisterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Page>
  );
}
