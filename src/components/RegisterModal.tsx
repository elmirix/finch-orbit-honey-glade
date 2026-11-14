import { useState, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabaseClient";
import type { ExamId } from "@/data/types";

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

// ИСПРАВЛЕНО: Массивы теперь инициализированы
const DAILY_GOALS = [15, 30, 45, 60];
const STEPS = [1, 2, 3, 4];

export function RegisterModal({
  isOpen,
  onClose,
  initialMode = "register",
}: {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "register" | "login";
}) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<"register" | "login">(initialMode);
  const [step, setStep] = useState(1);

  const [targetExam, setTargetExam] = useState<ExamId>("ort");
  const [experience, setExperience] = useState("Ни разу не сдавал — начинаю с нуля");
  const [targetScore, setTargetScore] = useState<string>(TARGET_SCORES.ort[1]);
  const [dailyGoal, setDailyGoal] = useState<number>(30);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("preset:av1");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setStep(1);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleExamSelect = (exam: ExamId) => {
    setTargetExam(exam);
    setTargetScore(TARGET_SCORES[exam][1]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

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
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const cleanName = name.trim() || "Студент";
      const cleanEmail = email.trim();

      const { error } = await supabase
        .from("users")
        .insert([{ name: cleanName, email: cleanEmail }]);

      if (error) throw error;

      const user = {
        name: cleanName,
        email: cleanEmail,
        avatar,
        targetExam,
        targetScore,
        experience,
        dailyGoal,
        isLoggedIn: true,
        joinedAt: new Date().toISOString(),
      };

      localStorage.setItem("click_user", JSON.stringify(user));

      setStep(1);
      onClose();
      navigate({ to: "/profile" });
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
      alert("Не удалось сохранить данные. Проверьте интернет.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const cleanEmail = email.trim();

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", cleanEmail)
        .limit(1);

      if (error) throw error;

      if (!data || data.length === 0) {
        alert("Аккаунт с таким email не найден. Проверьте адрес или зарегистрируйтесь.");
        setIsLoading(false);
        return;
      }

      const dbUser = data[0];
      const fallbackName = cleanEmail.split("@")[0] || "Студент";
      const user = {
        name: dbUser.name || fallbackName,
        email: dbUser.email,
        avatar: "preset:av1",
        targetExam: "ort" as ExamId,
        dailyGoal: 30,
        isLoggedIn: true,
        joinedAt: dbUser.created_at || new Date().toISOString(),
      };

      localStorage.setItem("click_user", JSON.stringify(user));

      onClose();
      navigate({ to: "/profile" });
    } catch (error) {
      console.error("Ошибка при входе:", error);
      alert("Ошибка соединения с базой данных.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#040914]/85 p-3 backdrop-blur-xl sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/15 bg-[#0a1628]/90 p-5 shadow-[0_25px_70px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.2)] sm:p-8"
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          {mode === "register" ? (
            <div className="flex flex-1 gap-2">
              {STEPS.map((num) => (
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
          ) : (
            <span className="text-xs font-semibold tracking-widest text-teal uppercase">
              С возвращением
            </span>
          )}

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium text-slate transition-colors hover:text-mist"
          >
            Закрыть ✕
          </button>
        </div>

        {mode === "login" ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-mist">Войти в Click</h2>
              <p className="mt-1 text-sm text-slate">
                Введи свой email, чтобы продолжить подготовку.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate">Email</label>
              <input
                type="email"
                required
                placeholder="aigerim@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder-slate/50 focus:border-teal focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate">Пароль</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder-slate/50 focus:border-teal focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-full bg-teal py-3.5 text-sm font-bold text-[#071120] shadow-[0_0_25px_rgba(100,255,218,0.35)] transition-transform hover:scale-[1.02] disabled:opacity-70"
            >
              {isLoading ? "Входим..." : "Войти в профиль →"}
            </button>

            <p className="pt-2 text-center text-xs text-slate">
              Ещё нет аккаунта?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setStep(1);
                }}
                className="font-semibold text-teal hover:underline"
              >
                Создать аккаунт
              </button>
            </p>
          </form>
        ) : (
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-bold text-mist">Привет от команды Click 👋</h2>
                  <p className="mt-2 text-sm text-slate">
                    Хочешь поступить, готовясь с умом? Мы — Эльмир и Чынгыз. Сделали Click,
                    чтобы ты готовился к ОРТ, SAT и IELTS прямо с телефона: короткая теория, задачи с разбором и пробники на время.
                  </p>
                </div>

                <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-sm font-semibold text-mist">Почему с нами быстрее</p>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate">
                      <span>С платформой Click</span>
                      <span className="text-teal">Система + практика + разбор</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "92%" }}
                        transition={{ duration: 0.65, delay: 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 shadow-[0_0_12px_rgba(100,255,218,0.5)]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between text-xs text-slate">
                      <span>Обычные курсы и зубрёжка</span>
                      <span className="text-red-400">Вода и потеря времени</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "42%" }}
                        transition={{ duration: 0.65, delay: 0.2 }}
                        className="h-full rounded-full bg-white/25"
                      />
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
                
                <p className="text-center text-xs text-slate">
                  Уже есть аккаунт?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="font-semibold text-teal hover:underline"
                  >
                    Войти
                  </button>
                </p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-bold text-mist">К какому экзамену готовимся?</h2>
                  <p className="mt-1 text-sm text-slate">Настроим личный профиль под твою цель.</p>
                </div>

                <div className="grid grid-cols-3 gap-2">
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
                        className={`rounded-2xl border p-3.5 text-center transition-all ${
                          active
                            ? "border-teal bg-teal/15 shadow-[0_0_20px_rgba(100,255,218,0.2)]"
                            : "border-white/10 bg-white/[0.04] hover:border-white/25"
                        }`}
                      >
                        <p className={`text-lg font-bold ${active ? "text-teal" : "text-mist"}`}>
                          {item.title}
                        </p>
                        <p className="text-[10px] text-slate">{item.sub}</p>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <p className="mb-3 text-sm font-semibold text-mist">Когда в последний раз сдавал экзамен?</p>
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
                        {exp}
                        {experience === exp && <span className="text-teal">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
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
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-bold text-mist">Какой балл хочешь получить?</h2>
                  <p className="mt-1 text-sm text-slate">Сохраним цель в профиле, чтобы следить за прогрессом.</p>
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
                  <p className="mb-3 text-sm font-semibold text-mist">Сколько минут в день готов уделять?</p>
                  <div className="grid grid-cols-4 gap-2">
                    {DAILY_GOALS.map((mins) => (
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

                <div className="flex gap-3 pt-2">
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
                onSubmit={handleRegisterSubmit}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="text-2xl font-bold text-mist">Создай аккаунт</h2>
                  <p className="mt-1 text-sm text-slate">Заполни данные и выбери аватар из 15 вариантов.</p>
                </div>

                <div>
                  <label className="mb-1 block text-xs text-slate">Имя</label>
                  <input
                    type="text"
                    required
                    placeholder="Айгерим"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-2.5 text-sm text-white placeholder-slate/50 focus:border-teal focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-slate">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="aigerim@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-2.5 text-sm text-white placeholder-slate/50 focus:border-teal focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-slate">Пароль</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-2.5 text-sm text-white placeholder-slate/50 focus:border-teal focus:outline-none"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs text-slate">Выбери аватар</label>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-full border border-teal/40 bg-teal/15 px-3 py-1 text-xs font-semibold text-teal hover:bg-teal/25"
                    >
                      + Своё фото
                    </button>
                  </div>
                  
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <div className="grid grid-cols-5 gap-2">
                    {PRESET_AVATARS.map((preset) => {
                      // ИСПРАВЛЕНО: используем backticks (шаблонные строки)
                      const selected = avatar === `preset:${preset.id}`;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setAvatar(`preset:${preset.id}`)}
                          className={`flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br ${preset.bg} text-xl transition-transform hover:scale-105 ${
                            selected ? "ring-2 ring-teal ring-offset-2 ring-offset-[#0a1628]" : "opacity-80 hover:opacity-100"
                          }`}
                        >
                          {preset.icon}
                        </button>
                      );
                    })}
                  </div>
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
                    disabled={isLoading}
                    className="flex-1 rounded-full bg-teal py-3 text-sm font-bold text-[#071120] shadow-[0_0_20px_rgba(100,255,218,0.3)] disabled:opacity-50"
                  >
                    {isLoading ? "Сохраняем..." : "Создать аккаунт и начать 🚀"}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
}