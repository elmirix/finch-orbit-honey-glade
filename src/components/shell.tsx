import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { examList } from "@/data/catalog";
import type { ExamId } from "@/data/types";
import { cn } from "@/lib/cn";
import { ExamLink } from "@/components/links";
import { LogoMark } from "@/components/icons";
import { useProgress } from "@/store/progress";

function examActive(pathname: string, id: ExamId) {
  return pathname === `/${id}` || pathname.startsWith(`/${id}/`);
}

export function Shell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState(false);
  const resetAll = useProgress((state) => state.resetAll);

  useEffect(() => {
    void useProgress.persist.rehydrate();
  }, []);

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-line-dark bg-navy">
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
                    "rounded-full px-4 py-2 text-sm font-medium",
                    active ? "bg-navy-3 text-teal" : "text-mist hover:text-teal",
                  )}
                >
                  {exam.title}
                </ExamLink>
              );
            })}
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
          <div className="overflow-hidden">
            <nav aria-label="Экзамены" className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 pb-4">
              <Link
                to="/"
                className="flex h-12 items-center rounded-xl px-3 text-base text-mist hover:bg-navy-3"
              >
                Главная
              </Link>
              {examList.map((exam) => (
                <ExamLink
                  key={exam.id}
                  examId={exam.id}
                  className={cn(
                    "flex h-12 items-center rounded-xl px-3 text-base",
                    examActive(pathname, exam.id)
                      ? "bg-navy-3 text-teal"
                      : "text-mist hover:bg-navy-3",
                  )}
                >
                  {exam.title}
                </ExamLink>
              ))}
            </nav>
          </div>
        </div>
      </header>
      <main className="page-enter flex-1" key={pathname}>
        {children}
      </main>
      <footer className="border-t border-line-dark">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-medium text-mist">Click</p>
            <p className="mt-1 max-w-md">
              Подготовка к ОРТ, SAT и IELTS. Демонстрационные материалы для тренировки, не официальные
              задания комиссий.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {examList.map((exam) => (
              <ExamLink key={exam.id} examId={exam.id} className="hover:text-teal">
                {exam.title}
              </ExamLink>
            ))}
            <button
              type="button"
              className="hover:text-teal"
              onClick={() => {
                if (window.confirm("Сбросить весь прогресс на этом устройстве?")) resetAll();
              }}
            >
              Сбросить прогресс
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
