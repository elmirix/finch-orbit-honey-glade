import { createFileRoute, Link } from '@tanstack/react-router'
import { Page } from "@/components/ui"
import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence, animate } from "framer-motion"

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

// ---------- Ключевые кадры для CSS-эффектов (shimmer / shine) ----------
const FX_CSS = `
@keyframes fx-shimmer {
  0% { transform: translateX(-120%) skewX(-20deg); }
  100% { transform: translateX(320%) skewX(-20deg); }
}
@keyframes fx-shine {
  0% { left: -70%; }
  60% { left: 130%; }
  100% { left: 130%; }
}
`

// ---------- Типы и данные ----------

type TaskStatus = 'strong' | 'medium' | 'weak'

interface Task {
  id: number
  title: string
  xp: number
  coins: number
  done: boolean
}

interface Subject {
  subject: string
  score: number
  total: number
  status: TaskStatus
  trend: string
}

const initialTasks: Task[] = [
  { id: 1, title: "Выучить 10 слов", xp: 10, coins: 5, done: false },
  { id: 2, title: "Пройти пробный тест ОРТ", xp: 100, coins: 50, done: false },
  { id: 3, title: "Решить 5 задач по математике", xp: 50, coins: 25, done: false },
]

const analysisData: Subject[] = [
  { subject: "Математика", score: 85, total: 100, status: "strong", trend: "+5%" },
  { subject: "Аналогии и логика", score: 72, total: 100, status: "strong", trend: "+2%" },
  { subject: "Чтение и анализ текста", score: 45, total: 100, status: "weak", trend: "-3%" },
  { subject: "Грамматика (Английский)", score: 60, total: 100, status: "medium", trend: "+1%" },
]

const STATUS_CONFIG: Record<TaskStatus, { bar: string; text: string; label: string }> = {
  strong: { bar: 'bg-teal', text: 'text-teal', label: 'Сильная сторона' },
  medium: { bar: 'bg-yellow-400', text: 'text-yellow-400', label: 'Средний уровень' },
  weak: { bar: 'bg-red-400', text: 'text-red-400', label: 'Слабая сторона' },
}

const STATS = [
  { label: "Дней подряд", value: 12, icon: "🔥", color: "text-ok" },
  { label: "Пройдено тем", value: 24, icon: "✅", color: "text-teal" },
  { label: "Средний балл", value: 1340, icon: "🎯", color: "text-mist" },
] as const

const BASE_COINS = 450

// ---------- ЭФФЕКТ 1: Count-up чисел ----------

function useCountUp(target: number, delay = 0, duration = 1.4) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const controls = animate(0, target, {
      duration, delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: v => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [target, delay, duration])
  return value
}

// ---------- ЭФФЕКТ 5: Spotlight-карточка ----------

function GlowCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group/glow relative ${className}`}
    >
      <div className="absolute inset-0 rounded-[inherit] opacity-0 group-hover/glow:opacity-100 transition-opacity duration-500 shadow-[0_20px_50px_-15px_rgba(45,212,191,0.15)] pointer-events-none" />
      <div
        className="absolute inset-0 rounded-[inherit] opacity-0 group-hover/glow:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: 'radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), rgba(45,212,191,0.12), transparent 70%)' }}
      />
      {children}
    </motion.div>
  )
}

// ---------- Компоненты ----------

function StatCard({ icon, value, label, color, index }: { icon: string; value: number; label: string; color: string; index: number }) {
  const display = useCountUp(value, index * 0.1)
  return (
    <GlowCard delay={index * 0.1} className="card p-5 flex flex-col">
      <motion.span
        className="text-2xl mb-2"
        aria-hidden
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 260, damping: 14 }}
      >
        {icon}
      </motion.span>
      <span className={`text-3xl font-bold ${color} tabular-nums`}>{display}</span>
      <span className="text-xs text-slate mt-1 font-medium">{label}</span>
    </GlowCard>
  )
}

function SubjectRow({ item, index }: { item: Subject; index: number }) {
  const cfg = STATUS_CONFIG[item.status]
  const trendUp = item.trend.startsWith('+')

  return (
    <motion.div
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15 + index * 0.1 }}
    >
      <div className="flex justify-between items-end mb-2">
        <div>
          <p className="text-sm font-medium text-mist">{item.subject}</p>
          <p className={`text-xs ${cfg.text} mt-0.5`}>{cfg.label}</p>
        </div>
        <div className="text-right flex items-center gap-2 justify-end">
          <span className="text-sm font-bold text-mist tabular-nums">{item.score}/{item.total}</span>
          <motion.span
            initial={{ scale: 0, y: trendUp ? 6 : -6 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1, type: 'spring', stiffness: 300, damping: 10 }}
            className={`text-xs ${trendUp ? 'text-ok' : 'text-red-400'}`}
          >
            {trendUp ? '▲' : '▼'} {item.trend}
          </motion.span>
        </div>
      </div>

      <div className="w-full bg-ink rounded-full h-2.5 overflow-hidden relative">
        <motion.div
          className={`${cfg.bar} h-2.5 rounded-full relative overflow-hidden`}
          initial={{ width: 0 }}
          animate={{ width: `${item.score}%` }}
          transition={{ delay: 0.3 + index * 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            className="absolute top-0 bottom-0 w-10 bg-white/30"
            style={{ animation: 'fx-shimmer 2.4s ease-in-out infinite', animationDelay: `${1 + index * 0.3}s` }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

function CoinBurst() {
  const colors = ['bg-teal', 'bg-yellow-400', 'bg-ok', 'bg-teal', 'bg-yellow-400', 'bg-teal']
  return (
    <div className="absolute inset-0 pointer-events-none">
      {colors.map((c, i) => (
        <motion.span
          key={i}
          className={`absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full ${c}`}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(i * 1.05) * (28 + (i % 3) * 10),
            y: Math.sin(i * 1.05) * (28 + (i % 3) * 10) - 10,
            opacity: 0,
            scale: 0.4,
          }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

function TaskItem({ task, onToggle }: { task: Task; onToggle: (id: number) => void }) {
  return (
    <div
      role="checkbox"
      aria-checked={task.done}
      tabIndex={0}
      onClick={() => onToggle(task.id)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(task.id) } }}
      className="flex items-start gap-3 cursor-pointer group select-none relative"
    >
      <div className="relative shrink-0 mt-0.5">
        {/* ИСПРАВЛЕНО: убран spring, чтобы не было ошибки с keyframes */}
        <motion.div
          animate={task.done ? { scale: [1, 1.35, 1] } : { scale: 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
            task.done ? 'bg-teal/20 text-teal' : 'border-2 border-line-dark group-hover:border-teal'
          }`}
        >
          {task.done && "✓"}
        </motion.div>
        <AnimatePresence>
          {task.done && <CoinBurst key={`burst-${task.id}-${task.done}`} />}
        </AnimatePresence>
      </div>

      <div className="relative">
        <p className={`text-sm font-medium transition-colors ${
          task.done ? 'text-slate line-through' : 'text-mist group-hover:text-teal'
        }`}>
          {task.title}
        </p>
        <p className="text-xs text-slate mt-0.5 relative">
          +{task.xp} XP
          <AnimatePresence>
            {task.done && (
              <motion.span
                key={`xp-${task.id}`}
                className="absolute left-0 -top-1 text-teal font-bold text-xs"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: -16 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                +{task.xp}
              </motion.span>
            )}
          </AnimatePresence>
        </p>
      </div>
    </div>
  )
}

// ---------- Страница ----------

function DashboardPage() {
  const [userName, setUserName] = useState('Студент')
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('click_user')
      if (!saved) return
      const name = JSON.parse(saved)?.name
      if (typeof name === 'string' && name) setUserName(name)
    } catch { /* дефолт */ }
  }, [])

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const stats = useMemo(() => {
    const done = tasks.filter(t => t.done)
    return {
      earnedXp: done.reduce((s, t) => s + t.xp, 0),
      coins: BASE_COINS + done.reduce((s, t) => s + t.coins, 0),
      accuracy: Math.round(analysisData.reduce((s, i) => s + i.score, 0) / analysisData.length),
    }
  }, [tasks])

  const coinsDisplay = useCountUp(stats.coins, 0.3)
  const accuracyDisplay = useCountUp(stats.accuracy, 0.4)
  const statCards = [...STATS, { label: "Монеты", value: stats.coins, icon: "🪙", color: "text-slate" }]

  return (
    <Page className="pt-8 pb-20 md:pt-12">
      <style>{FX_CSS}</style>
      <div className="max-w-6xl mx-auto">

        {/* Шапка */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <motion.span
                className="absolute inset-0 rounded-full bg-teal/40"
                animate={{ scale: [1, 1.55], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              />
              <motion.span
                className="absolute inset-0 rounded-full bg-teal/25"
                animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
              />
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                className="relative w-16 h-16 rounded-full bg-teal flex items-center justify-center text-2xl font-bold text-ink shadow-lg shadow-teal/20 uppercase"
              >
                {userName.charAt(0)}
              </motion.div>
            </div>
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="text-2xl font-semibold text-mist"
              >
                Привет, {userName}! 👋
              </motion.h1>
              <p className="text-slate text-sm mt-1">
                Твой прогресс сегодня:{' '}
                <motion.span
                  key={stats.earnedXp}
                  initial={{ scale: 1.3, color: '#2dd4bf' }}
                  animate={{ scale: 1, color: '#2dd4bf' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                  className="inline-block font-semibold text-teal"
                >
                  +{stats.earnedXp} XP
                </motion.span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/profile" className="px-5 py-2.5 rounded-full bg-teal text-ink text-sm font-semibold hover:brightness-110 transition-all shadow-lg shadow-teal/20">
              Мой профиль
            </Link>
            <Link to="/" className="px-5 py-2.5 rounded-full border border-line-dark text-sm font-medium text-slate hover:text-mist hover:border-teal transition-colors">
              На главную
            </Link>
          </div>
        </motion.div>

        {/* Верхняя статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <StatCard key={stat.label} {...stat} index={i} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ЛЕВАЯ КОЛОНКА */}
          <div className="lg:col-span-2 space-y-6">

            {/* Анализ успеваемости */}
            <GlowCard className="card p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-mist flex items-center gap-2">
                  Анализ успеваемости
                </h3>
                <div className="text-right">
                  <p className="text-sm text-slate">Общая точность</p>
                  <p className="text-2xl font-bold text-teal tabular-nums">{accuracyDisplay}%</p>
                </div>
              </div>

              <div className="space-y-6">
                {analysisData.map((item, idx) => (
                  <SubjectRow key={item.subject} item={item} index={idx} />
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: 'spring', stiffness: 150, damping: 16 }}
                className="mt-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-3 items-start"
              >
                <motion.span
                  className="text-xl"
                  aria-hidden
                  animate={{ rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  ⚠️
                </motion.span>
                <div>
                  <h4 className="text-sm font-semibold text-red-400 mb-1">Зона особого внимания</h4>
                  <p className="text-sm text-slate">
                    Твой балл по чтению упал на 3%. Рекомендуем пройти тему{' '}
                    <strong className="text-mist">«Работа с текстом: Основная мысль»</strong>, чтобы подтянуть этот навык перед пробным экзаменом.
                  </p>
                </div>
              </motion.div>
            </GlowCard>

            {/* Продолжить урок */}
            <GlowCard className="card p-6 md:p-8 relative overflow-hidden">
              <motion.div
                className="absolute top-0 right-0 w-64 h-64 bg-teal/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"
                animate={{ x: [0, -25, 10, 0], y: [0, 15, -10, 0], scale: [1, 1.15, 0.95, 1] }}
                transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-40 h-40 bg-teal/5 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"
                animate={{ x: [0, 20, 0], y: [0, -12, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              />

              <div className="relative">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xs font-semibold tracking-widest text-teal mb-2"
                >
                  СЛЕДУЮЩИЙ ШАГ
                </motion.p>
                <h2 className="text-2xl font-semibold text-mist mb-2">Математика: Логарифмы</h2>
                <p className="text-slate text-sm mb-6 max-w-md">
                  Вы остановились на 3 из 10 вопросов. Самое время закончить тему и закрепить результат.
                </p>

                <Link
                  to="/ort"
                  className="relative inline-block overflow-hidden bg-teal text-ink font-semibold px-6 py-3 rounded-full hover:brightness-110 transition-all"
                >
                  Продолжить урок →
                  <span
                    className="absolute top-0 bottom-0 w-14 bg-white/25 skew-x-[-20deg] pointer-events-none"
                    style={{ animation: 'fx-shine 2.8s ease-in-out infinite' }}
                  />
                </Link>
              </div>
            </GlowCard>

          </div>

          {/* ПРАВАЯ КОЛОНКА */}
          <GlowCard className="card p-6" delay={0.2}>
            <h3 className="text-lg font-semibold text-mist mb-4">Задания на день</h3>
            <div className="space-y-4">
              {tasks.map(task => (
                <TaskItem key={task.id} task={task} onToggle={toggleTask} />
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-line-dark flex items-center justify-between">
              <span className="text-xs text-slate font-medium">Баланс</span>
              <span className="text-sm font-bold text-slate tabular-nums">🪙 {coinsDisplay}</span>
            </div>
          </GlowCard>

        </div>
      </div>
    </Page>
  )
}