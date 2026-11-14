
import { createFileRoute, Link } from '@tanstack/react-router'
import { Page } from '@/components/ui'
import { useState, useEffect, useMemo, useRef } from 'react'
import type { ReactNode, MouseEvent } from 'react'
import { motion, AnimatePresence, animate } from 'framer-motion'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

// ---------- CSS-эффекты ----------

const FX_CSS = `
  @keyframes fx-shimmer {
    0% { transform: translateX(-120%) skewX(-20deg); }
    100% { transform: translateX(320%) skewX(-20deg); }
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
  { id: 1, title: 'Выучить 10 слов', xp: 10, coins: 5, done: false },
  { id: 2, title: 'Пройти пробный тест ОРТ', xp: 100, coins: 50, done: false },
  { id: 3, title: 'Решить 5 задач по математике', xp: 50, coins: 25, done: false },
]

const analysisData: Subject[] = [
  { subject: 'Математика', score: 85, total: 100, status: 'strong', trend: '+5%' },
  { subject: 'Аналогии и логика', score: 72, total: 100, status: 'strong', trend: '+2%' },
  { subject: 'Чтение и анализ текста', score: 45, total: 100, status: 'weak', trend: '-3%' },
  { subject: 'Грамматика (Английский)', score: 60, total: 100, status: 'medium', trend: '+1%' },
]

const STATUS_CONFIG: Record<
  TaskStatus,
  { bar: string; text: string; label: string }
> = {
  strong: {
    bar: 'bg-teal',
    text: 'text-teal',
    label: 'Сильная сторона',
  },
  medium: {
    bar: 'bg-yellow-400',
    text: 'text-yellow-400',
    label: 'Средний уровень',
  },
  weak: {
    bar: 'bg-red-400',
    text: 'text-red-400',
    label: 'Слабая сторона',
  },
}

const STATS = [
  { label: 'Дней подряд', value: 12, icon: '🔥', color: 'text-ok' },
  { label: 'Пройдено тем', value: 24, icon: '✅', color: 'text-teal' },
  { label: 'Средний балл', value: 1340, icon: '🎯', color: 'text-mist' },
] as const

const BASE_COINS = 450

// ---------- Стеклянный стиль ----------

const GLASS_STYLE =
  'rounded-3xl border border-white/15 bg-white/[0.045] backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_12px_36px_rgba(0,0,0,0.45)] transition-colors hover:border-white/25 hover:bg-white/[0.07]'

// ---------- Анимация чисел ----------

function useCountUp(target: number, delay = 0, duration = 1.4) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const controls = animate(0, target, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    })

    return () => controls.stop()
  }, [target, delay, duration])

  return value
}

// ---------- Spotlight-карточка ----------

function GlowCard({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()

    el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group/glow relative ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 shadow-[0_20px_50px_-15px_rgba(45,212,191,0.18)] transition-opacity duration-500 group-hover/glow:opacity-100" />

      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/glow:opacity-100"
        style={{
          background:
            'radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), rgba(100,255,218,0.14), transparent 70%)',
        }}
      />

      {children}
    </motion.div>
  )
}

// ---------- Карточка статистики ----------

function StatCard({
  icon,
  value,
  label,
  color,
  index,
}: {
  icon: string
  value: number
  label: string
  color: string
  index: number
}) {
  const display = useCountUp(value, index * 0.1)

  return (
    <GlowCard
      delay={index * 0.1}
      className={`${GLASS_STYLE} flex flex-col p-5`}
    >
      <motion.span
        className="mb-3 flex size-11 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] text-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
        aria-hidden
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          delay: index * 0.1 + 0.2,
          type: 'spring',
          stiffness: 260,
          damping: 14,
        }}
      >
        {icon}
      </motion.span>

      <span className={`text-3xl font-bold tabular-nums ${color}`}>
        {display}
      </span>

      <span className="mt-1 text-xs font-medium text-slate">{label}</span>
    </GlowCard>
  )
}

// ---------- Строка анализа успеваемости ----------

function SubjectRow({
  item,
  index,
}: {
  item: Subject
  index: number
}) {
  const cfg = STATUS_CONFIG[item.status]
  const trendUp = item.trend.startsWith('+')

  return (
    <motion.div
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15 + index * 0.1 }}
    >
      <div className="mb-2 flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-mist">{item.subject}</p>
          <p className={`mt-0.5 text-xs ${cfg.text}`}>{cfg.label}</p>
        </div>

        <div className="flex items-center justify-end gap-2 text-right">
          <span className="text-sm font-bold tabular-nums text-mist">
            {item.score}/{item.total}
          </span>

          <motion.span
            initial={{ scale: 0, y: trendUp ? 6 : -6 }}
            animate={{ scale: 1, y: 0 }}
            transition={{
              delay: 0.5 + index * 0.1,
              type: 'spring',
              stiffness: 300,
              damping: 10,
            }}
            className={`text-xs ${trendUp ? 'text-ok' : 'text-red-400'}`}
          >
            {trendUp ? '▲' : '▼'} {item.trend}
          </motion.span>
        </div>
      </div>

      <div className="relative h-2.5 w-full overflow-hidden rounded-full border border-white/10 bg-white/[0.08]">
        <motion.div
          className={`relative h-2.5 overflow-hidden rounded-full ${cfg.bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${item.score}%` }}
          transition={{
            delay: 0.3 + index * 0.1,
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <span
            className="absolute bottom-0 top-0 w-10 bg-white/35"
            style={{
              animation: 'fx-shimmer 2.4s ease-in-out infinite',
              animationDelay: `${1 + index * 0.3}s`,
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

// ---------- Анимация получения монет ----------

function CoinBurst() {
  const colors = [
    'bg-teal',
    'bg-yellow-400',
    'bg-ok',
    'bg-teal',
    'bg-yellow-400',
    'bg-teal',
  ]

  return (
    <div className="pointer-events-none absolute inset-0">
      {colors.map((color, i) => (
        <motion.span
          key={i}
          className={`absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full ${color}`}
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

// ---------- Задание ----------

function TaskItem({
  task,
  onToggle,
}: {
  task: Task
  onToggle: (id: number) => void
}) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onToggle(task.id)
    }
  }

  return (
    <div
      role="checkbox"
      aria-checked={task.done}
      tabIndex={0}
      onClick={() => onToggle(task.id)}
      onKeyDown={handleKeyDown}
      className="group relative flex cursor-pointer select-none items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 transition-colors hover:border-teal/40 hover:bg-white/[0.06]"
    >
      <div className="relative mt-0.5 shrink-0">
        <motion.div
          animate={task.done ? { scale: [1, 1.35, 1] } : { scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold transition-colors ${
            task.done
              ? 'bg-teal text-[#071120] shadow-[0_0_15px_rgba(100,255,218,0.4)]'
              : 'border-2 border-white/25 bg-white/[0.04] group-hover:border-teal'
          }`}
        >
          {task.done && '✓'}
        </motion.div>

        <AnimatePresence>
          {task.done && <CoinBurst key={`burst-${task.id}`} />}
        </AnimatePresence>
      </div>

      <div className="relative min-w-0 flex-1">
        <p
          className={`text-sm font-medium transition-colors ${
            task.done
              ? 'text-slate line-through'
              : 'text-mist group-hover:text-teal'
          }`}
        >
          {task.title}
        </p>

        <p className="relative mt-0.5 text-xs text-slate">
          +{task.xp} XP

          <AnimatePresence>
            {task.done && (
              <motion.span
                key={`xp-${task.id}`}
                className="absolute left-0 -top-1 text-xs font-bold text-teal"
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

      {task.done && (
        <span className="text-xs font-semibold text-teal">Готово</span>
      )}
    </div>
  )
}

// ---------- Главная страница кабинета ----------

function DashboardPage() {
  const [userName, setUserName] = useState('Студент')
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  // Получаем имя пользователя
  useEffect(() => {
    try {
      const saved = localStorage.getItem('click_user')
      if (!saved) return

      const name = JSON.parse(saved)?.name

      if (typeof name === 'string' && name.trim()) {
        setUserName(name)
      }
    } catch {
      // Используем имя по умолчанию
    }
  }, [])

  // Отмечаем задание выполненным
  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    )
  }

  // Подсчёт статистики
  const stats = useMemo(() => {
    const done = tasks.filter((task) => task.done)

    return {
      earnedXp: done.reduce((sum, task) => sum + task.xp, 0),
      coins: BASE_COINS + done.reduce((sum, task) => sum + task.coins, 0),
      accuracy: Math.round(
        analysisData.reduce((sum, item) => sum + item.score, 0) /
          analysisData.length,
      ),
    }
  }, [tasks])

  const coinsDisplay = useCountUp(stats.coins, 0.3)
  const accuracyDisplay = useCountUp(stats.accuracy, 0.4)

  const statCards = [
    ...STATS,
    {
      label: 'Монеты',
      value: stats.coins,
      icon: '🪙',
      color: 'text-mist',
    },
  ]

  return (
    <Page>
      <style>{FX_CSS}</style>

      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10">
        {/* Шапка */}

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col items-start justify-between gap-5 md:flex-row md:items-center"
        >
          <div className="flex items-center gap-4">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
              <motion.span
                className="absolute inset-0 rounded-full bg-teal/40"
                animate={{ scale: [1, 1.55], opacity: [0.5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />

              <motion.span
                className="absolute inset-0 rounded-full bg-teal/25"
                animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: 0.5,
                }}
              />

              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 14,
                }}
                className="relative flex h-16 w-16 items-center justify-center rounded-full bg-teal text-2xl font-bold uppercase text-[#071120] shadow-[0_0_25px_rgba(100,255,218,0.35)]"
              >
                {userName.charAt(0).toUpperCase()}
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

              <p className="mt-1 text-sm text-slate">
                Твой прогресс сегодня:{' '}
                <motion.span
                  key={stats.earnedXp}
                  initial={{ scale: 1.3, color: '#2dd4bf' }}
                  animate={{ scale: 1, color: '#2dd4bf' }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 12,
                  }}
                  className="inline-block font-semibold text-teal"
                >
                  +{stats.earnedXp} XP
                </motion.span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/profile"
              className="rounded-full border border-white/15 bg-white/[0.06] px-5 py-2.5 text-sm font-medium text-mist backdrop-blur-xl transition hover:border-teal/40 hover:bg-white/10"
            >
              Мой профиль
            </Link>

            <Link
              to="/"
              className="rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-[#071120] shadow-[0_0_20px_rgba(45,212,191,0.2)] transition hover:brightness-110"
            >
              На главную
            </Link>
          </div>
        </motion.div>

        {/* Верхняя статистика */}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <StatCard
              key={stat.label}
              {...stat}
              index={index}
            />
          ))}
        </div>

        {/* Основная сетка */}

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {/* Левая колонка */}

          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Анализ успеваемости */}

            <GlowCard className={`${GLASS_STYLE} p-6 md:p-8`}>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-mist">
                    Анализ успеваемости
                  </h2>
                  <p className="mt-1 text-sm text-slate">
                    Твои результаты по направлениям
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate">Общая точность</p>
                  <p className="text-3xl font-bold tabular-nums text-teal">
                    {accuracyDisplay}%
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {analysisData.map((item, index) => (
                  <SubjectRow
                    key={item.subject}
                    item={item}
                    index={index}
                  />
                ))}
              </div>

              {/* Зона особого внимания */}

              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.6,
                  type: 'spring',
                  stiffness: 150,
                  damping: 16,
                }}
                className="mt-8 flex items-start gap-3 rounded-2xl border border-red-400/25 bg-red-500/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl"
              >
                <motion.span
                  className="text-xl"
                  aria-hidden
                  animate={{ rotate: [0, -8, 8, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                >
                  ⚠️
                </motion.span>

                <div>
                  <p className="text-sm font-semibold text-red-300">
                    Зона особого внимания
                  </p>

                  <p className="mt-1 text-sm leading-relaxed text-slate">
                    Твой балл по чтению упал на 3%. Рекомендуем пройти тему{' '}
                    <span className="font-medium text-mist">
                      «Работа с текстом: Основная мысль»
                    </span>
                    , чтобы подтянуть этот навык перед пробным экзаменом.
                  </p>
                </div>
              </motion.div>
            </GlowCard>

            {/* Продолжить урок */}

            <GlowCard
              className={`${GLASS_STYLE} relative overflow-hidden p-6 md:p-8`}
            >
              <motion.div
                className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal/15 blur-3xl"
                animate={{
                  x: [0, -25, 10, 0],
                  y: [0, 15, -10, 0],
                  scale: [1, 1.15, 0.95, 1],
                }}
                transition={{
                  duration: 9,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              <motion.div
                className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl"
                animate={{
                  x: [0, 15, -10, 0],
                  y: [0, -12, 0],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
              />

              <div className="relative">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-2 text-xs font-semibold tracking-widest text-teal"
                >
                  СЛЕДУЮЩИЙ ШАГ
                </motion.p>

                <h2 className="text-xl font-bold text-mist">
                  Математика: Логарифмы
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate">
                  Вы остановились на 3 из 10 вопросов. Самое время закончить
                  тему и закрепить результат.
                </p>

                <a
                  href="/practice"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal px-6 py-3 text-sm font-semibold text-[#071120] shadow-[0_0_20px_rgba(45,212,191,0.2)] transition hover:brightness-110"
                >
                  Продолжить урок
                  <span aria-hidden>→</span>
                </a>
              </div>
            </GlowCard>
          </div>

          {/* Правая колонка */}

          <div className="flex flex-col gap-6">
            <GlowCard
              className={`${GLASS_STYLE} h-fit p-6`}
              delay={0.2}
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-mist">
                    Задания на день
                  </h2>
                  <p className="mt-1 text-xs text-slate">
                    Выполняй задания и получай награды
                  </p>
                </div>

                <span className="rounded-full border border-teal/20 bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
                  {tasks.filter((task) => task.done).length}/{tasks.length}
                </span>
              </div>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                  />
                ))}
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-xs font-medium text-slate">Баланс</p>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-2xl font-bold tabular-nums text-mist">
                    🪙 {coinsDisplay}
                  </span>

                  <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
                    +{stats.coins - BASE_COINS} сегодня
                  </span>
                </div>
              </div>
            </GlowCard>

            {/* Дополнительная мотивационная карточка */}

            <GlowCard className={`${GLASS_STYLE} p-6`} delay={0.3}>
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] text-xl">
                🚀
              </div>

              <h3 className="text-base font-semibold text-mist">
                Продолжай в том же духе!
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate">
                Каждый день практики приближает тебя к твоей цели. Даже
                небольшие шаги имеют значение.
              </p>
            </GlowCard>
          </div>
        </div>
      </div>
    </Page>
  )
}
