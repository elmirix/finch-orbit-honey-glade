import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useCallback } from "react";
import { RegisterModal } from "@/components/RegisterModal";

const examLinks = [
  {
    id: "ort",
    title: "ОРТ",
    subtitle: "Поступление в вузы Кыргызстана",
    to: "/ort",
  },
  {
    id: "sat",
    title: "SAT",
    subtitle: "Поступление в зарубежные вузы",
    to: "/sat",
  },
  {
    id: "ielts",
    title: "IELTS",
    subtitle: "Международный экзамен по английскому",
    to: "/ielts",
  },
] as const;

const GLASS_BASE = "backdrop-blur-2xl backdrop-saturate-150";
const GLASS_NAV = "bg-[#0b192e]/60 border border-white/10 border-t-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,255,255,0.15)]";
const GLASS_POPUP = "bg-[#0c1b33]/70 border border-white/10 border-t-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)]";

interface NavItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  isExamsOpen: boolean;
  isProtected?: boolean;
  onProtectedClick?: (e: React.MouseEvent, hasAccess: boolean) => void;
}

function NavItem({ to, label, icon, isActive, isExamsOpen, isProtected, onProtectedClick }: NavItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    // Если вкладка защищена, проверяем авторизацию
    if (isProtected && onProtectedClick) {
      const hasAccess = !!localStorage.getItem("click_user");
      if (!hasAccess) {
        e.preventDefault(); // Блокируем переход, если нет доступа
      }
      onProtectedClick(e, hasAccess); // Сообщаем родителю (открыть модалку/закрыть меню)
    }
  };

  const activeClass = isActive && !isExamsOpen;

  return (
    <li className="flex-1">
      <Link
        to={to as any}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group relative flex flex-col items-center justify-center gap-1 py-1 text-[11px] font-medium transition-colors duration-200 ${
          activeClass ? "text-teal" : "text-slate hover:text-mist"
        }`}
      >
        <span
          className={`flex h-8 w-14 items-center justify-center rounded-full transition-all duration-300 ease-out ${
            activeClass
              ? "border border-teal/40 bg-teal/20 text-teal shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_0_12px_rgba(20,184,166,0.15)]"
              : isHovered
              ? "bg-white/5 text-mist"
              : ""
          }`}
        >
          <motion.div
            animate={{ scale: isHovered && !activeClass ? 1.1 : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {icon}
          </motion.div>
        </span>
        <span className="tracking-wide">{label}</span>
      </Link>
    </li>
  );
}

export function MobileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExamsOpen, setIsExamsOpen] = useState(false);

  const handleProtectedClick = useCallback((e: React.MouseEvent, hasAccess: boolean) => {
    setIsExamsOpen(false);
    if (!hasAccess) {
      setIsModalOpen(true); // Открываем модалку регистрации, если не залогинен
    }
  }, []);

  const isHome = pathname === "/";
  const isExams = pathname.startsWith("/ort") || pathname.startsWith("/sat") || pathname.startsWith("/ielts");
  const isProfile = pathname.startsWith("/profile");
  const isSettings = pathname.startsWith("/settings");

  return (
    <>
      <AnimatePresence mode="wait">
        {isExamsOpen && (
          <>
            {/* Оверлей */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExamsOpen(false)}
              className="fixed inset-0 z-40 bg-[#040a14]/60 backdrop-blur-sm md:hidden"
            />
            
            {/* Всплывающее меню экзаменов */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className={`fixed right-3 bottom-24 left-3 z-50 mx-auto max-w-md rounded-3xl p-4 md:hidden ${GLASS_POPUP} ${GLASS_BASE}`}
            >
              <div className="mb-3 flex items-center justify-between px-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-teal/90">
                  Выберите экзамен
                </span>
                <button
                  type="button"
                  onClick={() => setIsExamsOpen(false)}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate transition-all hover:border-teal/50 hover:bg-teal/10 hover:text-teal"
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
                      className={`group flex items-center justify-between rounded-2xl border px-4 py-3.5 transition-all duration-200 ${
                        active
                          ? "border-teal/50 bg-teal/15 text-mist shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                          : "border-white/5 bg-white/[0.03] text-slate hover:border-white/15 hover:bg-white/[0.08] hover:text-mist"
                      }`}
                    >
                      <div>
                        <p className={`text-sm font-semibold ${active ? "text-teal" : "text-mist"}`}>
                          {exam.title}
                        </p>
                        <p className="text-xs text-slate/80">{exam.subtitle}</p>
                      </div>
                      <span className={`flex size-7 items-center justify-center rounded-full transition-transform duration-200 group-hover:translate-x-0.5 ${
                        active ? "bg-teal/20 text-teal" : "bg-white/5 text-slate group-hover:bg-teal/10 group-hover:text-teal"
                      }`}>
                        →
                      </span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Нижняя панель навигации */}
      <nav
        aria-label="Мобильная навигация"
        className={`fixed right-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-3 z-30 mx-auto max-w-md rounded-full px-1.5 py-1.5 md:hidden ${GLASS_NAV} ${GLASS_BASE}`}
      >
        <ul className="flex items-center justify-around">
          <NavItem
            to="/"
            label="Главная"
            isActive={isHome}
            isExamsOpen={isExamsOpen}
            icon={
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            }
          />
          
          <li className="flex-1">
            <button
              type="button"
              onClick={() => setIsExamsOpen((prev) => !prev)}
              className={`group flex w-full flex-col items-center justify-center gap-1 py-1 text-[11px] font-medium transition-colors duration-200 ${
                isExams || isExamsOpen ? "text-teal" : "text-slate hover:text-mist"
              }`}
            >
              <span
                className={`flex h-8 w-14 items-center justify-center rounded-full transition-all duration-300 ${
                  isExams || isExamsOpen
                    ? "border border-teal/40 bg-teal/20 text-teal shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_0_12px_rgba(20,184,166,0.15)]"
                    : "group-hover:bg-white/5"
                }`}
              >
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.523 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </span>
              <span className="tracking-wide">Экзамены</span>
            </button>
          </li>

          <NavItem
            to="/profile"
            label="Профиль"
            isActive={isProfile}
            isExamsOpen={isExamsOpen}
            isProtected
            onProtectedClick={handleProtectedClick}
            icon={
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />

          <NavItem
            to="/settings"
            label="Настройки"
            isActive={isSettings}
            isExamsOpen={isExamsOpen}
            isProtected
            onProtectedClick={handleProtectedClick}
            icon={
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
        </ul>
      </nav>

      <RegisterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}