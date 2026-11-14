
import React, { useState, useEffect, useRef } from "react";

type Language = "ru" | "kg" | "en";
type ExamId = "ort" | "sat" | "ielts";
type FontSize = "small" | "normal" | "large";
type Tab = "general" | "trainer" | "data";

export interface ClickSettings {
  lang: Language;
  primaryExam: ExamId;
  examDate: string;
  dailyGoal: number;
  useTimer: boolean;
  instantFeedback: boolean;
  autoNext: boolean;
  hotkeys: boolean;
  sounds: boolean;
  particles: boolean;
  focusMode: boolean;
  fontSize: FontSize;
}

const DEFAULT_SETTINGS: ClickSettings = {
  lang: "ru",
  primaryExam: "ort",
  examDate: "",
  dailyGoal: 10,
  useTimer: true,
  instantFeedback: true,
  autoNext: false,
  hotkeys: true,
  sounds: true,
  particles: true,
  focusMode: false,
  fontSize: "normal",
};

const TRANSLATIONS = {
  ru: {
    title: "Настройки",
    tabGeneral: "Общие",
    tabTrainer: "Тренажёр",
    tabData: "Данные",
    language: "Язык интерфейса",
    langHint: "Для ОРТ автоматически подберётся выбранный язык. SAT и IELTS всегда на английском.",
    primaryExam: "Основной экзамен",
    examDate: "Дата экзамена (для обратного отсчёта)",
    dailyGoal: "Ежедневная цель (вопросов в день)",
    timer: "Таймер на 15 минут",
    timerDesc: "Ограничение времени в пробных тестах",
    instantFeedback: "Разбор сразу после ответа",
    instantFeedbackDesc: "Показывать объяснение не дожидаясь конца теста",
    autoNext: "Автопереход к следующему вопросу",
    autoNextDesc: "Переключать через 1 сек после правильного ответа",
    hotkeys: "Горячие клавиши (1–4 и Enter)",
    hotkeysDesc: "Выбор ответа и переход с клавиатуры на ПК",
    sounds: "Звуковые эффекты",
    soundsDesc: "Мягкие сигналы при ответах и завершении темы",
    particles: "Космический фон и анимации",
    particlesDesc: "Отключите для экономии заряда на телефоне",
    focusMode: "Режим фокусировки (Дзен)",
    focusModeDesc: "Скрывать шапку и меню во время прохождения теста",
    fontSize: "Размер текста в блоке «Чтение»",
    fontSmall: "Мелкий",
    fontNormal: "Обычный",
    fontLarge: "Крупный",
    backupTitle: "Резервная копия прогресса",
    backupDesc: "Сохраните прогресс в файл, чтобы перенести его на другое устройство.",
    exportBtn: "Скачать копию",
    importBtn: "Загрузить копию",
    importSuccess: "Прогресс успешно восстановлен!",
    importError: "Ошибка чтения файла копии.",
    resetTitle: "Сброс статистики",
    resetAll: "Сбросить всё",
    resetOrt: "Сбросить ОРТ",
    resetSat: "Сбросить SAT",
    resetIelts: "Сбросить IELTS",
    resetConfirm: "Удалить выбранный прогресс без возможности восстановления?",
    cancel: "Отмена",
    confirm: "Да, удалить",
    save: "Готово",
  },
  kg: {
    title: "Жөндөөлөр",
    tabGeneral: "Жалпы",
    tabTrainer: "Машыктыргыч",
    tabData: "Маалыматтар",
    language: "Интерфейс тили",
    langHint: "ЖРТ үчүн тандалган тил автоматтык түрдө коюлат. SAT жана IELTS ар дайым англис тилинде.",
    primaryExam: "Негизги экзамен",
    examDate: "Экзамен күнү (артка саноо үчүн)",
    dailyGoal: "Күнүмдүк максат (күнүнө суроо)",
    timer: "15 мүнөттүк таймер",
    timerDesc: "Сынамык тесттерде убакытты чектөө",
    instantFeedback: "Жооптон кийин дароо талдоо",
    instantFeedbackDesc: "Тесттин аягын күтпөстөн түшүндүрмөнү көрсөтүү",
    autoNext: "Кийинки суроого автоматтык өтүү",
    autoNextDesc: "Туура жооптон кийин 1 сек ичинде өтүү",
    hotkeys: "Ыкчам баскычтар (1–4 жана Enter)",
    hotkeysDesc: "Компьютерде клавиатура аркылуу жооп берүү",
    sounds: "Үн коштоосу",
    soundsDesc: "Жооп бергенде жана тема бүткөндө үн чыгаруу",
    particles: "Космос фону жана анимациялар",
    particlesDesc: "Телефондун батареясын үнөмдөө үчүн өчүрүңүз",
    focusMode: "Көңүл буруу режими (Дзен)",
    focusModeDesc: "Тест учурунда жогорку менюну жашыруу",
    fontSize: "«Окуу» бөлүмүндөгү тексттин өлчөмү",
    fontSmall: "Кичине",
    fontNormal: "Кадимки",
    fontLarge: "Чоң",
    backupTitle: "Прогресстин камдык көчүрмөсү",
    backupDesc: "Прогрессти башка түзмөккө өткөрүү үчүн файлга сактаңыз.",
    exportBtn: "Көчүрмөнү жүктөө",
    importBtn: "Көчүрмөнү киргизүү",
    importSuccess: "Прогресс ийгиликтүү калыбына келтирилди!",
    importError: "Файлды окууда ката кетти.",
    resetTitle: "Статистиканы өчүрүү",
    resetAll: "Баарын өчүрүү",
    resetOrt: "ЖРТ өчүрүү",
    resetSat: "SAT өчүрүү",
    resetIelts: "IELTS өчүрүү",
    resetConfirm: "Тандалган прогрессти биротоло өчүрөсүзбү?",
    cancel: "Жокко чыгаруу",
    confirm: "Ооба, өчүрүү",
    save: "Даяр",
  },
  en: {
    title: "Settings",
    tabGeneral: "General",
    tabTrainer: "Trainer",
    tabData: "Data",
    language: "Interface Language",
    langHint: "ORT will adapt to the selected language. SAT and IELTS always remain in English.",
    primaryExam: "Primary Exam",
    examDate: "Exam Date (for countdown)",
    dailyGoal: "Daily Goal (questions per day)",
    timer: "15-minute timer",
    timerDesc: "Time limit for mock exams",
    instantFeedback: "Instant explanation",
    instantFeedbackDesc: "Show solution right after answering a question",
    autoNext: "Auto-advance to next question",
    autoNextDesc: "Move forward 1s after a correct answer",
    hotkeys: "Keyboard shortcuts (1–4 & Enter)",
    hotkeysDesc: "Answer and navigate using keyboard on desktop",
    sounds: "Sound effects",
    soundsDesc: "Subtle audio cues on answers and completion",
    particles: "Space background & animations",
    particlesDesc: "Disable to save battery on mobile devices",
    focusMode: "Focus Mode (Zen)",
    focusModeDesc: "Hide navigation bars during active tests",
    fontSize: "Text size in Reading sections",
    fontSmall: "Small",
    fontNormal: "Normal",
    fontLarge: "Large",
    backupTitle: "Progress Backup",
    backupDesc: "Export your progress to transfer it to another device.",
    exportBtn: "Export JSON",
    importBtn: "Import JSON",
    importSuccess: "Progress restored successfully!",
    importError: "Invalid backup file.",
    resetTitle: "Reset Progress",
    resetAll: "Reset All",
    resetOrt: "Reset ORT",
    resetSat: "Reset SAT",
    resetIelts: "Reset IELTS",
    resetConfirm: "Permanently delete selected progress?",
    cancel: "Cancel",
    confirm: "Yes, delete",
    save: "Done",
  },
};

type Translation = typeof TRANSLATIONS.ru;

export function SettingsButtonWithModal({
  onLanguageChange,
}: {
  onLanguageChange?: (lang: Language) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [settings, setSettings] = useState<ClickSettings>(DEFAULT_SETTINGS);
  const [resetTarget, setResetTarget] = useState<"all" | ExamId | null>(null);
  const [backupStatus, setBackupStatus] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const t: Translation = TRANSLATIONS[settings.lang] || TRANSLATIONS.ru;

  const applyGlobalClasses = (s: ClickSettings) => {
    document.documentElement.dataset.fontSize = s.fontSize;
    document.documentElement.dataset.particles = s.particles ? "on" : "off";
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("click_settings");

      if (saved) {
        const parsed = {
          ...DEFAULT_SETTINGS,
          ...JSON.parse(saved),
        } as ClickSettings;

        setSettings(parsed);
        applyGlobalClasses(parsed);
        onLanguageChange?.(parsed.lang);
      } else {
        applyGlobalClasses(DEFAULT_SETTINGS);
      }
    } catch (error) {
      console.error("Ошибка загрузки настроек:", error);
      applyGlobalClasses(DEFAULT_SETTINGS);
    }
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setResetTarget(null);
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const updateSetting = <K extends keyof ClickSettings>(
    key: K,
    value: ClickSettings[K]
  ) => {
    const updated = { ...settings, [key]: value };

    setSettings(updated);
    localStorage.setItem("click_settings", JSON.stringify(updated));
    applyGlobalClasses(updated);

    if (key === "lang") {
      onLanguageChange?.(value as Language);
    }
  };

  // Экспорт данных
  const handleExport = () => {
    try {
      const data: Record<string, string | null> = {};

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (key && key.startsWith("click_")) {
          data[key] = localStorage.getItem(key);
        }
      }

      const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        { type: "application/json" }
      );

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `click-backup-${new Date().toISOString().slice(0, 10)}.json`;

      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Ошибка экспорта:", error);
      setBackupStatus({ type: "err", text: t.importError });
    }
  };

  // Импорт данных
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);

        if (
          !parsed ||
          typeof parsed !== "object" ||
          Array.isArray(parsed)
        ) {
          throw new Error("Invalid backup");
        }

        Object.entries(parsed).forEach(([key, value]) => {
          if (key.startsWith("click_") && typeof value === "string") {
            localStorage.setItem(key, value);
          }
        });

        setBackupStatus({ type: "ok", text: t.importSuccess });

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.error("Ошибка импорта:", error);
        setBackupStatus({ type: "err", text: t.importError });
      }
    };

    reader.onerror = () => {
      setBackupStatus({ type: "err", text: t.importError });
    };

    reader.readAsText(file);
    e.target.value = "";
  };

  // Сброс прогресса
  const executeReset = () => {
    if (!resetTarget) return;

    if (resetTarget === "all") {
      const keys = Object.keys(localStorage);

      keys.forEach((key) => {
        if (
          key.startsWith("click_progress") ||
          key === "click-progress"
        ) {
          localStorage.removeItem(key);
        }
      });
    } else {
      localStorage.removeItem(`click_progress_${resetTarget}`);
    }

    setResetTarget(null);
    setIsOpen(false);
    window.location.reload();
  };

  const trainerOptions = [
    { key: "useTimer", title: t.timer, desc: t.timerDesc },
    { key: "instantFeedback", title: t.instantFeedback, desc: t.instantFeedbackDesc },
    { key: "autoNext", title: t.autoNext, desc: t.autoNextDesc },
    { key: "hotkeys", title: t.hotkeys, desc: t.hotkeysDesc },
    { key: "sounds", title: t.sounds, desc: t.soundsDesc },
    { key: "focusMode", title: t.focusMode, desc: t.focusModeDesc },
    { key: "particles", title: t.particles, desc: t.particlesDesc },
  ] as const;

  const tabOptions = [
    { id: "general", label: t.tabGeneral },
    { id: "trainer", label: t.tabTrainer },
    { id: "data", label: t.tabData },
  ] as const;

  return (
    <>
      {/* Кнопка настроек */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label={t.title}
        className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-sm font-medium text-mist backdrop-blur-xl transition-all hover:border-teal/50 hover:bg-white/[0.12] hover:text-teal active:scale-95"
      >
        <span>{settings.lang.toUpperCase()}</span>
      </button>

      {/* Модальное окно */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
              setResetTarget(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.title}
            className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#0b1422]/95 shadow-[0_25px_100px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
          >
            {/* Заголовок */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <h2 className="text-xl font-bold tracking-tight text-mist">
                {t.title}
              </h2>

              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate transition hover:bg-white/15 hover:text-mist"
              >
                ✕
              </button>
            </div>

            {/* Вкладки */}
            <div className="grid grid-cols-3 gap-1.5 border-b border-white/10 px-5 py-3">
              {tabOptions.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setResetTarget(null);
                    setBackupStatus(null);
                  }}
                  className={`rounded-xl py-2 text-xs font-semibold transition ${
                    activeTab === tab.id
                      ? "bg-teal text-[#071120] shadow-[0_0_15px_rgba(100,255,218,0.3)]"
                      : "text-slate hover:bg-white/5 hover:text-mist"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Контент */}
            <div className="overflow-y-auto px-6 py-5">

              {/* GENERAL */}
              {activeTab === "general" && (
                <div className="space-y-6">

                  {/* Язык */}
                  <section>
                    <h3 className="mb-3 text-sm font-semibold text-mist">
                      {t.language}
                    </h3>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "ru", label: "Русский" },
                        { id: "kg", label: "Кыргызча" },
                        { id: "en", label: "English" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => updateSetting("lang", item.id as Language)}
                          className={`rounded-2xl border py-2.5 text-sm font-medium transition ${
                            settings.lang === item.id
                              ? "border-teal/60 bg-teal/15 text-teal"
                              : "border-white/10 bg-white/[0.04] text-mist/80 hover:bg-white/[0.08]"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    <p className="mt-2 text-xs leading-relaxed text-slate">
                      {t.langHint}
                    </p>
                  </section>

                  {/* Экзамен */}
                  <section>
                    <h3 className="mb-3 text-sm font-semibold text-mist">
                      {t.primaryExam}
                    </h3>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "ort", label: "ОРТ" },
                        { id: "sat", label: "SAT" },
                        { id: "ielts", label: "IELTS" },
                      ].map((exam) => (
                        <button
                          key={exam.id}
                          onClick={() => updateSetting("primaryExam", exam.id as ExamId)}
                          className={`rounded-2xl border py-2 text-sm font-semibold transition ${
                            settings.primaryExam === exam.id
                              ? "border-teal/60 bg-teal/15 text-teal"
                              : "border-white/10 bg-white/[0.04] text-mist/80 hover:bg-white/[0.08]"
                          }`}
                        >
                          {exam.label}
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Цель */}
                  <section>
                    <h3 className="mb-3 text-sm font-semibold text-mist">
                      {t.dailyGoal}
                    </h3>

                    <div className="flex gap-2">
                      {[5, 10, 20, 30].map((num) => (
                        <button
                          key={num}
                          onClick={() => updateSetting("dailyGoal", num)}
                          className={`flex-1 rounded-xl py-2 text-xs font-semibold transition ${
                            settings.dailyGoal === num
                              ? "bg-teal text-[#071120]"
                              : "bg-white/5 text-mist hover:bg-white/10"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Дата экзамена */}
                  <section>
                    <label className="mb-2 block text-sm font-semibold text-mist">
                      {t.examDate}
                    </label>

                    <input
                      type="date"
                      value={settings.examDate}
                      onChange={(e) => updateSetting("examDate", e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-mist outline-none focus:border-teal"
                    />
                  </section>

                  {/* Размер текста */}
                  <section>
                    <h3 className="mb-3 text-sm font-semibold text-mist">
                      {t.fontSize}
                    </h3>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "small", label: t.fontSmall },
                        { id: "normal", label: t.fontNormal },
                        { id: "large", label: t.fontLarge },
                      ].map((size) => (
                        <button
                          key={size.id}
                          onClick={() => updateSetting("fontSize", size.id as FontSize)}
                          className={`rounded-2xl border py-2 text-xs font-medium transition ${
                            settings.fontSize === size.id
                              ? "border-teal/60 bg-teal/15 text-teal"
                              : "border-white/10 bg-white/[0.04] text-mist/80 hover:bg-white/[0.08]"
                          }`}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {/* TRAINER */}
              {activeTab === "trainer" && (
                <div className="space-y-2">
                  {trainerOptions.map((item) => (
                    <label
                      key={item.key}
                      className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3.5 transition hover:bg-white/[0.05]"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-mist">
                          {item.title}
                        </p>

                        <p className="mt-1 text-xs leading-relaxed text-slate">
                          {item.desc}
                        </p>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={settings[item.key]}
                        aria-label={item.title}
                        onClick={() =>
                          updateSetting(item.key, !settings[item.key])
                        }
                        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                          settings[item.key] ? "bg-teal" : "bg-white/15"
                        }`}
                      >
                        <span
                          className={`absolute top-1 size-4 rounded-full bg-white shadow transition-all ${
                            settings[item.key] ? "left-6" : "left-1"
                          }`}
                        />
                      </button>
                    </label>
                  ))}
                </div>
              )}

              {/* DATA */}
              {activeTab === "data" && (
                <div className="space-y-6">

                  {/* Backup */}
                  <section>
                    <h3 className="text-sm font-semibold text-mist">
                      {t.backupTitle}
                    </h3>

                    <p className="mt-1.5 text-xs leading-relaxed text-slate">
                      {t.backupDesc}
                    </p>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={handleExport}
                        className="flex-1 rounded-xl bg-teal py-2.5 text-xs font-bold text-[#071120] transition hover:brightness-110 active:scale-95"
                      >
                        ↓ {t.exportBtn}
                      </button>

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-semibold text-mist transition hover:bg-white/10"
                      >
                        ↑ {t.importBtn}
                      </button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json,application/json"
                      onChange={handleImport}
                      className="hidden"
                    />

                    {backupStatus && (
                      <p
                        className={`mt-3 text-xs font-medium ${
                          backupStatus.type === "ok"
                            ? "text-teal"
                            : "text-red-400"
                        }`}
                      >
                        {backupStatus.text}
                      </p>
                    )}
                  </section>

                  <div className="h-px bg-white/10" />

                  {/* Reset */}
                  <section>
                    <h3 className="mb-3 text-sm font-semibold text-mist">
                      {t.resetTitle}
                    </h3>

                    {!resetTarget ? (
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "ort", label: t.resetOrt },
                          { id: "sat", label: t.resetSat },
                          { id: "ielts", label: t.resetIelts },
                        ].map((exam) => (
                          <button
                            key={exam.id}
                            onClick={() => setResetTarget(exam.id as ExamId)}
                            className="rounded-xl border border-red-500/20 bg-red-500/10 py-2.5 text-xs font-medium text-red-300 transition hover:bg-red-500/20"
                          >
                            {exam.label}
                          </button>
                        ))}

                        <button
                          onClick={() => setResetTarget("all")}
                          className="rounded-xl border border-red-500/40 bg-red-500/20 py-2.5 text-xs font-semibold text-red-200 transition hover:bg-red-500/30"
                        >
                          {t.resetAll}
                        </button>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-red-500/25 bg-red-500/[0.06] p-4">
                        <p className="text-sm leading-relaxed text-red-200">
                          {t.resetConfirm}
                        </p>

                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => setResetTarget(null)}
                            className="flex-1 rounded-xl bg-white/10 py-2.5 text-xs font-medium text-mist transition hover:bg-white/20"
                          >
                            {t.cancel}
                          </button>

                          <button
                            onClick={executeReset}
                            className="flex-1 rounded-xl bg-red-500 py-2.5 text-xs font-bold text-white transition hover:bg-red-400"
                          >
                            {t.confirm}
                          </button>
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 p-4">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setResetTarget(null);
                }}
                className="w-full rounded-full bg-teal py-3 text-sm font-semibold text-[#071120] shadow-[0_0_20px_rgba(100,255,218,0.25)] transition hover:brightness-105 active:scale-[0.98]"
              >
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
