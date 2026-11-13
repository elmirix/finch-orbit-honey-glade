import { createFileRoute, Link } from '@tanstack/react-router'
import { Page } from "@/components/ui"
import { motion } from "framer-motion"
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const [userName, setUserName] = useState('Айгерим')

  // Загружаем имя при открытии страницы
  useEffect(() => {
    const savedName = localStorage.getItem('click_user_name')
    if (savedName) setUserName(savedName)
  }, [])

  return (
    <Page className="pt-8 pb-20 md:pt-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Шапка профиля */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-teal flex items-center justify-center text-2xl font-bold text-ink shadow-lg shadow-teal/20 uppercase">
              {userName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-mist">Привет, {userName}! 👋</h1>
              <p className="text-slate text-sm mt-1">Твой прогресс за эту неделю отличный. Продолжай в том же духе!</p>
            </div>
          </div>
          <Link to="/" className="px-5 py-2.5 rounded-full border border-line-dark text-sm font-medium text-slate hover:text-mist hover:border-teal transition-colors">
            На главную
          </Link>
        </motion.div>

        {/* Верхняя статистика (4 карточки) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Дней подряд", value: "12", icon: "🔥", color: "text-ok" },
            { label: "Пройдено тем", value: "24", icon: "✅", color: "text-teal" },
            { label: "Средний балл", value: "1340", icon: "🎯", color: "text-mist" },
            { label: "Тестов сдано", value: "8", icon: "📝", color: "text-slate" },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }}
              className="card p-5 flex flex-col"
            >
              <span className="text-2xl mb-2">{stat.icon}</span>
              <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
              <span className="text-xs text-slate mt-1 font-medium">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ЛЕВАЯ КОЛОНКА (Основной контент) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Блок Продолжить */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="card p-6 md:p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              <p className="text-xs font-semibold tracking-widest text-teal mb-2">СЛЕДУЮЩИЙ ШАГ</p>
              <h2 className="text-2xl font-semibold text-mist mb-2">Математика: Логарифмы</h2>
              <p className="text-slate text-sm mb-6 max-w-md">Вы остановились на 3 из 10 вопросов. Самое время закончить тему и закрепить результат.</p>
              <button className="bg-teal text-ink font-semibold px-6 py-3 rounded-full hover:brightness-110 transition-all flex items-center gap-2">
                Продолжить урок <span>→</span>
              </button>
            </motion.div>

            {/* Блок Прогресс по экзаменам */}
            <div>
              <h3 className="text-lg font-semibold text-mist mb-4">Общий прогресс</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* ОРТ */}
                <div className="card p-5 flex flex-col hover:border-teal/50 transition-colors cursor-pointer">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-mist">ОРТ</h4>
                    <span className="text-sm font-bold text-teal">45%</span>
                  </div>
                  <div className="w-full bg-ink rounded-full h-2 mb-3">
                    <div className="bg-teal h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <p className="text-xs text-slate mt-auto">12 из 24 тем</p>
                </div>

                {/* SAT */}
                <div className="card p-5 flex flex-col hover:border-ok/50 transition-colors cursor-pointer">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-mist">SAT</h4>
                    <span className="text-sm font-bold text-ok">20%</span>
                  </div>
                  <div className="w-full bg-ink rounded-full h-2 mb-3">
                    <div className="bg-ok h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                  <p className="text-xs text-slate mt-auto">4 из 20 тем</p>
                </div>

                {/* IELTS */}
                <div className="card p-5 flex flex-col hover:border-slate/50 transition-colors cursor-pointer">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-mist">IELTS</h4>
                    <span className="text-sm font-bold text-slate">70%</span>
                  </div>
                  <div className="w-full bg-ink rounded-full h-2 mb-3">
                    <div className="bg-slate h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <p className="text-xs text-slate mt-auto">14 из 20 тем</p>
                </div>

              </div>
            </div>
          </div>

          {/* ПРАВАЯ КОЛОНКА (Виджеты) */}
          <div className="space-y-6">
            
            {/* Цель на сегодня */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-mist mb-4">Цель на сегодня</h3>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 flex items-center justify-center rounded-full border-4 border-ink">
                  <div className="absolute inset-0 rounded-full border-4 border-teal border-r-transparent border-b-transparent rotate-45"></div>
                  <span className="text-sm font-bold text-mist">75%</span>
                </div>
                <div>
                  <p className="text-sm text-mist font-medium">Осталось 15 минут</p>
                  <p className="text-xs text-slate mt-1">Позанимайся еще немного, чтобы не потерять стрик!</p>
                </div>
              </div>
            </div>

            {/* Последняя активность */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-mist mb-4">Активность</h3>
              <div className="space-y-4">
                {[
                  { title: "Пробный тест ОРТ", time: "Сегодня, 14:30", score: "185/200" },
                  { title: "Тема: Квадратные уравнения", time: "Вчера, 18:00", score: "Пройдено" },
                  { title: "Эссе IELTS (Task 1)", time: "12 Ноября", score: "6.5" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-start border-b border-line-dark last:border-0 pb-3 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-mist">{item.title}</p>
                      <p className="text-xs text-slate mt-1">{item.time}</p>
                    </div>
                    <span className="text-xs font-semibold text-teal bg-teal/10 px-2 py-1 rounded-md">{item.score}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </Page>
  )
}