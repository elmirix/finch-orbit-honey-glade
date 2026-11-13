import { motion } from "framer-motion";
import { useState } from "react";

interface Developer {
  name: string;
  role: string;
  initials: string;
  photo: string;
  description: string;
  tags: string[];
  instagram: string;
  instagramHandle: string;
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
    instagram: "https://www.instagram.com/elmirx01?psln=MXJ3bnl0bGJucDcxNg==",
    instagramHandle: "@elmirx01",
  },
  {
    name: "Жанышов Чынгыз",
    role: "Co-Founder & Product Developer",
    initials: "ЖЧ",
    photo: "/team/chyngyz.jpg",
    description:
      "Соавтор концепции и разработчик образовательной системы Click. Проектирует пользовательский опыт, механику подготовки к ОРТ, SAT и IELTS и визуальную подачу.",
    tags: ["Разработка", "UX/UI Дизайн", "Контент и тесты"],
    instagram: "https://www.instagram.com/chikzhq?xtok=dHAwb2cxZjNhc3Zp&utm_source=qr",
    instagramHandle: "@chikzhq",
  },
];

function DeveloperAvatar({ dev }: { dev: Developer }) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-teal/30 bg-teal/10 text-lg font-bold text-teal shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-md">
        {dev.initials}
      </span>
    );
  }

  return (
    <div className="size-16 shrink-0 overflow-hidden rounded-2xl border border-white/25 bg-white/10 p-0.5 shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md transition-colors group-hover:border-teal/60">
      <img
        src={dev.photo}
        alt={dev.name}
        onError={() => setImgError(true)}
        className="h-full w-full rounded-[14px] object-cover transition-transform duration-300 group-hover:scale-110"
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
          Мы создаём Click вдвоём, чтобы подготовка к ОРТ, SAT и IELTS была чёткой,
          современной и без лишней воды.
        </p>
      </motion.div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {developers.map((dev, index) => (
          <motion.a
            key={dev.name}
            href={dev.instagram}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: index * 0.12 }}
            whileHover={{ y: -5, scale: 1.01 }}
            className="card card-hover group flex cursor-pointer flex-col justify-between p-6 md:p-7"
          >
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-4">
                  <DeveloperAvatar dev={dev} />
                  <div>
                    <h3 className="text-xl font-semibold text-mist transition-colors group-hover:text-teal">
                      {dev.name}
                    </h3>
                    <p className="text-xs font-semibold tracking-wide text-teal">
                      {dev.role}
                    </p>
                  </div>
                </div>

                {/* Стеклянная кнопка Instagram */}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.08] px-3.5 py-1.5 text-xs font-semibold text-mist shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-md transition-all group-hover:scale-105 group-hover:border-teal/50 group-hover:bg-teal/15 group-hover:text-teal">
                  <svg
                    className="size-3.5 text-teal"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  {dev.instagramHandle} ↗
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-mist/90">
                {dev.description}
              </p>
            </div>

            {/* Стеклянные капсулы тегов */}
            <ul className="mt-5 flex flex-wrap gap-2">
              {dev.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 text-xs font-medium text-mist/90 backdrop-blur-md"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
