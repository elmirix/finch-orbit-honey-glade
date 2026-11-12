import { motion } from "framer-motion";
import { useState } from "react";

interface Developer {
  name: string;
  role: string;
  initials: string;
  photo: string;
  description: string;
  tags: string[];
}

const developers: Developer[] = [
  {
    name: "Аманбаев Эльмир",
    role: "Co-Founder & Full-Stack Developer",
    initials: "АЭ",
    photo: "/team/elmir.jpg",
    description:
      "Соавтор идеи и архитектор платформы Click. Отвечает за логику тренажеров, структуру экзаменационных треков и бесперебойную работу интерфейса.",
    tags: ["Архитектура", "Frontend & Backend", "Продукт"],
  },
  {
    name: "Жанышов Чынгыз",
    role: "Co-Founder & Product Developer",
    initials: "ЖЧ",
    photo: "/team/chyngyz.jpg",
    description:
      "Соавтор концепции и разработчик образовательной системы Click. Проектирует пользовательский опыт, механику подготовки к ОРТ, SAT и IELTS и визуальную подачу.",
    tags: ["Разработка", "UX/UI Дизайн", "Контент и тесты"],
  },
];

function DeveloperAvatar({ dev }: { dev: Developer }) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-navy text-lg font-bold text-teal shadow-sm">
        {dev.initials}
      </span>
    );
  }

  return (
    <div className="size-16 shrink-0 overflow-hidden rounded-2xl border-2 border-teal/40 bg-navy shadow-md">
      <img
        src={dev.photo}
        alt={dev.name}
        onError={() => setImgError(true)}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
    </div>
  );
}

export function DevelopersSection() {
  return (
    <section className="mt-12">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45 }}
      >
        <p className="text-xs font-semibold tracking-widest text-teal uppercase">
          КОМАНДА ПРОЕКТА
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-mist md:text-3xl">
          Разработчики платформы Click
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate">
          Мы создаём Click вдвоём, чтобы подготовка к ОРТ, SAT и IELTS была чёткой, современной и без лишней воды.
        </p>
      </motion.div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {developers.map((dev, index) => (
          <motion.article
            key={dev.name}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: index * 0.12 }}
            whileHover={{ y: -5, scale: 1.01 }}
            className="card card-hover group flex flex-col justify-between p-6 md:p-7"
          >
            <div>
              <div className="flex items-center gap-4">
                <DeveloperAvatar dev={dev} />
                <div>
                  <h3 className="text-xl font-semibold text-ink">{dev.name}</h3>
                  <p className="text-xs font-semibold tracking-wide text-ok">
                    {dev.role}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-ink">
                {dev.description}
              </p>
            </div>

            <ul className="mt-5 flex flex-wrap gap-2">
              {dev.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-line px-3 py-1 text-xs font-medium text-ink"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
