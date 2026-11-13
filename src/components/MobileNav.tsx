import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { RegisterModal } from "@/components/RegisterModal";

const examLinks = [
  {
    id: "ort",
    title: "ОРТ",
    subtitle: "Общереспубликанское тестирование",
    to: "/ort",
  },
  {
    id: "sat",
    title: "SAT",
    subtitle: "Scholastic Assessment Test",
    to: "/sat",
  },
  {
    id: "ielts",
    title: "IELTS",
    subtitle: "Международный экзамен по английскому",
    to: "/ielts",
  },
];

export function MobileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExamsOpen, setIsExamsOpen] = useState(false);

  const handleProtectedClick = (e: React.MouseEvent) => {
    setIsExamsOpen(false);
    const user = localStorage.getItem("click_user");
    if (!user) {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  const isHome = pathname === "/";
  const isExams =
    pathname.startsWith("/ort") ||
    pathname.startsWith("/sat") ||
    pathname.startsWith("/ielts");
  const isDashboard = pathname.startsWith("/dashboard");
  const isProfile = pathname.startsWith("/profile");

  return (
    <>
      {/* Затемнение фона при открытом меню экзаменов */}
      <AnimatePresence>
        {isExamsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExamsOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Всплывающая панель выбора экзамена */}
      <AnimatePresence>
        {isExamsOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed right-3 bottom-20 left-3 z-40 mx-auto max-w-md rounded-2xl border border-line-dark bg-[#0A192F]/95 p-3 shadow-2xl backdrop-blur-md md:hidden"
          >
            <div className="mb-2 flex items-center justify-between px-2">
              <span className="text-xs font-semibold tracking-wider text-teal uppercase">
                Выберите экзамен
              </span>
              <button
                type="button"
                onClick={() => setIsExamsOpen(false)}
                className="text-xs text-slate hover:text-mist"
              >
                Закрыть ✕
              </button>
            </div>

            <div className="grid gap-2">
              {examLinks.map((exam) => {
                const active = pathname.startsWith(exam.to);
                return (
                  <Link
                    key={exam.id}
                    to={exam.to}
                    onClick={() => setIsExamsOpen(false)}
                    className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 transition-colors ${
                      active
                        ? "border-teal bg-teal/15 text-mist"
                        : "border-line-dark bg-[#050B14]/70 text-mist hover:border-teal/50"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold">{exam.title}</p>
                      <p className="text-xs text-slate">{exam.subtitle}</p>
                    </div>
                    <span className="text-sm font-bold text-teal">→</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Нижняя фиксированная навигация */}
      <nav
        aria-label="Мобильная навигация"
        className="fixed right-0 bottom-0 left-0 z-40 border-t border-line-dark bg-[#050B14]/95 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
      >
        <ul className="mx-auto flex max-w-md items-center justify-around">
          {/* Главная */}
          <li className="flex-1">
            <Link
              to="/"
              onClick={() => setIsExamsOpen(false)}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl py-1 text-[11px] font-medium transition-colors ${
                isHome && !isExamsOpen ? "text-teal" : "text-slate hover:text-mist"
              }`}
            >
              <span
                className={`flex h-7 w-11 items-center justify-center rounded-full transition-colors ${
                  isHome && !isExamsOpen ? "bg-teal/15 text-teal" : ""
                }`}
              >
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </span>
              <span>Главная</span>
            </Link>
          </li>

          {/* Экзамены (открывает выбор ОРТ / SAT / IELTS) */}
          <li className="flex-1">
            <button
              type="button"
              onClick={() => setIsExamsOpen((prev) => !prev)}
              className={`flex w-full flex-col items-center justify-center gap-1 rounded-xl py-1 text-[11px] font-medium transition-colors ${
                isExams || isExamsOpen ? "text-teal" : "text-slate hover:text-mist"
              }`}
            >
              <span
                className={`flex h-7 w-11 items-center justify-center rounded-full transition-colors ${
                  isExams || isExamsOpen ? "bg-teal/15 text-teal" : ""
                }`}
              >
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </span>
              <span>Экзамены</span>
            </button>
          </li>

          {/* Кабинет */}
          <li className="flex-1">
            <Link
              to="/dashboard"
              onClick={handleProtectedClick}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl py-1 text-[11px] font-medium transition-colors ${
                isDashboard && !isExamsOpen ? "text-teal" : "text-slate hover:text-mist"
              }`}
            >
              <span
                className={`flex h-7 w-11 items-center justify-center rounded-full transition-colors ${
                  isDashboard && !isExamsOpen ? "bg-teal/15 text-teal" : ""
                }`}
              >
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </span>
              <span>Кабинет</span>
            </Link>
          </li>

          {/* Профиль */}
          <li className="flex-1">
            <Link
              to="/profile"
              onClick={handleProtectedClick}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl py-1 text-[11px] font-medium transition-colors ${
                isProfile && !isExamsOpen ? "text-teal" : "text-slate hover:text-mist"
              }`}
            >
              <span
                className={`flex h-7 w-11 items-center justify-center rounded-full transition-colors ${
                  isProfile && !isExamsOpen ? "bg-teal/15 text-teal" : ""
                }`}
              >
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <span>Профиль</span>
            </Link>
          </li>
        </ul>
      </nav>

      <RegisterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
