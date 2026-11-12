import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-start px-4 py-24">
      <p className="text-sm font-medium text-teal">404</p>
      <h1 className="mt-2 text-3xl font-semibold text-mist">Страница не найдена</h1>
      <p className="mt-3 text-slate">
        Такой темы или раздела нет. Выберите экзамен на главной — ОРТ, SAT и IELTS открываются отдельно.
      </p>
      <Link
        to="/"
        className="tap mt-6 inline-flex h-11 items-center rounded-full bg-teal px-5 text-sm font-semibold text-ink"
      >
        На главную
      </Link>
    </div>
  );
}
