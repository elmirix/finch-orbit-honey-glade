import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Page } from "@/components/ui";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { examList } from "@/data/catalog";
import { topicKey, useProgress } from "@/store/progress";
import { useProgressHydrated } from "@/components/use-hydrated";
import type { ExamId } from "@/data/types";
import type { ChangeEvent } from "react";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

const STORAGE_KEY = "click_user";

interface User {
  name: string;
  email: string;
  avatar?: string;
  targetExam?: ExamId;
  dailyGoal?: number;
}

const PRESET_AVATARS = [
  { id: "av1", bg: "from-teal-400 to-emerald-600", icon: "🚀", label: "Старт" },
  { id: "av2", bg: "from-cyan-400 to-blue-600", icon: "🧠", label: "Логика" },
  { id: "av3", bg: "from-indigo-400 to-purple-600", icon: "⚡", label: "Энергия" },
  { id: "av4", bg: "from-fuchsia-500 to-pink-600", icon: "🎯", label: "Цель" },
  { id: "av5", bg: "from-amber-400 to-orange-600", icon: "🔥", label: "Стрик" },
  { id: "av6", bg: "from-emerald-400 to-teal-700", icon: "📚", label: "Учёба" },
  { id: "av7", bg: "from-sky-400 to-indigo-600", icon: "🌍", label: "IELTS" },
  { id: "av8", bg: "from-violet-500 to-fuchsia-700", icon: "🎓", label: "SAT" },
  { id: "av9", bg: "from-rose-400 to-red-600", icon: "🏛️", label: "ОРТ" },
  { id: "av10", bg: "from-lime-400 to-green-600", icon: "🧩", label: "Задачи" },
  { id: "av11", bg: "from-blue-500 to-cyan-400", icon: "💎", label: "Фокус" },
  { id: "av12", bg: "from-purple-500 to-indigo-800", icon: "🌌", label: "Космос" },
  { id: "av13", bg: "from-orange-400 to-rose-600", icon: "🏆", label: "Победа" },
  { id: "av14", bg: "from-teal-300 to-cyan-600", icon: "💡", label: "Идея" },
  { id: "av15", bg: "from-slate-500 to-zinc-800", icon: "🕶️", label: "Профи" },
];

const GLASS_STYLE =
  "bg-white/[0.05] backdrop-blur-xl border border-white/15 rounded-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]";

function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "success">("idle");

  const hydrated = useProgressHydrated();
  const topics = useProgress((state) => state.topics);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
      try {
        const parsed = JSON.parse(raw);

        const loadedUser: User = {
          targetExam: "ort",
          dailyGoal: 30,
          ...parsed,
        };

        setUser(loadedUser);
        setEditName(loadedUser.name || "");
        setEditEmail(loadedUser.email || "");
      } catch {
        navigate({ to: "/" });
      }
    } else {
      navigate({ to: "/" });
    }
  }, [navigate]);

  const updateUserStorage = (updated: User) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setUser(updated);
  };

  const handleSave = () => {
    if (!user) return;

    setSaveState("saving");

    setTimeout(() => {
      const updated = {
        ...user,
        name: editName.trim() || user.name,
        email: editEmail.trim() || user.email,
      };

      updateUserStorage(updated);
      setSaveState("success");

      setTimeout(() => {
        setIsEditing(false);
        setSaveState("idle");
      }, 1000);
    }, 400);
  };

  const handleSelectPresetAvatar = (presetId: string) => {
    if (!user) return;

    updateUserStorage({
      ...user,
      avatar: `preset:${presetId}`,
    });

    setShowAvatarPicker(false);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file || !user) return;

    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 256;

        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");

        if (ctx) {
          const minSide = Math.min(img.width, img.height);
          const sx = (img.width - minSide) / 2;
          const sy = (img.height - minSide) / 2;

          ctx.drawImage(
            img,
            sx,
            sy,
            minSide,
            minSide,
            0,
            0,
            size,
            size
          );

          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8);

          updateUserStorage({
            ...user,
            avatar: compressedDataUrl,
          });

          setShowAvatarPicker(false);
        }
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleTargetChange = (examId: ExamId) => {
    if (!user) return;

    updateUserStorage({
      ...user,
      targetExam: examId,
    });
  };

  const handleGoalChange = (minutes: number) => {
    if (!user) return;

    updateUserStorage({
      ...user,
      dailyGoal: minutes,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    navigate({ to: "/" });
  };

  if (!user) return null;

  const examStats = examList.map((exam) => {
    let total = 0;
    let done = 0;

    for (const subject of exam.subjects) {
      for (const topic of subject.topics) {
        total += 1;

        if (
          hydrated &&
          topics[topicKey(exam.id, subject.id, topic.id)]?.passed
        ) {
          done += 1;
        }
      }
    }

    const percent = total > 0 ? Math.round((done / total) * 100) : 0;

    return {
      id: exam.id,
      title: exam.title,
      total,
      done,
      percent,
    };
  });

  const totalTopicsAll = examStats.reduce(
    (acc, item) => acc + item.total,
    0
  );

  const completedTopicsAll = examStats.reduce(
    (acc, item) => acc + item.done,
    0
  );

  const overallPercent =
    totalTopicsAll > 0
      ? Math.round((completedTopicsAll / totalTopicsAll) * 100)
      : 0;

  const userLevel = 1 + Math.floor(completedTopicsAll / 2);

  const userRank =
    completedTopicsAll === 0
      ? "Новичок"
      : completedTopicsAll < 5
        ? "Практикант"
        : completedTopicsAll < 15
          ? "Уверенный старт"
          : "Мастер тестов";

  const activeTarget = user.targetExam || "ort";

  const activeTargetExam =
    examList.find((e) => e.id === activeTarget) || examList[0];

  const renderAvatar = () => {
    if (user.avatar?.startsWith("data:image")) {
      return (
        <img
          src={user.avatar}
          alt={user.name}
          className="h-full w-full rounded-full object-cover"
        />
      );
    }

    if (user.avatar?.startsWith("preset:")) {
      const presetId = user.avatar.replace("preset:", "");
      const preset = PRESET_AVATARS.find((p) => p.id === presetId);

      if (preset) {
        return (
          <div
            className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br ${preset.bg} text-5xl shadow-inner`}
          >
            {preset.icon}
          </div>
        );
      }
    }

    return (
      <span className="text-5xl font-semibold text-mist">
        {user.name.charAt(0).toUpperCase()}
      </span>
    );
  };

  return (
    <Page className="relative min-h-screen overflow-hidden bg-transparent text-mist">
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-8 md:px-8 md:py-12">

        <header className="mb-8 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-medium text-mist backdrop-blur-xl transition-all hover:border-teal/50 hover:text-teal"
          >
            <span>←</span> В кабинет
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-slate transition-colors hover:border-red-400/40 hover:text-red-400"
          >
            Выйти
          </button>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

          <div className="space-y-6 lg:col-span-5">

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${GLASS_STYLE} p-6`}
            >
              <div className="flex items-center gap-5">

                <div className="relative shrink-0">
                  <div className="absolute inset-0 rounded-full bg-teal opacity-25 blur-xl" />

                  <button
                    type="button"
                    onClick={() => setShowAvatarPicker((prev) => !prev)}
                    title="Изменить аватар"
                    className="group relative z-10 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-white/10 shadow-xl transition-transform hover:scale-105"
                  >
                    {renderAvatar()}

                    <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                      Изменить
                    </span>
                  </button>
                </div>

                <div className="min-w-0 flex-1">
                  <h1 className="truncate text-2xl font-semibold text-mist">
                    {user.name}
                  </h1>

                  <p className="mt-0.5 truncate text-sm text-slate">
                    {user.email}
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowAvatarPicker((prev) => !prev)}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-xs font-medium text-teal transition-colors hover:bg-teal/20"
                  >
                    {showAvatarPicker ? "Скрыть выбор" : "Сменить аватар"}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {showAvatarPicker && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-6 border-t border-white/10 pt-5">

                      <div className="mb-4 flex items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold text-mist">
                          Выбери аватар (15)
                        </h3>

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="rounded-full bg-teal px-3 py-1.5 text-xs font-semibold text-[#071120] transition-transform hover:scale-105"
                        >
                          + Загрузить фото
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
                          const isSelected =
                            user.avatar === `preset:${preset.id}`;

                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() =>
                                handleSelectPresetAvatar(preset.id)
                              }
                              title={preset.label}
                              className={`flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br ${preset.bg} text-2xl transition-transform hover:scale-105 ${
                                isSelected
                                  ? "ring-2 ring-teal ring-offset-2 ring-offset-[#071120]"
                                  : "opacity-85 hover:opacity-100"
                              }`}
                            >
                              {preset.icon}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-6 grid grid-cols-2 gap-3">

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="mb-1 text-xs text-slate">Статус</p>
                  <p className="text-sm font-semibold text-teal">
                    {userRank}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="mb-1 text-xs text-slate">Уровень</p>
                  <p className="text-sm font-semibold text-mist">
                    {userLevel}
                  </p>
                  <p className="mt-1 text-xs text-slate">
                    {completedTopicsAll}/{totalTopicsAll} тем
                  </p>
                </div>

              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`${GLASS_STYLE} p-6`}
            >
              <h2 className="mb-5 text-lg font-semibold text-mist">
                Твоя цель
              </h2>

              <div className="mb-6">
                <p className="mb-3 text-sm text-slate">
                  Основной экзамен
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {(["ort", "sat", "ielts"] as ExamId[]).map((examId) => {
                    const active = activeTarget === examId;

                    return (
                      <button
                        key={examId}
                        type="button"
                        onClick={() => handleTargetChange(examId)}
                        className={`rounded-xl py-2.5 text-sm font-semibold uppercase transition-all ${
                          active
                            ? "bg-teal text-[#071120] shadow-[0_0_15px_rgba(100,255,218,0.3)]"
                            : "border border-white/10 bg-white/[0.05] text-mist hover:bg-white/[0.1]"
                        }`}
                      >
                        {examId === "ort" ? "ОРТ" : examId.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm text-slate">
                  Время занятий в день
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {[15, 30, 60].map((mins) => {
                    const active = (user.dailyGoal || 30) === mins;

                    return (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => handleGoalChange(mins)}
                        className={`rounded-xl py-2 text-xs font-medium transition-all ${
                          active
                            ? "border border-teal/50 bg-teal/15 text-teal"
                            : "border border-white/10 bg-white/[0.04] text-slate hover:text-mist"
                        }`}
                      >
                        {mins} мин
                      </button>
                    );
                  })}
                </div>
              </div>

              <Link
                to="/dashboard"
                className="mt-6 flex w-full items-center justify-center rounded-full bg-teal py-3.5 text-sm font-semibold text-[#071120] shadow-[0_0_20px_rgba(100,255,218,0.2)] transition-transform hover:scale-[1.01]"
              >
                Приступить к {activeTargetExam.title} →
              </Link>
            </motion.div>
          </div>

          <div className="space-y-6 lg:col-span-7">

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className={`${GLASS_STYLE} p-6 md:p-8`}
            >
              <h2 className="text-lg font-semibold text-mist">
                Аналитика
              </h2>

              <p className="mt-1 text-sm text-slate">
                Прогресс подготовки
              </p>

              <div className="mt-6 flex items-end justify-between">
                <div>
                  <p className="text-5xl font-bold tracking-tight text-teal">
                    {overallPercent}%
                  </p>
                  <p className="mt-1 text-sm text-slate">
                    общий прогресс
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-semibold text-mist">
                    {completedTopicsAll}/{totalTopicsAll}
                  </p>
                  <p className="text-xs text-slate">
                    пройдено тем
                  </p>
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${overallPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full bg-teal shadow-[0_0_12px_rgba(100,255,218,0.5)]"
                />
              </div>

              <div className="mt-8 space-y-6">
                {examStats.map((stat) => (
                  <div key={stat.id}>

                    <div className="mb-2 flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-mist">
                        {stat.title}
                      </h3>

                      <span className="text-sm font-semibold text-teal">
                        {stat.percent}%
                      </span>
                    </div>

                    <p className="mb-3 text-xs text-slate">
                      Пройдено {stat.done} из {stat.total} тем
                    </p>

                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.percent}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="h-full rounded-full bg-teal shadow-[0_0_12px_rgba(100,255,218,0.5)]"
                      />
                    </div>

                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`${GLASS_STYLE} p-6 md:p-8`}
            >
              <div className="mb-6 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-mist">
                  Личные данные
                </h2>

                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="rounded-full border border-teal/30 bg-teal/10 px-4 py-1.5 text-xs font-medium text-teal transition-colors hover:bg-teal/20"
                  >
                    Изменить
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditName(user.name);
                      setEditEmail(user.email);
                      setIsEditing(false);
                      setSaveState("idle");
                    }}
                    className="rounded-full border border-red-400/30 bg-red-400/10 px-4 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-400/20"
                  >
                    Отмена
                  </button>
                )}
              </div>

              <div className="space-y-5">

                <div>
                  <label className="mb-2 block text-xs font-medium text-slate">
                    Имя
                  </label>

                  {isEditing ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full rounded-xl border border-teal/50 bg-white/[0.06] px-4 py-2.5 text-base text-white focus:border-teal focus:outline-none"
                    />
                  ) : (
                    <p className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-mist">
                      {user.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-slate">
                    Email
                  </label>

                  {isEditing ? (
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full rounded-xl border border-teal/50 bg-white/[0.06] px-4 py-2.5 text-base text-white focus:border-teal focus:outline-none"
                    />
                  ) : (
                    <p className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-mist">
                      {user.email}
                    </p>
                  )}
                </div>

                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <button
                        onClick={handleSave}
                        disabled={saveState === "saving"}
                        className="flex w-full items-center justify-center rounded-full bg-teal py-3.5 text-sm font-semibold text-[#071120] shadow-[0_0_20px_rgba(100,255,218,0.3)] transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {saveState === "saving"
                          ? "Сохраняем..."
                          : saveState === "success"
                            ? "✓ Сохранено"
                            : "Сохранить изменения"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Page>
  );
}