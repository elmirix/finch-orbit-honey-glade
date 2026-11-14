import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { examList } from "@/data/catalog";
import type { ExamId } from "@/data/types";
import { cn } from "@/lib/cn";
import { ExamLink } from "@/components/links";
import { LogoMark } from "@/components/icons";

function examActive(pathname: string, id: ExamId) {
  return pathname === `/${id}` || pathname.startsWith(`/${id}/`);
}

export function Shell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#071120]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4">
          <Link to="/" className="inline-flex items-center gap-2.5 text-mist">
            <LogoMark className="size-8 text-teal" />
            <span className="text-lg font-semibold tracking-tight">Click</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Экзамены">
            {examList.map((exam) => {
              const active = examActive(pathname, exam.id);
              return (
                <ExamLink
                  key={exam.id}
                  examId={exam.id}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "border border-teal/30 bg-teal/15 text-teal"
                      : "text-mist hover:text-teal",
                  )}
                >
                  {exam.title}
                </ExamLink>
              );
            })}
            <Link
              to="/profile"
              className={cn(
                "ml-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                pathname.startsWith("/profile")
                  ? "border-teal/50 bg-teal/20 text-teal"
                  : "border-white/15 bg-white/[0.06] text-mist hover:border-teal/40 hover:text-teal",
              )}
            >
              Профиль
            </Link>
          </nav>

          <button
            type="button"
            className="tap inline-flex size-11 items-center justify-center rounded-full text-mist md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
            <span className="sr-only">{open ? "Закрыть меню" : "Открыть меню"}</span>
          </button>
        </div>

        <div id="mobile-nav" className="nav-panel md:hidden" data-open={open ? "true" : "false"}>
          <div className="overflow-hidden border-t border-white/10 bg-[#071120]/90 backdrop-blur-2xl">
            <nav
              aria-label="Экзамены"
              className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-3"
            >
              <Link
                to="/"
                className="flex h-11 items-center rounded-xl px-3 text-base text-mist hover:bg-white/10"
              >
                Главная
              </Link>
              {examList.map((exam) => (
                <ExamLink
                  key={exam.id}
                  examId={exam.id}
                  className={cn(
                    "flex h-11 items-center rounded-xl px-3 text-base",
                    examActive(pathname, exam.id)
                      ? "bg-teal/15 text-teal"
                      : "text-mist hover:bg-white/10",
                  )}
                >
                  {exam.title}
                </ExamLink>
              ))}
              <Link
                to="/profile"
                className={cn(
                  "flex h-11 items-center rounded-xl px-3 text-base",
                  pathname.startsWith("/profile")
                    ? "bg-teal/15 text-teal"
                    : "text-mist hover:bg-white/10",
                )}
              >
                Профиль
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="page-enter flex-1" key={pathname}>
        {children}
      </main>

      <footer className="border-t border-white/10 bg-[#050b14]/60 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-medium text-mist">Click</p>
            <p className="mt-1 max-w-md">
              Тренажёр для подготовки к ОРТ, SAT и IELTS. Материалы созданы для тренировки.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {examList.map((exam) => (
              <ExamLink key={exam.id} examId={exam.id} className="hover:text-teal">
                {exam.title}
              </ExamLink>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
