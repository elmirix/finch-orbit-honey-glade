import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import type { ExamId } from "@/data/types";
import type { ChangeEvent, FormEvent } from "react";

const STORAGE_KEY = "click_user";
const ONBOARDING_DISMISSED_KEY = "click_onboarding_seen";

const PRESET_AVATARS = [
  { id: "av1", bg: "from-teal-400 to-emerald-600", icon: "🚀" },
  { id: "av2", bg: "from-cyan-400 to-blue-600", icon: "🧠" },
  { id: "av3", bg: "from-indigo-400 to-purple-600", icon: "⚡" },
  { id: "av4", bg: "from-fuchsia-500 to-pink-600", icon: "🎯" },
  { id: "av5", bg: "from-amber-400 to-orange-600", icon: "🔥" },
  { id: "av6", bg: "from-emerald-400 to-teal-700", icon: "📚" },
  { id: "av7", bg: "from-sky-400 to-indigo-600", icon: "🌍" },
  { id: "av8", bg: "from-violet-500 to-fuchsia-700", icon: "🎓" },
  { id: "av9", bg: "from-rose-400 to-red-600", icon: "🏛️" },
  { id: "av10", bg: "from-lime-400 to-green-600", icon: "🧩" },
  { id: "av11", bg: "from-blue-500 to-cyan-400", icon: "💎" },
  { id: "av12", bg: "from-purple-500 to-indigo-800", icon: "🌌" },
  { id: "av13", bg: "from-orange-400 to-rose-600", icon: "🏆" },
  { id: "av14", bg: "from-teal-300 to-cyan-600", icon: "💡" },
  { id: "av15", bg: "from-slate-500 to-zinc-800", icon: "🕶️" },
];

const TARGET_SCORES: Record<ExamId, string[]> = {
  ort: ["160+ баллов", "190+ баллов", "215+ (Золотой сертификат)"],
  sat: ["1250+ баллов", "1400+ баллов", "1520+ (Топ вузы)"],
  ielts: ["Band 6.5", "Band 7.5", "Band 8.5+"],
};

export function WelcomeOnboarding({
  forceOpen = false,
  onClose,
}: {
  forceOpen?: boolean;
  onClose?: () => void;
}) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);

  const [targetExam, setTargetExam] = useState<ExamId>("ort");
  const [experience, setExperience] = useState("Ни разу не сдавал");
  const [targetScore, setTargetScore] = useState(TARGET_SCORES.ort[1]);
  const [dailyGoal, setDailyGoal] = useState(30);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("preset:av1");

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      setStep(1);
      return;
    }

    const existingUser = localStorage.getItem(STORAGE_KEY);
    const dismissed = sessionStorage.getItem(ONBOARDING_DISMISSED_KEY);

    if (!existingUser && !dismissed) {
      const timer = setTimeout(() => setIsOpen(true), 400);
      return () => clearTimeout(timer);
    }
  }, [forceOpen]);

  const handleClose = () => {
    sessionStorage.setItem(ONBOARDING_DISMISSED_KEY, "true");
    setIsOpen(false);
    onClose?.();
  };

  const handleExamSelect = (exam: ExamId) => {
    setTargetExam(exam);
    setTargetScore(TARGET_SCORES[exam][1]);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");

        canvas.width = 200;
        canvas.height = 200;

        const ctx = canvas.getContext("2d");

        if (ctx) {
          const minSide = Math.min(img.width, img.height);

          ctx.drawImage(
            img,
            (img.width - minSide) / 2,
            (img.height - minSide) / 2,
            minSide,
            minSide,
            0,
            0,
            200,
            200
          );

          setAvatar(canvas.toDataURL("image/jpeg", 0.8));
        }
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleFinish = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userData = {
      name: name.trim() || "Студент Click",
      email: email.trim() || "student@click.kg",
      avatar,
      targetExam,
      targetScore,
      experience,
      dailyGoal,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setIsOpen(false);
    onClose?.();

    navigate({ to: `/${targetExam}` as "/ort" | "/sat" | "/ielts" });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#040914]/85 p-3 backdrop-blur-xl sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/15 bg-[#0a1628]/90 p-5 shadow-[0_25px_70px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.2)] sm:p-8"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex flex-1 gap-2">
              {[1, 2, 3, 4].map((num) => (
                <div
                  key={num}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    num <= step
                      ? "bg-teal shadow-[0_0_10px_rgba(100,255,218,0.5)]"
                      : "bg-white/10"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="text-xs font-medium text-slate transition-colors hover:text-mist"
            >
              Позже ✕
            </button>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-5"
              >
                <div>
                  <span className="inline-block rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
                    Привет от команды Click 👋
                  </span>

                  <h2 className="mt-3 text-2xl font-bold leading-tight text-mist sm:text-3xl">
                    Хочешь поступить, готовясь с умом?
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-slate">
                    Мы — <strong className="text-mist">Эльмир и Чынгыз</strong>.
                    Сделали Click, чтобы ты готовился к{" "}
                    <strong className="text-mist">ОРТ, SAT и IELTS</strong>{" "}
                    прямо с телефона: короткая теория, задачи с разбором и
                    пробники на время.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate">
                    Почему с нами быстрее
                  </p>

                  <div className="space-y-3.5">
                    <div>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="font-semibold text-teal">
                          С платформой Click
                        </span>
                        <span className="text-teal">
                          Система + практика + разбор
                        </span>
                      </div>

                      <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "92%" }}
                          transition={{ duration: 0.7, delay: 0.1 }}
                          className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 shadow-[0_0_12px_rgba(100,255,218,0.5)]"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-slate">
                          Обычная подготовка / зубрёжка
                        </span>
                        <span className="text-slate/70">
                          Вода и потеря времени
                        </span>
                      </div>

                      <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "42%" }}
                          transition={{ duration: 0.7, delay: 0.2 }}
                          className="h-full rounded-full bg-white/25"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full rounded-full bg-teal py-3.5 text-sm font-bold text-[#071120] shadow-[0_0_25px_rgba(100,255,218,0.35)] transition-transform hover:scale-[1.02] active:scale-95"
                >
                  Давай дружить! Рассказать о себе →
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-bold text-mist">
                    К какому экзамену готовимся?
                  </h2>

                  <p className="mt-1 text-sm text-slate">
                    Подберём программу и откроем нужный трек.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {(
                    [
                      { id: "ort", title: "ОРТ", sub: "Вузы КР" },
                      { id: "sat", title: "SAT", sub: "США и мир" },
                      { id: "ielts", title: "IELTS", sub: "Английский" },
                    ] as const
                  ).map((item) => {
                    const active = targetExam === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleExamSelect(item.id)}
                        className={`rounded-2xl border p-3.5 text-left transition-all ${
                          active
                            ? "border-teal bg-teal/15 shadow-[0_0_20px_rgba(100,255,218,0.2)]"
                            : "border-white/10 bg-white/[0.04] hover:border-white/25"
                        }`}
                      >
                        <p
                          className={`text-lg font-bold ${
                            active ? "text-teal" : "text-mist"
                          }`}
                        >
                          {item.title}
                        </p>

                        <p className="mt-1 text-xs text-slate">
                          {item.sub}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-mist">
                    Когда в последний раз сдавал экзамен?
                  </h3>

                  <div className="space-y-2">
                    {[
                      "Ни разу не сдавал — начинаю с нуля",
                      "Пробовал решать пробники сам",
                      "Уже сдавал официально, хочу поднять балл",
                    ].map((exp) => (
                      <button
                        key={exp}
                        type="button"
                        onClick={() => setExperience(exp)}
                        className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition-all ${
                          experience === exp
                            ? "border-teal/60 bg-teal/15 text-mist"
                            : "border-white/10 bg-white/[0.04] text-slate hover:text-mist"
                        }`}
                      >
                        <span>{exp}</span>
                        {experience === exp && (
                          <span className="text-teal">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-mist"
                  >
                    ← Назад
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 rounded-full bg-teal py-3 text-sm font-bold text-[#071120] shadow-[0_0_20px_rgba(100,255,218,0.3)]"
                  >
                    Дальше →
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-bold text-mist">
                    Какой балл хочешь получить?
                  </h2>

                  <p className="mt-1 text-sm text-slate">
                    Зафиксируем цель в твоём профиле, чтобы отслеживать прогресс.
                  </p>
                </div>

                <div className="space-y-2">
                  {TARGET_SCORES[targetExam].map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setTargetScore(score)}
                      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-sm font-semibold transition-all ${
                        targetScore === score
                          ? "border-teal bg-teal/15 text-teal shadow-[0_0_15px_rgba(100,255,218,0.15)]"
                          : "border-white/10 bg-white/[0.04] text-mist hover:border-white/25"
                      }`}
                    >
                      {score}
                      {targetScore === score && <span>🎯</span>}
                    </button>
                  ))}
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-mist">
                    Сколько минут в день готов уделять?
                  </h3>

                  <div className="grid grid-cols-3 gap-3">
                    {[15, 30, 60].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setDailyGoal(mins)}
                        className={`rounded-2xl border py-3 text-sm font-semibold transition-all ${
                          dailyGoal === mins
                            ? "border-teal bg-teal text-[#071120]"
                            : "border-white/10 bg-white/[0.04] text-mist"
                        }`}
                      >
                        {mins} мин
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-mist"
                  >
                    ← Назад
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="flex-1 rounded-full bg-teal py-3 text-sm font-bold text-[#071120] shadow-[0_0_20px_rgba(100,255,218,0.3)]"
                  >
                    Почти готово →
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.form
                key="step4"
                onSubmit={handleFinish}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="text-2xl font-bold text-mist">
                    Создай свой профиль
                  </h2>

                  <p className="mt-1 text-sm text-slate">
                    Выбери аватар из 15 вариантов или загрузи своё фото.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-mist">
                    Как тебя зовут?
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="Например, Айбек"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-2.5 text-sm text-white placeholder-slate/50 focus:border-teal focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-mist">
                    Email
                  </label>

                  <input
                    type="email"
                    required
                    placeholder="name@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-2.5 text-sm text-white placeholder-slate/50 focus:border-teal focus:outline-none"
                  />
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-mist">
                      Выбери аватар
                    </h3>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-full border border-teal/40 bg-teal/15 px-3 py-1 text-xs font-semibold text-teal hover:bg-teal/25"
                    >
                      + Своё фото
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="grid grid-cols-5 gap-3">
                    {PRESET_AVATARS.map((preset) => {
                      const selected = avatar === `preset:${preset.id}`;

                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setAvatar(`preset:${preset.id}`)}
                          className={`flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br ${preset.bg} text-xl transition-transform hover:scale-105 ${
                            selected
                              ? "ring-2 ring-teal ring-offset-2 ring-offset-[#0a1628]"
                              : "opacity-80 hover:opacity-100"
                          }`}
                        >
                          {preset.icon}
                        </button>
                      );
                    })}
                  </div>

                  {avatar.startsWith("data:image") && (
                    <div className="mt-3 flex items-center gap-3">
                      <img
                        src={avatar}
                        alt="Выбранный аватар"
                        className="h-12 w-12 rounded-full border border-teal/50 object-cover"
                      />

                      <span className="text-xs text-teal">
                        Фото выбрано
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-mist"
                  >
                    ←
                  </button>

                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-teal py-3.5 text-sm font-bold text-[#071120] shadow-[0_0_20px_rgba(100,255,218,0.3)] transition-transform hover:scale-[1.01] active:scale-95"
                  >
                    Начать подготовку к{" "}
                    {targetExam === "ort" ? "ОРТ" : targetExam.toUpperCase()} 🚀
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}