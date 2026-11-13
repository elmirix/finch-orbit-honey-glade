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
      <AnimatePresence>
        {isExamsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExamsOpen(false)}
            className="fixed inset-0 z-30 bg-[#040a14]/60 backdrop-blur-md md:hidden"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExamsOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-3 bottom-24 left-3 z-40 mx-auto max-w-md rounded-3xl border border-white/20 bg-[#0c1b33]/75 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-2xl backdrop-saturate-150 md:hidden"
          >
            <div className="mb-3 flex items-center justify-between px-1.5">
              <span className="text-xs font-semibold tracking-wider text-teal uppercase">
                Выберите экзамен
              </span>
              <button
                type="button"
                onClick={() => setIsExamsOpen(false)}
                className="rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-xs text-mist transition-colors hover:border-teal/50 hover:text-teal"
              >
                Закрыть ✕
              </button>
            </div>

            <div className="grid gap-2.5">
              {examLinks.map((exam) => {
                const active = pathname.startsWith(exam.to);
                return (
                  <Link
                    key={exam.id}
                    to={exam.to}
                    onClick={() => setIsExamsOpen(false)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 backdrop-blur-md transition-all ${
                      active
                        ? "border-teal/60 bg-teal/20 text-mist shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
                        : "border-white/12 bg-white/[0.06] text-mist shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] hover:border-teal/40 hover:bg-white/[0.12]"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-mist">{exam.title}</p>
                      <p className="text-xs text-slate">{exam.subtitle}</p>
                    </div>
                    <span className="flex size-7 items-center justify-center rounded-full bg-teal/15 text-sm font-bold text-teal">
                      →
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav
        aria-label="Мобильная навигация"
        className="fixed right-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-3 z-40 mx-auto max-w-md rounded-full border border-white/20 bg-[#0b192e]/70 px-2 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-2xl backdrop-saturate-150 md:hidden"
      >
        <ul className="flex items-center justify-around">
          <li className="flex-1">
            <Link
              to="/"
              onClick={() => setIsExamsOpen(false)}
              className={`flex flex-col items-center justify-center gap-0.5 rounded-full py-1 text-[11px] font-medium transition-all ${
                isHome && !isExamsOpen ? "text-teal" : "text-slate hover:text-mist"
              }`}
            >
              <span
                className={`flex h-7 w-12 items-center justify-center rounded-full transition-all ${
                  isHome && !isExamsOpen
                    ? "border border-teal/30 bg-teal/20 text-teal shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                    : ""
                }`}
              >
                <svg
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </span>
              <span>Главная</span>
            </Link>
          </li>

          <li className="flex-1">
            <button
              type="button"
              onClick={() => setIsExamsOpen((prev) => !prev)}
              className={`flex w-full flex-col items-center justify-center gap-0.5 rounded-full py-1 text-[11px] font-medium transition-all ${
                isExams || isExamsOpen ? "text-teal" : "text-slate hover:text-mist"
              }`}
            >
              <span
                className={`flex h-7 w-12 items-center justify-center rounded-full transition-all ${
                  isExams || isExamsOpen
                    ? "border border-teal/30 bg-teal/20 text-teal shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                    : ""
                }`}
              >
                <svg
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.523 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </span>
              <span>Экзамены</span>
            </button>
          </li>

          <li className="flex-1">
            <Link
              to="/dashboard"
              onClick={handleProtectedClick}
              className={`flex flex-col items-center justify-center gap-0.5 rounded-full py-1 text-[11px] font-medium transition-all ${
                isDashboard && !isExamsOpen ? "text-teal" : "text-slate hover:text-mist"
              }`}
            >
              <span
                className={`flex h-7 w-12 items-center justify-center rounded-full transition-all ${
                  isDashboard && !isExamsOpen
                    ? "border border-teal/30 bg-teal/20 text-teal shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                    : ""
                }`}
              >
                <svg
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </span>
              <span>Кабинет</span>
            </Link>
          </li>

          <li className="flex-1">
            <Link
              to="/profile"
              onClick={handleProtectedClick}
              className={`flex flex-col items-center justify-center gap-0.5 rounded-full py-1 text-[11px] font-medium transition-all ${
                isProfile && !isExamsOpen ? "text-teal" : "text-slate hover:text-mist"
              }`}
            >
              <span
                className={`flex h-7 w-12 items-center justify-center rounded-full transition-all ${
                  isProfile && !isExamsOpen
                    ? "border border-teal/30 bg-teal/20 text-teal shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                    : ""
                }`}
              >
                <svg
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
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