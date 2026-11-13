import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Page } from "@/components/ui"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

const STORAGE_KEY = 'click_user'

interface User {
  name: string
  email: string
}

// Стиль для стеклянных карточек
const GLASS_STYLE = "bg-[#0a192f]/50 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl"

function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'success'>('idle')

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        setUser(parsed)
        setEditName(parsed.name)
        setEditEmail(parsed.email)
      } catch (e) {
        navigate({ to: '/' })
      }
    } else {
      navigate({ to: '/' })
    }
  }, [navigate])

  const handleSave = () => {
    if (!user) return
    setSaveState('saving')
    setTimeout(() => {
      const updated = { ...user, name: editName, email: editEmail }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      setUser(updated)
      setSaveState('success')
      setTimeout(() => {
        setIsEditing(false)
        setSaveState('idle')
      }, 1500)
    }, 800)
  }

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY)
    navigate({ to: '/' })
  }

  if (!user) return null

  return (
    <Page className="min-h-screen bg-transparent text-mist relative overflow-hidden flex flex-col justify-center">
      
      {/* Основной контент */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 py-12">
        
        {/* Верхняя навигация */}
        <header className="flex justify-between items-center mb-16">
          <Link to="/dashboard" className="group flex items-center gap-3 text-sm font-medium text-slate hover:text-white transition-colors">
            <span className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">←</span>
            Вернуться в систему
          </Link>
          <div className="text-xs font-mono text-slate/50 tracking-widest uppercase">System ID: {user.name.substring(0,3)}-89X</div>
        </header>

        {/* Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* ЛЕВАЯ ЧАСТЬ: Идентичность */}
          <div className="lg:col-span-5 flex flex-col items-start">
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative mb-10"
            >
              <div className="absolute inset-0 bg-teal blur-[50px] opacity-20 rounded-full"></div>
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center text-6xl font-light shadow-2xl relative z-10">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-[#050B14] z-20"></div>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-medium tracking-tight mb-4"
            >
              {user.name}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="text-lg text-slate font-light mb-12"
            >
              {user.email}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="flex gap-8 border-t border-white/10 pt-6 w-full"
            >
              <div>
                <p className="text-xs text-slate/60 uppercase tracking-wider mb-1">Статус</p>
                <p className="text-sm font-medium text-teal">Pro Member</p>
              </div>
              <div>
                <p className="text-xs text-slate/60 uppercase tracking-wider mb-1">Уровень</p>
                <p className="text-sm font-medium">12 / 99</p>
              </div>
            </motion.div>
          </div>

          {/* ПРАВАЯ ЧАСТЬ: Настройки (Теперь в стиле Glassmorphism) */}
          <div className="lg:col-span-7 w-full">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
              className={`${GLASS_STYLE} p-8 md:p-10`}
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-sm font-semibold tracking-widest text-slate uppercase">Управление аккаунтом</h2>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="text-xs font-medium text-teal hover:text-white transition-colors uppercase tracking-wider">
                    [ Редактировать ]
                  </button>
                ) : (
                  <button onClick={() => setIsEditing(false)} className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider">
                    [ Отмена ]
                  </button>
                )}
              </div>

              <div className="space-y-12">
                {/* Поле: Имя */}
                <div className="relative">
                  <label className="text-[10px] text-slate/50 uppercase tracking-widest mb-2 block">Идентификация</label>
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.input
                        key="input"
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        type="text" value={editName} onChange={e => setEditName(e.target.value)}
                        className="w-full bg-transparent border-b-2 border-teal/50 text-2xl font-light text-white pb-2 focus:outline-none focus:border-teal transition-colors"
                      />
                    ) : (
                      <motion.div
                        key="text"
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="text-2xl font-light text-white pb-2 border-b border-white/10"
                      >
                        {user.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Поле: Email */}
                <div className="relative">
                  <label className="text-[10px] text-slate/50 uppercase tracking-widest mb-2 block">Канал связи (Email)</label>
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.input
                        key="input-email"
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)}
                        className="w-full bg-transparent border-b-2 border-teal/50 text-xl font-light text-white pb-2 focus:outline-none focus:border-teal transition-colors"
                      />
                    ) : (
                      <motion.div
                        key="text-email"
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="text-xl font-light text-white pb-2 border-b border-white/10"
                      >
                        {user.email}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Кнопка сохранения */}
              <AnimatePresence>
                {isEditing && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginTop: 0 }} 
                    animate={{ opacity: 1, height: 'auto', marginTop: 40 }} 
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <button 
                      onClick={handleSave} 
                      disabled={saveState === 'saving'}
                      className="w-full py-4 rounded-xl bg-teal text-[#050B14] font-bold text-sm tracking-widest uppercase hover:bg-white transition-colors duration-300 flex justify-center items-center shadow-[0_0_20px_rgba(45,212,191,0.3)]"
                    >
                      {saveState === 'saving' ? 'Синхронизация...' : saveState === 'success' ? '✓ Данные обновлены' : 'Применить изменения'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Кнопка выхода в самом низу */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="mt-8 flex justify-end"
            >
              <button 
                onClick={handleLogout}
                className="text-xs font-medium text-slate/50 hover:text-red-400 uppercase tracking-widest transition-colors"
              >
                Завершить сессию ↴
              </button>
            </motion.div>

          </div>
        </div>
      </div>
    </Page>
  )
}